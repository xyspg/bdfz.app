# 北大附中 AI 助手

## 介绍

这个项目从 `pages` 目录中获取所有的 `.mdx` 文件，并使用 OpenAI Embeddings 计算文本矢量，以在[OpenAI ChatGPT API](https://platform.openai.com/docs/guides/completion) prompt 中使用。
目前包括的文件：

- 北大附中学生手册
- 高中学生事务手册
- 北大附中文凭方案
- 北大附中社团运行和管理方案
- 道尔顿学院 Sharepoint
- 道尔顿学院课程手册
- SubIT新生指南（部分）

## 技术细节

1. [👷 Build Time] 预处理知识库（ `pages` 文件夹中的 `.mdx` 文件）
2. [👷 Build Time] 在 PostgreSQL 中使用 [pgvector](https://supabase.com/docs/guides/database/extensions/pgvector) 存储嵌入向量
3. [🏃 Runtime] 执行向量相似性搜索，查找与问题相关的内容
4. [🏃 Runtime] 将内容注入到 OpenAI GPT-3.5 文本自动补全中，并将响应流式传输到客户端

## 本地开发

### 配置开发环境

1. 安装 [Node.js](https://nodejs.org/en/download/) (LTS)
2. ```bash
   npm install -g pnpm
   ```

### 配置

- `cd 项目文件夹`
- `pnpm install`
- `cp .env.example .env`
- 在新创建的 `.env` 文件中输入 `OPENAI_KEY`。

### 启动 Supabase

确保已安装并在本地运行 Docker。然后运行

```bash
supabase init
```

```bash
supabase migration new init
```
```bash
-- Enable pgvector extension
create extension if not exists vector with schema public;
```
创建数据库表
```bash
-- Stores the checksum of our pages.
-- This ensures that we only regenerate embeddings
-- when the page content has changed.
create table "public"."nods_page" (
  id bigserial primary key,
  parent_page_id bigint references public.nods_page,
  path text not null unique,
  department text,
  checksum text,
  meta jsonb,
  type text,
  source text
);
alter table "public"."nods_page"
  enable row level security;

-- Stores the actual embeddings with some metadata
create table "public"."nods_page_section" (
  id bigserial primary key,
  page_id bigint not null references public.nods_page on delete cascade,
  content text,
  token_count int,
  embedding vector(1536),
  slug text,
  heading text
);
alter table "public"."nods_page_section"
  enable row level security;
```
```bash
-- Create embedding similarity search functions
create or replace function match_page_sections(
    embedding vector(1536),
    match_threshold float,
    match_count int,
    min_content_length int,
    department text
)
returns table (
    id bigint,
    page_id bigint,
    slug text,
    heading text,
    content text,
    similarity float
)
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select
    nods_page_section.id,
    nods_page_section.page_id,
    nods_page_section.slug,
    nods_page_section.heading,
    nods_page_section.content,
    (nods_page_section.embedding <#> embedding) * -1 as similarity
  from nods_page_section
  join nods_page
  on nods_page_section.page_id = nods_page.id
  -- We only care about sections that have a useful amount of content
  where length(nods_page_section.content) >= min_content_length
  
  -- The dot product is negative because of a Postgres limitation, so we negate it
  and (nods_page_section.embedding <#> embedding) * -1 > match_threshold
  
  -- Filter the department based on the input
  and (
      (department is null)
      or (department = 'Dalton' and nods_page.department != 'MainSchool')
      or (department = 'MainSchool' and nods_page.department != 'Dalton')
      or (department = 'Both')
  )
    
  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by nods_page_section.embedding <#> embedding
  limit match_count;
end;
$$;
```

```bash
npx supabase start
```

本地开发完成后，推送到远程数据库
```bash
supabase link --project-ref=your-project-ref

supabase db push
```


### 启动 Next.js 应用程序

在新的终端窗口中运行

```bash
pnpm dev
```
