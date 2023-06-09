import Head from 'next/head'
import { ChatDialog } from '@/components/ChatDialog'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import ModeSwitcher from '@/components/ModeSwitcher'
import * as React from 'react'
import Layout from '@/components/Layout'

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

  const today = new Date()

  return (
    <>
      <Head>
        <title>BDFZ AI</title>
      </Head>
      <Layout>
        <div className="">
          {session && (
            <div className="flex flex-col justify-center items-center ">
              <ChatDialog
                History={[
                  {
                    role: 'system',
                    content: `You are a large language model trained by The Affilated High School of Peking University. \nKnowledge Cut off: 2023-07\nToday: ${today}`,
                  },
                ]}
                Mode="BDFZ"
              />
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
