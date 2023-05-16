import React, { useEffect } from 'react'
import Header from '@/components/Header'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const Chat = () => {
  const session = useSession()
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Chat - bdfz.app</title>
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />
      </Head>
      <Header />
      {session && (
        <>
          <div className="flex justify-center font-mono">
            <h1>Under Development...</h1>
          </div>
        </>
      )}
    </>
  )
}

export default Chat
