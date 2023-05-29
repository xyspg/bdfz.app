import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import * as React from 'react'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  const router = useRouter()
  const pathname = router.asPath

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />
      </Head>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ThemeProvider attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionContextProvider>
      <Script
        async
        src="https://analytics.xyspg.moe/script.js"
        data-website-id="de651054-0c49-4294-ba67-fd0c988f5b40"
        data-domains="bdfz.app"
      ></Script>
      <Analytics />
    </>
  )
}
