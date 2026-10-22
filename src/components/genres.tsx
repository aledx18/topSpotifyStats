import type { ArtistsI } from '@/app/interface'
import { Badge } from '@/components/ui/badge'
import { GenreCount } from './genreCounts'

interface ArtistsProps {
  topArtists: ArtistsI
}

export default function Genres({ topArtists }: ArtistsProps) {
  const genres = GenreCount(topArtists)

  return (
    <div className='grid grid-cols-2 gap-2'>
      {genres.map(res => (
        <Badge variant='personal' key={res}>
          {res}
        </Badge>
      ))}
    </div>
  )
}
