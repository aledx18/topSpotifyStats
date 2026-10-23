import { LogIn } from 'lucide-react'
import { spotifyLoginUrl } from '@/components/const'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export function SessionError({
  reason
}: {
  reason: 'login' | 'expired' | 'failed'
}) {
  const description = {
    login: 'Conectá tu cuenta de Spotify para ver tus estadísticas.',
    expired: 'Tu sesión de Spotify expiró. Volvé a iniciar sesión.',
    failed:
      'No pudimos obtener tus datos de Spotify. Probá de nuevo en un rato.'
  }[reason]

  return (
    <main className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-sm text-center'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>
            Top Spotify Stats
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size='lg' className='w-full'>
            <a href={spotifyLoginUrl}>
              <LogIn />
              Iniciar sesión con Spotify
            </a>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
