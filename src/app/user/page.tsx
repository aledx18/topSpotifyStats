/* eslint-disable multiline-ternary */
/* eslint-disable @next/next/no-img-element */
import { getAccesToken } from '@/components/accessToken'
import { ArtistsI, UserProfile } from '@/app/interface'

import Artists from '@/components/artists'
import Genres from '@/components/genres'
import Tracks from '@/components/tracks'
import RenderProfile from '@/components/renderProfile'
import RecentlyTracks from '@/components/recentlyTracks'
import TopGenres from '@/components/topGenres'
import { TracksI } from '../interfaceTracks'
import { RecentlyTracksI } from '../interfaceRecently'
import ErrorFetch from '@/components/error/errorFetch'

export default async function Home({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const code = typeof searchParams.code === 'string' ? searchParams.code : ''

  const result = await getAccesToken(code)
  if (result?.error) {
    return <ErrorFetch />
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
  } = result?.data!

  return (
    <main>
      <div className='lg:h-screen p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 lg:grid-rows-8 gap-2 group [&>*]:min-h-[6rem] [&>*]:rounded-lg [&>*]:shadow-lg [&>*]:transition [&>*]:duration-300'>
        <div className='bg-[#121212] font-medium flex flex-col gap-4 px-2 lg:col-span-2 lg:row-span-5'>
          <div className='rounded-t-lg py-1'>
            <h2 className='font-bold text-2xl'>
              Recent <span className='text-primary'>streams</span>{' '}
            </h2>
            <p className='font-medium text-[#a3a3a3]'>Recently played tracks</p>
          </div>
          <RecentlyTracks recentlyTracks={recentlyTracks} />
        </div>

        <div
          className='font-light flex flex-col gap-2 lg:col-span-4 lg:row-span-5'
          style={{
            backgroundImage:
              'linear-gradient(to right, #1e1e1e, #1b1b1b, #181818, #151515, #121212)'
          }}>
          <div className='rounded-t-lg px-2 py-1'>
            <h2 className='font-bold text-2xl'>
              Top <span className='text-primary'>Tracks</span>
            </h2>
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

        <div className='text-xl lg:col-span-2 lg:row-span-7 bg-[#121212] p-2'>
          <h2 className='font-bold text-2xl px-2 py-1'>
            {' '}
            Top <span className='text-primary'>genres</span>
          </h2>
          <Genres topArtists={topArtists} />
        </div>
        <div className='text-xl lg:col-span-2 lg:row-span-4 grid bg-[#121212] p-2'>
          <TopGenres topArtists={topArtists} />
        </div>
        <div className='bg-[#121212] text-xl grid lg:col-span-8'>
          <RenderProfile profile={profile} />
        </div>
      </div>
    </main>
  )
}
// 7 row 2 col
// 7 row 4 col
// 5 row 2 col
// 2 row 2 col
// 8 row 8 col

// #242424
// #181818

// <TopGenres topArtists={topArtists} />

// 7 row 2 col
// 7 row 4 col
// 5 row 2 col
// 2 row 2 col
// 8 row 8 col

/* {
  /* <div className='lg:col-span-2 bg-[#121212] font-medium flex flex-col gap-4 px-2'>
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

        <div className='lg:col-span-2 bg-[#121212] p-2'>
          <Genres topArtists={topArtists} />
        </div>
        <div className='bg-[#121212] p-2 row-span-2' />

        <div className='lg:col-span-8 grid bg-[#121212]'>
          <RenderProfile profile={profile} />
        </div> */
