/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      { source: '/experience', destination: '/', permanent: true },
      { source: '/blog', destination: '/', permanent: true },
      { source: '/kaynote', destination: '/', permanent: true },
      { source: '/kaynotes', destination: '/', permanent: true },
      { source: '/kynotes', destination: '/', permanent: true },
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
