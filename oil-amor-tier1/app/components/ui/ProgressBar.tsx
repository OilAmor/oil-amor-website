'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: 'default' | 'tier' | 'crystal'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  labelFormat?: (value: number, max: number) => string
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      variant = 'default',
      showLabel = true,
      size = 'md',
      labelFormat,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    }

    const variants = {
      default: 'bg-miron-dark/10',
      tier: 'bg-miron-dark/10',
      crystal: 'bg-miron-void/20',
    }

    const fillVariants = {
      default: 'bg-miron-dark',
      tier: 'bg-gradient-to-r from-gold-dark via-gold-pure to-gold-light',
      crystal: 'bg-gradient-to-r from-miron-light via-gold-pure to-miron-light',
    }

    const defaultLabelFormat = (val: number, mx: number) => `${Math.round((val / mx) * 100)}%`

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-miron-dark/60 uppercase tracking-wider">
              Progress
            </span>
            <span className="text-xs font-medium text-miron-dark">
              {labelFormat ? labelFormat(value, max) : defaultLabelFormat(value, max)}
            </span>
          </div>
        )}
        <div className={cn('w-full rounded-full overflow-hidden', sizes[size], variants[variant])}>
          <motion.div
            className={cn('h-full rounded-full', fillVariants[variant])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'

export { ProgressBar }
export default ProgressBar
