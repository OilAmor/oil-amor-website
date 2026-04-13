'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { RefreshCcw, Share2, Droplets, ArrowRight, Sparkles } from 'lucide-react'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

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
        x: [0, radius, 0, -radius, 0],
        y: [-radius, 0, radius, 0, -radius],
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
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        width: radius * 2,
        height: radius * 2,
        border: `1px solid ${color}`,
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

function OrbitCard({
  icon: Icon,
  title,
  description,
  href,
  cta,
  position,
  delay,
}: {
  icon: React.ElementType
  title: string
  description: string
  href: string
  cta: string
  position: 'left' | 'right' | 'bottom'
  delay: number
}) {
  const isLeft = position === 'left'
  const isRight = position === 'right'
  const isBottom = position === 'bottom'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease: EASE_LUXURY }}
      className={`
        group absolute w-72 rounded-[2rem] rounded-tl-sm border border-[#c9a227]/10 
        bg-[#0a080c]/60 p-8 backdrop-blur-sm transition-all 
        hover:border-[#c9a227]/30 hover:bg-[#0a080c]/80
        lg:w-80
        ${isLeft ? 'left-0 top-[8%] lg:left-[5%] lg:top-[15%]' : ''}
        ${isRight ? 'right-0 top-[8%] lg:right-[5%] lg:top-[15%]' : ''}
        ${isBottom ? 'bottom-[5%] left-1/2 -translate-x-1/2 lg:bottom-[8%]' : ''}
      `}
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a227]/20">
        <Icon className="h-5 w-5 text-[#c9a227]" />
      </div>
      <h3 className="mb-2 font-display text-xl text-[#f5f3ef]">{title}</h3>
      <p className="mb-5 text-sm leading-relaxed text-[#a69b8a]/90">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.15em] text-[#c9a227] transition-colors hover:text-[#f5f3ef]"
      >
        {cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  )
}

export function CircleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0a080c] py-40 lg:h-screen lg:min-h-[900px] lg:py-0"
    >
      {/* Deep radial glow behind mandala */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[120vh] w-[120vh] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(26,15,46,0.5) 0%, rgba(10,8,12,0.9) 50%, transparent 70%)',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: EASE_LUXURY }}
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 text-center lg:absolute lg:top-16 lg:mb-0">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
            className="mb-4 block text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a]"
          >
            The Circle
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
            className="font-display text-4xl leading-[1.05] tracking-tight text-[#f5f3ef] sm:text-5xl lg:text-6xl"
          >
            Join the <span className="italic text-[#c9a227]">Sanctuary</span>
          </motion.h2>
        </div>

        {/* Mandala + Orbiting Cards Container */}
        <div className="relative flex w-full items-center justify-center lg:h-[600px]">
          {/* The Living Mandala — centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.6, ease: EASE_LUXURY }}
            className="relative aspect-square w-[320px] sm:w-[400px] lg:w-[480px]"
          >
            {/* Outermost ring — Community */}
            <GlowingRing
              radius={160}
              particleCount={4}
              baseDuration={24}
              color="rgba(201, 162, 39, 0.5)"
              opacity={0.15}
            />
            <GlowingRing
              radius={180}
              particleCount={3}
              baseDuration={30}
              color="rgba(201, 162, 39, 0.3)"
              opacity={0.1}
            />

            {/* Middle ring — Refill */}
            <GlowingRing
              radius={120}
              particleCount={3}
              baseDuration={18}
              color="rgba(232, 213, 163, 0.5)"
              opacity={0.2}
            />
            <GlowingRing
              radius={100}
              particleCount={2}
              baseDuration={14}
              color="rgba(232, 213, 163, 0.4)"
              opacity={0.15}
            />

            {/* Inner ring — Return/Credit */}
            <GlowingRing
              radius={60}
              particleCount={2}
              baseDuration={10}
              color="rgba(139, 115, 85, 0.6)"
              opacity={0.25}
            />

            {/* Center core */}
            <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#c9a227]/30 bg-[#0a080c] shadow-[0_0_60px_rgba(201,162,39,0.2)]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="h-7 w-7 text-[#c9a227]" />
              </motion.div>
            </div>
          </motion.div>

          {/* Desktop orbit cards */}
          <div className="hidden lg:block">
            <OrbitCard
              icon={RefreshCcw}
              title="Forever Refills"
              description="Return your Miron vessel for a $5 credit. Unlock cheaper refills with every return."
              href="/refill"
              cta="Enter the Circle"
              position="left"
              delay={0.3}
            />
            <OrbitCard
              icon={Share2}
              title="Blend. Share. Earn."
              description="Create in the Atelier. Share your code. Earn 10% on every purchase made with your blend."
              href="/community-blends"
              cta="Start Earning"
              position="right"
              delay={0.5}
            />
            <OrbitCard
              icon={Droplets}
              title="Close the Loop"
              description="Zero waste. Every bottle is sterilized, refilled, and reborn into the cycle."
              href="/sustainability"
              cta="Our Promise"
              position="bottom"
              delay={0.7}
            />
          </div>
        </div>

        {/* Mobile cards — stacked below mandala */}
        <div className="mt-12 flex w-full flex-col gap-5 lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_LUXURY }}
            className="rounded-[2rem] rounded-tl-sm border border-[#c9a227]/10 bg-[#0a080c]/60 p-6"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a227]/20">
              <RefreshCcw className="h-4 w-4 text-[#c9a227]" />
            </div>
            <h3 className="mb-1 font-display text-lg text-[#f5f3ef]">Forever Refills</h3>
            <p className="text-sm text-[#a69b8a]/80">Return your Miron vessel for a $5 credit.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE_LUXURY }}
            className="rounded-[2rem] rounded-tr-sm border border-[#c9a227]/10 bg-[#0a080c]/60 p-6"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a227]/20">
              <Share2 className="h-4 w-4 text-[#c9a227]" />
            </div>
            <h3 className="mb-1 font-display text-lg text-[#f5f3ef]">Blend. Share. Earn.</h3>
            <p className="text-sm text-[#a69b8a]/80">Earn 10% on every purchase with your code.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE_LUXURY }}
            className="rounded-[2rem] rounded-bl-sm border border-[#c9a227]/10 bg-[#0a080c]/60 p-6"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a227]/20">
              <Droplets className="h-4 w-4 text-[#c9a227]" />
            </div>
            <h3 className="mb-1 font-display text-lg text-[#f5f3ef]">Close the Loop</h3>
            <p className="text-sm text-[#a69b8a]/80">Zero waste. Every bottle is reborn.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
