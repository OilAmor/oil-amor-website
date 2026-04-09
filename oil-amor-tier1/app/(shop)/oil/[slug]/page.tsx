import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductByHandle } from '@/app/lib/shopify'
import { getOilByHandle, getOilById, getAllOils } from '@/lib/content/oil-crystal-synergies'
import { OilPageClient } from './oil-page-client'

// Map URL slugs to oil IDs for the original oils
// New oils use their ID as the slug directly
const SLUG_TO_OIL_ID: Record<string, string> = {
  'lavender-essential-oil': 'lavender',
  'blue-mallee-eucalyptus': 'eucalyptus',
  'tea-tree-oil': 'tea-tree',
  'clove-bud-oil': 'clove-bud',
  'lemongrass-oil': 'lemongrass',
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const oilData = getOilByHandle(params.slug)
  const product = await getProductByHandle(params.slug).catch(() => null)
  
  const title = product?.title || oilData?.commonName || 'Essential Oil'
  const description = product?.description || oilData?.description || ''
  
  return {
    title: `${title} | Oil Amor`,
    description: description.slice(0, 160),
    openGraph: {
      title: `${title} | Oil Amor`,
      description: description.slice(0, 160),
      images: oilData ? [oilData.image] : undefined,
    },
  }
}

// Generate static params for ALL 17 oils
export async function generateStaticParams() {
  const allOils = getAllOils()
  
  return allOils.map(oil => ({
    slug: oil.handle || oil.id
  }))
}

export default async function OilPage({ params }: Props) {
  // Try to get oil by handle first, then by ID mapping
  let oilData = getOilByHandle(params.slug)
  
  if (!oilData) {
    // Try the ID mapping for legacy URLs
    const oilId = SLUG_TO_OIL_ID[params.slug]
    if (oilId) {
      oilData = getOilById(oilId)
    } else {
      // Try using slug directly as ID
      oilData = getOilById(params.slug)
    }
  }
  
  const product = await getProductByHandle(params.slug).catch(() => null)
  
  if (!product && !oilData) {
    notFound()
  }
  
  const variant = product?.variants?.edges?.[0]?.node || null
  const title = product?.title || oilData?.commonName || 'Essential Oil'

  return (
    <OilPageClient 
      oilData={oilData} 
      variant={variant} 
      title={title}
      slug={params.slug}
    />
  )
}
