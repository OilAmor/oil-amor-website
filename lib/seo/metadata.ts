/**
 * SEO Metadata Configuration
 * Default metadata and helpers for page metadata
 */

import { Metadata } from 'next'
import { OpenGraph } from '@/lib/types/index'

// ============================================================================
// DEFAULT METADATA
// ============================================================================

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://oilamor.com'),
  title: {
    default: 'Oil Amor — Essence Transcended',
    template: '%s | Oil Amor',
  },
  description: 'Essential oils that culminate in crystal jewelry. A journey from bottle to keepsake. Premium Miron Violetglass with ethically-sourced crystals.',
  keywords: [
    'essential oils',
    'crystal jewelry',
    'aromatherapy',
    'Miron Violetglass',
    'sustainable wellness',
    'crystal infused oils',
    'luxury wellness',
    'Australian made',
  ],
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
    locale: 'en_AU',
    url: 'https://oilamor.com',
    siteName: 'Oil Amor',
    title: 'Oil Amor — Essence Transcended',
    description: 'Essential oils that culminate in crystal jewelry.',
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  category: 'luxury wellness',
}

// ============================================================================
// METADATA HELPERS
// ============================================================================

interface PageMetadataOptions {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article' | 'product'
  noIndex?: boolean
  keywords?: string[]
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const url = options.path ? `https://oilamor.com${options.path}` : 'https://oilamor.com'
  
  return {
    title: options.title,
    description: options.description,
    ...(options.noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    ...(options.keywords && {
      keywords: [...defaultMetadata.keywords!, ...options.keywords],
    }),
    openGraph: {
      type: (options.type || 'website') as 'website' | 'article',
      locale: 'en_AU',
      url,
      siteName: 'Oil Amor',
      title: options.title,
      description: options.description,
      images: [
        {
          url: options.image || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: options.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      images: [options.image || '/og-image.jpg'],
    },
    alternates: {
      canonical: url,
    },
  }
}

// ============================================================================
// PAGE-SPECIFIC METADATA
// ============================================================================

export const pageMetadata = {
  home: generatePageMetadata({
    title: 'Oil Amor — Essence Transcended',
    description: 'Essential oils that culminate in crystal jewelry. A journey from bottle to keepsake.',
    path: '/',
  }),
  
  oils: generatePageMetadata({
    title: 'The Collection | Oil Amor',
    description: 'Explore our collection of 50+ essential oils, each paired with complementary crystals.',
    path: '/oils',
  }),
  
  philosophy: generatePageMetadata({
    title: 'Our Philosophy | Oil Amor',
    description: 'We do not sell oils. We craft vessels of transformation that become keepsakes of your journey.',
    path: '/philosophy',
  }),
  
  contact: generatePageMetadata({
    title: 'Contact Us | Oil Amor',
    description: 'Get in touch with Oil Amor. Visit our Central Coast atelier or reach out online.',
    path: '/contact',
  }),
  
  shipping: generatePageMetadata({
    title: 'Shipping Information | Oil Amor',
    description: 'Free shipping on orders over $150. Learn about delivery options and times.',
    path: '/shipping',
  }),
  
  returns: generatePageMetadata({
    title: 'Returns & Refunds | Oil Amor',
    description: '30-day satisfaction guarantee. Learn about our return policy and process.',
    path: '/returns',
  }),
  
  faq: generatePageMetadata({
    title: 'FAQ | Oil Amor',
    description: 'Find answers to frequently asked questions about Oil Amor products and services.',
    path: '/faq',
  }),
}

// ============================================================================
// PRODUCT METADATA
// ============================================================================

export function generateProductMetadata(
  productName: string,
  description: string,
  slug: string,
  image?: string
): Metadata {
  return generatePageMetadata({
    title: `${productName} | Oil Amor`,
    description,
    path: `/oil/${slug}`,
    image,
    type: 'product',
    keywords: [productName, 'essential oil', 'crystal', productName.toLowerCase()],
  })
}
