'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Beaker } from 'lucide-react'
import type { BlendWithRating } from '@/lib/community-blends/data'

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const

function BlendPill({ blend, index }: { blend: BlendWithRating; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE_LUXURY }}
      className="group flex min-w-[280px] flex-col justify-between rounded-[2rem] rounded-br-sm border border-[#c9a227]/10 bg-[#0a080c]/40 p-6 transition-all hover:border-[#c9a227]/25 hover:bg-[#0a080c]/60 sm:min-w-[320px]"
    >
      <div>
        <h4 className="font-display text-xl text-[#f5f3ef]">{blend.name}</h4>
        <p className="mt-1 text-[0.65rem] uppercase tracking-[0.15em] text-[#a69b8a]">
          by {blend.creatorName}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {blend.recipe.oils.slice(0, 2).map((oil) => (
            <span
              key={oil.oilId}
              className="rounded-full border border-[#c9a227]/20 px-2.5 py-1 text-[0.6rem] uppercase tracking-wide text-[#a69b8a]"
            >
              {oil.name}
            </span>
          ))}
        </div>
        <span className="font-display text-lg text-[#c9a227]">
          ${(blend.price / 100).toFixed(0)}
        </span>
      </div>
    </motion.div>
  )
}

export function CommunityStrip() {
  const [blends, setBlends] = useState<BlendWithRating[]>([])

  useEffect(() => {
    fetch('/api/community-blends?sort=purchased&limit=4')
      .then((r) => r.json())
      .then((data) => {
        const raw = Array.isArray(data) ? data : data.blends || []
        const real = raw.filter((b: BlendWithRating) => !b.id.startsWith('demo-'))
        setBlends(real.slice(0, 4))
      })
      .catch(() => setBlends([]))
  }, [])

  return (
    <section className="relative overflow-hidden bg-[#0a080c] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
          >
            <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a]">
              From the Community
            </span>
            <h3 className="mt-2 font-display text-3xl text-[#f5f3ef] lg:text-4xl">
              Recent Creations
            </h3>
          </motion.div>

          <Link
            href="/community-blends"
            className="group inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.15em] text-[#c9a227] transition-colors hover:text-[#f5f3ef]"
          >
            Explore All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {blends.length > 0 ? (
          <div className="scrollbar-hide flex snap-x gap-5 overflow-x-auto pb-4">
            {blends.map((blend, i) => (
              <BlendPill key={blend.id} blend={blend} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-[2rem] rounded-tl-sm border border-[#c9a227]/10 bg-[#0a080c]/40 p-12 text-center"
          >
            <Beaker className="mx-auto mb-4 h-8 w-8 text-[#c9a227]/50" />
            <p className="text-[#a69b8a]">
              The first community blends are brewing.
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
    </section>
  )
}
