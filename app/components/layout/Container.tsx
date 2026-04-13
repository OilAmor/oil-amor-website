'use client'

import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface ContainerProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function Container({
  children,
  size = 'xl',
  className,
  as: Component = 'div',
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-[640px]',
    md: 'max-w-[768px]',
    lg: 'max-w-[1024px]',
    xl: 'max-w-[1280px]',
    '2xl': 'max-w-[1440px]',
    full: 'max-w-none',
  }

  return (
    <Component
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12',
        sizes[size],
        className
      )}
    >
      {children}
    </Component>
  )
}

// Narrow container for text-heavy content
export function ProseContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Container size="md" className={cn('prose prose-lg max-w-none', className)}>
      {children}
    </Container>
  )
}

export default Container
