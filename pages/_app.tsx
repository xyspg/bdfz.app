import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react'
import { UserStatusProvider } from '@/lib/userContext'
import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react'
import { NextIntlClientProvider } from 'next-intl';


export default function App({ Component, pageProps }: AppProps<{
    messages: any;
    initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  const router = useRouter()
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />
      </Head>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
          <NextIntlClientProvider
              locale={router.locale}
              timeZone="Asia/Shanghai"
              messages={pageProps.messages}
          >
        <UserStatusProvider>
          <ThemeProvider attribute="class">
            <Component {...pageProps} />
          </ThemeProvider>
        </UserStatusProvider>
          </NextIntlClientProvider>
      </SessionContextProvider>
      <Analytics />
      <Script
        async
        src="https://analytics.xyspg.moe/script.js"
        data-website-id="de651054-0c49-4294-ba67-fd0c988f5b40"
        data-domains="bdfz.app"
      ></Script>
    </>
  )
}