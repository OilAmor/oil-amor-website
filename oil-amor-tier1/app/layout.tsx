import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Navigation } from './components/navigation'
import { Footer } from './components/layout/Footer'
// Cart is now handled by Zustand store in hooks/use-cart.tsx - no provider needed
import { UserProvider } from '@/lib/context/user-context'
import { HealthProfileProvider } from '@/lib/context/health-profile-context'
import { RecipeProvider } from '@/lib/context/recipe-context'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f3ef' },
    { media: '(prefers-color-scheme: dark)', color: '#0a080c' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://oilamor.com'),
  title: {
    default: 'Oil Amor — Essence Transcended',
    template: '%s | Oil Amor',
  },
  description: 'Essential oils that culminate in crystal jewelry. A journey from bottle to keepsake.',
  keywords: ['essential oils', 'crystal jewelry', 'aromatherapy', 'sustainable', 'luxury wellness'],
  authors: [{ name: 'Oil Amor' }],
  creator: 'Oil Amor',
  publisher: 'Oil Amor',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://oilamor.com',
    siteName: 'Oil Amor',
    title: 'Oil Amor — Essence Transcended',
    description: 'Essential oils that culminate in crystal jewelry. A journey from bottle to keepsake.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Oil Amor — Essence Transcended',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oil Amor — Essence Transcended',
    description: 'Essential oils that culminate in crystal jewelry.',
    images: ['/og-image.jpg'],
    creator: '@oilamor',
  },
  alternates: {
    canonical: 'https://oilamor.com',
  },
  category: 'luxury wellness',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className="font-body bg-[#0a080c] text-[#f5f3ef] antialiased">
        {/* Skip Link for Accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Grain Overlay */}
        <div className="grain" />

        <UserProvider>
          <HealthProfileProvider>
            <RecipeProvider>
              <Navigation />
              
              <main id="main-content" className="relative">
                {children}
              </main>

              <Footer />
            </RecipeProvider>
          </HealthProfileProvider>
        </UserProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
