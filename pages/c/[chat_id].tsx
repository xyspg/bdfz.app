import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { ChatDialog } from '@/components/ChatDialog'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import Layout from '@/components/Layout'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chat_id = context.params && context.params.chat_id

  // Supabase client with service role
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) throw new Error('Missing env variables')

  const supabase = createClient(supabaseUrl, supabaseKey)
  const supabaseServerClient = createServerSupabaseClient(context)

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser()
  const { data, error } = await supabase
    .from('latest_chat_statistics')
    .select('chat_history, model')
    .eq('chat_id', chat_id)
    .eq('user_id', user?.id)
    .eq('isRemoved', false)

  if (error) console.log(error)

  return {
    props: {
      chatHistory: data,
    },
  }
}

type ChatHistoryItem = {
  chat_history: {
    role: string
    content: string
  }[]
  chat_id: string
  timestamp: string
  total_word_count: number
  model: string
}

type Props = {
  chatHistory: ChatHistoryItem[]
  model: string
}

const ChatIdDialog = ({ chatHistory }: Props) => {
  const model =
    chatHistory[0].model === 'bdfz' ? 'BDFZ' : chatHistory[0].model === 'gpt-4' ? 'Normal' : 'BDFZ'
  const router = useRouter()
  useEffect(() => {
    if (!chatHistory || !chatHistory.length) {
      router.push('/not-found')
    }
  }, [chatHistory, router])

  if (chatHistory && chatHistory.length) {
    return (
      <Layout>
        <div className="flex justify-center">
          <ChatDialog History={chatHistory[0].chat_history} Mode={model} />
        </div>
      </Layout>
    )
  }
}

export default ChatIdDialog
