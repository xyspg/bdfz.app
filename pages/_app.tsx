import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
if (typeof window !== 'undefined') {
  let process = require('process')
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    }
  })
}
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog?.capture('$pageview')
    router.events.on('routeChangeComplete', handleRouteChange)
    posthog.capture('my event', { property: 'value' })
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])
  return (
    <>
      <PostHogProvider client={posthog}>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
      </PostHogProvider>
      <Script
        async
        src="https://analytics.umami.is/script.js"
        data-website-id="2c84a5e3-0df4-41ba-bcc6-72028bae3279"
      ></Script>
      <Analytics />
    </>
  )
}
