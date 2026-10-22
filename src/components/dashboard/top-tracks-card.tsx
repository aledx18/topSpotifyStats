'use client'

import { cn } from 'cn'
import { Minus, Triangle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import type { Track } from '@/lib/spotify/types'
import type { RankChange } from '@/lib/stats'
import { Cover } from './cover'

const COLLAPSED_COUNT = 8

function ChangeIndicator({ change }: { change: RankChange | undefined }) {
  if (change === undefined) return null
  if (change === 'new') {
    return <span className='text-xs text-muted-foreground'>Nuevo</span>
  }
  if (change === 0) {
    return (
      <span className='text-muted-foreground'>
        <Minus aria-hidden className='size-3' />
        <span className='sr-only'>Sin cambios</span>
      </span>
    )
  }

  const up = change > 0
  return (
    <span className='flex items-center gap-1 text-xs text-muted-foreground'>
      <span className='sr-only'>{up ? 'Subió' : 'Bajó'}</span>
      <Triangle
        aria-hidden
        className={cn('size-2.5 fill-current', !up && 'rotate-180')}
      />
      {Math.abs(change)}
    </span>
  )
}

interface TopTracksCardProps {
  tracks: Track[]
  changes: Record<string, RankChange>
}

export function TopTracksCard({ tracks, changes }: TopTracksCardProps) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? tracks : tracks.slice(0, COLLAPSED_COUNT)

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Top canciones</CardTitle>
        {tracks.length > COLLAPSED_COUNT && (
          <CardAction>
            <Button
              variant='link'
              size='sm'
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Ver menos' : `Ver las ${tracks.length}`}
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <ol className='grid gap-x-8 md:grid-cols-2'>
          {visible.map((track, index) => (
            <li
              key={track.id}
              className='flex items-center gap-4 border-b border-border py-3'
            >
              <span
                className={cn(
                  'w-6 text-center text-xl font-bold',
                  index < 3 ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {index + 1}
              </span>
              <Cover
                images={track.album.images}
                name={track.name}
                size={96}
                className='size-11'
              />
              <div className='min-w-0 flex-1'>
                <p className='truncate font-semibold'>{track.name}</p>
                <p className='truncate text-xs text-muted-foreground'>
                  {track.artists.map(a => a.name).join(', ')}
                </p>
              </div>
              <ChangeIndicator change={changes[track.id]} />
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
