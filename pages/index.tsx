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

export default function Home() {
  const { systemTheme, theme, setTheme } = useTheme()
  const session = useSession()
  const router = useRouter()
  const pathname = router.pathname

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
          content="北大附中专属的AI文档搜索系统，利用先进的文本嵌入技术和OpenAI的GPT模型，帮助学生和教职员工快速、高效地查找学校手册、课程设置、请假流程等各类信息。无需翻阅大量文件，一键即可获取所需信息"
        />
      </Head>
      <NewHeader />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        {/*<Reviews />*/}
        {/*<Pricing />*/}
        <Faqs />
      </main>
      <IntroFooter />
    </>
  )
}
