import type { NextResponse } from 'next/server'
import { clientSecret, publicClient, publicUrl } from '@/components/const'

export const ACCESS_COOKIE = 'sp_access'
export const REFRESH_COOKIE = 'sp_refresh'

const REFRESH_MAX_AGE = 60 * 60 * 24 * 30
// Expire the access cookie a minute early so a request never carries a stale token.
const EXPIRY_MARGIN = 60

interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
}

async function requestToken(params: Record<string, string>) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      ...params,
      client_id: publicClient,
      client_secret: clientSecret
    }),
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error(`Spotify token request failed with ${response.status}`)
  }
  return (await response.json()) as TokenResponse
}

export function exchangeCode(code: string) {
  return requestToken({
    grant_type: 'authorization_code',
    code,
    redirect_uri: publicUrl
  })
}

export function refreshTokens(refreshToken: string) {
  return requestToken({
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  })
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
} as const

export function setTokenCookies(response: NextResponse, tokens: TokenResponse) {
  response.cookies.set(ACCESS_COOKIE, tokens.access_token, {
    ...cookieOptions,
    // Never zero: a cookie that expires on arrival would loop the refresh.
    maxAge:
      tokens.expires_in > EXPIRY_MARGIN
        ? tokens.expires_in - EXPIRY_MARGIN
        : tokens.expires_in
  })
  // Spotify may omit the refresh token on refresh; the previous one stays valid.
  if (tokens.refresh_token) {
    response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
      ...cookieOptions,
      maxAge: REFRESH_MAX_AGE
    })
  }
}
