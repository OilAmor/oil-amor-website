'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

export function AwakeningSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // === Text 1: We do not sell oils.
  const text1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.15, 0.22], [0, 1, 1, 0])
  const text1Y = useTransform(scrollYProgress, [0, 0.08, 0.15, 0.22], [60, 0, 0, -60])
  const text1Blur = useTransform(scrollYProgress, [0, 0.08], [20, 0])

  // === Bottle
  const bottleOpacity = useTransform(scrollYProgress, [0.12, 0.20, 0.35, 0.45], [0, 1, 1, 0])
  const bottleScale = useTransform(scrollYProgress, [0.12, 0.25], [0.6, 1])
  const bottleBlur = useTransform(scrollYProgress, [0.12, 0.25], [30, 0])
  const bottleY = useTransform(scrollYProgress, [0.15, 0.35, 0.45], [40, 0, -40])

  // === Cap opening
  const capY = useTransform(scrollYProgress, [0.28, 0.38], [0, -40])
  const capRotate = useTransform(scrollYProgress, [0.28, 0.38], [0, -12])

  // === Vapor
  const vaporOpacity = useTransform(scrollYProgress, [0.30, 0.35, 0.42, 0.48], [0, 0.8, 0.6, 0])
  const vaporY = useTransform(scrollYProgress, [0.30, 0.48], [0, -120])

  // === Crystals assembly
  const crystalsOpacity = useTransform(scrollYProgress, [0.38, 0.48, 0.65, 0.72], [0, 1, 1, 0])
  const crystalsScale = useTransform(scrollYProgress, [0.38, 0.50], [0.5, 1])

  // === Text 2: We craft vessels of transformation.
  const text2Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.82], [0, 1, 1, 0])
  const text2Y = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.82], [60, 0, 0, -60])

  return (
    <div ref={containerRef} className="relative h-[350vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a080c] flex items-center justify-center">
        {/* === Ambient Glow === */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            className="h-[60vh] w-[60vh] rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, #c9a227 0%, transparent 60%)',
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* === Text 1 === */}
        <motion.div
          className="absolute z-20 max-w-4xl px-6 text-center"
          style={{
            opacity: text1Opacity,
            y: text1Y,
            filter: useTransform(text1Blur, (v) => `blur(${v}px)`),
          }}
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[1.1] tracking-tight text-[#f5f3ef]">
            We do not sell oils.
          </h2>
        </motion.div>

        {/* === The Bottle === */}
        <motion.div
          className="absolute z-10 flex flex-col items-center"
          style={{
            opacity: bottleOpacity,
            scale: bottleScale,
            y: bottleY,
            filter: useTransform(bottleBlur, (v) => `blur(${v}px)`),
          }}
        >
          {/* Cap */}
          <motion.div
            className="relative z-20 w-16 h-10 rounded-t-md"
            style={{
              y: capY,
              rotate: capRotate,
              background: 'linear-gradient(135deg, #2a1f3e 0%, #1a0f2e 50%, #0a080c 100%)',
              boxShadow: 'inset 2px 2px 8px rgba(255,255,255,0.08)',
            }}
          />

          {/* Bottle Body */}
          <div
            className="relative -mt-1 w-24 h-44 rounded-b-xl rounded-t-sm overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #1a0f2e 0%, #0a080c 40%, #0a080c 60%, #1a0f2e 100%)',
              boxShadow:
                'inset -8px 0 20px rgba(0,0,0,0.6), inset 8px 0 20px rgba(255,255,255,0.03), 0 0 40px rgba(26,15,46,0.8)',
            }}
          >
            {/* Gold reflection stripe */}
            <div
              className="absolute top-4 bottom-4 left-3 w-1 rounded-full opacity-40"
              style={{
                background: 'linear-gradient(180deg, transparent, #c9a227, transparent)',
              }}
            />
            {/* Subtle label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="w-px h-8 bg-[#c9a227]/30 mx-auto mb-1" />
              <span className="text-[0.5rem] uppercase tracking-[0.3em] text-[#c9a227]/50 block">
                Oil Amor
              </span>
            </div>
          </div>
        </motion.div>

        {/* === Vapor === */}
        <motion.div
          className="absolute z-15 flex flex-col items-center"
          style={{
            opacity: vaporOpacity,
            y: vaporY,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: 80 + i * 40,
                height: 20 + i * 10,
                marginTop: -8,
                background: `radial-gradient(ellipse at center, rgba(201,162,39,${0.15 - i * 0.03}) 0%, transparent 70%)`,
                filter: 'blur(8px)',
              }}
              animate={{
                scaleX: [1, 1.2, 1],
                x: [0, (i % 2 === 0 ? 10 : -10), 0],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>

        {/* === Crystals === */}
        <motion.div
          className="absolute z-20"
          style={{
            opacity: crystalsOpacity,
            scale: crystalsScale,
          }}
        >
          <CrystalArc />
        </motion.div>

        {/* === Text 2 === */}
        <motion.div
          className="absolute z-20 max-w-5xl px-6 text-center"
          style={{
            opacity: text2Opacity,
            y: text2Y,
          }}
        >
          <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a] mb-8 block">
            Our Philosophy
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-6xl leading-[1.15] tracking-tight text-[#f5f3ef]">
            We craft vessels of
            <br />
            <span className="italic text-[#c9a227]">transformation</span>
            <br />
            that become keepsakes of your journey.
          </h2>
        </motion.div>
      </div>
    </div>
  )
}

function CrystalArc() {
  const crystals = [
    { color: 'from-[#c9a227] to-[#8b7355]', size: 14, x: -120, y: 30, rotate: -25 },
    { color: 'from-[#e8d5a3] to-[#c9a227]', size: 18, x: -60, y: -10, rotate: -10 },
    { color: 'from-[#f5f3ef] to-[#e8d5a3]', size: 22, x: 0, y: -30, rotate: 0 },
    { color: 'from-[#e8d5a3] to-[#c9a227]', size: 18, x: 60, y: -10, rotate: 10 },
    { color: 'from-[#c9a227] to-[#8b7355]', size: 14, x: 120, y: 30, rotate: 25 },
  ]

  return (
    <div className="relative flex items-center justify-center">
      {/* Connection thread */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-72 opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
        }}
      />

      {crystals.map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: c.x,
            top: c.y,
            width: c.size,
            height: c.size,
            rotate: c.rotate,
            background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            boxShadow: '0 0 20px rgba(201, 162, 39, 0.4)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, duration: 0.6, ease: EASE_LUXURY }}
        >
          <div
            className={`w-full h-full bg-gradient-to-br ${c.color}`}
            style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
          />
        </motion.div>
      ))}
    </div>
  )
}
