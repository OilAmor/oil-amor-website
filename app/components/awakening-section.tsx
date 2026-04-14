'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function AwakeningSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const formY = useTransform(scrollYProgress, [0, 0.5], ['40%', '0%'])
  const formOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  const crystalY = useTransform(scrollYProgress, [0.3, 0.7], ['30%', '0%'])
  const crystalOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1])
  const glowScale = useTransform(scrollYProgress, [0.2, 0.6], [0.6, 1.4])
  const textOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1])
  const textY = useTransform(scrollYProgress, [0.5, 0.8], [60, 0])

  return (
    <section ref={sectionRef} className="relative h-[220vh] bg-[#050505]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Central glow that intensifies */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ scale: glowScale }}
        >
          <div
            className="h-[100vh] w-[100vh] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 60%)',
            }}
          />
        </motion.div>

        {/* Abstract oil form — dark, liquid */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{ y: formY, opacity: formOpacity }}
        >
          <svg
            width="360"
            height="360"
            viewBox="0 0 360 360"
            className="opacity-80"
          >
            <defs>
              <linearGradient id="oilGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a1520" />
                <stop offset="100%" stopColor="#050505" />
              </linearGradient>
              <filter id="turbulence">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.015"
                  numOctaves="3"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="20"
                />
              </filter>
            </defs>
            <circle
              cx="180"
              cy="180"
              r="140"
              fill="url(#oilGrad)"
              filter="url(#turbulence)"
            />
          </svg>
        </motion.div>

        {/* Abstract crystal form — geometric, luminous */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{
            y: crystalY,
            opacity: crystalOpacity,
          }}
        >
          <svg width="320" height="320" viewBox="0 0 320 320" className="drop-shadow-[0_0_60px_rgba(201,162,39,0.3)]">
            <defs>
              <linearGradient id="crystalGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(232,213,163,0.9)" />
                <stop offset="50%" stopColor="rgba(201,162,39,0.5)" />
                <stop offset="100%" stopColor="rgba(139,115,85,0.3)" />
              </linearGradient>
            </defs>
            <polygon
              points="160,20 280,120 220,300 100,300 40,120"
              fill="url(#crystalGrad)"
              stroke="rgba(201,162,39,0.4)"
              strokeWidth="1"
            />
            <line x1="160" y1="20" x2="160" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="40" y1="120" x2="280" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="100" y1="300" x2="220" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="220" y1="300" x2="100" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Text overlay */}
        <motion.div
          className="pointer-events-none absolute bottom-[15%] z-10 max-w-xl px-6 text-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          <span className="mb-4 block text-[0.6rem] uppercase tracking-[0.3em] text-[#a69b8a]">
            The Awakening
          </span>
          <h2 className="font-display text-3xl leading-[1.1] tracking-tight text-[#f5f3ef] sm:text-4xl lg:text-5xl">
            From Oil
            <br />
            to <span className="italic text-[#c9a227]">Essence</span>
          </h2>
          <p className="mt-6 text-sm font-light leading-relaxed text-[#a69b8a] sm:text-base">
            Every bottle holds a promise. Every drop carries intention.
            What begins as oil becomes something sacred in your hands.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
