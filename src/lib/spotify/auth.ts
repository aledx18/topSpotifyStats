import type { NextResponse } from 'next/server'
import { clientSecret, publicClient, publicUrl } from '@/components/const'
import {
  accessMaxAge,
  type TokenClient,
  TokenRequestError,
  type TokenSet
} from './session'

export const ACCESS_COOKIE = 'sp_access'
export const REFRESH_COOKIE = 'sp_refresh'

const REFRESH_MAX_AGE = 60 * 60 * 24 * 30
const TOKEN_TIMEOUT_MS = 10_000

function isTokenSet(value: unknown): value is TokenSet {
  const tokens = value as Partial<TokenSet> | null
  return (
    typeof tokens?.access_token === 'string' &&
    typeof tokens.expires_in === 'number' &&
    tokens.expires_in > 0
  )
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
    cache: 'no-store',
    signal: AbortSignal.timeout(TOKEN_TIMEOUT_MS)
  })

  if (!response.ok) {
    // 400/401 mean the grant or client was rejected; retrying cannot help.
    throw new TokenRequestError(
      `Spotify token request failed with ${response.status}`,
      response.status === 400 || response.status === 401
    )
  }

  const tokens: unknown = await response.json()
  if (!isTokenSet(tokens)) {
    throw new TokenRequestError(
      'Spotify returned an invalid token response',
      false
    )
  }
  return tokens
}

export const spotifyTokenClient: TokenClient = {
  exchangeCode: code =>
    requestToken({
      grant_type: 'authorization_code',
      code,
      redirect_uri: publicUrl
    }),
  refreshTokens: refreshToken =>
    requestToken({
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

export function setTokenCookies(response: NextResponse, tokens: TokenSet) {
  response.cookies.set(ACCESS_COOKIE, tokens.access_token, {
    ...cookieOptions,
    maxAge: accessMaxAge(tokens.expires_in)
  })
  // Spotify may omit the refresh token on refresh; the previous one stays valid.
  if (tokens.refresh_token) {
    response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
      ...cookieOptions,
      maxAge: REFRESH_MAX_AGE
    })
  }
}
