'use client'

import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

export function HeroSection() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const y = useTransform(scrollY, [0, 400], [0, -120])

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 25, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 25, damping: 30 })

  const auroraX = useTransform(springX, [0, 1], ['-12%', '12%'])
  const auroraY = useTransform(springY, [0, 1], ['-12%', '12%'])

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-[#050505]"
      onMouseMove={(e) => {
        mouseX.set(e.clientX / window.innerWidth)
        mouseY.set(e.clientY / window.innerHeight)
      }}
    >
      {/* Cinematic breathing aurora */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ x: auroraX, y: auroraY }}
      >
        <motion.div
          className="h-[150vh] w-[150vh] rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(26,15,46,0.55) 0%, rgba(5,5,5,0) 60%)',
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(201,162,39,0.12) 0%, transparent 45%)',
          }}
          animate={{ scale: [1.15, 1, 1.15] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Grain texture overlay — subtle */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-20 text-center"
        style={{ opacity, y }}
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-[0.6rem] uppercase tracking-[0.4em] text-[#a69b8a]"
        >
          Est. 2026 — Central Coast, NSW
        </motion.span>

        <div className="overflow-hidden">
          <motion.h1
            className="font-display text-[clamp(3.2rem,11vw,10rem)] leading-[0.85] tracking-[-0.04em] text-[#f5f3ef]"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Essence
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            className="font-display text-[clamp(3.2rem,11vw,10rem)] leading-[0.85] tracking-[-0.04em] text-[#c9a227]"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
          >
            <span className="italic">Transcended</span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-12 max-w-md text-sm font-light leading-relaxed tracking-wide text-[#a69b8a]"
        >
          Australian organic essential oils. Paired with sacred crystals.
          Culminating in jewelry that carries intention.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-14 flex flex-col gap-4 sm:flex-row sm:gap-6"
        >
          <Link
            href="/oils"
            className="group relative overflow-hidden border border-[#c9a227] bg-[#c9a227] px-12 py-4 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#050505] transition-all hover:bg-transparent hover:text-[#c9a227]"
          >
            Enter the Collection
          </Link>
          <Link
            href="/mixing-atelier"
            className="group relative overflow-hidden border border-[#f5f3ef]/20 px-12 py-4 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#f5f3ef] transition-all hover:border-[#c9a227] hover:text-[#c9a227]"
          >
            Become the Alchemist
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <motion.div
          className="h-20 w-px bg-gradient-to-b from-[#c9a227] to-transparent"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
