'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { RefreshCcw, Share2, Droplets, ArrowRight, Sparkles } from 'lucide-react'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

// An orbiting ring particle
function OrbitParticle({
  radius,
  duration,
  delay,
  size,
  color,
}: {
  radius: number
  duration: number
  delay: number
  size: number
  color: string
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 rounded-full"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
      animate={{
        x: [
          0,
          radius,
          0,
          -radius,
          0,
        ],
        y: [
          -radius,
          0,
          radius,
          0,
          -radius,
        ],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

// A glowing ring with orbiting particles
function GlowingRing({
  radius,
  particleCount,
  baseDuration,
  color,
  opacity = 0.3,
}: {
  radius: number
  particleCount: number
  baseDuration: number
  color: string
  opacity?: number
}) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
      style={{
        width: radius * 2,
        height: radius * 2,
        borderColor: color,
        opacity,
      }}
    >
      {Array.from({ length: particleCount }).map((_, i) => (
        <OrbitParticle
          key={i}
          radius={radius}
          duration={baseDuration + i * 3}
          delay={(i / particleCount) * baseDuration}
          size={4 + (i % 3) * 2}
          color={color}
        />
      ))}
    </div>
  )
}

// Count up animation
function CountUp({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setValue(Math.floor(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

export function CircleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0a080c] py-32 lg:py-48"
    >
      {/* Deep radial glow behind mandala */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[100vh] w-[100vh] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(26,15,46,0.4) 0%, rgba(10,8,12,0.8) 50%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20 text-center lg:mb-28">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
            className="mb-6 block text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a]"
          >
            The Circle
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight text-[#f5f3ef]"
          >
            Join the
            <br />
            <span className="italic text-[#c9a227]">Sanctuary</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXURY }}
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[#a69b8a]"
          >
            Three rings. One ecosystem. Unlock cheaper refills forever. Share your
            blends and earn. Return your bottles and become part of the cycle.
          </motion.p>
        </div>

        {/* Mandala + Cards Layout */}
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: The Living Mandala */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.4, ease: EASE_LUXURY }}
            className="relative mx-auto aspect-square w-full max-w-md"
          >
            {/* Outermost ring — Community */}
            <GlowingRing
              radius={220}
              particleCount={4}
              baseDuration={24}
              color="rgba(201, 162, 39, 0.5)"
              opacity={0.15}
            />

            {/* Middle ring — Refill */}
            <GlowingRing
              radius={160}
              particleCount={3}
              baseDuration={18}
              color="rgba(232, 213, 163, 0.5)"
              opacity={0.2}
            />

            {/* Inner ring — Return/Credit */}
            <GlowingRing
              radius={100}
              particleCount={2}
              baseDuration={12}
              color="rgba(139, 115, 85, 0.6)"
              opacity={0.25}
            />

            {/* Center core */}
            <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#c9a227]/40 bg-[#0a080c]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="h-6 w-6 text-[#c9a227]" />
              </motion.div>
            </div>

            {/* Floating stat labels around rings */}
            <motion.div
              className="absolute right-0 top-0 rounded-sm border border-[#c9a227]/20 bg-[#0a080c]/80 px-4 py-3 backdrop-blur-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: EASE_LUXURY }}
            >
              <div className="font-display text-2xl text-[#c9a227]">
                <CountUp target={847} prefix="$" />
              </div>
              <div className="text-[0.6rem] uppercase tracking-[0.15em] text-[#a69b8a]">
                Earned this week
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-8 left-0 rounded-sm border border-[#c9a227]/20 bg-[#0a080c]/80 px-4 py-3 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8, ease: EASE_LUXURY }}
            >
              <div className="font-display text-2xl text-[#c9a227]">
                <CountUp target={3421} />
              </div>
              <div className="text-[0.6rem] uppercase tracking-[0.15em] text-[#a69b8a]">
                Bottles returned
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Feature cards */}
          <div className="space-y-8">
            {/* Refill Circle Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXURY }}
              className="group relative overflow-hidden rounded-sm border border-[#c9a227]/10 bg-[#0a080c]/40 p-8 transition-colors hover:border-[#c9a227]/30"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a227]/20">
                <RefreshCcw className="h-6 w-6 text-[#c9a227]" />
              </div>
              <h3 className="mb-3 font-display text-2xl text-[#f5f3ef]">
                Unlock Forever Refills
              </h3>
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#a69b8a]">
                Purchase a 30ml bottle and unlock the Refill Circle. Return your empty
                Miron violetglass vessel for a $5 credit. The more you return, the less
                you pay.
              </p>
              <div className="flex items-center gap-6 text-[0.7rem] uppercase tracking-[0.1em] text-[#a69b8a]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
                  $35 Standard Refill
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
                  $5 Return Credit
                </span>
              </div>
              <Link
                href="/refill"
                className="mt-8 inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.15em] text-[#c9a227] transition-colors hover:text-[#f5f3ef]"
              >
                Enter the Circle
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Community Blends Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE_LUXURY }}
              className="group relative overflow-hidden rounded-sm border border-[#c9a227]/10 bg-[#0a080c]/40 p-8 transition-colors hover:border-[#c9a227]/30"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a227]/20">
                <Share2 className="h-6 w-6 text-[#c9a227]" />
              </div>
              <h3 className="mb-3 font-display text-2xl text-[#f5f3ef]">
                Blend. Share. Earn.
              </h3>
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#a69b8a]">
                Create a masterpiece in the Atelier. Share your unique code with
                friends, followers, or clients. Earn 10% of every purchase made with
                your blend.
              </p>
              <div className="flex items-center gap-6 text-[0.7rem] uppercase tracking-[0.1em] text-[#a69b8a]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
                  Unique Share Code
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
                  10% Per Sale
                </span>
              </div>
              <Link
                href="/community-blends"
                className="mt-8 inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.15em] text-[#c9a227] transition-colors hover:text-[#f5f3ef]"
              >
                Start Earning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Sustainability Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: EASE_LUXURY }}
              className="group relative overflow-hidden rounded-sm border border-[#c9a227]/10 bg-[#0a080c]/40 p-8 transition-colors hover:border-[#c9a227]/30"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a227]/20">
                <Droplets className="h-6 w-6 text-[#c9a227]" />
              </div>
              <h3 className="mb-3 font-display text-2xl text-[#f5f3ef]">
                Close the Loop
              </h3>
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#a69b8a]">
                Every returned bottle is sterilized, refilled, and reborn. Zero waste.
                Pure intention. Your ritual becomes part of something larger than
                yourself.
              </p>
              <div className="flex items-center gap-6 text-[0.7rem] uppercase tracking-[0.1em] text-[#a69b8a]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
                  Zero Waste
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
                  Reusable Miron Glass
                </span>
              </div>
              <Link
                href="/sustainability"
                className="mt-8 inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.15em] text-[#c9a227] transition-colors hover:text-[#f5f3ef]"
              >
                Our Promise
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
