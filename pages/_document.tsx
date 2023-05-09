import { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang='zh'>
      <Head>
        <script async src='https://analytics.umami.is/script.js' data-website-id='2c84a5e3-0df4-41ba-bcc6-72028bae3279' />
      </Head>
      <body className='bg-white dark:bg-neutral-800'>
      <Main />
      <NextScript />
      </body>
    </Html>
  )
}
