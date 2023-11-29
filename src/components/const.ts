export const publicClient =
  process.env.NEXT_PUBLIC_CLIENT ||
  (function () {
    throw new Error('NEXT_PUBLIC_CLIENT no está definido')
  })()
export const publicUrl =
  process.env.NEXT_PUBLIC_URl ||
  (function () {
    throw new Error('NEXT_PUBLIC_URl no está definido')
  })()
export const clientSecret = process.env.NEXT_CLIENT_SECRET || ''
export const scopes =
  'user-top-read%20user-read-recently-played%20user-read-private%20user-read-email'

export const topArtistsUrl =
  'https://api.spotify.com/v1/me/top/artists?limit=15'
export const topTracksUrl =
  'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=8'
export const recentlyUrl =
  'https://api.spotify.com/v1/me/player/recently-played?limit=9'
