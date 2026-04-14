'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

export function SectionTransition({
  variant = 'wave',
  flip = false,
  fill = '#0a080c',
  accent = true,
}: {
  variant?: 'wave' | 'curve' | 'arch' | 'peak'
  flip?: boolean
  fill?: string
  accent?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  const paths: Record<string, { bg: string; line: string }> = {
    wave: {
      bg: 'M0,64 C360,120 720,8 1080,64 C1440,120 1800,8 2160,64 L2160,200 L0,200 Z',
      line: 'M0,64 C360,120 720,8 1080,64 C1440,120 1800,8 2160,64',
    },
    curve: {
      bg: 'M0,120 C540,0 1620,200 2160,120 L2160,200 L0,200 Z',
      line: 'M0,120 C540,0 1620,200 2160,120',
    },
    arch: {
      bg: 'M0,160 Q1080,40 2160,160 L2160,200 L0,200 Z',
      line: 'M0,160 Q1080,40 2160,160',
    },
    peak: {
      bg: 'M0,120 L1080,40 L2160,120 L2160,200 L0,200 Z',
      line: 'M0,120 L1080,40 L2160,120',
    },
  }

  const { bg, line } = paths[variant]
  const pathLength = 2400

  return (
    <div
      ref={ref}
      className="relative z-10 h-20 w-full overflow-hidden sm:h-24 lg:h-32"
      style={{ transform: flip ? 'rotate(180deg)' : undefined }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 2160 200"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={`grad-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity="0.9" />
            <stop offset="100%" stopColor={fill} stopOpacity="1" />
          </linearGradient>
        </defs>

        <path d={bg} fill={`url(#grad-${variant})`} />

        {accent && (
          <motion.path
            d={line}
            fill="none"
            stroke="rgba(201,162,39,0.3)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{
              pathLength: { duration: 1.8, ease: EASE_LUXURY },
              opacity: { duration: 0.6, ease: EASE_LUXURY },
            }}
          />
        )}

        {accent && (
          <motion.path
            d={line}
            fill="none"
            stroke="rgba(201,162,39,0.08)"
            strokeWidth="20"
            filter="blur(8px)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{
              pathLength: { duration: 1.8, delay: 0.2, ease: EASE_LUXURY },
              opacity: { duration: 0.6, delay: 0.2, ease: EASE_LUXURY },
            }}
          />
        )}
      </svg>
    </div>
  )
}
