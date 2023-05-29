import React from 'react'
import { ChatDialog } from '@/components/ChatDialog'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import Layout from '@/components/Layout'

const GPT4 = () => {
  const [tokenCount, setTokenCount] = React.useState(0)
  const user = useUser()
  const supabase = useSupabaseClient()

  React.useEffect(() => {
    const fetchTokenCount = async () => {
      if (!user?.id) {
        console.log('User or User ID not defined')
        return
      }
      const { data, error } = await supabase
        .from('user_token_count')
        .select('gpt4_token_count')
        .eq('user_id', user.id)
      if (error) console.log(error)
      if (data) {
        setTokenCount(data[0].gpt4_token_count)
      }
    }
    if (user) {
      fetchTokenCount()
    }
  }, [user])

  return (
    <>
      <Layout>
        <div className="flex flex-col justify-center items-center ">
          <ChatDialog
            History={[{ role: 'system', content: 'You are a helpful assistant.' }]}
            Mode="Normal"
          />
        </div>
      </Layout>
    </>
  )
}

export default GPT4
