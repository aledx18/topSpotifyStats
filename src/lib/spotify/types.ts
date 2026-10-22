// Subset of the Spotify Web API objects the dashboard reads.
// `popularity` and `followers` were removed in February 2026 and
// `genres` may come back empty, so nothing here depends on them.

export type TimeRange = 'short_term' | 'medium_term' | 'long_term'

export interface SpotifyImage {
  url: string
  width: number | null
  height: number | null
}

export interface SimpleArtist {
  id: string
  name: string
}

export interface Artist extends SimpleArtist {
  genres?: string[]
  images: SpotifyImage[]
}

export interface Album {
  id: string
  name: string
  images: SpotifyImage[]
  release_date: string
}

export interface Track {
  id: string
  name: string
  artists: SimpleArtist[]
  album: Album
  duration_ms: number
  explicit: boolean
}

export interface PlayHistory {
  track: Track
  played_at: string
}

export interface UserProfile {
  id: string
  display_name: string | null
  images: SpotifyImage[]
}

export interface Paging<T> {
  items: T[]
}
