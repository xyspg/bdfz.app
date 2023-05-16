import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'


export async function middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next()
  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res })
  let cookie = req.cookies.get('supabase-auth-token')?.value

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (req.nextUrl.pathname.startsWith('/') && cookie) {
    return res
  } else if (session) {
    return res
  } else {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set(`redirect`, req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

}

export const config = {
  matcher: ['/api', '/profile', '/password', '/'],
}