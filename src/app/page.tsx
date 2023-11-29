/* eslint-disable multiline-ternary */
/* eslint-disable @next/next/no-img-element */
import { getAccesToken } from '@/components/accessToken'
import { ArtistsI, UserProfile } from './interface'
import { publicClient, publicUrl, scopes } from '@/components/const'

import Artists from '@/components/artists'
import Genres from '@/components/genres'

import Tracks from '@/components/tracks'
import { TracksI } from './interfaceTracks'
import RenderProfile from '@/components/renderProfile'
import { RecentlyTracksI } from './interfaceRecently'
import RecentlyTracks from '@/components/recentlyTracks'

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
          href={`https://accounts.spotify.com/authorize?client_id=${publicClient}&response_type=code&redirect_uri=${publicUrl}&scope=${scopes}`}>
          Iniciar Session
        </a>
      </div>
    )
  }

  const {
    profile,
    recentlyTracks,
    topTracks,
    topArtists
  }: {
    profile: UserProfile
    topTracks: TracksI
    topArtists: ArtistsI
    recentlyTracks: RecentlyTracksI
  } = result

  return (
    <main>
      <div className='p-2 grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-1 lg:grid-cols-8 lg:grid-rows-1 gap-2 group [&>*]:min-h-[6rem] [&>*]:rounded-lg [&>*]:shadow-lg [&>*]:transition [&>*]:duration-300'>
        <div className='lg:col-span-2 bg-[#121212] font-medium flex flex-col gap-4 px-2'>
          <div className='rounded-t-lg py-2'>
            <h2 className='font-bold text-xl'>Recent streams</h2>
            <p className='font-medium text-[#a3a3a3]'>Recently played tracks</p>
          </div>
          <RecentlyTracks recentlyTracks={recentlyTracks} />
        </div>

        <div
          className='lg:col-span-4 font-light flex flex-col gap-2'
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

        <div className='lg:col-span-2 bg-[#121212] p-2 flex flex-col gap-4'>
          <h2 className='font-bold text-xl'> Top genres</h2>
          <Genres topArtists={topArtists} />
        </div>
        <div className='lg:col-span-8 grid bg-[#121212]'>
          <RenderProfile profile={profile} />
        </div>
      </div>
    </main>
  )
}
// #242424
// #181818
