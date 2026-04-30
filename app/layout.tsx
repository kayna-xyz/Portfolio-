import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, IBM_Plex_Serif } from 'next/font/google'
import localFont from 'next/font/local'
import ClientProviders from '@/components/client-providers'

import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
})

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-ibm-plex-serif',
})

const intrudingCat = localFont({
  src: '../public/fonts/IntrudingCat.ttf',
  variable: '--font-intruding-cat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kayna',
  description: 'Kayna Huang - Product Designer',
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="relative">
      <body className={`${jetbrainsMono.variable} ${intrudingCat.variable} ${ibmPlexSerif.variable} font-sans antialiased relative`}>
        <ClientProviders />
        {children}
      </body>
    </html>
  )
}
