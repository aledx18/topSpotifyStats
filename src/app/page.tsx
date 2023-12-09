import Navbar from '@/components/Header/Navbar'
import Footer from '@/components/footer'
/* eslint-disable @next/next/no-img-element */

export default function Welcome() {
  return (
    <div className='h-screen p-2 bg-[#121212] flex flex-col justify-between'>
      <Navbar />
      <section className='py-1'>
        <div className='container mx-auto flex px-5 md:flex-row flex-col items-center'>
          <div className='lg:flex-grow md:w-1/2 lg:pr-10 md:pr-20 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center'>
            <h1 className=' lg:text-8xl md:text-6xl text-3xl mb-4 font-semibold'>
              Elevate Your Playlist, Amplify Your{' '}
              <span className='text-[#ea580c]'>Stats.</span>
            </h1>
            <p className='mb-4 leading-relaxed text-xl text-[#a3a3a3]'>
              Connect your Spotify account and get instant insights into your
              top-played songs, favorite artists, and preferred genres.
            </p>
          </div>
          <div className='lg:max-w-2xl lg:w-full md:w-1/2 w-5/6'>
            <img className='' alt='hero' src='/sl.png' />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
