import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
// @ts-ignore
import { Parser } from 'json2csv'

const json2csv = new Parser().parse

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing env variables')
}
const supabase = createClient(supabaseUrl, supabaseKey)
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  })

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser()
  const { removeItem, clear } = req.body
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('latest_chat_statistics')
      .select('chat_history, chat_id, timestamp, model, total_word_count')
      .eq('user_id', user?.id)
      .eq('isRemoved', false)
      .order('timestamp', { ascending: false })

    const { data: adminData, error: admin_error } = await supabase
      .from('users')
      .select('is_super_admin')
      .eq('id', user?.id)
      .single()

    const { data: tokenData, error: token_count_error } = await supabase
      .from('user_token_count')
      .select('token_count, gpt4_token_count')
      .eq('user_id', user?.id)
      .single()
    if (error || token_count_error) {
      let errorMessage = ''
      if (error) {
        errorMessage += error.message
      }
      if (token_count_error) {
        errorMessage += ' ' + token_count_error.message
      }
      res.status(400).json({ error: errorMessage.trim() })
      return
    }

    res
      .status(200)
      .json({
        data,
        token_count: tokenData?.token_count,
        gpt4_token_count: tokenData?.gpt4_token_count,
      })
  } else if (req.method === 'POST') {
    if (clear) {
      const { error } = await supabase
        .from('chat_statistics')
        .update({ isRemoved: true })
        .eq('user_id', user?.id)
      if (error) {
        res.status(400).json({ error: error.message })
        return
      } else {
        res.status(200).json({ data: { success: true } })
      }
    } else {
      const { error } = await supabase
        .from('chat_statistics')
        .update({ isRemoved: true })
        .eq('chat_id', removeItem)
        .eq('user_id', user?.id)

      if (error) {
        res.status(400).json({ error: error.message })
        return
      }
      res.status(200).json({ data: { success: true } })
    }
  } else if (req.method === 'GET' && 'export' in req.query) {
    const { data, error } = await supabase
      .from('latest_chat_statistics')
      .select('chat_history, chat_id, timestamp, model, total_word_count')
      .eq('user_id', user?.id)
      .eq('isRemoved', false)
      .order('timestamp', { ascending: false })

    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    // Convert the data to CSV
    const csvData = json2csv(data)

    // Ensure a proper file download
    res.setHeader('Content-disposition', 'attachment; filename=export.csv')
    res.setHeader('Content-type', 'text/csv')

    res.status(200).send(csvData)
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
