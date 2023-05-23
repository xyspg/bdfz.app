import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

//@ts-ignore
const supabase = createClient(supabaseUrl, supabaseKey)
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  })
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser()
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('latest_chat_statistics')
      .select('chat_history,chat_id, timestamp, total_word_count')
      .eq('user_id', user?.id)
      .order('timestamp', { ascending: false })

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }
    res.status(200).json({ data })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
