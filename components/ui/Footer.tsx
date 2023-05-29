import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const FooterItem = [
    { title: '使用条款', href: '/policies/terms-of-use' },
    { title: '隐私政策', href: '/policies/privacy' },
  ]

  return (
    <>
      <div className="w-screen px-4 py-4 md:pt-8 md:px-12 flex flex-col items-center border-t border-gray-200 lg:flex-row lg:justify-between lg:pt-4 gap-y-1">
        <p className="text-xs md:text-xs text-gray-500 md:mt-0 dark:text-gray-200">
          BDFZ AI 基于 OpenAI API 构建，生成内容不代表官方立场
        </p>
        <div className="flex flex-col md:flex-row justify-between items-center gap-x-4">
          <div className="flex flex-row gap-2">
            {FooterItem.map((item, index) => (
              <Link
                key={index}
                className="text-xs text-center text-gray-500 dark:text-gray-300"
                href={item.href}
                data-umami-event={`click footer ${item.title}`}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500 md:mt-0 dark:text-gray-200">
            &copy; Copyright {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </>
  )
}

export default Footer
