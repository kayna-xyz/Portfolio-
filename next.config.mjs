/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        // Belt and braces with the metadata.robots noindex: also covers
        // non-HTML assets (PDFs, images) that carry no meta tag.
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noimageindex' }],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/portfolio', destination: '/', permanent: true },
      { source: '/experience', destination: '/about', permanent: true },
      { source: '/blog', destination: '/about', permanent: true },
      { source: '/kaynote', destination: '/about', permanent: true },
      { source: '/kaynotes', destination: '/about', permanent: true },
      { source: '/kynotes', destination: '/about', permanent: true },
      { source: '/portfolio-review', destination: '/about', permanent: false },
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
