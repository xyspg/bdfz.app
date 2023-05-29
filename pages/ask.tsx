import Head from 'next/head'
import { SearchDialog } from '@/components/SearchDialog'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import * as React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import ModeSwitcher from '@/components/ModeSwitcher'
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
  }, [router, session, supabase.auth])

  return (
    <Layout>
      <Head>
        <title>BDFZ AI</title>
      </Head>
      <div className="">
        {session && (
          <div className="flex flex-col justify-center items-center">
            <div className="w-full">
              <ModeSwitcher />
            </div>
            <SearchDialog />
          </div>
        )}
      </div>
    </Layout>
  )
}
