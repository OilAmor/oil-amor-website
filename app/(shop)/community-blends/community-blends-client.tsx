'use client'

import { useState, useTransition } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
  Beaker,
} from 'lucide-react'
import { type BlendWithRating } from '@/lib/community-blends/data'
import { formatPrice } from '@/lib/content/pricing-engine-final'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

const SORT_OPTIONS = [
  { id: 'popular', label: 'Most Popular', icon: TrendingUp },
  { id: 'newest', label: 'Newest', icon: Clock },
  { id: 'rated', label: 'Highest Rated', icon: Star },
  { id: 'purchased', label: 'Most Purchased', icon: Award },
] as const

type SortOption = (typeof SORT_OPTIONS)[number]['id']

const ORGANIC_SHAPES = [
  'rounded-[2rem] rounded-tl-sm',
  'rounded-[2rem] rounded-tr-sm',
  'rounded-[2rem] rounded-bl-sm',
  'rounded-[2rem] rounded-br-sm',
]

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= Math.round(rating)
                ? 'fill-[#c9a227] text-[#c9a227]'
                : 'text-[#f5f3ef]/20'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-[#a69b8a]">({count})</span>
    </div>
  )
}

function BlendCard({
  blend,
  index,
}: {
  blend: BlendWithRating
  index: number
}) {
  const shape = ORGANIC_SHAPES[index % ORGANIC_SHAPES.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, ease: EASE_LUXURY }}
      className="group"
    >
      <Link href={`/community-blends/${blend.slug}`}>
        <div
          className={`relative border border-[#f5f3ef]/10 bg-[#0a080c]/60 p-5 transition-all duration-300 hover:border-[#c9a227]/40 hover:shadow-lg hover:shadow-[#c9a227]/5 ${shape}`}
        >
          {/* Creator Badge */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 text-sm font-medium text-[#c9a227]">
              {blend.creatorName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#f5f3ef]">
                {blend.name}
              </p>
              <p className="text-xs text-[#a69b8a]">by {blend.creatorName}</p>
            </div>
          </div>

          {/* Recipe Preview */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {blend.recipe.oils.slice(0, 3).map((oil, i) => (
                <span
                  key={i}
                  className="rounded-full border border-[#c9a227]/20 bg-[#0a080c] px-2 py-0.5 text-[10px] text-[#a69b8a]"
                >
                  {oil.name} ({oil.ml}ml)
                </span>
              ))}
              {blend.recipe.oils.length > 3 && (
                <span className="rounded-full border border-[#c9a227]/20 bg-[#0a080c] px-2 py-0.5 text-[10px] text-[#a69b8a]">
                  +{blend.recipe.oils.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between">
            <StarRating
              rating={blend.averageRating}
              count={blend.ratingCount}
            />
            <div className="flex items-center gap-1 text-xs text-[#a69b8a]">
              <Droplets className="h-3 w-3" />
              {blend.purchaseCount} sold
            </div>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center justify-between border-t border-[#f5f3ef]/10 pt-3">
            <span className="text-xs text-[#a69b8a]">
              {blend.recipe.bottleSize}ml
            </span>
            <span className="font-display text-[#c9a227]">
              {formatPrice(blend.price / 100)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function CommunityBlendsClient({
  initialBlends,
  initialSort,
}: {
  initialBlends: BlendWithRating[]
  initialSort: SortOption
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [sortBy, setSortBy] = useState<SortOption>(initialSort)

  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 300], [0, 50])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    startTransition(() => {
      router.push(`/community-blends?sort=${newSort}`)
    })
  }

  return (
    <div className="min-h-screen bg-[#0a080c]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-12 pt-28">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute -right-[10vw] top-[10vh] h-[50vw] w-[50vw] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(26,15,46,0.35) 0%, transparent 60%)',
            }}
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -left-[10vw] top-[30vh] h-[35vw] w-[35vw] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(201,162,39,0.05) 0%, transparent 60%)',
            }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Background text */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{ opacity: heroOpacity }}
        >
          <span className="whitespace-nowrap font-display text-[14vw] font-light tracking-[-0.04em] text-[#c9a227]/[0.03]">
            Community
          </span>
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto max-w-7xl"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_LUXURY }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2"
            >
              <Users className="h-4 w-4 text-[#c9a227]" />
              <span className="text-sm text-[#c9a227]">Community Creations</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
              className="font-display text-4xl leading-[1.1] text-[#f5f3ef] sm:text-5xl lg:text-6xl"
            >
              Blends by Our
              <br />
              <span className="italic text-[#c9a227]">Community</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXURY }}
              className="mt-6 leading-relaxed text-[#a69b8a]"
            >
              Discover unique oil blends created by our community. Each blend is
              crafted with intention, tested by its creator, and available for you
              to experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE_LUXURY }}
              className="mt-8"
            >
              <Link
                href="/mixing-atelier"
                className="inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-8 py-4 text-[0.75rem] font-medium uppercase tracking-[0.15em] text-[#0a080c] transition-colors hover:bg-transparent hover:text-[#c9a227]"
              >
                <Beaker className="h-4 w-4" />
                Create Your Own Blend
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Filters & Grid */}
      <section className="px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Sort Tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {SORT_OPTIONS.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => handleSortChange(option.id)}
                  disabled={isPending}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                    sortBy === option.id
                      ? 'bg-[#c9a227] text-[#0a080c]'
                      : 'border border-[#f5f3ef]/10 bg-[#0a080c]/60 text-[#a69b8a] hover:border-[#c9a227]/50'
                  } ${isPending ? 'cursor-wait opacity-50' : ''}`}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              )
            })}
          </div>

          {/* Blends Grid */}
          {isPending ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-64 animate-pulse border border-[#f5f3ef]/10 bg-[#0a080c]/60 ${ORGANIC_SHAPES[i % ORGANIC_SHAPES.length]}`}
                />
              ))}
            </div>
          ) : initialBlends.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {initialBlends.map((blend, index) => (
                <BlendCard key={blend.id} blend={blend} index={index} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-[#c9a227]/30" />
              <h3 className="font-display text-xl text-[#f5f3ef]">
                No blends yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-[#a69b8a]">
                Be the first to share your creation with the community!
              </p>
              <Link
                href="/mixing-atelier"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-8 py-4 text-[0.75rem] font-medium uppercase tracking-[0.15em] text-[#0a080c] transition-colors hover:bg-transparent hover:text-[#c9a227]"
              >
                Create a Blend
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
