import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/home'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    )
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 2. Extract the Provider Token (GitHub Access Token)
      const providerToken = data.session?.provider_token

      // 3. Store it in a specific cookie that your Client Hook can read
      if (providerToken) {
        cookieStore.set('gh_provider_token', providerToken, {
            path: '/',
            httpOnly: false, // Vital: Allows client-side JS to read this cookie
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600 * 24 // Expire after 1 day
        })
      }

      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
        console.error('🔥 Supabase Auth Error:', error.message)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}