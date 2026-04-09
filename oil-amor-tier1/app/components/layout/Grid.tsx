'use client'

import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface GridProps {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  sm?: 1 | 2 | 3 | 4 | 6
  md?: 1 | 2 | 3 | 4 | 6
  lg?: 1 | 2 | 3 | 4 | 5 | 6
  xl?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Grid({
  children,
  cols = 1,
  sm,
  md,
  lg,
  xl,
  gap = 'md',
  className,
}: GridProps) {
  const gaps = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  }

  const colClasses = [
    `grid-cols-${cols}`,
    sm && `sm:grid-cols-${sm}`,
    md && `md:grid-cols-${md}`,
    lg && `lg:grid-cols-${lg}`,
    xl && `xl:grid-cols-${xl}`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cn('grid', colClasses, gaps[gap], className)}>{children}</div>
  )
}

// Masonry-style grid for product collections
export interface MasonryGridProps {
  children: ReactNode
  className?: string
}

export function MasonryGrid({ children, className }: MasonryGridProps) {
  return (
    <div
      className={cn(
        'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6',
        className
      )}
    >
      {children}
    </div>
  )
}

// Feature grid with icons
export interface FeatureGridProps {
  features: {
    icon: ReactNode
    title: string
    description: string
  }[]
  className?: string
}

export function FeatureGrid({ features, className }: FeatureGridProps) {
  return (
    <Grid md={2} lg={3} gap="lg" className={className}>
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center text-center p-6">
          <div className="w-12 h-12 rounded-full bg-gold-pure/10 flex items-center justify-center text-gold-pure mb-4">
            {feature.icon}
          </div>
          <h3 className="font-display text-lg text-miron-dark mb-2">
            {feature.title}
          </h3>
          <p className="text-sm text-miron-dark/60 leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </Grid>
  )
}

export default Grid
