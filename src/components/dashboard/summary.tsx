import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { TimeRange } from '@/lib/spotify/types'

// Replaces the "mainstream index": Spotify removed `popularity` in February 2026.
export function ExplicitCard({ percent }: { percent: number }) {
  return (
    <Card className='shrink-0'>
      <CardHeader>
        <CardTitle className='text-xl font-bold'>Contenido explícito</CardTitle>
        <CardDescription>De tus top canciones</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <p className='text-5xl font-black text-primary'>{percent}%</p>
        <Progress
          value={percent}
          aria-label={`${percent}% explícito`}
          className='h-2'
        />
        <div className='flex justify-between text-xs text-muted-foreground'>
          <span>Limpio</span>
          <span>Explícito</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function ShareBanner({ range }: { range: TimeRange }) {
  return (
    <Card className='bg-primary text-primary-foreground ring-0'>
      <CardContent className='flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-3xl font-black'>
            Tu resumen, listo para compartir
          </h2>
          <p className='text-sm'>
            Genera una tarjeta con tu top 5 de artistas, canciones y géneros
            para Instagram.
          </p>
        </div>
        <Button
          asChild
          size='lg'
          className='h-12 rounded-full bg-background px-6 text-foreground hover:bg-background/80'
        >
          <a href={`/api/card?range=${range}`} download='mi-top-spotify.png'>
            <Download />
            Crear mi tarjeta
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
