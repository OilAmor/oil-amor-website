'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [dropletHit, setDropletHit] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 30 })
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 30 })

  const auroraX = useTransform(smoothX, [0, 1], ['-10%', '10%'])
  const auroraY = useTransform(smoothY, [0, 1], ['-10%', '10%'])

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Orchestrate the entrance sequence
  useEffect(() => {
    if (!mounted) return

    const timers = [
      setTimeout(() => setDropletHit(true), 2200),
      setTimeout(() => setShowContent(true), 2800),
    ]

    return () => timers.forEach(clearTimeout)
  }, [mounted])

  if (!mounted) {
    return (
      <section className="h-screen w-full bg-[#0a080c] flex items-center justify-center">
        <div className="sr-only">Oil Amor — Essence Transcended</div>
      </section>
    )
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0a080c]">
      {/* ===== Fluid Aurora — Follows Cursor ===== */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(201, 162, 39, 0.12) 0%, rgba(26, 15, 46, 0.2) 35%, transparent 70%)',
          x: auroraX,
          y: auroraY,
        }}
      />

      {/* ===== Deep Void Orbs ===== */}
      <motion.div
        className="pointer-events-none absolute -right-[20vw] top-[10vh] h-[60vw] w-[60vw] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #1a0f2e 0%, transparent 60%)',
        }}
        animate={{ scale: [1, 1.05, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="pointer-events-none absolute -left-[15vw] bottom-[5vh] h-[50vw] w-[50vw] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #141218 0%, transparent 60%)',
        }}
        animate={{ scale: [1, 1.03, 1], rotate: [0, -10, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* ===== SVG Displacement Filter for Liquid Ripples ===== */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="liquid-ripple">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ===== The Droplet ===== */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative z-20"
          initial={{ y: '-40vh', opacity: 0, scale: 0.5 }}
          animate={
            dropletHit
              ? { y: 0, opacity: 0, scale: 0.2 }
              : { y: 0, opacity: 1, scale: 1 }
          }
          transition={{
            y: { duration: 2, ease: [0.25, 0.1, 0.25, 1] },
            opacity: { duration: 0.6, delay: 1.8 },
            scale: { duration: 0.8, delay: 1.8 },
          }}
        >
          <div
            className="h-6 w-6 rounded-full shadow-2xl"
            style={{
              background:
                'radial-gradient(circle at 35% 35%, #e8d5a3 0%, #c9a227 40%, #8b7355 100%)',
              boxShadow: '0 0 30px rgba(201, 162, 39, 0.6)',
            }}
          />
        </motion.div>
      </div>

      {/* ===== Impact Ripples ===== */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-[#c9a227]/40"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={
              dropletHit
                ? { width: 800 + i * 400, height: 800 + i * 400, opacity: [0, 0.6, 0] }
                : {}
            }
            transition={{
              duration: 2.5,
              delay: i * 0.25,
              ease: EASE_LUXURY,
            }}
            style={{
              boxShadow: `inset 0 0 60px rgba(201, 162, 39, ${0.15 - i * 0.05})`,
            }}
          />
        ))}
      </div>

      {/* ===== Headline — Emerges Through Liquid ===== */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={
            showContent
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : {}
          }
          transition={{ duration: 1.2, ease: EASE_LUXURY, delay: 0 }}
          className="mb-8 text-[0.625rem] uppercase tracking-[0.35em] text-[#a69b8a]"
        >
          Est. 2026 — Central Coast, NSW
        </motion.p>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 60, filter: 'blur(20px)', scale: 0.95 }}
          animate={
            showContent
              ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
              : {}
          }
          transition={{ duration: 1.6, ease: EASE_LUXURY, delay: 0.2 }}
          className="font-display text-[clamp(3.5rem,12vw,10rem)] leading-[0.9] tracking-[-0.04em] text-[#f5f3ef]"
        >
          Essence
          <br />
          <span className="italic text-[#c9a227]">Transcended</span>
        </motion.h1>

        {/* Subline — Writes Itself */}
        <motion.p
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={
            showContent
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : {}
          }
          transition={{ duration: 1.2, ease: EASE_LUXURY, delay: 0.8 }}
          className="mt-10 max-w-lg text-sm leading-relaxed text-[#a69b8a]"
        >
          Essential oils that culminate in crystal jewelry.
          <br />
          A journey from bottle to keepsake.
        </motion.p>

        {/* CTAs — Floating Runes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: EASE_LUXURY, delay: 1.2 }}
          className="mt-14 flex flex-col items-center gap-5 sm:flex-row sm:gap-8"
        >
          <Link
            href="/oils"
            className="group relative overflow-hidden btn-luxury px-10 py-4"
          >
            <span className="relative z-10">Enter the Collection</span>
            <motion.div
              className="absolute inset-0 bg-[#f5f3ef]"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.5, ease: EASE_LUXURY }}
            />
          </Link>

          <Link
            href="/mixing-atelier"
            className="group relative overflow-hidden btn-luxury-dark px-10 py-4"
          >
            <span className="relative z-10">Become the Alchemist</span>
            <motion.div
              className="absolute inset-0 bg-[#c9a227]"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.5, ease: EASE_LUXURY }}
            />
          </Link>
        </motion.div>
      </div>

      {/* ===== Scroll Indicator ===== */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={showContent ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="h-16 w-px bg-gradient-to-b from-[#c9a227] to-transparent"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
