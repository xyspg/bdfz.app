import Head from 'next/head'
import { SearchDialog } from '@/components/SearchDialog'
import Header from '@/components/Header'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const session = useSession()
  const router = useRouter()
  const supabase = useSupabaseClient()

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == 'PASSWORD_RECOVERY') {
        router.push('/password')
      }
    })
  }, [router, supabase.auth])

  return (
    <>
      <Head>
        <title>BDFZ AI</title>
        <meta
          name="description"
          content="北大附中 AI 助手，支持学生手册、事物手册等查询，国际部课程建议等"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />
        <meta property="twitter:image" content="https://bdfz.app/meta.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="og:image" content="https://bdfz.app/meta.png" />
        <meta property="og:title" content="BDFZ AI" />
        <meta
          property="og:description"
          content="北大附中 AI 助手，支持学生手册、事物手册等查询，国际部课程建议等"
        />
        <meta property="og:url" content="https://bdfz.app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        {session && (
          <div className="flex justify-center">
            <SearchDialog />
          </div>
        )}
      </div>
    </>
  )
}
