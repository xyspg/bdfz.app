import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider attribute='class'>
        <Component {...pageProps} />
      </ThemeProvider>
      <Script async src='https://analytics.umami.is/script.js'
              data-website-id='2c84a5e3-0df4-41ba-bcc6-72028bae3279'></Script>
      <Analytics />
    </>

  )
}
