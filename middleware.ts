import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next()
  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res })
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (req.nextUrl.pathname.startsWith('/unauthorized')) {
    return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  // Check auth condition
  if (session) {
    // Authentication successful, forward request to protected route.
    if (
      req.nextUrl.pathname.startsWith('/gpt4') ||
      req.nextUrl.pathname.startsWith('/api/chat-completion')
    ) {
      const { data: adminData, error } = await supabase
        .from('users')
        .select('is_super_admin')
        .eq('id', session.user.id)
      if (error) {
        console.log(error)
        // Maybe return a server error response here
        return new NextResponse(JSON.stringify({ success: false, message: 'Server error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      } else {
        if (adminData && adminData[0]) {
          const result = adminData[0]
          const isAdmin = result.is_super_admin === true

          if (isAdmin) {
            // User is an admin, allow them to visit /gpt4
            return res
          } else {
            if (!isAdmin && req.nextUrl.pathname.startsWith('/api/chat-completion')) {
              return new NextResponse(JSON.stringify({ success: false, message: 'Forbidden' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
              })
            } else {
              const redirectUrl = req.nextUrl.clone()
              redirectUrl.pathname = '/unauthorized'
              return NextResponse.redirect(redirectUrl)
            }
          }
        }
      }
    } else {
      return res
    }
  }
  if (!session && req.nextUrl.pathname.startsWith('/api')) {
    // API route, return 401.
    return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Auth condition not met, redirect to home page.
  const redirectUrl = req.nextUrl.clone()
  redirectUrl.pathname = '/'
  // redirectUrl.searchParams.set(`redirect`, req.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}
export const config = {
  matcher: [
    '/c/:path*',
    '/chat/:path*',
    '/gpt4/:path*',
    '/api/:path*',
    '/ask/:path*',
    '/unauthorized/:path*',
    '/settings/:path*',
    '/billing/:path*',
    '/history/:path*',
  ],
}
