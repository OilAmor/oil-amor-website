import Script from 'next/script'

interface OrganizationSchema {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name: string
  url: string
  logo: string
  description: string
  sameAs: string[]
}

interface ProductSchema {
  '@context': 'https://schema.org'
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
    price: string
    priceCurrency: string
    availability: string
    url: string
  }
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: string
    reviewCount: string
  }
}

interface WebSiteSchema {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  url: string
  potentialAction: {
    '@type': 'SearchAction'
    target: string
    'query-input': string
  }
}

export function OrganizationStructuredData() {
  const data: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Oil Amor',
    url: 'https://oilamor.com',
    logo: 'https://oilamor.com/logo.png',
    description: 'Essential oils that transform into crystal jewelry.',
    sameAs: [
      'https://instagram.com/oilamor',
      'https://facebook.com/oilamor',
      'https://twitter.com/oilamor',
    ],
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function WebSiteStructuredData() {
  const data: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Oil Amor',
    url: 'https://oilamor.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://oilamor.com/oils?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function ProductStructuredData({
  name,
  description,
  image,
  price,
  currency,
  availability,
  url,
  rating,
  reviewCount,
}: {
  name: string
  description: string
  image: string[]
  price: string
  currency: string
  availability: 'InStock' | 'OutOfStock'
  url: string
  rating?: string
  reviewCount?: string
}) {
  const data: ProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    image,
    description,
    brand: {
      '@type': 'Brand',
      name: 'Oil Amor',
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url,
    },
  }

  if (rating && reviewCount) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount,
    }
  }

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
