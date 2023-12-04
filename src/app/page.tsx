import Navbar from '@/components/Header/Navbar'
/* eslint-disable @next/next/no-img-element */

export default function Welcome() {
  return (
    <div className='h-screen p-2 bg-[#121212]'>
      <Navbar />
      <section className='py-1 lg:mt-16 md:pt-40'>
        <div className='container mx-auto flex px-5 md:flex-row flex-col items-center'>
          <div className='lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center'>
            <h1 className=' lg:text-8xl md:text-6xl text-3xl mb-4 font-bold'>
              Elevate Your Playlist, Amplify Your{' '}
              <span className='text-[#ea580c]'>Stats.</span>
            </h1>
            <p className='mb-4 leading-relaxed text-xl text-[#a3a3a3]'>
              Connect your Spotify account and get instant insights into your
              top-played songs, favorite artists, and preferred genres.
            </p>
          </div>
          <div className='lg:max-w-lg lg:w-full md:w-1/2 w-5/6'>
            <img
              className='object-cover object-center rounded'
              alt='hero'
              src=''
            />
          </div>
        </div>
      </section>
    </div>
  )
}
