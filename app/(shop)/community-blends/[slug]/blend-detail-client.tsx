'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Star, 
  Droplets, 
  Eye,
  ShoppingBag,
  ArrowLeft,
  Share2,
  Check,
  Beaker,
  Sparkles
} from 'lucide-react'
import { type BlendDetail } from '@/lib/community-blends/data'
import { formatPrice } from '@/lib/content/pricing-engine-final'
import { LivingBlendCodex } from '@/components/mixing/LivingBlendCodex'
import type { BlendCodex } from '@/lib/atelier/living-blend-codex'

// Star rating display
function StarRating({ rating, count, size = 'md' }: { rating: number; count: number; size?: 'sm' | 'md' | 'lg' }) {
  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSizes[size]} ${
              star <= Math.round(rating)
                ? 'text-[#c9a227] fill-[#c9a227]'
                : 'text-[#f5f3ef]/20'
            }`}
          />
        ))}
      </div>
      <span className="text-[#a69b8a]">{rating.toFixed(1)} ({count})</span>
    </div>
  )
}

interface BlendDetailClientProps {
  blend: BlendDetail
}

export default function BlendDetailClient({ blend }: BlendDetailClientProps) {
  const [copied, setCopied] = useState(false)
  const [selectedSize, setSelectedSize] = useState<number>(blend.recipe.bottleSize)
  const [showRevelation, setShowRevelation] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Calculate scaled mls for any bottle size while keeping ratios
  const scaledOils = blend.recipe.oils.map(oil => {
    if (blend.recipe.mode === 'pure') {
      const ratio = oil.ml / blend.recipe.bottleSize
      return { ...oil, ml: Math.round(ratio * selectedSize * 10) / 10 }
    } else {
      // For carrier mode, the essential oil portion = selectedSize * (strength / 100)
      const essentialTotal = blend.recipe.bottleSize * (blend.recipe.strength / 100)
      const ratio = oil.ml / essentialTotal
      const newEssentialTotal = selectedSize * (blend.recipe.strength / 100)
      return { ...oil, ml: Math.round(ratio * newEssentialTotal * 10) / 10 }
    }
  })

  // Encode blend data for the atelier URL
  const atelierUrl = (() => {
    const totalEssentialMl = scaledOils.reduce((sum, o) => sum + o.ml, 0)
    const percentages: Record<string, number> = {}
    scaledOils.forEach(o => {
      percentages[o.oilId] = totalEssentialMl > 0 ? Math.round((o.ml / totalEssentialMl) * 1000) / 10 : 0
    })
    const blendData = {
      oils: scaledOils.map(o => ({ oilId: o.oilId, ml: o.ml })),
      mode: blend.recipe.mode,
      bottleSize: selectedSize,
      carrierRatio: blend.recipe.mode === 'carrier' ? blend.recipe.strength : undefined,
      carrierOilId: (blend.recipe as any).carrierOilId,
      crystalId: (blend.recipe as any).crystalId,
      cordId: (blend.recipe as any).cordId,
      name: blend.name,
    }
    const encoded = typeof window !== 'undefined' ? btoa(JSON.stringify(blendData)) : ''
    return `/mixing-atelier?blend=${encoded}`
  })()

  const codex = blend.revelationData ? (blend.revelationData as unknown as BlendCodex) : null

  return (
    <div className="min-h-screen bg-[#0a080c]">
      {/* Navigation */}
      <div className="pt-24 pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/community-blends"
            className="inline-flex items-center gap-2 text-[#a69b8a] hover:text-[#c9a227] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community Blends
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Left Column - Blend Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="font-serif text-4xl text-[#f5f3ef] mb-2">{blend.name}</h1>
                <StarRating 
                  rating={blend.averageRating} 
                  count={blend.ratingCount} 
                  size="md"
                />
              </div>

              {/* Creator Card */}
              <div className="p-4 rounded-2xl bg-[#111] border border-[#f5f3ef]/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#c9a227]/20 flex items-center justify-center text-[#c9a227] text-xl font-medium">
                    {blend.creatorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-[#a69b8a]">Created by</p>
                    <p className="text-lg font-medium text-[#f5f3ef]">{blend.creatorName}</p>
                    {blend.creatorBio && (
                      <p className="text-sm text-[#a69b8a] mt-1">{blend.creatorBio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description & Story */}
              {blend.description && (
                <div>
                  <h3 className="text-sm font-medium text-[#c9a227] mb-2">About This Blend</h3>
                  <p className="text-[#a69b8a] leading-relaxed">{blend.description}</p>
                </div>
              )}
              
              {blend.story && (
                <div>
                  <h3 className="text-sm font-medium text-[#c9a227] mb-2">The Story</h3>
                  <p className="text-[#a69b8a] leading-relaxed italic">&ldquo;{blend.story}&rdquo;</p>
                </div>
              )}

              {/* View Revelation Button */}
              {codex && (
                <button
                  onClick={() => setShowRevelation(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6]/20 to-[#A855F7]/10 border border-[#8B5CF6]/30 text-[#ddd6fe] flex items-center justify-center gap-2 hover:bg-[#8B5CF6]/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  View Blend Revelation
                </button>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#111] border border-[#f5f3ef]/10 text-center">
                  <Eye className="w-5 h-5 text-[#c9a227] mx-auto mb-2" />
                  <p className="text-lg font-medium text-[#f5f3ef]">{blend.viewCount}</p>
                  <p className="text-xs text-[#a69b8a]">Views</p>
                </div>
                <div className="p-4 rounded-xl bg-[#111] border border-[#f5f3ef]/10 text-center">
                  <ShoppingBag className="w-5 h-5 text-[#c9a227] mx-auto mb-2" />
                  <p className="text-lg font-medium text-[#f5f3ef]">{blend.purchaseCount}</p>
                  <p className="text-xs text-[#a69b8a]">Purchased</p>
                </div>
                <div className="p-4 rounded-xl bg-[#111] border border-[#f5f3ef]/10 text-center">
                  <Star className="w-5 h-5 text-[#c9a227] mx-auto mb-2" />
                  <p className="text-lg font-medium text-[#f5f3ef]">{blend.ratingCount}</p>
                  <p className="text-xs text-[#a69b8a]">Ratings</p>
                </div>
              </div>
            </div>

            {/* Right Column - Recipe & Purchase */}
            <div className="space-y-6">
              {/* Recipe Card */}
              <div className="p-6 rounded-2xl bg-[#111] border border-[#f5f3ef]/10">
                <h3 className="text-lg font-medium text-[#f5f3ef] mb-4 flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-[#c9a227]" />
                  The Formula
                </h3>
                
                {/* Oils */}
                <div className="space-y-2 mb-4">
                  {scaledOils.map((oil, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0a080c]"
                    >
                      <span className="text-[#f5f3ef]">{oil.name}</span>
                      <span className="text-[#c9a227]">{oil.ml}ml</span>
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="border-t border-[#f5f3ef]/10 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-[#a69b8a]">
                    <span>Mode</span>
                    <span className="text-[#f5f3ef]">
                      {blend.recipe.mode === 'pure' ? 'Pure Essential' : 'Carrier Enhanced'}
                    </span>
                  </div>
                  {blend.recipe.mode === 'carrier' && (
                    <div className="flex justify-between text-[#a69b8a]">
                      <span>Strength</span>
                      <span className="text-[#f5f3ef]">{blend.recipe.strength}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Size Selector */}
              <div className="p-5 rounded-2xl bg-[#111] border border-[#f5f3ef]/10">
                <h3 className="text-sm font-medium text-[#f5f3ef] mb-3">Choose Bottle Size</h3>
                <div className="grid grid-cols-5 gap-2">
                  {[5, 10, 15, 20, 30].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-[#c9a227] text-[#0a080c]'
                          : 'bg-[#0a080c] text-[#a69b8a] hover:bg-[#0a080c]/80'
                      }`}
                    >
                      {size}ml
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#a69b8a] mt-2">
                  Ratios stay identical — only total volume changes.
                </p>
              </div>

              {/* Purchase Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#c9a227]/20 to-[#c9a227]/5 border border-[#c9a227]/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#a69b8a]">Price</span>
                  <span className="text-3xl font-serif text-[#c9a227]">
                    {formatPrice(blend.price / 100)}
                  </span>
                </div>
                
                <Link
                  href={atelierUrl}
                  className="w-full py-4 rounded-xl bg-[#c9a227] text-[#0a080c] font-medium flex items-center justify-center gap-2 hover:bg-[#f5f3ef] transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Order This Blend
                </Link>
                
                <p className="text-xs text-[#a69b8a] text-center mt-3">
                  This blend will be handcrafted just for you
                </p>
              </div>

              {/* Share */}
              <button 
                onClick={handleShare}
                className="w-full py-3 rounded-xl bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] flex items-center justify-center gap-2 hover:border-[#c9a227]/50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Share This Blend
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Ratings Section */}
          {blend.ratings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-serif text-[#f5f3ef] mb-6">Community Reviews</h2>
              
              <div className="space-y-4">
                {blend.ratings.map((rating) => (
                  <div
                    key={rating.id}
                    className="p-4 rounded-xl bg-[#111] border border-[#f5f3ef]/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c9a227]/20 flex items-center justify-center text-[#c9a227] text-sm">
                          {rating.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[#f5f3ef]">{rating.userName}</span>
                        {rating.verifiedPurchase && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <StarRating rating={rating.rating} count={0} size="sm" />
                    </div>
                    {rating.review && (
                      <p className="text-[#a69b8a] text-sm pl-11">{rating.review}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Living Blend Codex Modal */}
      <LivingBlendCodex
        codex={codex}
        isOpen={showRevelation}
        onClose={() => setShowRevelation(false)}
      />
    </div>
  )
}
