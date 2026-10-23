// Session decisions for the proxy, kept free of Next.js and env access so
// they can be tested with node:test.

export interface TokenSet {
  access_token: string
  expires_in: number
  refresh_token?: string
}

export interface TokenClient {
  exchangeCode(code: string): Promise<TokenSet>
  refreshTokens(refreshToken: string): Promise<TokenSet>
}

// `permanent` marks answers that will never succeed on retry (Spotify
// rejected the grant), as opposed to outages, rate limits or timeouts.
export class TokenRequestError extends Error {
  readonly permanent: boolean

  constructor(message: string, permanent: boolean) {
    super(message)
    this.permanent = permanent
  }
}

export type SessionAction =
  | { kind: 'redirect'; url: URL; tokens?: TokenSet }
  | { kind: 'next'; clearRefresh: boolean }

interface SessionInput {
  url: URL
  hasAccessToken: boolean
  refreshToken?: string
}

type Log = (...args: unknown[]) => void

export async function resolveSession(
  { url, hasAccessToken, refreshToken }: SessionInput,
  client: TokenClient,
  log: Log = console.error
): Promise<SessionAction> {
  const code = url.searchParams.get('code')

  if (code) {
    // The OAuth code is single-use: trade it once and drop it from the URL.
    const target = new URL(url)
    target.searchParams.delete('code')
    target.searchParams.delete('state')
    try {
      return {
        kind: 'redirect',
        url: target,
        tokens: await client.exchangeCode(code)
      }
    } catch (error) {
      log('Spotify code exchange failed:', error)
      target.searchParams.set('error', 'auth')
      return { kind: 'redirect', url: target }
    }
  }

  if (!hasAccessToken && refreshToken) {
    try {
      return {
        kind: 'redirect',
        url: new URL(url),
        tokens: await client.refreshTokens(refreshToken)
      }
    } catch (error) {
      log('Spotify token refresh failed:', error)
      return {
        kind: 'next',
        clearRefresh: error instanceof TokenRequestError && error.permanent
      }
    }
  }

  return { kind: 'next', clearRefresh: false }
}

// Expire the access cookie a minute early so a request never carries a
// stale token, but never set zero: a cookie that expires on arrival would
// loop the refresh redirect.
const EXPIRY_MARGIN = 60

export function accessMaxAge(expiresIn: number) {
  return expiresIn > EXPIRY_MARGIN ? expiresIn - EXPIRY_MARGIN : expiresIn
}
