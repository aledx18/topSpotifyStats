import { ArtistsI } from '@/app/interface'

type GenreCounts = {
  [genre: string]: number
}

export function GenreCount(topArtists: ArtistsI) {
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
  return uniqueSortedGenres
}
