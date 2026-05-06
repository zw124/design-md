import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Fraunces, DM_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DESIGN.MD - Design System Generator',
  description:
    'Paste a URL — get a production-ready DESIGN.md with tokens, typography, spacing, and component patterns. Everything your team needs, in seconds.',
  generator: 'v0.app',
  keywords: ['design system', 'design tokens', 'DESIGN.md', 'CSS variables', 'Tailwind', 'design documentation'],
  openGraph: {
    title: 'DESIGN.MD - Design System Generator',
    description: 'Turn any site into a production-ready design system document.',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#0A0A08',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${fraunces.variable} ${dmMono.variable} bg-background`}>
        <body className="font-sans antialiased">
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </body>
      </html>
    </ClerkProvider>
  )
}
