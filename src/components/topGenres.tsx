import { ArtistsI } from '@/app/interface'
import { GenreCount } from './genreCounts'

interface ArtistsProps {
  topArtists: ArtistsI
}

export default function TopGenres({ topArtists }: ArtistsProps) {
  const genresTop = GenreCount(topArtists)

  return (
    <div className='flex flex-col gap-1 justify-center'>
      {genresTop.slice(0, 5).map((res, i) => (
        <div className='grid grid-cols-2 lg:mx-12 rounded-xl' key={i}>
          <h2 className='text-4xl'>
            <span className='text-primary'>{i + 1}.</span>{' '}
            <span className='text-xl'>
              {res.charAt(0).toUpperCase() + res.slice(1)}{' '}
            </span>
          </h2>
        </div>
      ))}
    </div>
  )
}
