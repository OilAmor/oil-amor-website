/**
 * JSON-LD Structured Data Schemas
 * Rich snippets for Google Search
 */

import { Oil } from '@/lib/types/product'

export interface SchemaOrgBase {
  '@context': 'https://schema.org'
  '@type': string
}

// Organization Schema
export interface OrganizationSchema extends SchemaOrgBase {
  '@type': 'Organization'
  name: string
  url: string
  logo: {
    '@type': 'ImageObject'
    url: string
    width?: number
    height?: number
  }
  description: string
  sameAs: string[]
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Oil Amor',
    url: 'https://oilamor.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://oilamor.com/logo.png',
      width: 512,
      height: 512,
    },
    description: 'Essential oils that transform into crystal jewelry. Premium Miron Violetglass bottles with ethically-sourced crystal chips.',
    sameAs: [
      'https://instagram.com/oilamor',
      'https://facebook.com/oilamor',
      'https://pinterest.com/oilamor',
    ],
  }
}

// Website Schema
export interface WebsiteSchema extends SchemaOrgBase {
  '@type': 'WebSite'
  name: string
  url: string
  potentialAction: {
    '@type': 'SearchAction'
    target: {
      '@type': 'EntryPoint'
      urlTemplate: string
    }
    'query-input': string
  }
}

export function generateWebsiteSchema(): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Oil Amor',
    url: 'https://oilamor.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://oilamor.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// Product Schema
export interface ProductSchema extends SchemaOrgBase {
  '@type': 'Product'
  name: string
  image: string[]
  description: string
  brand: {
    '@type': 'Brand'
    name: string
  }
  offers: {
    '@type': 'Offer'
    url: string
    priceCurrency: string
    price: string
    availability: string
    itemCondition: string
  }
  sku: string
  category?: string
}

export function generateProductSchema(oil: Oil): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${oil.name} with Crystal Pairing`,
    image: oil.images.map((img) => img.url),
    description: oil.description,
    brand: {
      '@type': 'Brand',
      name: 'Oil Amor',
    },
    offers: {
      '@type': 'Offer',
      url: `https://oilamor.com/oil/${oil.slug}`,
      priceCurrency: oil.price.currencyCode,
      price: oil.price.amount.toString(),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    sku: `OA-${oil.slug.toUpperCase().replace(/-/g, '')}`,
    category: oil.category,
  }
}

// Breadcrumb Schema
export interface BreadcrumbSchema extends SchemaOrgBase {
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item?: string
  }>
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; item?: string }>
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.item && { item: item.item }),
    })),
  }
}

// FAQ Schema
export interface FAQSchema extends SchemaOrgBase {
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }>
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Local Business Schema
export interface LocalBusinessSchema extends SchemaOrgBase {
  '@type': 'Store'
  name: string
  url: string
  telephone: string
  address: {
    '@type': 'PostalAddress'
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
}

export function generateLocalBusinessSchema(): LocalBusinessSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Oil Amor Atelier',
    url: 'https://oilamor.com',
    telephone: '+61-3-9000-1234',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Fitzroy Street',
      addressLocality: 'Fitzroy',
      addressRegion: 'VIC',
      postalCode: '3065',
      addressCountry: 'AU',
    },
  }
}

// Render helper
export function renderSchema(schema: Record<string, unknown>): string {
  return JSON.stringify(schema)
}
