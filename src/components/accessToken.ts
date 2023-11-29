/* eslint-disable camelcase */
import { clientSecret, publicClient, publicUrl } from './const'
import { getUserProfile } from './getAll'

export async function getAccesToken(code: string) {
  const data = new URLSearchParams()
  data.append('grant_type', 'authorization_code')
  data.append('code', code)
  data.append('redirect_uri', publicUrl)
  data.append('client_id', publicClient)
  data.append('client_secret', clientSecret)

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    })

    const { access_token } = await response.json()

    const profile = await getUserProfile(access_token)
    return profile
  } catch (error) {
    console.error('Error change code for token:', error)
  }
}
