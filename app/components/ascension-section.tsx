'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

export function AscensionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-20%' })
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const beamScale = useTransform(scrollYProgress, [0, 0.5], [0.5, 1])
  const contentY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status !== 'idle') return
    setStatus('submitting')
    setTimeout(() => {
      setStatus('success')
      setEmail('')
    }, 800)
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] py-32 lg:py-40"
    >
      {/* Central shaft of light */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
        <motion.div
          className="h-full w-[2px]"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(201,162,39,0.35) 20%, rgba(201,162,39,0.35) 60%, transparent 100%)',
            scaleY: beamScale,
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 2, ease: EASE_LUXURY }}
        />
        <motion.div
          className="absolute h-full w-[120px] lg:w-[160px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(201,162,39,0.12) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 0.3, ease: EASE_LUXURY }}
        />
      </div>

      {/* Ascending particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-px rounded-full bg-[#c9a227]"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: '-5%',
              boxShadow: '0 0 8px rgba(201,162,39,0.8)',
            }}
            animate={{
              y: ['0vh', '-110vh'],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 6,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-2xl px-6 text-center lg:px-12"
        style={{ y: contentY }}
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_LUXURY }}
          className="mb-6 block text-[0.6rem] uppercase tracking-[0.3em] text-[#a69b8a]"
        >
          The Inner Circle
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
          className="font-display text-4xl leading-[1.05] tracking-tight text-[#f5f3ef] sm:text-5xl lg:text-6xl"
        >
          Join the
          <br />
          <span className="italic text-[#c9a227]">Ascension</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXURY }}
          className="mx-auto mt-6 max-w-md text-base font-light leading-relaxed text-[#a69b8a]"
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
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === 'success'}
              className="w-full border-0 border-b border-[#c9a227]/20 bg-transparent px-2 py-5 text-center text-lg text-[#f5f3ef] placeholder:text-[#a69b8a]/30 focus:border-[#c9a227] focus:outline-none focus:ring-0 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={status !== 'idle'}
            className="group mx-auto mt-10 inline-flex items-center gap-3 border border-[#c9a227] bg-[#c9a227] px-12 py-4 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#050505] transition-all hover:bg-transparent hover:text-[#c9a227] disabled:cursor-not-allowed"
          >
            {status === 'success' ? (
              <>
                <Check className="h-4 w-4" />
                Welcome to the Circle
              </>
            ) : status === 'submitting' ? (
              <span>Entering...</span>
            ) : (
              <>
                Enter the Sanctuary
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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

          <p className="mt-5 text-[0.55rem] uppercase tracking-[0.15em] text-[#a69b8a]/40">
            No correspondence without value.
          </p>
        </motion.form>
      </motion.div>
    </section>
  )
}
