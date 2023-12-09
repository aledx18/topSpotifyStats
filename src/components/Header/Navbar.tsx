import { publicClient, publicUrl, scopes } from '@/components/const'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
export default function Navbar() {
  return (
    <header>
      <div className='container mx-auto flex p-5 flex-row justify-between md:flex-row md:justify-between items-center'>
        <a className='flex title-font font-medium items-center text-white md:mb-0'>
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
          <span className='ml-2 text-md lg:text-xl'>TopSpotify</span>
        </a>
        <Button asChild variant='personal' size='pers'>
          <a
            href={`https://accounts.spotify.com/authorize?client_id=${publicClient}&response_type=code&redirect_uri=${publicUrl}&scope=${scopes}`}>
            <LogIn className='mr-2' />
            Log In
          </a>
        </Button>
      </div>
    </header>
  )
}
