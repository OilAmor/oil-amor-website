'use client'

import { motion } from 'framer-motion'

interface SectionTransitionProps {
  type?: 'wave' | 'curve' | 'arch' | 'peak' | 'mist'
  flip?: boolean
  className?: string
}

export function SectionTransition({
  type = 'wave',
  flip = false,
  className = '',
}: SectionTransitionProps) {
  const paths = {
    wave: 'M0,96 C320,160 640,32 960,96 C1280,160 1600,32 1920,96 L1920,192 L0,192 Z',
    curve: 'M0,0 C640,128 1280,128 1920,0 L1920,192 L0,192 Z',
    arch: 'M0,192 C480,32 1440,32 1920,192 L1920,192 L0,192 Z',
    peak: 'M0,192 L960,32 L1920,192 L1920,192 L0,192 Z',
    mist: 'M0,128 C480,64 960,192 1440,96 C1680,48 1800,80 1920,128 L1920,192 L0,192 Z',
  }

  const gradientId = `transition-gradient-${type}-${flip ? 'flip' : 'norm'}`

  return (
    <div
      className={`pointer-events-none relative z-20 h-20 w-full overflow-hidden sm:h-28 lg:h-36 ${className}`}
      style={{ transform: flip ? 'rotate(180deg)' : undefined, marginTop: flip ? '-1px' : '-1px', marginBottom: flip ? '-1px' : '-1px' }}
    >
      <svg
        viewBox="0 0 1920 192"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a080c" />
            <stop offset="40%" stopColor="#0f0c12" />
            <stop offset="100%" stopColor="#0a080c" />
          </linearGradient>
        </defs>
        <motion.path
          d={paths[type]}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        />
      </svg>
      {/* Gold accent line following the curve */}
      <svg
        viewBox="0 0 1920 192"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <motion.path
          d={paths[type].replace(' Z', '')}
          fill="none"
          stroke="rgba(201, 162, 39, 0.2)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {/* Inner glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.08) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
