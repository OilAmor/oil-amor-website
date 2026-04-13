import { Suspense } from 'react'
import { Metadata } from 'next'
import CommunityBlendsClient from './community-blends-client'
import { getCommunityBlends } from '@/lib/community-blends/data'

export const metadata: Metadata = {
  title: 'Community Blends | Oil Amor',
  description: 'Discover unique oil blends created by our community. Each blend is crafted with intention and available for you to experience.',
}

export const dynamic = 'force-dynamic'

export default async function CommunityBlendsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const sortBy = (searchParams.sort as 'popular' | 'newest' | 'rated' | 'purchased') || 'popular'
  const blends = await getCommunityBlends(sortBy, 24)
  const realBlends = blends.filter((b) => !b.id.startsWith('demo-'))

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a080c]" />}>
      <CommunityBlendsClient initialBlends={realBlends} initialSort={sortBy} />
    </Suspense>
  )
}
