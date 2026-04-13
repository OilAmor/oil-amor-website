'use client'

import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { formatPrice } from '../../lib/utils'
import { CountUp } from '../animations/CountUp'

export interface PriceDisplayProps {
  price: number
  compareAtPrice?: number
  unitPrice?: number
  unit?: string
  credits?: number
  creditValue?: number
  showPerUnit?: boolean
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export function PriceDisplay({
  price,
  compareAtPrice,
  unitPrice,
  unit = 'ml',
  credits,
  creditValue = 1,
  showPerUnit = true,
  size = 'md',
  animated = true,
  className,
}: PriceDisplayProps) {
  const isOnSale = compareAtPrice && compareAtPrice > price
  const savings = isOnSale ? compareAtPrice - price : 0
  const savingsPercent = isOnSale ? Math.round((savings / compareAtPrice) * 100) : 0

  const sizes = {
    sm: {
      price: 'text-lg',
      compare: 'text-sm',
      unit: 'text-xs',
    },
    md: {
      price: 'text-2xl',
      compare: 'text-base',
      unit: 'text-sm',
    },
    lg: {
      price: 'text-4xl',
      compare: 'text-xl',
      unit: 'text-base',
    },
  }

  const finalPrice = credits ? Math.max(0, price - credits * creditValue) : price

  return (
    <div className={cn('space-y-1', className)}>
      {/* Main Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <motion.span
          key={finalPrice}
          initial={animated ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'font-display text-miron-dark',
            sizes[size].price
          )}
        >
          {animated && finalPrice > 0 ? (
            <CountUp end={finalPrice} prefix="$" decimals={2} />
          ) : (
            formatPrice(finalPrice)
          )}
        </motion.span>

        {isOnSale && (
          <>
            <span
              className={cn(
                'text-miron-dark/40 line-through',
                sizes[size].compare
              )}
            >
              {formatPrice(compareAtPrice)}
            </span>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
              Save {savingsPercent}%
            </span>
          </>
        )}
      </div>

      {/* Unit Price */}
      {showPerUnit && unitPrice && (
        <p className={cn('text-miron-dark/50', sizes[size].unit)}>
          {formatPrice(unitPrice)} per {unit}
        </p>
      )}

      {/* Credit Application Preview */}
      {credits && credits > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pt-2 mt-2 border-t border-miron-dark/10"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-miron-dark/60">Subtotal</span>
            <span className="text-miron-dark">{formatPrice(price)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-miron-dark/60">Credits Applied</span>
            <span className="text-gold-dark">-{formatPrice(credits * creditValue)}</span>
          </div>
          <div className="flex items-center justify-between text-sm font-medium mt-1 pt-1 border-t border-dashed border-miron-dark/10">
            <span className="text-miron-dark">Final Price</span>
            <span className="text-gold-dark">{formatPrice(finalPrice)}</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Compact price for cart/minicart
export function PriceCompact({
  price,
  quantity = 1,
  className,
}: {
  price: number
  quantity?: number
  className?: string
}) {
  const total = price * quantity

  return (
    <div className={cn('text-right', className)}>
      <span className="font-medium text-miron-dark">{formatPrice(total)}</span>
      {quantity > 1 && (
        <span className="text-xs text-miron-dark/50 block">
          {formatPrice(price)} each
        </span>
      )}
    </div>
  )
}

export default PriceDisplay
