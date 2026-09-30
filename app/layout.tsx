import type { Metadata, Viewport } from 'next'
import { PT_Serif, Reddit_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import ClientProviders from '@/components/client-providers'

import './globals.css'

const ptSerif = PT_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-pt-serif',
})

const redditMono = Reddit_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-reddit-mono',
})

const twkLausanne = localFont({
  src: '../public/fonts/TWKLausanne-400.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-twk',
  display: 'swap',
})

const SITE_URL = 'https://www.kayna.ai'
const SITE_DESCRIPTION =
  'Product designer and design engineer in New York, studying Cognitive Science at Barnard College, Columbia. Work from HeyGen, OpusClip, and personal projects.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Kayna Huang',
    template: '%s · Kayna Huang',
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Kayna Huang',
    title: 'Kayna Huang',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Kayna Huang',
    description: SITE_DESCRIPTION,
    creator: '@kayna_huang',
  },
  // Keep the site out of search engines. Bots must still be allowed to crawl
  // (see app/robots.ts) so they can read this noindex directive.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FDFBFA',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ptSerif.variable} ${redditMono.variable} ${twkLausanne.variable} antialiased`}
        style={{
          background: '#FDFBFA',
          fontFamily: 'var(--font-twk), system-ui, -apple-system, sans-serif',
          color: 'rgba(0,0,0,0.75)',
          margin: 0,
        }}
      >
        <ClientProviders />
        {children}
      </body>
    </html>
  )
}
