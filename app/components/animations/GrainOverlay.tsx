'use client'

import { cn } from '../../lib/utils'

export interface GrainOverlayProps {
  opacity?: number
  className?: string
}

export function GrainOverlay({ opacity = 0.025, className }: GrainOverlayProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 pointer-events-none z-[9999]',
        'grain-overlay',
        className
      )}
      style={{ opacity }}
      aria-hidden="true"
    />
  )
}

// Static grain for backgrounds
export function GrainBackground({
  className,
  opacity = 0.03,
}: GrainOverlayProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none',
        className
      )}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
      aria-hidden="true"
    />
  )
}

export default GrainOverlay
