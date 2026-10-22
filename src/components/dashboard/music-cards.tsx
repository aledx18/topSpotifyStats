import { cn } from 'cn'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import type { Artist, PlayHistory } from '@/lib/spotify/types'
import { type GenreShare, relativeTime } from '@/lib/stats'
import { Cover } from './cover'

const RANKED_GENRES = 6
const EXTRA_GENRES = 12

export function GenresCard({ genres }: { genres: GenreShare[] }) {
  const ranked = genres.slice(0, RANKED_GENRES)
  const others = genres.slice(RANKED_GENRES, RANKED_GENRES + EXTRA_GENRES)
  // Bars are relative to the top genre so the leader always fills its track.
  const top = ranked[0]?.percent ?? 1

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Tus géneros</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <ol className='flex flex-col gap-3'>
          {ranked.map((genre, index) => (
            <li key={genre.genre} className='flex flex-col gap-1.5'>
              <div className='flex justify-between gap-2 text-sm font-semibold'>
                <span className='truncate capitalize'>
                  {index + 1}. {genre.genre}
                </span>
                <span className='text-muted-foreground'>{genre.percent}%</span>
              </div>
              <Progress
                value={(genre.percent / top) * 100}
                aria-label={`${genre.genre} ${genre.percent}%`}
                className={cn(
                  'h-1.5',
                  index > 0 &&
                    '*:data-[slot=progress-indicator]:bg-muted-foreground/50'
                )}
              />
            </li>
          ))}
        </ol>

        {others.length > 0 && (
          <>
            <Separator />
            <div className='flex flex-col gap-2'>
              <p className='text-xs text-muted-foreground'>También escuchás</p>
              <div className='flex flex-wrap gap-2'>
                {others.map(genre => (
                  <Badge key={genre.genre} variant='outline'>
                    {genre.genre}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

interface TopArtistsCardProps {
  artists: Artist[]
  period: string
}

export function TopArtistsCard({ artists, period }: TopArtistsCardProps) {
  return (
    <Card>
      <CardHeader className='flex items-start justify-between'>
        <CardTitle className='text-2xl font-bold'>Top 10 artistas</CardTitle>
        <CardDescription>{period}</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className='grid grid-cols-2 gap-6 sm:grid-cols-5 lg:grid-cols-10'>
          {artists.slice(0, 10).map((artist, index) => (
            <li
              key={artist.id}
              className='flex flex-col items-center gap-2 text-center'
            >
              <div className='relative'>
                <Cover
                  images={artist.images}
                  name={artist.name}
                  size={160}
                  shape='circle'
                  className='size-24'
                  fallbackClassName='text-3xl'
                />
                <Badge
                  variant={index < 3 ? 'default' : 'secondary'}
                  className='absolute right-0 bottom-0 size-6 rounded-full p-0 ring-2 ring-card'
                >
                  {index + 1}
                </Badge>
              </div>
              <div className='w-full min-w-0'>
                <p className='truncate text-sm font-semibold'>{artist.name}</p>
                {artist.genres?.[0] && (
                  <p className='truncate text-xs text-muted-foreground'>
                    {artist.genres[0]}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

const RECENT_COUNT = 7

export function RecentlyPlayedCard({ recent }: { recent: PlayHistory[] }) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          Escuchado recientemente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className='relative flex flex-col gap-4 border-l border-border pl-5'>
          {recent.slice(0, RECENT_COUNT).map((play, index) => (
            <li key={play.played_at} className='relative flex gap-3'>
              <span
                className={cn(
                  'absolute top-1.5 -left-[25px] size-2.5 rounded-full ring-4 ring-card',
                  index === 0 ? 'bg-primary' : 'bg-muted-foreground'
                )}
              />
              <div className='min-w-0 flex-1'>
                <p className='truncate font-semibold'>{play.track.name}</p>
                <p className='truncate text-xs text-muted-foreground'>
                  {play.track.artists.map(a => a.name).join(', ')}
                </p>
              </div>
              <span className='shrink-0 text-xs text-muted-foreground'>
                {relativeTime(play.played_at)}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
