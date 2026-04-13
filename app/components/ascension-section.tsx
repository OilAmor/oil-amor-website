'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

// Floating crystal shard
function CrystalShard({
  delay,
  x,
  size,
  color,
}: {
  delay: number
  x: number
  size: number
  color: string
}) {
  return (
    <motion.div
      className="absolute rounded-sm"
      style={{
        left: `${x}%`,
        bottom: '-10%',
        width: size,
        height: size * 1.6,
        background: color,
        clipPath: 'polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)',
        opacity: 0.6,
      }}
      animate={{
        y: ['0vh', '-120vh'],
        rotate: [0, 15, -10, 5, 0],
        opacity: [0, 0.8, 0.6, 0],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

export function AscensionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-20%' })
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status !== 'idle') return
    setStatus('submitting')
    // Simulate submission - in production, wire this to your newsletter API
    setTimeout(() => {
      setStatus('success')
      setEmail('')
    }, 800)
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0a080c] py-40 lg:py-56"
    >
      {/* Central shaft of light */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
        <motion.div
          className="h-[120%] w-[2px] opacity-30"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, #c9a227 20%, #c9a227 60%, transparent 100%)',
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={isInView ? { opacity: 0.3, scaleY: 1 } : {}}
          transition={{ duration: 2, ease: EASE_LUXURY }}
        />
        <motion.div
          className="absolute h-[120%] w-[80px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(201,162,39,0.12) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 0.3, ease: EASE_LUXURY }}
        />
      </div>

      {/* Ascending crystals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { delay: 0, x: 15, size: 8, color: '#c9a227' },
          { delay: 2, x: 25, size: 12, color: '#e8d5a3' },
          { delay: 4, x: 70, size: 10, color: '#c9a227' },
          { delay: 1.5, x: 80, size: 14, color: '#8b7355' },
          { delay: 3.5, x: 40, size: 6, color: '#d4af37' },
          { delay: 5, x: 60, size: 9, color: '#c9a227' },
          { delay: 6, x: 10, size: 11, color: '#a69b8a' },
          { delay: 7, x: 90, size: 7, color: '#e8d5a3' },
        ].map((shard, i) => (
          <CrystalShard key={i} {...shard} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_LUXURY }}
          className="mb-6 block text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a]"
        >
          The Inner Circle
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
          className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight text-[#f5f3ef]"
        >
          Join the
          <br />
          <span className="italic text-[#c9a227]">Ascension</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXURY }}
          className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-[#a69b8a]"
        >
          First access to limited editions. Invitations to private blending events.
          And the occasional revelation reserved for those who walk the path.
        </motion.p>

        {/* Altar input */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE_LUXURY }}
          className="mx-auto mt-14 max-w-md"
        >
          <div className="relative">
            {/* Glowing underline */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent" />

            <div className="flex items-center gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={status === 'success'}
                className="flex-1 border-0 border-b border-[#c9a227]/20 bg-transparent px-2 py-4 text-center text-lg text-[#f5f3ef] placeholder:text-[#a69b8a]/40 focus:border-[#c9a227] focus:outline-none focus:ring-0 disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status !== 'idle'}
            className="group mx-auto mt-8 inline-flex items-center gap-3 overflow-hidden btn-luxury px-10 py-4 disabled:cursor-not-allowed"
          >
            {status === 'success' ? (
              <>
                <Check className="relative z-10 h-4 w-4" />
                <span className="relative z-10">Welcome to the Circle</span>
              </>
            ) : status === 'submitting' ? (
              <>
                <span className="relative z-10">Entering...</span>
              </>
            ) : (
              <>
                <span className="relative z-10">Enter the Sanctuary</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {status === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-sm text-[#c9a227]"
            >
              Your invitation is on its way.
            </motion.p>
          )}

          <p className="mt-4 text-[0.6rem] uppercase tracking-[0.15em] text-[#a69b8a]/50">
            No correspondence without value.
          </p>
        </motion.form>
      </div>
    </section>
  )
}
