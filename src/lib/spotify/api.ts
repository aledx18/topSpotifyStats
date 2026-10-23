import { PREVIOUS_RANGE } from './ranges'
import type {
  Artist,
  Paging,
  PlayHistory,
  TimeRange,
  Track,
  UserProfile
} from './types'

const API_URL = 'https://api.spotify.com/v1'
// Spotify caps top items and recently played at 50 per request.
const LIMIT = 50

export class SpotifyAuthError extends Error {}

async function get<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  })

  if (response.status === 401) throw new SpotifyAuthError('Token expired')
  if (!response.ok) {
    throw new Error(`Spotify ${path} failed with ${response.status}`)
  }
  return (await response.json()) as T
}

export interface DashboardData {
  profile: UserProfile
  artists: Artist[]
  tracks: Track[]
  previousTracks: Track[] | null
  recent: PlayHistory[]
}

export async function getDashboardData(
  token: string,
  range: TimeRange
): Promise<DashboardData> {
  const previousRange = PREVIOUS_RANGE[range]
  const [profile, artists, tracks, previousTracks, recent] = await Promise.all([
    get<UserProfile>('/me', token),
    get<Paging<Artist>>(
      `/me/top/artists?time_range=${range}&limit=${LIMIT}`,
      token
    ),
    get<Paging<Track>>(
      `/me/top/tracks?time_range=${range}&limit=${LIMIT}`,
      token
    ),
    previousRange
      ? get<Paging<Track>>(
          `/me/top/tracks?time_range=${previousRange}&limit=${LIMIT}`,
          token
        )
      : null,
    get<Paging<PlayHistory>>(`/me/player/recently-played?limit=${LIMIT}`, token)
  ])

  return {
    profile,
    artists: artists.items,
    tracks: tracks.items,
    previousTracks: previousTracks?.items ?? null,
    recent: recent.items
  }
}
