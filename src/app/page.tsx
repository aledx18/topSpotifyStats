/* eslint-disable multiline-ternary */
/* eslint-disable @next/next/no-img-element */
import { getAccesToken } from '@/components/accessToken'
import { ArtistsI } from './interface'
import { publicClient, publicUrl } from '@/components/const'

import Artists from '@/components/artists'
import Genres from '@/components/genres'

import { ModeToggle } from '@/components/toggle'
import Tracks from '@/components/tracks'
import { TracksI } from './interfaceTracks'

export default async function Home({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const code = typeof searchParams.code === 'string' ? searchParams.code : ''

  const result = await getAccesToken(code)
  if (!result) {
    return (
      <div className='h-screen flex items-center justify-center bg-[#121212]'>
        <a
          className='bg-[#1ed760] rounded-3xl text-black px-8 py-2'
          href={`https://accounts.spotify.com/authorize?client_id=${publicClient}&response_type=code&redirect_uri=${publicUrl}&scope=user-top-read%20user-read-recently-played`}>
          Iniciar Session
        </a>
      </div>
    )
  }

  const {
    topTracks,
    topArtists
  }: {
    topTracks: TracksI
    topArtists: ArtistsI
  } = result

  return (
    <main>
      <div className='p-4 grid grid-cols-1 grid-rows-2 lg:grid-cols-5 lg:grid-rows-5 gap-3 group [&>*]:min-h-[5rem] [&>*]:rounded-lg [&>*]:shadow-lg [&>*]:transition [&>*]:duration-300'>
        <div className='row-span-4 bg-[#121212] font-medium flex flex-col gap-4 px-2'>
          <div className='rounded-t-lg py-2'>
            <h2 className='font-bold text-xl'>Recent streams</h2>
            <p className='font-medium text-[#a3a3a3]'>Recently played tracks</p>
          </div>
          {/* <RecentlyTracks recentlyTracks={recentlyTracks} /> */}
        </div>
        <div
          className='col-span-3 row-span-4 font-light flex flex-col gap-2'
          style={{
            backgroundImage:
              'linear-gradient(to right, #1e1e1e, #1b1b1b, #181818, #151515, #121212)'
          }}>
          <div className='rounded-t-lg px-2 py-1 bg-[#242424]'>
            <h2 className='font-bold text-xl'>Top Tracks</h2>
            <p className='font-medium text-[#a3a3a3]'>
              Top tracks from the past 6 months
            </p>
          </div>

          <Tracks topTracks={topTracks} />

          <div className='rounded-t-lg px-2 py-1'>
            <h2 className='font-bold text-xl'>Top Artists</h2>
            <p className='font-medium text-[#a3a3a3]'>
              top artists from the past 6 months
            </p>
          </div>
          <Artists topArtists={topArtists} />
        </div>
        <div className='bg-[#121212]'>
          {/* <RenderProfile profile={profile} /> */}
          <ModeToggle />
        </div>

        <div className='row-span-3 bg-[#121212] p-2 flex flex-col gap-4'>
          <h2 className='font-bold text-xl'> Top genres</h2>
          <Genres topArtists={topArtists} />
        </div>

        <div className='col-span-5 bg-[#121212]'>d</div>
      </div>
    </main>
  )
}
// #242424
// #181818
