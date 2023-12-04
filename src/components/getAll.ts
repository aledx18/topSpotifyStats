import { RecentlyTracksI } from '@/app/interfaceRecently'
import { topTracksUrl, topArtistsUrl, recentlyUrl } from './const'
import { ArtistsI, UserProfile } from '@/app/interface'
import { TracksI } from '@/app/interfaceTracks'

interface UserProfileResult {
  error?: string
  data?: {
    profile: UserProfile
    topTracks: TracksI
    topArtists: ArtistsI
    recentlyTracks: RecentlyTracksI
  }
}

export async function getUserProfile(
  accessToken: string
): Promise<UserProfileResult> {
  try {
    const profileResult = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!profileResult.ok) {
      const errorText = await profileResult.text()
      console.error(`Error al obtener el perfil. Detalles: ${errorText}`)
      throw new Error(`Error al obtener el perfil. Detalles: ${errorText}`)
    }

    // Verificar que la respuesta sea de tipo 'application/json'
    const contentType = profileResult.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(
        `La respuesta no es de tipo JSON. Tipo de contenido: ${contentType}`
      )
    }

    const profileData = await profileResult.json()

    const topTracksResult = await fetch(topTracksUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!topTracksResult.ok) {
      const errorText = await topTracksResult.text()
      console.error(`Error al obtener el perfil. Detalles: ${errorText}`)
      throw new Error(`Error al obtener el perfil. Detalles: ${errorText}`)
    }

    const topTracksData = await topTracksResult.json()

    const topArtistsResult = await fetch(topArtistsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!topArtistsResult.ok) {
      throw new Error(
        `Error al obtener los principales artistas. Código de estado: ${topArtistsResult.status}`
      )
    }

    const topArtistData = await topArtistsResult.json()

    const recentlyTracksResult = await fetch(recentlyUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!recentlyTracksResult.ok) {
      throw new Error(
        `Error al obtener los principales artistas. Código de estado: ${recentlyTracksResult.status}`
      )
    }

    const recentlyTrackData = await recentlyTracksResult.json()

    // await new Promise((resolve) => setTimeout(resolve, 90000))

    return {
      data: {
        profile: profileData,
        topTracks: topTracksData,
        topArtists: topArtistData,
        recentlyTracks: recentlyTrackData
      }
    }
  } catch (error: any) {
    console.log(error)
    return { error: error.message }
  }
}
