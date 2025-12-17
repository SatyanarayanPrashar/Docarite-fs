import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    console.log(`[Middleware Running] Path: ${request.nextUrl.pathname}`)
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // -------------------------------------------------------------
  // LOGIC 1: If User IS Logged In
  // -------------------------------------------------------------
  // If they try to go to "/" or "/authentication", send them to "/home"
  if (user) {
    if (url.pathname === '/' || url.pathname === '/authentication') {
      url.pathname = '/home'
      return NextResponse.redirect(url)
    }
  }

  // -------------------------------------------------------------
  // LOGIC 2: If User is NOT Logged In
  // -------------------------------------------------------------
  // If they try to access "/home" (or anything inside it), send them to "/authentication"
  if (!user) {
    if (url.pathname.startsWith('/home')) {
      url.pathname = '/authentication' // <--- Redirect to your specific auth page
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}