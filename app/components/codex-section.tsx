'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Gem, MapPin, Droplets } from 'lucide-react'
import { OIL_DATABASE } from '@/lib/content/oil-crystal-synergies'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

function OilCodexCard({ oil, index }: { oil: typeof OIL_DATABASE[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-20%' })

  const mainCrystal = oil.crystalPairings[0]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: 80 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, ease: EASE_LUXURY, delay: 0.1 }}
      className="relative flex h-[70vh] min-w-[85vw] snap-center flex-col overflow-hidden rounded-sm border border-[#c9a227]/10 bg-[#0a080c] sm:min-w-[70vw] lg:min-w-[55vw] lg:flex-row"
    >
      {/* Image Side */}
      <div className="relative h-1/2 w-full lg:h-full lg:w-1/2">
        <img
          src={oil.image}
          alt={oil.commonName}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a080c] via-[#0a080c]/20 to-transparent lg:bg-gradient-to-r" />

        {/* Number badge */}
        <div className="absolute left-6 top-6">
          <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a]">
            No. {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Content Side */}
      <div className="flex h-1/2 flex-col justify-center p-8 lg:h-full lg:w-1/2 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE_LUXURY }}
        >
          <div className="mb-6 flex items-center gap-4 text-[0.65rem] uppercase tracking-[0.2em] text-[#a69b8a]">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {oil.origin}
            </span>
            <span className="h-px w-4 bg-[#c9a227]/30" />
            <span className="flex items-center gap-1.5">
              <Droplets className="h-3 w-3" />
              {oil.extractionMethod}
            </span>
          </div>

          <h3 className="font-display text-4xl text-[#f5f3ef] sm:text-5xl lg:text-6xl">
            {oil.commonName}
          </h3>
          <p className="mt-2 text-[0.75rem] italic text-[#a69b8a]">
            {oil.technicalName}
          </p>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#a69b8a]">
            {oil.description}
          </p>

          {mainCrystal && (
            <div className="mt-8 border-t border-[#c9a227]/10 pt-6">
              <div className="mb-3 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-[#c9a227]">
                <Gem className="h-3.5 w-3.5" />
                Sacred Pairing
              </div>
              <p className="font-display text-xl text-[#f5f3ef]">
                {mainCrystal.name}
              </p>
              <p className="mt-1 max-w-xs text-[0.8rem] leading-relaxed text-[#a69b8a]/80">
                {mainCrystal.synergyDescription}
              </p>
            </div>
          )}

          <Link
            href={`/oil/${oil.id}`}
            className="group mt-8 inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.15em] text-[#c9a227] transition-colors hover:text-[#f5f3ef]"
          >
            Discover {oil.commonName}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function CodexSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.4], ['0%', '100%'])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0a080c] py-32 lg:py-40">
      {/* Header */}
      <div className="mb-16 px-6 lg:mb-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
            className="mb-6 block text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a]"
          >
            The Codex
          </motion.span>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[#f5f3ef]"
            >
              Thirty-Three
              <br />
              <span className="italic text-[#c9a227]">Sacred Oils</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXURY }}
              className="max-w-md text-sm leading-relaxed text-[#a69b8a] lg:text-right"
            >
              Each oil is paired with crystals chosen by energetic resonance.
              Scroll to explore the complete collection.
            </motion.p>
          </div>

          {/* Progress line */}
          <div className="relative mt-12 h-px w-full bg-[#c9a227]/10">
            <motion.div
              className="absolute left-0 top-0 h-full bg-[#c9a227]"
              style={{ width: lineWidth }}
            />
          </div>
        </div>
      </div>

      {/* Horizontal scroll gallery */}
      <div
        ref={scrollContainerRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-8 lg:gap-10 lg:px-12"
      >
        {OIL_DATABASE.map((oil, index) => (
          <OilCodexCard key={oil.id} oil={oil} index={index} />
        ))}

        {/* End card */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 1, ease: EASE_LUXURY }}
          className="flex h-[70vh] min-w-[70vw] snap-center flex-col items-center justify-center rounded-sm border border-[#c9a227]/10 bg-[#0a080c] p-12 sm:min-w-[50vw] lg:min-w-[35vw]"
        >
          <span className="mb-6 text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a]">
            The Complete Collection
          </span>
          <h3 className="text-center font-display text-3xl text-[#f5f3ef] sm:text-4xl">
            Every oil tells a story.
            <br />
            <span className="italic text-[#c9a227]">Which is yours?</span>
          </h3>
          <Link
            href="/oils"
            className="group mt-10 inline-flex items-center gap-2 overflow-hidden btn-luxury px-10 py-4"
          >
            <span className="relative z-10">Enter the Collection</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
