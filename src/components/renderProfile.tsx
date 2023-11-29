import { UserProfile } from '../app/interface'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface profileProps {
  profile: UserProfile
}

export default function RenderProfile({ profile }: profileProps) {
  return (
    <div className='flex justify-between items-center p-2 font-bold'>
      <h1 className='text-2xl'>Good Morning {profile.display_name}</h1>
      {/* <Avatar>
        <AvatarImage src={profile.images[0].url} />
        <AvatarFallback>UE</AvatarFallback>
      </Avatar> */}
    </div>
  )
}
