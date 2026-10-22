import type { Artist, PlayHistory, Track } from './spotify/types.ts'

export interface GenreShare {
  genre: string
  count: number
  percent: number
}

export function genreRanking(artists: Artist[]): GenreShare[] {
  const counts = new Map<string, number>()
  for (const artist of artists) {
    for (const genre of artist.genres ?? []) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1)
    }
  }

  const total = [...counts.values()].reduce((sum, count) => sum + count, 0)
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([genre, count]) => ({
      genre,
      count,
      percent: Math.round((count / total) * 100)
    }))
}

const DECADES = ['70s', '80s', '90s', '00s', '10s', '20s'] as const
const FIRST_DECADE_YEAR = 1970

export interface DecadeBucket {
  decade: (typeof DECADES)[number]
  count: number
}

export function decadeHistogram(tracks: Track[]) {
  const buckets: DecadeBucket[] = DECADES.map(decade => ({ decade, count: 0 }))
  for (const track of tracks) {
    const year = Number.parseInt(track.album.release_date.slice(0, 4), 10)
    const index = Math.floor((year - FIRST_DECADE_YEAR) / 10)
    if (index >= 0 && index < buckets.length) buckets[index].count++
  }

  const top = buckets.reduce((best, bucket) =>
    bucket.count > best.count ? bucket : best
  )
  return { buckets, favorite: top.count > 0 ? top.decade : null }
}

export type RankChange = number | 'new'

// Positions gained (positive) or lost (negative) against the previous period.
export function rankChanges(
  current: Track[],
  previous: Track[] | null
): Record<string, RankChange> {
  if (!previous) return {}

  const previousRank = new Map(
    previous.map((track, index) => [track.id, index])
  )
  const changes: Record<string, RankChange> = {}
  current.forEach((track, index) => {
    const before = previousRank.get(track.id)
    changes[track.id] = before === undefined ? 'new' : before - index
  })
  return changes
}

export function hourHistogram(plays: PlayHistory[], timeZone?: string) {
  const format = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hourCycle: 'h23',
    timeZone
  })
  const hours: number[] = new Array(24).fill(0)
  for (const play of plays) {
    hours[Number(format.format(new Date(play.played_at)))]++
  }
  return hours
}

export type PartOfDay = 'madrugada' | 'mañana' | 'tarde' | 'noche'

const PARTS_OF_DAY: { name: PartOfDay; from: number; to: number }[] = [
  { name: 'madrugada', from: 0, to: 5 },
  { name: 'mañana', from: 6, to: 11 },
  { name: 'tarde', from: 12, to: 17 },
  { name: 'noche', from: 18, to: 23 }
]

export function partOfDay(hours: number[]): PartOfDay | null {
  let best: PartOfDay | null = null
  let bestCount = 0
  for (const part of PARTS_OF_DAY) {
    const count = hours
      .slice(part.from, part.to + 1)
      .reduce((sum, value) => sum + value, 0)
    if (count > bestCount) {
      best = part.name
      bestCount = count
    }
  }
  return best
}

export function listenedMinutes(plays: PlayHistory[]) {
  const totalMs = plays.reduce((sum, play) => sum + play.track.duration_ms, 0)
  return Math.round(totalMs / 60_000)
}

export function distinctArtistCount(tracks: Track[]) {
  return new Set(tracks.flatMap(track => track.artists.map(a => a.id))).size
}

export function distinctTrackCount(plays: PlayHistory[]) {
  return new Set(plays.map(play => play.track.id)).size
}

export function explicitShare(tracks: Track[]) {
  if (tracks.length === 0) return 0
  const explicit = tracks.filter(track => track.explicit).length
  return Math.round((explicit / tracks.length) * 100)
}

export function relativeTime(date: string, now: Date = new Date()) {
  const minutes = Math.floor(
    (now.getTime() - new Date(date).getTime()) / 60_000
  )
  if (minutes < 1) return 'recién'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  return `hace ${Math.floor(hours / 24)} d`
}
