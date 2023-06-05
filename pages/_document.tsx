import { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
import * as React from 'react'

export default function Document() {
  return (
    <Html lang="zh">
      <Head>
        <meta
          name="description"
          content="北大附中 AI 助手，支持学生手册、事物手册等查询，国际部课程建议等"
          key="description"
        />
        <meta property="twitter:image" content="https://bdfz.app/meta.png" key="twitter_image" />
        <meta property="twitter:card" content="summary_large_image" key="twitter_card" />
        <meta property="og:image" content="https://bdfz.app/meta.jpg" key="og_image" />
        <meta
          property="og:description"
          content="北大附中 AI 助手，支持学生手册、事物手册等查询，国际部课程建议等"
        />
        <meta property="og:url" content="https://bdfz.app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <noscript>
          您的浏览器不支持现代 Javascript 技术，而我们需要现代 Javascript 才可以为您展示信息
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
