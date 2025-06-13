// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // 1. Create a response object
  let res = NextResponse.next()

  // 2. Create Supabase client and pass in the request + response
  const supabase = createMiddlewareClient({ req, res })

  // 3. Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('middleware: session', session?.user?.email ?? 'none')

  // 4. If route is the auth callback, just let it go
  if (req.nextUrl.pathname.startsWith('/auth/callback')) {
    return res
  }

  // 5. Not logged in, redirect to home
  if (!session && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // 6. Logged in but still on home page, send to /home
  if (session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  // ✅ 7. IMPORTANT: return the SAME response object used in supabase client
  return res
}

export const config = {
  matcher: ['/', '/home', '/auth/callback'],
}
