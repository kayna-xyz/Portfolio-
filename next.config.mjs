/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      { source: '/experience', destination: '/kynotes', permanent: true },
      { source: '/blog', destination: '/kynotes', permanent: true },
      { source: '/kaynote', destination: '/kynotes', permanent: true },
      { source: '/kaynotes', destination: '/kynotes', permanent: true },
      { source: '/portfolio-review', destination: '/', permanent: false },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
