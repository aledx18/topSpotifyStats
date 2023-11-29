import { publicClient, publicUrl, scopes } from '@/components/const'

export default function Skeleton() {
  return (
    <>
      <a
        className='bg-green-500'
        href={`https://accounts.spotify.com/authorize?client_id=${publicClient}&response_type=code&redirect_uri=${publicUrl}&scope=${scopes}`}>
        Iniciar
      </a>
    </>
  )
}
