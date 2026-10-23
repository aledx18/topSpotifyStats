import type { TimeRange } from './types'

export const TIME_RANGES: TimeRange[] = [
  'short_term',
  'medium_term',
  'long_term'
]

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  short_term: '4 semanas',
  medium_term: '6 meses',
  long_term: 'Siempre'
}

export const TIME_RANGE_PERIODS: Record<TimeRange, string> = {
  short_term: 'Últimas 4 semanas',
  medium_term: 'Últimos 6 meses',
  long_term: 'Desde siempre'
}

// Rank changes compare against the next longer period; "always" has none.
export const PREVIOUS_RANGE: Record<TimeRange, TimeRange | null> = {
  short_term: 'medium_term',
  medium_term: 'long_term',
  long_term: null
}

export function parseTimeRange(value: unknown): TimeRange {
  return TIME_RANGES.find(range => range === value) ?? 'medium_term'
}
