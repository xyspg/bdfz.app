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
    const {
      chat_id,
      chat_history,
      timestamp,
      total_word_count,
      deviceInfo,
      hasFlaggedContent,
      mode,
    } = req.body
    try {
      // Attempt to find an existing chat_statistics record for this chat session
      const { data, error } = await supabaseServerClient
        .from('chat_statistics')
        .select()
        .eq('chat_id', chat_id)
        .maybeSingle()
      console.log('Data:', data) // Log the returned data
      console.log('Error:', error) // Log any error
      if (error) {
        res.status(400).json({ error: error.message })
        return
      }

      if (data && data.length > 0) {
        // If a record already exists, update it by appending the new chat_history
        const existingData = data[0]
        const updatedChatHistory = [...existingData.chat_history, ...chat_history]
        const { error: updateError } = await supabaseServerClient
          .from('chat_statistics')
          .update({
            chat_history: updatedChatHistory,
            timestamp,
            total_word_count: total_word_count + data.total_word_count,
            platform: deviceInfo.platform,
            os_cpu: deviceInfo.osCpu,
            browser_vendor: deviceInfo.browserVendor,
            screen_resolution: deviceInfo.screenResolution,
            has_flagged_content: hasFlaggedContent || data.has_flagged_content,
            model: mode,
          })
          .eq('chat_id', chat_id)

        if (updateError) {
          res.status(400).json({ error: updateError.message })
          return
        }

        res.status(200).json({ message: 'Data updated successfully' })
      } else {
        // If no record exists, insert a new one
        const { error: insertError } = await supabaseServerClient.from('chat_statistics').insert([
          {
            chat_id,
            user_id: user?.id,
            chat_history,
            timestamp,
            total_word_count,
            platform: deviceInfo.platform,
            os_cpu: deviceInfo.osCpu,
            browser_vendor: deviceInfo.browserVendor,
            screen_resolution: deviceInfo.screenResolution,
            has_flagged_content: hasFlaggedContent,
            model: mode,
          },
        ])

        if (insertError) {
          res.status(400).json({ error: insertError.message })
          return
        }

        res.status(200).json({ message: 'Data inserted successfully' })
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
