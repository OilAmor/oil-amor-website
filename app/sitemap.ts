import { MetadataRoute } from 'next'
import { getAllOils } from '@/lib/content/oil-crystal-synergies'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://oilamor.com'

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/oils`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/mixing-atelier`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/refill`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/community-blends`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
  ]

  // Dynamic oil pages from local catalog
  const oils = getAllOils()
  const oilPages = oils.map((oil) => ({
    url: `${baseUrl}/oil/${oil.handle || oil.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...oilPages]
}
