import { Badge } from '@/components/ui/badge'
import { ArtistsI } from '@/app/interface'
import { GenreCount } from './genreCounts'

interface ArtistsProps {
  topArtists: ArtistsI
}

export default function Genres({ topArtists }: ArtistsProps) {
  const genres = GenreCount(topArtists)

  return (
    <div className=''>
      <h2 className='font-bold text-2xl'> Top genres</h2>
      <div className='grid grid-cols-2 gap-2'>
        {genres.map((res, i) => (
          <Badge key={i}>{res}</Badge>
        ))}
      </div>
    </div>
  )
}
