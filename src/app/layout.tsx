import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

export const metadata: Metadata = {
  title: 'Top-Stats',
  description: ''
}

const myFont = localFont({
  src: [
    {
      path: '../fonts/CircularSpotifyText-Light.otf',
      weight: '300',
      style: 'light'
    },
    {
      path: '../fonts/CircularSpotifyText-Black.otf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../fonts/CircularSpotifyText-Medium.otf',
      weight: '500',
      style: 'medium'
    },
    {
      path: '../fonts/CircularSpotifyText-Bold.otf',
      weight: '700',
      style: 'bold'
    }
  ]
})

export default function RootLayout({
  children
}: {
  // eslint-disable-next-line no-undef
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={myFont.className}>{children}</body>
    </html>
  )
}
