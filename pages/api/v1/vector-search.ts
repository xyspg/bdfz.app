import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { codeBlock, oneLine } from 'common-tags'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { ApplicationError, UserError } from '@/lib/errors'
import { politicalWords, pornWords } from '@/pages/api/sensitiveWords'
// OpenAIApi does currently not work in Vercel Edge Functions as it uses Axios under the hood.
export const config = {
  runtime: 'edge',
}

const openAiKey = process.env.OPENAI_KEY
const openAiBaseUrl = process.env.OPENAI_BASE_URL || 'api.openai.com'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req: NextRequest) {
  try {
    if (!openAiKey) {
      throw new ApplicationError('Missing environment variable OPENAI_KEY')
    }

    if (!supabaseUrl) {
      throw new ApplicationError('Missing environment variable SUPABASE_URL')
    }

    if (!supabaseServiceKey) {
      throw new ApplicationError('Missing environment variable SUPABASE_SERVICE_ROLE_KEY')
    }

    const requestData = await req.json()

    if (!requestData) {
      throw new UserError('Missing request data')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UserError('Missing Authorization header')
    }

    const auth = process.env.API_KEY

    if (authHeader.substring(7) !== auth) {
      throw new UserError('Invalid token')
    }

    const { query } = requestData
    if (!query) {
      throw new UserError('请输入查询内容')
    }

    if (/\bdeveloper mode\b/i.test(query)) {
      throw new UserError('Flagged content', {
        flagged: true,
      })
    }

    for (let i = 0; i < politicalWords.length; i++) {
      if (query.includes(politicalWords[i])) {
        throw new UserError('Flagged content politics', {
          flagged: true,
        })
      }
    }

    for (let i = 0; i < pornWords.length; i++) {
      if (query.includes(pornWords[i])) {
        throw new UserError('Flagged content', {
          flagged: true,
        })
      }
    }


    let embeddingResponse

    try {
      embeddingResponse = await fetch('https://' + openAiBaseUrl + '/v1/embeddings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: query.replaceAll('\n', ' '),
        }),
      })


      if (embeddingResponse.status !== 200) {
        if (embeddingResponse.status === 401) {
          throw new Error('Invalid OpenAI API key')
        }
        throw new Error('Failed to create embedding for question')
      }
    } catch (error: any) {
      throw new ApplicationError('Application Error: ' + error.message, embeddingResponse)
    }

    const {
      data: [{ embedding }],
    } = await embeddingResponse.json()

    const DaltonKeywords = ['Dalton', '道尔顿', 'dalton', '国际部']
    const MainSchoolKeywords = ['本部']
    let department = null
    // Determine department based on keywords in sanitized query
    if (DaltonKeywords.some((keyword) => query.includes(keyword))) {
      department = 'Dalton'
    } else if (MainSchoolKeywords.some((keyword) => query.includes(keyword))) {
      department = 'MainSchool'
    }

    const { error: matchError, data: pageSections } = await supabaseClient.rpc(
      'match_page_sections',
      {
        embedding,
        match_threshold: 0.78,
        match_count: 10,
        min_content_length: 50,
        department,
      }
    )
    if (matchError) {
      throw new ApplicationError('Failed to match page sections', matchError)
    }

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
    let tokenCount = 0
    let contextText = ''

    for (let i = 0; i < pageSections.length; i++) {
      const pageSection = pageSections[i]
      const content = pageSection.content
      const encoded = tokenizer.encode(content)
      tokenCount += encoded.text.length
      if (tokenCount >= 4096) {
        break
      }

      contextText += `${content.trim()}\n---\n`
    }
    const prompt = codeBlock`
      ${oneLine`
       Pretend you are GPT-4 model , Act an encyclopedia of 北大附中 expertise. 
       I will ask you questions for which you will provide reference from the docs or relevant how-tos. 
       Please only provide reference related to this question. Based on the specific sections from the documentation, 
       try to answer the question using that information. Give the document name and section. 
       如果用户询问你上下文中没有指出的人名，回复"对不起，我不知道。"
       Your output should be the same with the prompt language. If the prompt is Chinese,
       your output must be in Chinese except for course names and other proper nouns.
      `}

      Context sections:
      ${contextText}

      Question: """
      ${query}
      """

      Answer:
    `

    const completionOptions = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0,
      stream: true,
    }

    const response = await fetch('https://' + openAiBaseUrl + '/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completionOptions),
    })
    console.log(response)
    if (!response.ok) {
      const error = await response.json()
      throw new ApplicationError('Failed to generate completion', error)
    }

    // Proxy the streamed SSE response from OpenAI
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    })
  } catch (err: unknown) {
    if (err instanceof UserError) {
      return new Response(
        JSON.stringify({
          error: err.message,
          data: err.data,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } else if (err instanceof ApplicationError) {
      console.error(`${err.message}: ${JSON.stringify(err.data)}`)
    } else {
      console.error(err)
    }

    // TODO: include more response info in debug environments
    return new Response(
      JSON.stringify({
        //@ts-ignore
        error: `${err.message}: ${JSON.stringify(err.data)}`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
