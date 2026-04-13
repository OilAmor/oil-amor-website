'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { FlaskConical, ShieldCheck, ArrowRight, Beaker } from 'lucide-react'
import type { BlendWithRating } from '@/lib/community-blends/data'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

// Animated Beaker — visual metaphor only, no fake revelations
function BeakerAnimation() {
  return (
    <div className="relative mx-auto h-80 w-48 sm:h-96 sm:w-56">
      {/* Glass beaker */}
      <div
        className="absolute inset-x-0 bottom-0 mx-auto h-64 w-40 rounded-b-3xl rounded-t-sm border border-[#c9a227]/20 sm:h-80 sm:w-44"
        style={{
          background:
            'linear-gradient(180deg, rgba(26,15,46,0.4) 0%, rgba(10,8,12,0.8) 100%)',
          boxShadow:
            'inset -12px 0 24px rgba(0,0,0,0.5), inset 8px 0 16px rgba(255,255,255,0.04), 0 0 40px rgba(201,162,39,0.15)',
        }}
      >
        {/* Liquid fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-b-3xl"
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
          animate={{ y: [0, 180, 180], opacity: [0, 1, 0], scale: [0.8, 1, 0.4] }}
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
          animate={{ y: [0, -60 - i * 20], opacity: [0.3, 0], scale: [1, 1.5] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// Real community blend card
function BlendMiniCard({ blend, index }: { blend: BlendWithRating; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: EASE_LUXURY }}
      className="group relative overflow-hidden rounded-sm border border-[#c9a227]/10 bg-[#0a080c]/60 p-5 transition-colors hover:border-[#c9a227]/30"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-display text-xl text-[#f5f3ef]">{blend.name}</h4>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.15em] text-[#a69b8a]">
            by {blend.creatorName}
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-lg text-[#c9a227]">
            ${(blend.price / 100).toFixed(0)}
          </div>
          <div className="text-[0.6rem] text-[#a69b8a]/70">
            {blend.purchaseCount} bought
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {blend.recipe.oils.slice(0, 3).map((oil) => (
          <span
            key={oil.oilId}
            className="rounded-full border border-[#c9a227]/20 px-2 py-1 text-[0.6rem] uppercase tracking-wide text-[#a69b8a]"
          >
            {oil.name}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export function LaboratorySection() {
  const [blends, setBlends] = useState<BlendWithRating[]>([])

  useEffect(() => {
    fetch('/api/community-blends?sort=purchased&limit=3')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBlends(data.slice(0, 3))
        else if (data.blends) setBlends(data.blends.slice(0, 3))
      })
      .catch(() => setBlends([]))
  }, [])

  return (
    <section className="relative overflow-hidden bg-[#0a080c] py-32 lg:py-48">
      {/* Background aura */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[80vh] w-[80vh] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #1a0f2e 0%, transparent 60%)' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20 text-center lg:mb-28">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
            className="mb-6 block text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a]"
          >
            The Laboratory
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight text-[#f5f3ef]"
          >
            Become the
            <br />
            <span className="italic text-[#c9a227]">Alchemist</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXURY }}
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[#a69b8a]"
          >
            Blend from 33 sacred oils. Select your ratios. Our safety engine checks
            every combination in real time. When you are ready, purchase your unique
            formula — or share it with the world.
          </motion.p>
        </div>

        {/* Main content grid */}
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: Beaker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE_LUXURY }}
            className="order-2 lg:order-1"
          >
            <BeakerAnimation />
          </motion.div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE_LUXURY }}
            >
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a227]/30">
                  <FlaskConical className="h-5 w-5 text-[#c9a227]" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-[#f5f3ef]">Mixing Atelier</h3>
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#a69b8a]">
                    Safety-Checked · Crystal-Infused
                  </p>
                </div>
              </div>

              <ul className="mb-10 space-y-5">
                {[
                  'Choose from 33 sacred oils and 15 crystals',
                  'Set your ratios with real-time safety validation',
                  'Receive a personalized blend revelation based on your selections',
                  'Purchase your formula or share it to Community Blends',
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: EASE_LUXURY }}
                    className="flex items-start gap-4 text-[#a69b8a]"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/mixing-atelier"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden btn-luxury px-8 py-4"
                >
                  <span className="relative z-10">Enter the Atelier</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/community-blends"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden btn-luxury-dark px-8 py-4"
                >
                  <span className="relative z-10">Explore Creations</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Featured community blends */}
        <div className="mt-28 lg:mt-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a]">
                From the Community
              </span>
              <h3 className="mt-2 font-display text-3xl text-[#f5f3ef]">
                Trending Blends
              </h3>
            </div>
            <Link
              href="/community-blends"
              className="hidden text-[0.7rem] uppercase tracking-[0.15em] text-[#c9a227] transition-colors hover:text-[#f5f3ef] sm:block"
            >
              View All
            </Link>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blends.length > 0 ? (
              blends.map((blend, i) => (
                <BlendMiniCard key={blend.id} blend={blend} index={i} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="col-span-full rounded-sm border border-[#c9a227]/10 bg-[#0a080c]/40 p-10 text-center"
              >
                <Beaker className="mx-auto mb-4 h-8 w-8 text-[#c9a227]/50" />
                <p className="text-[#a69b8a]">
                  The first community blends are brewing. Enter the Atelier and create the inaugural formula.
                </p>
                <Link
                  href="/mixing-atelier"
                  className="mt-4 inline-block text-[0.75rem] uppercase tracking-[0.15em] text-[#c9a227] hover:text-[#f5f3ef]"
                >
                  Be the First Creator
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
