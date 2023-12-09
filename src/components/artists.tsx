/* eslint-disable @next/next/no-img-element */
import { ArtistsI } from '@/app/interface'

interface ArtistsProps {
  topArtists: ArtistsI
}

export default function Artists({ topArtists }: ArtistsProps) {
  return (
    <div className='px-2 pb-2 lg:pb-2 grid grid-cols-2 lg:grid-cols-6 lg:grid-rows-2 gap-2 group [&>*]:bg-[#181818] [&>*]:rounded-lg'>
      {topArtists.items.slice(0, 12).map((item) => (
        <div className='font-medium p-4 flex flex-col lg:gap-1' key={item.id}>
          <img
            className='rounded-md shadow-lg'
            src={item.images[1].url}
            alt={item.name}
          />
          <div>
            <p className='lg:text-lg md:text-xs lg:font-bold'>{item.name}</p>
            <p className='md:text-sm lg:text-md'>{item.type}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
