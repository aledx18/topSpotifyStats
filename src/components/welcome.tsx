import { publicClient, publicUrl, scopes } from '@/components/const'
import { Button } from './ui/button'
import { LogIn } from 'lucide-react'
export default function Welcome() {
  return (
    <div className='h-screen p-2 bg-[#121212]'>
      <header>
        <div className='container mx-auto flex flex-wrap p-5 flex-col md:flex-row md:justify-between items-center'>
          <a className='flex title-font font-medium items-center text-white mb-4 md:mb-0'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='w-10 h-10 text-white p-2 bg-[#ea580c] rounded-full'
              viewBox='0 0 24 24'>
              <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
            </svg>
            <span className='ml-3 text-xl'>TopSpotify</span>
          </a>
          {/* <a
            className='inline-flex items-center bg-[#391a09] text-[#ea580c] border-0 p-3 focus:outline-none hover:bg-[#12251a]/60 rounded-2xl text-base mt-4 md:mt-0'
            href={`https://accounts.spotify.com/authorize?client_id=${publicClient}&response_type=code&redirect_uri=${publicUrl}&scope=${scopes}`}>
            Log In
            <svg
              fill='none'
              stroke='currentColor'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              className='w-4 h-4 ml-1'
              viewBox='0 0 24 24'>
              <path d='M5 12h14M12 5l7 7-7 7' />
            </svg>
          </a> */}
          <Button asChild variant='personal' size='lg'>
            <a
              href={`https://accounts.spotify.com/authorize?client_id=${publicClient}&response_type=code&redirect_uri=${publicUrl}&scope=${scopes}`}>
              <LogIn className='mr-2' />
              Log In
            </a>
          </Button>
        </div>
      </header>

      {/* <h1 classNameName='text-2xl'>Elevate Your Playlist, Amplify Your Stats</h1>
      <a
        classNameName='bg-[#1ed760] rounded-3xl text-black px-8 py-2'
        href={`https://accounts.spotify.com/authorize?client_id=${publicClient}&response_type=code&redirect_uri=${publicUrl}&scope=${scopes}`}>
        Iniciar Session
      </a> */}

      <section className='py-1 lg:py-36'>
        <div className='container mx-auto flex px-5 md:flex-row flex-col items-center'>
          <div className='lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center'>
            <h1 className=' lg:text-8xl md:text-6xl  text-3xl mb-4 font-bold'>
              Elevate Your Playlist, Amplify Your{' '}
              <span className='text-[#ea580c]'>Stats.</span>
            </h1>
            <p className='mb-4 leading-relaxed text-xl text-[#a3a3a3]'>
              Connect your Spotify account and get instant insights into your
              top-played songs, favorite artists, and preferred genres.
            </p>

            <div className='flex lg:flex-row md:flex-col'>
              <Button asChild variant='personal' size='lg'>
                <a
                  href={`https://accounts.spotify.com/authorize?client_id=${publicClient}&response_type=code&redirect_uri=${publicUrl}&scope=${scopes}`}>
                  <LogIn className='mr-2' />
                  Log In
                </a>
              </Button>
            </div>
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
