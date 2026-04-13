'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { FlaskConical, ArrowRight } from 'lucide-react'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

function BeakerAnimation() {
  return (
    <div className="relative mx-auto h-72 w-40 sm:h-80 sm:w-48">
      {/* Glass beaker */}
      <div
        className="absolute inset-x-0 bottom-0 mx-auto h-56 w-36 rounded-b-[2rem] rounded-t-sm border border-[#c9a227]/20 sm:h-64 sm:w-40"
        style={{
          background:
            'linear-gradient(180deg, rgba(26,15,46,0.4) 0%, rgba(10,8,12,0.8) 100%)',
          boxShadow:
            'inset -12px 0 24px rgba(0,0,0,0.5), inset 8px 0 16px rgba(255,255,255,0.04), 0 0 40px rgba(201,162,39,0.15)',
        }}
      >
        {/* Liquid fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-b-[2rem]"
          initial={{ height: '15%' }}
          animate={{ height: ['15%', '40%', '35%'] }}
          transition={{ duration: 8, times: [0, 0.7, 1], ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }}
          style={{
            background:
              'linear-gradient(180deg, rgba(201,162,39,0.25) 0%, rgba(139,115,85,0.45) 100%)',
          }}
        >
          <motion.div
            className="absolute left-0 right-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #c9a227, transparent)' }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <div
          className="absolute bottom-4 left-4 top-4 w-px opacity-30"
          style={{ background: 'linear-gradient(180deg, transparent, #c9a227, transparent)' }}
        />
      </div>

      {/* Droplets falling */}
      {[
        { color: '#c9a227', delay: 0 },
        { color: '#a69b8a', delay: 1.5 },
        { color: '#d4af37', delay: 3 },
      ].map((d) => (
        <motion.div
          key={d.delay}
          className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 35%, #fff 0%, ${d.color} 40%, ${d.color} 100%)`,
            boxShadow: `0 0 12px ${d.color}`,
            top: 0,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: [0, 160, 160], opacity: [0, 1, 0], scale: [0.8, 1, 0.4] }}
          transition={{
            duration: 2.5,
            delay: d.delay,
            repeat: Infinity,
            repeatDelay: 4,
            ease: [0.25, 0.1, 0.25, 1],
            times: [0, 0.85, 1],
          }}
        />
      ))}

      {/* Bubbles */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-[#c9a227]/20"
          style={{ left: `${35 + i * 10}%`, bottom: `${15 + i * 8}%`, width: 4 + i * 2, height: 4 + i * 2 }}
          animate={{ y: [0, -50 - i * 15], opacity: [0.3, 0], scale: [1, 1.5] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export function LaboratorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0a080c] py-28 lg:py-36"
    >
      {/* Background aura */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[60vh] w-[60vh] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #1a0f2e 0%, transparent 60%)' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Beaker floats freely */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE_LUXURY }}
            className="order-2 flex justify-center lg:order-1"
          >
            <BeakerAnimation />
          </motion.div>

          {/* Right: Content */}
          <div className="order-1 text-center lg:order-2 lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE_LUXURY }}
              className="mb-4 block text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a]"
            >
              The Laboratory
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
              className="font-display text-4xl leading-[1.05] tracking-tight text-[#f5f3ef] sm:text-5xl lg:text-6xl"
            >
              Become the
              <br />
              <span className="italic text-[#c9a227]">Alchemist</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXURY }}
              className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#a69b8a] lg:mx-0"
            >
              Blend from 33 sacred oils. Our safety engine validates every combination
              in real time. Purchase your formula — or share it with the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE_LUXURY }}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link
                href="/mixing-atelier"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#c9a227] px-8 py-4 text-[0.75rem] font-medium uppercase tracking-[0.15em] text-[#0a080c] transition-colors hover:bg-transparent hover:text-[#c9a227]"
              >
                <span className="relative z-10">Enter the Atelier</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/community-blends"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-[#c9a227] px-8 py-4 text-[0.75rem] font-medium uppercase tracking-[0.15em] text-[#c9a227] transition-colors hover:bg-[#c9a227] hover:text-[#0a080c]"
              >
                <span className="relative z-10">Explore Creations</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
