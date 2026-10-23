'use client'

import { ChartNoAxesColumn, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useOptimistic, useState, useTransition } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TIME_RANGE_LABELS, TIME_RANGES } from '@/lib/spotify/ranges'
import type { SpotifyImage, TimeRange } from '@/lib/spotify/types'
import { Cover } from './cover'

// Next only exposes the prefetch kind enum from an internal path; its
// runtime value for a full prefetch is the string 'full'.
type PrefetchOptions = Parameters<ReturnType<typeof useRouter>['prefetch']>[1]
const FULL_PREFETCH = { kind: 'full' } as PrefetchOptions

function greetingFor(hour: number) {
  if (hour >= 6 && hour < 12) return 'Buenos días'
  if (hour >= 12 && hour < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

interface DashboardHeaderProps {
  name: string
  images: SpotifyImage[]
  range: TimeRange
}

export function DashboardHeader({ name, images, range }: DashboardHeaderProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  // Select the clicked tab right away instead of waiting for the server.
  const [selected, setSelected] = useOptimistic(range)
  // Greeting and date depend on the viewer's clock, so they render after mount.
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => setNow(new Date()), [])

  // Each range is a fresh server render that waits on Spotify, so warm the
  // other ranges in the background once the browser is idle.
  useEffect(() => {
    const prefetch = () => {
      for (const value of TIME_RANGES) {
        if (value !== range) {
          router.prefetch(`/user?range=${value}`, FULL_PREFETCH)
        }
      }
    }
    if (typeof requestIdleCallback === 'undefined') {
      const timeout = setTimeout(prefetch, 1000)
      return () => clearTimeout(timeout)
    }
    const id = requestIdleCallback(prefetch)
    return () => cancelIdleCallback(id)
  }, [range, router])

  const firstName = name.split(' ')[0]

  return (
    <header className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex items-start gap-3'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
          <ChartNoAxesColumn className='size-5' />
        </div>
        <div>
          <h1 className='text-2xl font-bold'>
            {now ? greetingFor(now.getHours()) : 'Hola'},{' '}
            <span className='text-primary'>{firstName}</span>
          </h1>
          <p className='text-sm text-muted-foreground'>
            Esto es lo que más sonó en tus auriculares
            {now &&
              ` · actualizado el ${now.toLocaleDateString('es', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}`}
          </p>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <Tabs
          value={selected}
          onValueChange={value =>
            startTransition(() => {
              setSelected(value as TimeRange)
              router.push(`/user?range=${value}`)
            })
          }
        >
          <TabsList
            aria-busy={isPending}
            className='h-10 rounded-full bg-card ring-1 ring-foreground/10'
          >
            {TIME_RANGES.map(value => (
              <TabsTrigger
                key={value}
                value={value}
                className='rounded-full px-4 data-active:bg-primary! data-active:text-primary-foreground!'
              >
                {isPending && value === selected && (
                  <LoaderCircle aria-hidden className='animate-spin' />
                )}
                {TIME_RANGE_LABELS[value]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className='flex items-center gap-2 rounded-full bg-card p-1 ring-1 sm:pl-3 ring-foreground/10'>
          <span className='hidden max-w-28 truncate text-sm font-medium sm:inline'>
            {name}
          </span>
          <Cover
            images={images}
            name={name}
            size={64}
            shape='circle'
            className='size-8'
          />
        </div>
      </div>
    </header>
  )
}
