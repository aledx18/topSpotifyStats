import type { DashboardData } from '@/lib/spotify/api'
import { TIME_RANGE_PERIODS } from '@/lib/spotify/ranges'
import type { TimeRange } from '@/lib/spotify/types'
import {
  decadeHistogram,
  distinctArtistCount,
  distinctTrackCount,
  explicitShare,
  genreRanking,
  listenedMinutes,
  rankChanges
} from '@/lib/stats'
import { DecadesCard, ListeningHoursCard } from './charts'
import { DashboardHeader } from './dashboard-header'
import { GenresCard, RecentlyPlayedCard, TopArtistsCard } from './music-cards'
import { LastPlayedCard, StatCard, TopArtistCard } from './overview'
import { ExplicitCard, ShareBanner } from './summary'
import { TopTracksCard } from './top-tracks-card'

function formatDuration(ms: number) {
  const totalSeconds = Math.round(ms / 1000)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${Math.floor(totalSeconds / 60)}:${seconds}`
}

interface DashboardProps {
  data: DashboardData
  range: TimeRange
}

export function Dashboard({ data, range }: DashboardProps) {
  const { profile, artists, tracks, previousTracks, recent } = data
  const name = profile.display_name ?? profile.id
  const genres = genreRanking(artists)
  const decades = decadeHistogram(tracks)
  const averageMs =
    tracks.reduce((sum, track) => sum + track.duration_ms, 0) /
    Math.max(tracks.length, 1)

  return (
    <main className='mx-auto flex max-w-7xl flex-col gap-5 p-4 md:p-8'>
      <DashboardHeader name={name} images={profile.images} range={range} />

      <section className='grid gap-5 lg:grid-cols-12'>
        <div className='lg:col-span-7'>
          {artists[0] && (
            <TopArtistCard
              artist={artists[0]}
              tracks={tracks}
              recent={recent}
            />
          )}
        </div>
        <div className='grid grid-cols-2 gap-5 lg:col-span-5'>
          <StatCard
            label='Minutos escuchados'
            value={listenedMinutes(recent)}
            hint={`en tus últimas ${recent.length} escuchas`}
          />
          <StatCard
            label='Artistas distintos'
            value={distinctArtistCount(tracks)}
            hint={`en tu top de ${tracks.length} canciones`}
          />
          {genres[0] ? (
            <StatCard
              label='Género principal'
              value={genres[0].genre}
              hint={
                genres[1]
                  ? `seguido de ${genres[1].genre}`
                  : 'tu género número 1'
              }
            />
          ) : (
            <StatCard
              label='Duración promedio'
              value={formatDuration(averageMs)}
              hint='de tus top canciones'
            />
          )}
          <StatCard
            label='Canciones distintas'
            value={distinctTrackCount(recent)}
            hint={`en tus últimas ${recent.length} escuchas`}
          />
          {recent[0] && (
            <div className='col-span-2'>
              <LastPlayedCard play={recent[0]} />
            </div>
          )}
        </div>
      </section>

      <section className='grid gap-5 lg:grid-cols-12'>
        <div className={genres.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <TopTracksCard
            tracks={tracks}
            changes={rankChanges(tracks, previousTracks)}
          />
        </div>
        {genres.length > 0 && (
          <div className='lg:col-span-4'>
            <GenresCard genres={genres} />
          </div>
        )}
      </section>

      {artists.length > 0 && (
        <TopArtistsCard artists={artists} period={TIME_RANGE_PERIODS[range]} />
      )}

      <section className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
        <RecentlyPlayedCard recent={recent} />
        <DecadesCard buckets={decades.buckets} favorite={decades.favorite} />
        <div className='flex flex-col gap-5 md:col-span-2 lg:col-span-1'>
          <ExplicitCard percent={explicitShare(tracks)} />
          <ListeningHoursCard recent={recent} />
        </div>
      </section>

      <ShareBanner range={range} />

      <footer className='flex flex-col justify-between gap-2 text-xs text-muted-foreground sm:flex-row'>
        <span>Datos de tu cuenta de Spotify · no reproduce música</span>
        <a
          href='https://github.com/aledx18'
          target='_blank'
          rel='noreferrer'
          className='hover:text-foreground'
        >
          Hecho por aledx18
        </a>
      </footer>
    </main>
  )
}
