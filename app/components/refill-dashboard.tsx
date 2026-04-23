'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, Lock, Droplets, ArrowRight, Sparkles } from 'lucide-react'
import { 
  getRefillEligibleOils, 
  getLockedOils,
  getRefillSavings,
  OIL_PRICING,
  REFILL_SIZES,
} from '@/lib/content/product-config'
import type { OilProfile } from '@/lib/content/oil-crystal-synergies'

interface PurchaseRecord {
  oilId: string
  size: string
  date: Date
  orderId: string
}

interface RefillDashboardProps {
  purchaseHistory: PurchaseRecord[]
  allOils: OilProfile[]
}

export function RefillDashboard({ purchaseHistory, allOils }: RefillDashboardProps) {
  const eligibleOilIds = useMemo(() => 
    getRefillEligibleOils(purchaseHistory),
    [purchaseHistory]
  )
  
  const lockedOilIds = useMemo(() => 
    getLockedOils(purchaseHistory),
    [purchaseHistory]
  )

  // Get eligible oils with full data
  const eligibleOils = useMemo(() => {
    return eligibleOilIds.map(id => {
      const oilProfile = allOils.find(o => o.id === id)
      const purchase = purchaseHistory.find(p => p.oilId === id)
      const pricing = OIL_PRICING.find(o => o.id === id)
      return {
        oilId: id,
        oilName: oilProfile?.commonName || id,
        image: oilProfile?.image,
        purchasedSize: purchase?.size || '',
        purchasedAt: purchase?.date,
        eligibleRefills: (REFILL_SIZES as readonly string[]).map((size: string) => {
          const basePrice = pricing?.prices?.[size as '5ml' | '10ml' | '15ml' | '20ml' | '30ml'] || 0
          const refillPrice = basePrice * 0.7
          return {
            size,
            price: refillPrice,
            savings: basePrice - refillPrice,
            savingsPercent: basePrice > 0 ? Math.round((1 - refillPrice / basePrice) * 100) : 0,
          }
        }),
      }
    })
  }, [eligibleOilIds, allOils, purchaseHistory])

  // Get locked oils with full data
  const lockedOils = useMemo(() => {
    return lockedOilIds.map(id => {
      const oilProfile = allOils.find(o => o.id === id)
      const pricing = OIL_PRICING.find(o => o.id === id)
      const minPrice = pricing ? Math.min(...Object.values(pricing).filter(v => typeof v === 'number') as number[]) : 0
      return {
        oilId: id,
        oilName: oilProfile?.commonName || id,
        starterPrice: minPrice,
      }
    })
  }, [lockedOilIds, allOils])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#c9a227]/10 to-transparent border border-[#c9a227]/30">
        <h2 className="font-serif text-2xl text-[#f5f3ef] mb-2">Your Refill Status</h2>
        <p className="text-[#a69b8a]">
          Purchase any size bottle to unlock refill options for that oil type. 
          Refills save you money and reduce waste.
        </p>
        
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2ecc71]/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-[#2ecc71]" />
            </div>
            <span className="text-[#f5f3ef]">{eligibleOils.length} Oils Unlocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#f5f3ef]/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#a69b8a]" />
            </div>
            <span className="text-[#a69b8a]">{lockedOils.length} Oils Locked</span>
          </div>
        </div>
      </div>

      {/* Unlocked Oils */}
      {eligibleOils.length > 0 && (
        <section>
          <h3 className="text-lg font-medium text-[#f5f3ef] mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2ecc71]" />
            Available for Refill
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {eligibleOils.map((oil) => (
              <UnlockedOilCard key={oil.oilId} oil={oil} />
            ))}
          </div>
        </section>
      )}

      {/* Locked Oils */}
      {lockedOils.length > 0 && (
        <section>
          <h3 className="text-lg font-medium text-[#f5f3ef] mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#a69b8a]" />
            Unlock Refill Access
          </h3>
          <p className="text-[#a69b8a] text-sm mb-4">
            Purchase any size of these oils to unlock refill options and save up to 50%.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedOils.map((oil) => (
              <LockedOilCard key={oil.oilId} oil={oil} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Unlocked Oil Card
interface EligibleOil {
  oilId: string
  oilName: string
  image?: string
  purchasedSize: string
  purchasedAt?: Date
  eligibleRefills: {
    size: string
    price: number
    savings: number
    savingsPercent: number
  }[]
}

function UnlockedOilCard({ 
  oil,
}: { 
  oil: EligibleOil
}) {
  const bestSavings = oil.eligibleRefills.reduce((best, current) => 
    current.savingsPercent > best.savingsPercent ? current : best
  , oil.eligibleRefills[0])

  return (
    <div className="p-5 rounded-xl bg-[#111] border border-[#f5f3ef]/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {oil.image && (
            <Image
              src={oil.image}
              alt={oil.oilName}
              width={64}
              height={64}
              className="rounded-lg object-cover"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[#f5f3ef] font-medium">{oil.oilName}</h4>
              <span className="px-2 py-0.5 rounded-full bg-[#2ecc71]/20 text-[#2ecc71] text-xs">
                Unlocked
              </span>
            </div>
            <p className="text-[#a69b8a] text-sm">
              Purchased {oil.purchasedSize} on {oil.purchasedAt?.toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-[#2ecc71] text-sm">Save up to</p>
          <p className="text-2xl font-serif text-[#2ecc71]">{bestSavings?.savingsPercent || 0}%</p>
        </div>
      </div>

      {/* Refill Options */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {oil.eligibleRefills.map((refill) => (
          <div 
            key={refill.size}
            className="p-3 rounded-lg bg-[#0a080c] border border-[#f5f3ef]/5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#f5f3ef] font-medium">{refill.size}</span>
              <span className="text-[#c9a227] font-serif">${refill.price.toFixed(2)}</span>
            </div>
            <p className="text-[#2ecc71] text-xs">
              Save ${refill.savings.toFixed(2)} ({refill.savingsPercent}%)
            </p>
          </div>
        ))}
      </div>

      <Link
        href={`/refill?oil=${oil.oilId}`}
        className="mt-4 w-full py-2 rounded-lg bg-[#c9a227] text-[#0a080c] font-medium flex items-center justify-center gap-2 hover:bg-[#f5f3ef] transition-colors"
      >
        <Droplets className="w-4 h-4" />
        Order Refill
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

// Locked Oil Card
interface LockedOil {
  oilId: string
  oilName: string
  starterPrice: number
}

function LockedOilCard({ oil }: { oil: LockedOil }) {
  // Calculate potential savings
  const savings50ml = getRefillSavings(oil.oilId, '50ml-refill')
  
  return (
    <div className="p-4 rounded-xl bg-[#111] border border-[#f5f3ef]/10 opacity-75">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-[#f5f3ef] font-medium">{oil.oilName}</h4>
            <Lock className="w-3 h-3 text-[#a69b8a]" />
          </div>
          <p className="text-[#a69b8a] text-xs mt-1">
            From ${oil.starterPrice.toFixed(2)} to unlock
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-[#a69b8a] text-xs">Potential savings</p>
          <p className="text-[#2ecc71] text-sm">Up to {savings50ml.savingsPercent}%</p>
        </div>
      </div>
      
      <Link
        href={`/oil/${oil.oilId}`}
        className="mt-3 w-full py-2 rounded-lg border border-[#f5f3ef]/20 text-[#f5f3ef] text-sm flex items-center justify-center gap-2 hover:border-[#c9a227] hover:text-[#c9a227] transition-colors"
      >
        Shop {oil.oilName}
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}

// Simple version for account page sidebar
export function RefillStatusWidget({ purchaseHistory }: { purchaseHistory: PurchaseRecord[] }) {
  const eligibleCount = getRefillEligibleOils(purchaseHistory).length
  
  if (eligibleCount === 0) {
    return (
      <div className="p-4 rounded-xl bg-[#111] border border-[#f5f3ef]/10">
        <p className="text-[#a69b8a] text-sm">
          No refill access yet. Purchase any oil to unlock refills and save up to 50%.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-[#2ecc71]/10 to-transparent border border-[#2ecc71]/30">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#2ecc71]/20 flex items-center justify-center">
          <Droplets className="w-5 h-5 text-[#2ecc71]" />
        </div>
        <div>
          <h4 className="text-[#f5f3ef] font-medium">{eligibleCount} Oil{eligibleCount !== 1 ? 's' : ''} Unlocked</h4>
          <p className="text-[#a69b8a] text-xs">Refill eligible</p>
        </div>
      </div>
      <Link
        href="/account/refills"
        className="text-[#2ecc71] text-sm hover:underline flex items-center gap-1"
      >
        View refill options
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}
