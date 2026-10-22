export const publicClient =
  process.env.NEXT_PUBLIC_CLIENT ||
  (() => {
    throw new Error('NEXT_PUBLIC_CLIENT no está definido')
  })()
export const publicUrl =
  process.env.NEXT_PUBLIC_URL ||
  (() => {
    throw new Error('NEXT_PUBLIC_URL no está definido')
  })()
export const clientSecret = process.env.NEXT_CLIENT_SECRET || ''
export const scopes =
  'user-top-read%20user-read-recently-played%20user-read-private%20user-read-email'

export const spotifyLoginUrl = `https://accounts.spotify.com/authorize?client_id=${publicClient}&response_type=code&redirect_uri=${publicUrl}&scope=${scopes}`
