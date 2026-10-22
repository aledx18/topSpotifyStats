import { cookies } from 'next/headers'
import { Dashboard } from '@/components/dashboard/dashboard'
import { SessionError } from '@/components/dashboard/session-error'
import { getDashboardData, SpotifyAuthError } from '@/lib/spotify/api'
import { ACCESS_COOKIE } from '@/lib/spotify/auth'
import { parseTimeRange } from '@/lib/spotify/ranges'

export default async function UserPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { range: rangeParam, error } = await searchParams
  const range = parseTimeRange(rangeParam)
  const token = (await cookies()).get(ACCESS_COOKIE)?.value

  if (error || !token) return <SessionError reason='login' />

  try {
    const data = await getDashboardData(token, range)
    return <Dashboard data={data} range={range} />
  } catch (err) {
    console.error('Failed to load the dashboard:', err)
    return (
      <SessionError
        reason={err instanceof SpotifyAuthError ? 'expired' : 'failed'}
      />
    )
  }
}
