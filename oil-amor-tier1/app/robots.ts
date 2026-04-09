import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/cart/'],
    },
    sitemap: 'https://oilamor.com/sitemap.xml',
  }
}
