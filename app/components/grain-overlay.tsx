'use client'

import { useEffect, useState } from 'react'

export function GrainOverlay() {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Don't render on server or if reduced motion is preferred
  if (!mounted || reducedMotion) {
    return null
  }

  return (
    <div 
      className="grain-overlay" 
      aria-hidden="true"
    />
  )
}
