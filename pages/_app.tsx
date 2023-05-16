import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ThemeProvider attribute='class'>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </SessionContextProvider>
      <Script
        async
        src='https://analytics.umami.is/script.js'
        data-website-id='2c84a5e3-0df4-41ba-bcc6-72028bae3279'
      ></Script>
      <Analytics />
    </>
  )
}
