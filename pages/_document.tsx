import { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="zh">
      <Head />
      <body className="bg-white dark:bg-neutral-800">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
