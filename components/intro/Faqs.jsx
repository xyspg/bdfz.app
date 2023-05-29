import Link from 'next/link'

import { Container } from 'components/intro/Container'

const faqs = [
  [
    {
      question: '为什么我搜索不到我想要的内容？',
      answer:
        'BDFZ AI通过从数据库中的学校相关文件构建文本索引，所以如果问题的相关内容没有明确在学校文件中写明，将无法返回准确的答案。此外，您可以尝试换一种提问方式，如"书院活动室"和"书活"。如果仍然没有答案，您可以点击按钮提交反馈。',
    },
    {
      question: '为什么我搜索不到道尔顿学院的一些内容？',
      answer:
        '道尔顿学院的大多数文件，包括课程手册、选课指南等都是英文。所以根据实际测试发现，使用英文提问的效果通常比中文好。',
    },
    {
      question: 'BDFZ AI 免费吗？',
      answer:
        'BDFZ AI 对于拥有 @i.pkuschool.edu.cn 邮箱的北大附中师生是免费提供使用的。在 beta 版本暂时没有对外开放使用的计划。',
    },
  ],
  [
    {
      question: '我如何搜索特定文件或文档？',
      answer:
        '您可以通过在提问中明确指出相关文件名来搜寻特定文件。在提问时，请尽量明确您想要搜索的内容，并使用相关的关键词，以便系统能够准确匹配您的需求。',
    },
    {
      question: 'BDFZ AI能否保证搜索结果的准确性？',
      answer:
        'BDFZ AI通过建立文本索引和采用先进的语义匹配技术，努力提供准确的搜索结果。然而，由于学校文件的更新和变动，无法保证所有信息都是最新和完整的。建议您在获取重要信息时，再次核实并参考官方渠道。',
    },
    {
      question: '我可以在BDFZ AI上提供反馈或建议吗？',
      answer:
        '是的，我们欢迎您提供反馈和建议，以帮助我们改进和完善BDFZ AI的功能。您可以在问答界面点击反馈按钮，或通过联系 <a class="text-gray-900 underline" href="mailto:support@bdfz.app">support@bdfz.app</a> 提交您的意见和建议。',
    },
  ],
  [
    {
      question: 'BDFZ AI能够提供哪些学校生活相关的信息？',
      answer:
        'BDFZ AI提供了广泛的学校生活相关信息，包括学生手册、事务手册、课程手册、文凭方案、社团运行和管理方案等。您可以通过搜索关键词来获取所需的信息',
    },
    {
      question: 'BDFZ AI 有 APP 或微信小程序吗？',
      answer:
        'BDFZ AI 目前只有网页端应用。您可以在手机、平板电脑或电脑的浏览器中访问 bdfz.app，即可方便地访问和使用BDFZ AI的功能。',
    },
    {
      question: 'BDFZ AI 是如何运行的？',
      answer: `BDFZ AI 在预处理阶段，处理了知识库为搜索做好准备，然后利用PostgreSQL中的pgvector来存储嵌入向量；在运行时，执行向量相似性搜索，寻找与用户问题相关的内容，最后，将找到的内容注入到 OpenAI 的文本自动补全中，并将响应流式传输到客户端。`,
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="border-t border-gray-200 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 id="faqs-title" className="text-3xl font-medium tracking-tight text-gray-900">
            FAQs
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            如果您有别的问题，
            <Link href="mailto:support@bdfz.app" className="text-gray-900 underline">
              欢迎向我们询问
            </Link>
            .
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="space-y-10">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      {faq.question}
                    </h3>
                    <p
                      className="mt-4 text-sm text-gray-700"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
