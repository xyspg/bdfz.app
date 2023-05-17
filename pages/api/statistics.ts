import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  })
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser()

  if (req.method === 'POST') {
    const { question, answer, timestamp, words, deviceInfo, hasFlaggedContent } = req.body
    try {
      const { error } = await supabaseServerClient.from('statistics').insert([
        {
          user_id: user?.id,
          question,
          answer,
          timestamp,
          word_count: words,
          platform: deviceInfo.platform,
          os_cpu: deviceInfo.osCpu,
          browser_vendor: deviceInfo.browserVendor,
          screen_resolution: deviceInfo.screenResolution,
          has_flagged_content: hasFlaggedContent,
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
