'use client'

import { forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'default' | 'elevated' | 'glass' | 'bordered' | 'miron'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', padding = 'md', children, className, hover = true, ...props },
    ref
  ) => {
    const baseStyles = 'relative overflow-hidden transition-all duration-300'

    const variants = {
      default: 'bg-cream-pure rounded-lg shadow-sm',
      elevated: 'bg-cream-pure rounded-xl shadow-lg',
      glass: cn(
        'rounded-xl',
        'bg-white/80 backdrop-blur-xl',
        'border border-white/30'
      ),
      bordered: 'bg-cream-pure rounded-lg border border-miron-dark/10',
      miron: 'bg-miron-void rounded-xl',
    }

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    }

    const hoverStyles = hover
      ? {
          default: 'hover:shadow-md hover:-translate-y-1',
          elevated: 'hover:shadow-xl hover:-translate-y-1',
          glass: 'hover:bg-white/90 hover:shadow-lg',
          bordered: 'hover:border-miron-dark/20 hover:-translate-y-1',
          miron: 'hover:bg-miron-depth',
        }[variant]
      : ''

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddings[padding], hoverStyles, className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export { Card }
export default Card
