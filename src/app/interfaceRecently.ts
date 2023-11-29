interface ExternalIDS {
  isrc: string
}
interface ExternalUrls {
  spotify: string
}
interface Image {
  height: number
  url: string
  width: number
}
interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}
interface Album {
  album_type: string
  artists: Artist[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: Date
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}
interface Track {
  album: Album
  artists: Artist[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIDS
  external_urls: ExternalUrls
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: null
  track_number: number
  type: string
  uri: string
}

interface Context {
  type: string
  href: string
  external_urls: ExternalUrls
  uri: string
}

interface Item {
  track: Track
  played_at: Date
  context: Context
}

interface Cursors {
  after: string
  before: string
}
export interface RecentlyTracksI {
  items: Item[]
  next: string
  cursors: Cursors
  limit: number
  href: string
}
