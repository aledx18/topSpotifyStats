import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  accessMaxAge,
  resolveSession,
  type TokenClient,
  TokenRequestError,
  type TokenSet
} from './session.ts'

const tokens: TokenSet = {
  access_token: 'access',
  expires_in: 3600,
  refresh_token: 'refresh'
}

function client(overrides: Partial<TokenClient> = {}): TokenClient & {
  calls: string[]
} {
  const calls: string[] = []
  return {
    calls,
    exchangeCode: async code => {
      calls.push(`exchange:${code}`)
      return tokens
    },
    refreshTokens: async refreshToken => {
      calls.push(`refresh:${refreshToken}`)
      return tokens
    },
    ...overrides
  }
}

const silent = () => {}
const url = (path: string) => new URL(`http://localhost:3000${path}`)

describe('resolveSession with an OAuth code', () => {
  it('exchanges the code and redirects without code and state, keeping other params', async () => {
    const spotify = client()
    const action = await resolveSession(
      {
        url: url('/user?code=abc&state=xyz&range=short_term'),
        hasAccessToken: false
      },
      spotify,
      silent
    )

    assert.deepEqual(spotify.calls, ['exchange:abc'])
    assert.equal(action.kind, 'redirect')
    assert.equal(
      action.kind === 'redirect' && action.url.toString(),
      'http://localhost:3000/user?range=short_term'
    )
    assert.equal(action.kind === 'redirect' && action.tokens, tokens)
  })

  it('redirects with error=auth and logs when the exchange fails', async () => {
    const logged: unknown[] = []
    const action = await resolveSession(
      { url: url('/user?code=bad'), hasAccessToken: false },
      client({
        exchangeCode: async () => {
          throw new TokenRequestError(
            'Spotify token request failed with 400',
            true
          )
        }
      }),
      (...args) => logged.push(args)
    )

    assert.equal(action.kind, 'redirect')
    assert.equal(
      action.kind === 'redirect' && action.url.toString(),
      'http://localhost:3000/user?error=auth'
    )
    assert.equal(action.kind === 'redirect' && action.tokens, undefined)
    assert.equal(logged.length, 1)
  })
})

describe('resolveSession refresh', () => {
  it('refreshes when only the refresh token is present and redirects to the same URL', async () => {
    const spotify = client()
    const action = await resolveSession(
      {
        url: url('/user?range=long_term'),
        hasAccessToken: false,
        refreshToken: 'r1'
      },
      spotify,
      silent
    )

    assert.deepEqual(spotify.calls, ['refresh:r1'])
    assert.equal(
      action.kind === 'redirect' && action.url.toString(),
      'http://localhost:3000/user?range=long_term'
    )
    assert.equal(action.kind === 'redirect' && action.tokens, tokens)
  })

  it('clears the refresh token only when Spotify rejects it', async () => {
    const action = await resolveSession(
      { url: url('/user'), hasAccessToken: false, refreshToken: 'revoked' },
      client({
        refreshTokens: async () => {
          throw new TokenRequestError(
            'Spotify token request failed with 400',
            true
          )
        }
      }),
      silent
    )

    assert.deepEqual(action, { kind: 'next', clearRefresh: true })
  })

  it('keeps the refresh token on transient failures like 5xx, rate limits or timeouts', async () => {
    for (const error of [
      new TokenRequestError('Spotify token request failed with 503', false),
      new TokenRequestError('Spotify token request failed with 429', false),
      new DOMException('The operation timed out.', 'TimeoutError')
    ]) {
      const action = await resolveSession(
        { url: url('/user'), hasAccessToken: false, refreshToken: 'r1' },
        client({
          refreshTokens: async () => {
            throw error
          }
        }),
        silent
      )
      assert.deepEqual(action, { kind: 'next', clearRefresh: false })
    }
  })

  it('passes through without calling Spotify when the access token is present', async () => {
    const spotify = client()
    const action = await resolveSession(
      { url: url('/user'), hasAccessToken: true, refreshToken: 'r1' },
      spotify,
      silent
    )

    assert.deepEqual(spotify.calls, [])
    assert.deepEqual(action, { kind: 'next', clearRefresh: false })
  })

  it('passes through without a session', async () => {
    assert.deepEqual(
      await resolveSession(
        { url: url('/user'), hasAccessToken: false },
        client(),
        silent
      ),
      { kind: 'next', clearRefresh: false }
    )
  })
})

describe('accessMaxAge', () => {
  it('expires the access cookie a minute early', () => {
    assert.equal(accessMaxAge(3600), 3540)
  })

  it('never returns zero, which would loop the refresh', () => {
    assert.equal(accessMaxAge(60), 60)
    assert.equal(accessMaxAge(30), 30)
  })
})
