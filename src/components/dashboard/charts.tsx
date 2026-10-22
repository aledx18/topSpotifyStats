'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, Cell, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import type { PlayHistory } from '@/lib/spotify/types'
import { type DecadeBucket, hourHistogram, partOfDay } from '@/lib/stats'

const HIGHLIGHT = 'var(--color-primary)'
const MUTED = 'var(--color-muted)'

const decadeConfig = {
  count: { label: 'Canciones', color: HIGHLIGHT }
} satisfies ChartConfig

interface DecadesCardProps {
  buckets: DecadeBucket[]
  favorite: string | null
}

export function DecadesCard({ buckets, favorite }: DecadesCardProps) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          ¿De qué época es tu música?
        </CardTitle>
        <CardDescription>
          Según el año de lanzamiento de tus top canciones
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col gap-4'>
        <ChartContainer
          config={decadeConfig}
          className='aspect-auto h-56 w-full'
        >
          <BarChart data={buckets} margin={{ left: 0, right: 0 }}>
            <XAxis dataKey='decade' tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='count' radius={6}>
              {buckets.map(bucket => (
                <Cell
                  key={bucket.decade}
                  fill={bucket.decade === favorite ? HIGHLIGHT : MUTED}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        {favorite && (
          <p className='mt-auto rounded-lg bg-primary/10 px-3 py-2 text-sm'>
            Tu década favorita:{' '}
            <span className='font-semibold text-primary'>los {favorite}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

const hoursConfig = {
  plays: { label: 'Escuchas', color: HIGHLIGHT }
} satisfies ChartConfig

const PEAK_HOURS = 3

export function ListeningHoursCard({ recent }: { recent: PlayHistory[] }) {
  // Hours must use the viewer's time zone, which only the browser knows.
  const [hours, setHours] = useState<number[] | null>(null)
  useEffect(() => setHours(hourHistogram(recent)), [recent])

  const data = hours?.map((plays, hour) => ({ hour: `${hour} h`, plays }))
  const peaks = new Set(
    (hours ?? [])
      .map((plays, hour) => ({ plays, hour }))
      .filter(entry => entry.plays > 0)
      .sort((a, b) => b.plays - a.plays)
      .slice(0, PEAK_HOURS)
      .map(entry => entry.hour)
  )
  const part = hours ? partOfDay(hours) : null

  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle className='text-xl font-bold'>¿Cuándo escuchás?</CardTitle>
        <CardDescription>
          Según tus últimas {recent.length} escuchas
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        {data ? (
          <ChartContainer
            config={hoursConfig}
            className='aspect-auto h-32 w-full'
          >
            <BarChart data={data} margin={{ left: 0, right: 0 }}>
              <XAxis
                dataKey='hour'
                tickLine={false}
                axisLine={false}
                ticks={['0 h', '12 h', '23 h']}
                interval='preserveStartEnd'
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey='plays' radius={3}>
                {data.map((entry, hour) => (
                  <Cell
                    key={entry.hour}
                    fill={peaks.has(hour) ? HIGHLIGHT : MUTED}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <Skeleton className='h-32 w-full' />
        )}
        {part && (
          <p className='text-sm'>
            Sos más de la{' '}
            <span className='font-semibold text-primary'>{part}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
