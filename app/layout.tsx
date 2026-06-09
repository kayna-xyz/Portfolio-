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

export const metadata: Metadata = {
  title: 'Kayna Huang',
  description: 'Kayna Huang — Product Designer who builds.',
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
