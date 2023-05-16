import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

//@ts-ignore
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  })
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser()
  if (req.method === 'POST') {
    const {question, answer, f, timestamp, deviceInfo } = req.body

    try {
      const { error } = await supabase.from('feedback').insert([
        {
          user_id: user?.id,
          question,
          answer,
          feedback: f,
          timestamp,
          platform: deviceInfo.platform,
          os_cpu: deviceInfo.osCpu,
          browser_vendor: deviceInfo.browserVendor,
          screen_resolution: deviceInfo.screenResolution,
        },
      ])

      if (error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(200).json({ message: 'Data inserted successfully' })
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
