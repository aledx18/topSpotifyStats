import { Badge } from '@/components/ui/badge'
import { ArtistsI } from '@/app/interface'

interface ArtistsProps {
  topArtists: ArtistsI
}

type GenreCounts = {
  [genre: string]: number
}

export default function Genres({ topArtists }: ArtistsProps) {
  // Obtener un array plano de todos los géneros
  const allGenres = topArtists.items.flatMap((res) => res.genres)

  const genreCounts: GenreCounts = allGenres.reduce((counts, genre) => {
    counts[genre] = (counts[genre] || 0) + 1
    return counts
  }, {} as GenreCounts)

  // Ordenar los géneros por frecuencia de mayor a menor
  const sortedGenres = Object.keys(genreCounts).sort(
    (a, b) => genreCounts[b] - genreCounts[a]
  )

  // Eliminar géneros duplicados y obtener el array final
  const uniqueSortedGenres = Array.from(new Set(sortedGenres))

  return (
    <div className='grid grid-cols-2 gap-2'>
      {uniqueSortedGenres.map((res, i) => (
        <Badge variant='secondary' key={i}>
          {res}
        </Badge>
      ))}
    </div>
  )
}
