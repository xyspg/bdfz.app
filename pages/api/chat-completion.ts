import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { codeBlock, oneLine } from 'common-tags'
import GPT3Tokenizer from 'gpt3-tokenizer'
// @ts-ignore
import { CreateChatCompletionRequest } from 'openai'
import { ApplicationError, UserError } from '@/lib/errors'
import { politicalWords, pornWords } from '@/pages/api/sensitiveWords'
// OpenAIApi does currently not work in Vercel Edge Functions as it uses Axios under the hood.
export const config = {
  runtime: 'edge',
}

const openAiKey = process.env.OPENAI_KEY
const openAiBaseUrl = process.env.OPENAI_BASE_URL || 'api.openai.com'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req: NextRequest) {
  try {
    if (!openAiKey) {
      throw new ApplicationError('Missing environment variable OPENAI_KEY')
    }

    if (!supabaseUrl) {
      throw new ApplicationError('Missing environment variable SUPABASE_URL')
    }

    if (!supabaseServiceKey) {
      throw new ApplicationError('Missing environment variable SUPABASE_SERVICE_ROLE_KEY')
    }

    const requestData = await req.json()

    if (!requestData) {
      throw new UserError('Missing request data')
    }

    // Check if user is authenticated
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UserError('Missing Authorization header')
    }
    const jwt = authHeader.substring(7)
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser(jwt)
    if (error || !user) {
      throw new UserError('Invalid JWT token or user not found')
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabaseClient
      .from('users')
      .select('is_paid_user')
      .eq('id', user.id)

    if (adminError || !adminData || !adminData[0].is_paid_user) {
      await supabaseClient.from('security_audit_log').insert({
        user_id: user.id,
        endpoint: '/api/chat-completion',
        violation_type: 'Unauthorized Access',
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent'),
      })

      throw new UserError('User is not an admin')
    }
    // get user's ID
    const userId = user.id

    // insert a new row to security_audit_log
    await supabaseClient.from('security_audit_log').insert({
      user_id: userId,
      endpoint: '/api/chat-completion',
      ip_address: req.headers.get('x-forwarded-for'),
      user_agent: req.headers.get('user-agent'),
      attempt_time: new Date(),
      violation_type: 'Attempted Access',
    })

    const { query, messages } = requestData
    console.log('request data', requestData)
    if (!query) {
      throw new UserError('请输入查询内容')
    }

    if (/\bdeveloper mode\b/i.test(query)) {
      throw new UserError('Flagged content', {
        flagged: true,
      })
    }

    for (let i = 0; i < politicalWords.length; i++) {
      if (query.includes(politicalWords[i])) {
        throw new UserError('Flagged content politics', {
          flagged: true,
        })
      }
    }

    for (let i = 0; i < pornWords.length; i++) {
      if (query.includes(pornWords[i])) {
        throw new UserError('Flagged content', {
          flagged: true,
        })
      }
    }

    // get the current time and the time one minute ago
    const currentTime = new Date()
    const oneMinuteAgo = new Date(currentTime.getTime() - 60 * 1000)

    // count the requests made by the user within the last minute
    const { count: requestCount, error: rateLimitError } = await supabaseClient
      .from('security_audit_log')
      .select('id', { count: 'exact' })
      .gte('attempt_time', oneMinuteAgo.toISOString())
      .eq('user_id', userId)

    if (rateLimitError) {
      console.error(rateLimitError)
      throw new ApplicationError('Failed to check rate limit')
    }

    // check if the request count exceeds the limit
    if (requestCount && requestCount > 10) {
      throw new UserError('Too Many Requests')
    }

    messages.push({ role: 'user', content: query })
    console.log('Nomral messages: ', messages)

    const model = process.env.NODE_ENV === 'production' ? 'gpt-4' : 'gpt-3.5-turbo'
    const completionOptions: CreateChatCompletionRequest = {
      model: model,
      messages: messages,
      max_tokens: 1024,
      temperature: 0,
      stream: true,
    }

    const response = await fetch('https://' + openAiBaseUrl + '/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completionOptions),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new ApplicationError('Failed to generate completion', error)
    }

    // Proxy the streamed SSE response from OpenAI
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    })
  } catch (err: any) {
    if (err instanceof UserError) {
      return new Response(
        JSON.stringify({
          error: err.message,
          data: err.data,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } else if (err instanceof ApplicationError) {
      console.error(`${err.message}: ${JSON.stringify(err.data)}`)
    } else {
      console.error(err)
    }

    return new Response(
      JSON.stringify({
        error: err?.message || 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
