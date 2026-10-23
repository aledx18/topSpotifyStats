/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    // Keep visited dashboard ranges in the client cache instead of
    // re-rendering them (and calling Spotify) on every tab switch.
    staleTimes: {
      dynamic: 180
    }
  }
}

module.exports = nextConfig
