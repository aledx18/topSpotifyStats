import { RecentlyTracksI } from '@/app/interfaceRecently'
import { tiempoTranscurrido } from './timeRecently'

interface RecentlyProps {
  recentlyTracks: RecentlyTracksI
}

export default function RecentlyTracks({ recentlyTracks }: RecentlyProps) {
  const playedAt = recentlyTracks.items.flatMap((res) => res.played_at)
  console.log(playedAt)
  const recently = recentlyTracks.items.flatMap((res) => {
    return {
      time: tiempoTranscurrido(res.played_at.toString()),
      tracks: res.track
    }
  })

  //   const date = fechaFormateada(recentlyTracks.items[0].played_at.toString())

  return (
    <>
      {/* <h3 className='font-medium text-sm text-[#a3a3a3]'>{date} </h3> */}

      <div className='flex flex-col gap-2'>
        {recently.map((i) => (
          <div
            className='bg-[#181818] flex justify-between text-sm rounded-md p-2'
            key={i.tracks.id}>
            <div className='flex flex-col gap-1'>
              <p>{i.tracks.name}</p>
              {/* <p className='text-[#a3a3a3]'>{i.tracks.artists[0].name}</p> */}
            </div>
            <p>{i.time}</p>
          </div>
        ))}
      </div>
    </>
  )
}
