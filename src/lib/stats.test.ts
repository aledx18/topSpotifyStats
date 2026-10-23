import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { Artist, PlayHistory, Track } from './spotify/types.ts'
import {
  decadeHistogram,
  distinctArtistCount,
  distinctTrackCount,
  explicitShare,
  genreRanking,
  hourHistogram,
  listenedMinutes,
  partOfDay,
  rankChanges,
  relativeTime
} from './stats.ts'

const track = (id: string, overrides: Partial<Track> = {}): Track => ({
  id,
  name: `Track ${id}`,
  artists: [{ id: `artist-${id}`, name: `Artist ${id}` }],
  album: {
    id: `album-${id}`,
    name: 'Album',
    images: [],
    release_date: '2004-05-01'
  },
  duration_ms: 180_000,
  explicit: false,
  ...overrides
})

const artist = (id: string, genres?: string[]): Artist => ({
  id,
  name: `Artist ${id}`,
  images: [],
  genres
})

const play = (
  id: string,
  playedAt: string,
  durationMs = 180_000
): PlayHistory => ({
  track: track(id, { duration_ms: durationMs }),
  played_at: playedAt
})

describe('genreRanking', () => {
  it('ranks genres by frequency with their share of all genre mentions', () => {
    const ranking = genreRanking([
      artist('a', ['rock', 'punk']),
      artist('b', ['rock']),
      artist('c', ['rock', 'pop'])
    ])

    assert.deepEqual(ranking, [
      { genre: 'rock', count: 3, percent: 60 },
      { genre: 'punk', count: 1, percent: 20 },
      { genre: 'pop', count: 1, percent: 20 }
    ])
  })

  it('returns an empty list when Spotify sends no genres', () => {
    assert.deepEqual(genreRanking([artist('a'), artist('b', [])]), [])
  })
})

describe('decadeHistogram', () => {
  it('buckets tracks by release decade from the 70s to the 20s, ignores older ones and picks the favorite', () => {
    const result = decadeHistogram([
      track('1', {
        album: { id: 'x', name: 'x', images: [], release_date: '1977' }
      }),
      track('2', {
        album: { id: 'y', name: 'y', images: [], release_date: '2003-01-01' }
      }),
      track('3', {
        album: { id: 'z', name: 'z', images: [], release_date: '2008-10' }
      }),
      track('4', {
        album: { id: 'w', name: 'w', images: [], release_date: '1965-01-01' }
      })
    ])

    assert.deepEqual(result.buckets, [
      { decade: '70s', count: 1 },
      { decade: '80s', count: 0 },
      { decade: '90s', count: 0 },
      { decade: '00s', count: 2 },
      { decade: '10s', count: 0 },
      { decade: '20s', count: 0 }
    ])
    assert.equal(result.favorite, '00s')
  })

  it('has no favorite decade without tracks', () => {
    assert.equal(decadeHistogram([]).favorite, null)
  })
})

describe('rankChanges', () => {
  it('reports positions gained, lost, unchanged and new entries', () => {
    const previous = [track('a'), track('b'), track('c')]
    const current = [track('b'), track('a'), track('c'), track('d')]

    assert.deepEqual(rankChanges(current, previous), {
      b: 1,
      a: -1,
      c: 0,
      d: 'new'
    })
  })

  it('returns no changes when there is no previous period', () => {
    assert.deepEqual(rankChanges([track('a')], null), {})
  })
})

describe('hourHistogram and partOfDay', () => {
  it('counts plays per local hour and names the busiest part of the day', () => {
    const plays = [
      play('1', '2026-10-22T22:10:00Z'),
      play('2', '2026-10-22T23:30:00Z'),
      play('3', '2026-10-22T22:45:00Z'),
      play('4', '2026-10-22T09:00:00Z')
    ]
    const hours = hourHistogram(plays, 'UTC')

    assert.equal(hours.length, 24)
    assert.equal(hours[22], 2)
    assert.equal(hours[23], 1)
    assert.equal(hours[9], 1)
    assert.equal(partOfDay(hours), 'noche')
  })

  it('uses the given time zone to compute the hour', () => {
    const hours = hourHistogram(
      [play('1', '2026-10-22T02:00:00Z')],
      'America/Argentina/Buenos_Aires'
    )
    assert.equal(hours[23], 1)
  })

  it('names each part of the day by its busiest hours', () => {
    const at = (hour: number) =>
      Array.from({ length: 24 }, (_, h) => (h === hour ? 5 : 0))
    assert.equal(partOfDay(at(3)), 'madrugada')
    assert.equal(partOfDay(at(8)), 'mañana')
    assert.equal(partOfDay(at(15)), 'tarde')
    assert.equal(partOfDay(at(21)), 'noche')
    assert.equal(partOfDay(new Array(24).fill(0)), null)
  })
})

describe('listening totals', () => {
  it('sums the minutes of the recent plays, rounded', () => {
    assert.equal(
      listenedMinutes([
        play('1', '2026-10-22T10:00:00Z', 200_000),
        play('2', '2026-10-22T10:05:00Z', 130_000)
      ]),
      6
    )
  })

  it('counts distinct artists and tracks', () => {
    const tracks = [
      track('1'),
      track('2', {
        artists: [
          { id: 'artist-1', name: 'Artist 1' },
          { id: 'artist-x', name: 'X' }
        ]
      })
    ]
    assert.equal(distinctArtistCount(tracks), 2)
    assert.equal(
      distinctTrackCount([play('1', 'a'), play('1', 'b'), play('2', 'c')]),
      2
    )
  })

  it('computes the share of explicit tracks as a whole percent', () => {
    assert.equal(
      explicitShare([track('1', { explicit: true }), track('2'), track('3')]),
      33
    )
    assert.equal(explicitShare([]), 0)
  })
})

describe('relativeTime', () => {
  const now = new Date('2026-10-22T12:00:00Z')

  it('formats elapsed time like the design', () => {
    assert.equal(relativeTime('2026-10-22T11:59:40Z', now), 'recién')
    assert.equal(relativeTime('2026-10-22T11:01:00Z', now), 'hace 59 min')
    assert.equal(relativeTime('2026-10-22T10:30:00Z', now), 'hace 1 h')
    assert.equal(relativeTime('2026-10-20T12:00:00Z', now), 'hace 2 d')
  })
})
