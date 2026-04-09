'use client'

import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'text' | 'circle' | 'image'
  lines?: number
  aspectRatio?: string
}

export function Skeleton({
  variant = 'default',
  lines = 1,
  aspectRatio,
  className,
  ...props
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-miron-dark/10 rounded'

  const variants = {
    default: 'h-4 w-full',
    card: 'h-48 w-full rounded-xl',
    text: 'h-4 w-3/4 rounded',
    circle: 'w-12 h-12 rounded-full',
    image: 'w-full rounded-xl',
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseStyles,
              variants.text,
              i === lines - 1 && 'w-1/2',
              className
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={aspectRatio ? { aspectRatio } : undefined}
      {...props}
    />
  )
}

// Shimmer effect variant
export function SkeletonShimmer({
  variant = 'default',
  className,
}: Omit<SkeletonProps, 'lines'>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-miron-dark/5 rounded',
        variant === 'card' && 'h-48 rounded-xl',
        variant === 'circle' && 'w-12 h-12 rounded-full',
        variant === 'image' && 'w-full aspect-square rounded-xl',
        variant === 'default' && 'h-4 w-full',
        className
      )}
    >
      <div className="absolute inset-0 skeleton" />
    </div>
  )
}

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonShimmer variant="image" aspectRatio="3/4" />
      <Skeleton variant="text" className="w-2/3" />
      <Skeleton variant="text" className="w-1/3" />
    </div>
  )
}

// Grid skeleton for products
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default Skeleton
