'use client'

import { forwardRef, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { TIER_COLORS, TierType } from '../../styles/design-system'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'error' | 'tier'
  tier?: TierType
  size?: 'sm' | 'md'
  children: ReactNode
  dot?: boolean
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = 'default', tier = 'seed', size = 'sm', children, className, dot = false, ...props },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center gap-1.5 font-medium',
      'transition-all duration-200'
    )

    const sizes = {
      sm: 'px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full',
      md: 'px-3 py-1 text-xs uppercase tracking-wider rounded-full',
    }

    const variants = {
      default: 'bg-miron-dark/10 text-miron-dark',
      gold: 'bg-gold-pure/20 text-gold-dark border border-gold-pure/30',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-amber-100 text-amber-800',
      error: 'bg-red-100 text-red-800',
      tier: '',
    }

    const tierStyles = tier
      ? {
          style: {
            background: TIER_COLORS[tier].gradient,
            color: TIER_COLORS[tier].text,
          },
        }
      : {}

    return (
      <span
        ref={ref}
        className={cn(baseStyles, sizes[size], variant !== 'tier' && variants[variant], className)}
        style={variant === 'tier' ? tierStyles.style : undefined}
        {...props}
      >
        {dot && (
          <span className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'tier' ? 'bg-current' : 'bg-current'
          )} />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
export default Badge
