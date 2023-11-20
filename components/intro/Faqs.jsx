import Link from 'next/link'

import { Container } from 'components/intro/Container'
import { useTranslations } from "next-intl";


export function Faqs() {
    const t = useTranslations('landing_page.faqs');
  const faqs = [
    [
      {
        question: t('section.1.question'),
        answer: t('section.1.answer')
      },
      {
        question: t('section.2.question'),
        answer: t('section.2.answer')
      },
      {
        question: t('section.3.question'),
        answer: t('section.3.answer')
      },
    ],
    [
      {
        question: t('section.4.question'),
        answer: t('section.4.answer')
      },
      {
        question: t('section.5.question'),
        answer: t('section.5.answer')
      },
      {
        question: t('section.6.question'),
        answer: t.raw('section.6.answer')
      },
    ],
    [
      {
        question: t('section.7.question'),
        answer: t('section.7.answer')
      },
      {
        question: t('section.8.question'),
        answer: t('section.8.answer')
      },
      {
        question: t('section.9.question'),
        answer: t('section.9.answer')
      }
    ],
  ]

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
          <p
              dangerouslySetInnerHTML={{ __html: t.raw('title') }}
              className="mt-2 text-lg text-gray-600 underline"/>
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
