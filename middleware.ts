import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req, res })
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
    // If the user has a session and is accessing the homepage (/), forward to /chat.
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/chat', req.url))
    }

    // Authentication successful, forward request to protected route.
    if (
      req.nextUrl.pathname.startsWith('/gpt4') ||
      req.nextUrl.pathname.startsWith('/api/chat-completion') ||
      req.nextUrl.pathname.startsWith('/dashboard')
    ) {
      const { data: userData, error } = await supabase
        .from('users')
        .select('is_paid_user, is_admin')
        .eq('id', session.user.id)
      if (error) {
        console.log(error)
        // Maybe return a server error response here
        return new NextResponse(JSON.stringify({ success: false, message: 'Server error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      } else {
        if (userData && userData[0]) {
          const result = userData[0]
          const isPaidUser = result.is_paid_user === true
          const isAdmin = result.is_admin === true
          if (req.nextUrl.pathname.startsWith('/dashboard')) {
            if (isAdmin) {
              return res
            } else {
              return new NextResponse(JSON.stringify({ success: false, message: 'Forbidden' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
              })
            }
          }
          if (
            req.nextUrl.pathname.startsWith('/gpt4') ||
            req.nextUrl.pathname.startsWith('/api/chat-completion')
          ) {
            if (isPaidUser) {
              return res
            } else {
              return new NextResponse(JSON.stringify({ success: false, message: 'Forbidden' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
              })
            }
          }
        }
      }
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
  if (!session && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    '/',
    '/c/:path*',
    '/dashboard/:path*',
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
