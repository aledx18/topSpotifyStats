import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className='mx-auto flex max-w-7xl flex-col gap-5 p-4 md:p-8'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-12 w-72' />
        <Skeleton className='h-10 w-80 rounded-full' />
      </div>
      <div className='grid gap-5 lg:grid-cols-12'>
        <Skeleton className='h-80 lg:col-span-7' />
        <div className='grid grid-cols-2 gap-5 lg:col-span-5'>
          <Skeleton className='h-28' />
          <Skeleton className='h-28' />
          <Skeleton className='h-28' />
          <Skeleton className='h-28' />
          <Skeleton className='col-span-2 h-20' />
        </div>
      </div>
      <div className='grid gap-5 lg:grid-cols-12'>
        <Skeleton className='h-96 lg:col-span-8' />
        <Skeleton className='h-96 lg:col-span-4' />
      </div>
      <Skeleton className='h-56' />
    </main>
  )
}
