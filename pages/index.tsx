import Head from 'next/head'

import { CallToAction } from '@/components/intro/CallToAction'
import { Faqs } from '@/components/intro/Faqs'
import { IntroFooter } from '@/components/IntroFooter'
import { NewHeader } from '@/components/newHeader'
import { Hero } from '@/components/intro/Hero'
import { Pricing } from '@/components/intro/Pricing'
import { PrimaryFeatures } from '@/components/intro/PrimaryFeatures'
import { Reviews } from '@/components/intro/Reviews'
import { SecondaryFeatures } from '@/components/intro/SecondaryFeatures'
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useTheme } from 'next-themes'
import { useTranslations } from "next-intl";

export default function Home() {
  const { systemTheme, theme, setTheme } = useTheme()
  const session = useSession()
  const router = useRouter()
  const pathname = router.pathname

    const t = useTranslations("common");

  useEffect(() => {
    if (session) window.location.href = '/chat'
  }, [session])

  useEffect(() => {
    if (pathname === '/') {
      setTheme('light')
    }
  }, [pathname, setTheme])
  return (
    <>
      <Head>
        <title>BDFZ AI</title>
        <meta
          name="description"
          content={t('meta_description')}
        />
      </Head>
      <NewHeader />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Faqs />
      </main>
      <IntroFooter />
    </>
  )
}

export async function getStaticProps(context: any) {
    return {
        props: {
            // You can get the messages from anywhere you like. The recommended
            // pattern is to put them in JSON files separated by locale and read
            // the desired one based on the `locale` received from Next.js.
            messages: (await import(`../locales/${context.locale}.json`)).default
        }
    };
}
