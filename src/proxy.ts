import { type NextRequest, NextResponse } from 'next/server'
import {
  ACCESS_COOKIE,
  exchangeCode,
  REFRESH_COOKIE,
  refreshTokens,
  setTokenCookies
} from '@/lib/spotify/auth'

// The OAuth `code` Spotify appends to /user is single-use, so it is traded
// for tokens once, kept in httpOnly cookies, and removed from the URL.
export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const code = url.searchParams.get('code')

  if (code) {
    url.searchParams.delete('code')
    url.searchParams.delete('state')
    try {
      const response = NextResponse.redirect(url)
      setTokenCookies(response, await exchangeCode(code))
      return response
    } catch {
      url.searchParams.set('error', 'auth')
      return NextResponse.redirect(url)
    }
  }

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value
  if (!request.cookies.has(ACCESS_COOKIE) && refreshToken) {
    try {
      const response = NextResponse.redirect(url)
      setTokenCookies(response, await refreshTokens(refreshToken))
      return response
    } catch {
      const response = NextResponse.next()
      response.cookies.delete(REFRESH_COOKIE)
      return response
    }
  }

  return NextResponse.next()
}

// /api/card reads the same cookie, so it needs the same refresh.
export const config = {
  matcher: ['/user', '/api/card']
}
