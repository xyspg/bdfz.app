import React from 'react'
import { useRouter } from 'next/router'
import { ChatDialog } from '@/components/ChatDialog'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function getServerSideProps(context: any) {
  const chat_id = context.params.chat_id

  // Supabase client with service role
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  // @ts-ignore
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data, error } = await supabase
    .from('latest_chat_statistics')
    .select('chat_history')
    .eq('chat_id', chat_id)

  if (error) console.log(error)

  return {
    props: {
      chatHistory: data,
    },
  }
}

const ChatIdDialog = ({ chatHistory }) => {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing env variables')
  const router = useRouter()
  const { chat_id } = router.query

  return (
    <>
      <div className="flex justify-center">
        <ChatDialog History={chatHistory[0].chat_history} />
      </div>
    </>
  )
}

export default ChatIdDialog
