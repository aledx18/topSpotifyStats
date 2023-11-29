/* eslint-disable @next/next/no-img-element */
import { TracksI } from '@/app/interfaceTracks'

interface TracksProps {
  topTracks: TracksI
}

export default function Tracks({ topTracks }: TracksProps) {
  return (
    <div className='px-2 grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-4 group [&>*]:bg-[#181818] [&>*]:min-h-[4rem] [&>*]:rounded-lg'>
      {topTracks.items.map((item) => (
        <div key={item.id} className='flex items-center shadow-md'>
          <img
            className='rounded-l-lg p-0.5'
            src={item.album.images[2].url}
            alt='asd'
          />
          <div className='text-md font-medium pl-2'>
            <h1>{item.name}</h1>
            <h2 className='font-light text-sm'>{item.artists[0].name} </h2>
          </div>
        </div>
      ))}
    </div>
  )
}
