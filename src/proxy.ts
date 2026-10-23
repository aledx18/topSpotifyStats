import { type NextRequest, NextResponse } from 'next/server'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  setTokenCookies,
  spotifyTokenClient
} from '@/lib/spotify/auth'
import { resolveSession } from '@/lib/spotify/session'

// Keeps the Spotify session in httpOnly cookies; see resolveSession.
export async function proxy(request: NextRequest) {
  const action = await resolveSession(
    {
      url: request.nextUrl.clone(),
      hasAccessToken: request.cookies.has(ACCESS_COOKIE),
      refreshToken: request.cookies.get(REFRESH_COOKIE)?.value
    },
    spotifyTokenClient
  )

  if (action.kind === 'redirect') {
    const response = NextResponse.redirect(action.url)
    if (action.tokens) setTokenCookies(response, action.tokens)
    return response
  }

  const response = NextResponse.next()
  if (action.clearRefresh) response.cookies.delete(REFRESH_COOKIE)
  return response
}

// /api/card reads the same cookie, so it needs the same refresh.
export const config = {
  matcher: ['/user', '/api/card']
}
