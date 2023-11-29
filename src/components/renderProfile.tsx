import { UserProfile } from '../app/interface'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface profileProps {
  profile: UserProfile
}

export default function RenderProfile({ profile }: profileProps) {
  const imageUrl =
    profile.images.length > 0
      ? profile.images[0].url
      : (profile.images[0] || '').url

  return (
    <div className='flex justify-between items-center p-2 font-bold'>
      <h1 className='text-2xl'>Good Morning</h1>
      <div className='flex items-center gap-3'>
        <h2>{profile.display_name}</h2>
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>UE</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
