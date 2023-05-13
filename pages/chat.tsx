import React, { useEffect } from 'react'
import Header from '@/components/Header'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

const Chat = () => {
  const session = useSession()
  const router = useRouter()
  useEffect(() => {
    if (!session) router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`)
  }, [router, session])
  return (
    <>
      <Header />
      {session && (
        <>
          <div className="flex justify-center">
            <h1>Under Developement...</h1>
          </div>
        </>
      )}
    </>
  )
}

export default Chat
