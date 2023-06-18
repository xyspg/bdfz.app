import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) throw new Error('Missing env variables')
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
        const {
            question,
            answer,
            feedBackBody,
            timestamp,
        isChecked1,
            isChecked2,
            isChecked3,
        } = req.body

        try {
            const { error } = await supabase.from('feedback_text').insert([
                {
                    user_id: user?.id,
                    question,
                    answer,
                    feedback: feedBackBody,
                    ischecked1: isChecked1,
                    ischecked2: isChecked2,
                    ischecked3: isChecked3,
                    timestamp,
                },
            ])

            if (error) {
                res.status(400).json({ error: error.message })
            } else {
                res.status(200).json({ message: 'Feedback inserted successfully' })
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' })
    }
}
