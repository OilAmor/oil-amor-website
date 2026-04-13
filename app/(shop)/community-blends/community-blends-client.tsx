'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Star, 
  Droplets, 
  TrendingUp, 
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  Beaker
} from 'lucide-react'
import { type BlendWithRating } from '@/lib/community-blends/data'
import { formatPrice } from '@/lib/content/pricing-engine-final'

// Sort options
const SORT_OPTIONS = [
  { id: 'popular', label: 'Most Popular', icon: TrendingUp },
  { id: 'newest', label: 'Newest', icon: Clock },
  { id: 'rated', label: 'Highest Rated', icon: Star },
  { id: 'purchased', label: 'Most Purchased', icon: Award },
] as const

type SortOption = typeof SORT_OPTIONS[number]['id']

// Star rating component
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(rating)
                ? 'text-[#c9a227] fill-[#c9a227]'
                : 'text-[#f5f3ef]/20'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-[#a69b8a]">({count})</span>
    </div>
  )
}

// Blend card component
function BlendCard({ blend, index }: { blend: BlendWithRating; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/community-blends/${blend.slug}`}>
        <div className="relative p-5 rounded-2xl bg-[#111] border border-[#f5f3ef]/10 transition-all duration-300 hover:border-[#c9a227]/40 hover:shadow-lg hover:shadow-[#c9a227]/5">
          {/* Creator Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#c9a227]/20 flex items-center justify-center text-[#c9a227] text-sm font-medium">
              {blend.creatorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#f5f3ef] truncate">
                {blend.name}
              </p>
              <p className="text-xs text-[#a69b8a]">
                by {blend.creatorName}
              </p>
            </div>
          </div>

          {/* Recipe Preview */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {blend.recipe.oils.slice(0, 3).map((oil, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-[#0a080c] text-[#a69b8a] text-[10px]"
                >
                  {oil.name} ({oil.ml}ml)
                </span>
              ))}
              {blend.recipe.oils.length > 3 && (
                <span className="px-2 py-0.5 rounded-full bg-[#0a080c] text-[#a69b8a] text-[10px]">
                  +{blend.recipe.oils.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between">
            <StarRating rating={blend.averageRating} count={blend.ratingCount} />
            <div className="flex items-center gap-3 text-xs text-[#a69b8a]">
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                {blend.purchaseCount} sold
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-4 pt-3 border-t border-[#f5f3ef]/10 flex items-center justify-between">
            <span className="text-xs text-[#a69b8a]">{blend.recipe.bottleSize}ml</span>
            <span className="text-[#c9a227] font-serif">{formatPrice(blend.price / 100)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Main client component
interface CommunityBlendsClientProps {
  initialBlends: BlendWithRating[]
  initialSort: SortOption
}

export default function CommunityBlendsClient({ initialBlends, initialSort }: CommunityBlendsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [sortBy, setSortBy] = useState<SortOption>(initialSort)

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    startTransition(() => {
      router.push(`/community-blends?sort=${newSort}`)
    })
  }

  return (
    <div className="min-h-screen bg-[#0a080c]">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6">
              <Users className="w-4 h-4 text-[#c9a227]" />
              <span className="text-sm text-[#c9a227]">Community Creations</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#f5f3ef] leading-[1.1] mb-6">
              Blends by Our
              <br />
              <span className="italic text-[#c9a227]">Community</span>
            </h1>
            
            <p className="text-[#a69b8a] leading-relaxed mb-8">
              Discover unique oil blends created by our community. Each blend is crafted with intention, 
              tested by its creator, and available for you to experience.
            </p>

            {/* CTA */}
            <Link
              href="/mixing-atelier"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c9a227] text-[#0a080c] font-medium hover:bg-[#f5f3ef] transition-colors"
            >
              <Beaker className="w-4 h-4" />
              Create Your Own Blend
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Sort Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {SORT_OPTIONS.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => handleSortChange(option.id)}
                  disabled={isPending}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                    sortBy === option.id
                      ? 'bg-[#c9a227] text-[#0a080c]'
                      : 'bg-[#111] text-[#a69b8a] border border-[#f5f3ef]/10 hover:border-[#c9a227]/50'
                  } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                </button>
              )
            })}
          </div>

          {/* Blends Grid */}
          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl bg-[#111] border border-[#f5f3ef]/10 animate-pulse"
                />
              ))}
            </div>
          ) : initialBlends.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {initialBlends.map((blend, index) => (
                <BlendCard key={blend.id} blend={blend} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <Sparkles className="w-12 h-12 text-[#c9a227]/30 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-[#f5f3ef] mb-2">No blends yet</h3>
              <p className="text-[#a69b8a] mb-6">Be the first to share your creation with the community!</p>
              <Link
                href="/mixing-atelier"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c9a227] text-[#0a080c] font-medium hover:bg-[#f5f3ef] transition-colors"
              >
                Create a Blend
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
