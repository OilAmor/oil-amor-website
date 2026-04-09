'use client'

import { ShoppingBag } from 'lucide-react'
import { formatPrice } from '../../../../lib/utils'

interface AddToCartSectionProps {
  title: string
  crystalName: string
  variant?: {
    price: {
      amount: string
      currencyCode: string
    }
  } | null
}

export function AddToCartSection({ title, crystalName, variant }: AddToCartSectionProps) {
  const handleAddToCart = () => {
    // TODO: Implement add to cart logic
    console.log('Add to cart:', title, 'with', crystalName)
  }

  return (
    <section className="mt-20 pt-12 border-t border-[#1c181f]">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div>
          <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a] block mb-2">
            Your Selection
          </span>
          <p className="text-[#f5f3ef]">
            {title} with {crystalName || 'Clear Quartz'}
          </p>
        </div>
        
        {variant ? (
          <button
            className="btn-luxury"
            onClick={handleAddToCart}
          >
            Add to Collection — {formatPrice(parseFloat(variant.price.amount), variant.price.currencyCode)}
          </button>
        ) : (
          <button
            className="btn-luxury flex items-center gap-2"
            disabled
          >
            <ShoppingBag className="w-4 h-4" />
            Coming Soon
          </button>
        )}
      </div>
    </section>
  )
}
