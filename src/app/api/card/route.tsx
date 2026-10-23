import { cookies } from 'next/headers'
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { getDashboardData, SpotifyAuthError } from '@/lib/spotify/api'
import { ACCESS_COOKIE } from '@/lib/spotify/auth'
import { parseTimeRange, TIME_RANGE_PERIODS } from '@/lib/spotify/ranges'
import { genreRanking } from '@/lib/stats'

// Story size for Instagram.
const WIDTH = 1080
const HEIGHT = 1920
const TOP = 5
const ORANGE = '#ea580c'

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div
        style={{
          fontSize: 34,
          color: ORANGE,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 4
        }}
      >
        {title}
      </div>
      {items.map((item, index) => (
        <div key={item} style={{ display: 'flex', fontSize: 48, gap: 24 }}>
          <span
            style={{
              color: index === 0 ? ORANGE : '#737373',
              fontWeight: 700,
              width: 48
            }}
          >
            {index + 1}
          </span>
          <span
            style={{
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 820
            }}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  )
}

export async function GET(request: NextRequest) {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value
  if (!token) return new Response('Unauthorized', { status: 401 })

  const range = parseTimeRange(request.nextUrl.searchParams.get('range'))
  let data: Awaited<ReturnType<typeof getDashboardData>>
  try {
    data = await getDashboardData(token, range)
  } catch (err) {
    const status = err instanceof SpotifyAuthError ? 401 : 502
    return new Response('Could not load Spotify data', { status })
  }

  const name = data.profile.display_name ?? data.profile.id
  const genres = genreRanking(data.artists)
    .slice(0, TOP)
    .map(g => g.genre)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 96,
        background: '#0a0a0a',
        color: '#fafafa'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 40, color: '#a3a3a3' }}>
          {TIME_RANGE_PERIODS[range]}
        </div>
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 800 }}>
          El top de&nbsp;<span style={{ color: ORANGE }}>{name}</span>
        </div>
      </div>
      <List
        title='Artistas'
        items={data.artists.slice(0, TOP).map(a => a.name)}
      />
      <List
        title='Canciones'
        items={data.tracks.slice(0, TOP).map(t => t.name)}
      />
      {genres.length > 0 && <List title='Géneros' items={genres} />}
      <div style={{ fontSize: 32, color: '#737373' }}>Top Spotify Stats</div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      headers: { 'Cache-Control': 'private, no-store' }
    }
  )
}
