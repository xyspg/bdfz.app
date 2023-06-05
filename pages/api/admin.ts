import { NextApiRequest, NextApiResponse } from 'next'

import { createClient } from '@supabase/supabase-js'
import { UserError } from '@/lib/errors'
const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabase_url || !service_role_key) throw new Error('Missing env variables')

const supabase = createClient(supabase_url, service_role_key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Access auth admin api
const adminAuthClient = supabase.auth.admin

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader?.startsWith('Bearer ')) {
    throw new UserError('Missing Authorization header')
  }
  const jwt = authHeader.substring(7)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt)
  if (error || !user) {
    throw new UserError('Invalid JWT token or user not found')
  }

  // Check if user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)

  if (adminError || !adminData || !adminData[0].is_admin) {
    await supabase.from('security_audit_log').insert({
      user_id: user.id,
      endpoint: '/api/admin',
      violation_type: 'Unauthorized Access',
      ip_address: req.headers['x-forwarded-for'],
      user_agent: req.headers['user-agent'],
    })

    throw new UserError('User is not an admin')
  }

    let users;

    try {
        const response = await supabase.auth.admin.listUsers();
        users = response.data.users;
    } catch (error) {
        console.log(error)
        throw new UserError('Error fetching users')
    }

    let tokens

    try {
        const tokenCount = await supabase
            .from('user_token_count')
            .select('user_id, token_count, gpt4_token_count')
        tokens = tokenCount.data
    } catch (error) {
        console.log(error)
        throw new UserError('Error fetching tokens')
    }

    if (req.method === 'GET' && 'users' in req.query ) {
        return res.status(200).json({ users })
    }
    if (req.method === 'GET' && 'tokens' in req.query ){
        return res.status(200).json({ tokens })
    }

}
