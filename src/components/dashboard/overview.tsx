import { AudioLines } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Artist, PlayHistory, Track } from '@/lib/spotify/types'
import { relativeTime } from '@/lib/stats'
import { Cover } from './cover'

interface TopArtistCardProps {
  artist: Artist
  tracks: Track[]
  recent: PlayHistory[]
}

export function TopArtistCard({ artist, tracks, recent }: TopArtistCardProps) {
  const artistTracks = tracks.filter(track =>
    track.artists.some(a => a.id === artist.id)
  )
  const lastPlay = recent.find(play =>
    play.track.artists.some(a => a.id === artist.id)
  )

  return (
    <Card className='h-full'>
      <CardContent className='flex h-full flex-col gap-6 sm:flex-row'>
        <div className='relative shrink-0'>
          <Cover
            images={artist.images}
            name={artist.name}
            size={320}
            className='size-48 rounded-xl after:rounded-xl lg:size-52'
            fallbackClassName='text-7xl'
          />
          <Badge className='absolute top-3 left-3'>#1</Badge>
        </div>

        <div className='flex min-w-0 flex-1 flex-col gap-4'>
          <div className='flex flex-col gap-3'>
            <p className='text-xs font-semibold tracking-widest text-primary uppercase'>
              Tu artista número 1
            </p>
            <h2 className='truncate text-5xl font-black tracking-tight lg:text-6xl'>
              {artist.name}
            </h2>
            {artist.genres && artist.genres.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {artist.genres.slice(0, 3).map(genre => (
                  <Badge key={genre} variant='secondary'>
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator className='mt-auto' />

          <dl className='grid grid-cols-2 gap-4'>
            <div>
              <dt className='text-xs text-muted-foreground'>
                Canción favorita
              </dt>
              <dd className='truncate font-semibold'>
                {artistTracks[0]?.name ?? '—'}
              </dd>
            </div>
            <div>
              <dt className='text-xs text-muted-foreground'>
                En tu top {tracks.length}
              </dt>
              <dd className='font-semibold'>
                {artistTracks.length}{' '}
                {artistTracks.length === 1 ? 'canción' : 'canciones'}
              </dd>
            </div>
            <div>
              <dt className='text-xs text-muted-foreground'>
                Escuchada por última vez
              </dt>
              <dd className='font-semibold'>
                {lastPlay
                  ? relativeTime(lastPlay.played_at)
                  : 'Sin escuchas recientes'}
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  hint: string
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card className='h-full'>
      <CardContent className='flex flex-col gap-1'>
        <p className='text-xs text-muted-foreground'>{label}</p>
        <p className='truncate text-3xl font-bold capitalize'>{value}</p>
        <p className='text-xs text-muted-foreground'>{hint}</p>
      </CardContent>
    </Card>
  )
}

export function LastPlayedCard({ play }: { play: PlayHistory }) {
  return (
    <Card className='bg-primary/10 ring-primary/20'>
      <CardContent className='flex items-center gap-4'>
        <Cover
          images={play.track.album.images}
          name={play.track.name}
          size={96}
          className='size-12'
        />
        <div className='min-w-0 flex-1'>
          <p className='text-xs font-semibold tracking-widest text-primary uppercase'>
            Lo último que escuchaste
          </p>
          <p className='truncate font-semibold'>{play.track.name}</p>
          <p className='truncate text-xs text-muted-foreground'>
            {play.track.artists.map(a => a.name).join(', ')} ·{' '}
            {relativeTime(play.played_at)}
          </p>
        </div>
        <AudioLines className='size-7 shrink-0 text-primary' />
      </CardContent>
    </Card>
  )
}
