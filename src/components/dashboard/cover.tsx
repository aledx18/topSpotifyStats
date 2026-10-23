import { cn } from 'cn'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { SpotifyImage } from '@/lib/spotify/types'

// Spotify lists images largest first; take the smallest one that still covers `size`.
function pickImage(images: SpotifyImage[], size: number) {
  const fitting = images.filter(image => (image.width ?? 0) >= size)
  return (fitting.at(-1) ?? images[0])?.url
}

interface CoverProps {
  images: SpotifyImage[]
  name: string
  size: number
  shape?: 'square' | 'circle'
  className?: string
  fallbackClassName?: string
}

export function Cover({
  images,
  name,
  size,
  shape = 'square',
  className,
  fallbackClassName
}: CoverProps) {
  const radius = shape === 'square' ? 'rounded-md' : 'rounded-full'

  return (
    <Avatar
      className={cn(
        'size-auto',
        radius,
        shape === 'square' && 'after:rounded-md',
        className
      )}
    >
      <AvatarImage
        src={pickImage(images, size)}
        alt={name}
        className={radius}
      />
      <AvatarFallback
        className={cn(radius, 'font-bold uppercase', fallbackClassName)}
      >
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  )
}
