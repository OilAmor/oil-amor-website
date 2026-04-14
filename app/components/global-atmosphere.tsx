'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function GlobalAtmosphere() {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  if (!mounted || reducedMotion) return null

  return (
    <>
      {/* Film Grain */}
      <div
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Animated grain shift overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[9997]"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)'/%3E%3C/svg%3E")`,
        }}
        animate={{
          x: [0, -10, 5, -5, 0],
          y: [0, 5, -10, 5, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        aria-hidden="true"
      />

      {/* Light Leaks — Top Right */}
      <motion.div
        className="fixed -top-[20vh] -right-[20vh] h-[60vh] w-[60vh] rounded-full pointer-events-none z-[9996]"
        style={{
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.12) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.4, 0.5, 0.3],
          scale: [1, 1.2, 1.1, 1],
          x: [0, 20, -10, 0],
          y: [0, -15, 10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        aria-hidden="true"
      />

      {/* Light Leaks — Bottom Left */}
      <motion.div
        className="fixed -bottom-[10vh] -left-[10vh] h-[50vh] w-[50vh] rounded-full pointer-events-none z-[9996]"
        style={{
          background: 'radial-gradient(circle, rgba(139, 115, 85, 0.1) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
        animate={{
          opacity: [0.2, 0.4, 0.3, 0.35, 0.2],
          scale: [1, 1.15, 1.05, 1],
          x: [0, -15, 20, 0],
          y: [0, 10, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
        aria-hidden="true"
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[9995]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(10, 8, 12, 0.4) 100%)',
        }}
        aria-hidden="true"
      />
    </>
  )
}
