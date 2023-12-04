import { Badge } from '@/components/ui/badge'
import { ArtistsI } from '@/app/interface'
import { GenreCount } from './genreCounts'

interface ArtistsProps {
  topArtists: ArtistsI
}

export default function Genres({ topArtists }: ArtistsProps) {
  const genres = GenreCount(topArtists)

  return (
    <div className='grid grid-cols-2 gap-2'>
      {genres.map((res, i) => (
        <Badge variant='personal' key={i}>
          {res}
        </Badge>
      ))}
    </div>
  )
}
