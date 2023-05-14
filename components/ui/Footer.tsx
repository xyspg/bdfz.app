import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const FooterItem = [
    { title: '使用条款', href: '/policies/terms-of-use' },
    { title: '隐私政策', href: '/policies/privacy' },
  ]

  return (
    <>
      <footer>
        <div className="w-full md:flex items-center justify-center p-8">
          <div className="flex flex-col items-center justify-center mt-4 md:m-0 gap-2">
            <p className="text-xs text-center text-slate-500 dark:text-slate-300">
              BDFZ AI 基于 OpenAI Embeddings 以及 Chat Completions 构建，不代表官方立场
            </p>
            <div className="flex flex-row gap-2">
              {FooterItem.map((item, index) => (
                <Link
                  key={index}
                  className="text-xs text-center text-slate-500 dark:text-slate-300"
                  href={item.href}
                  data-umami-event={`click footer ${item.title}`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
