'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getAllOils } from '../../../lib/content/oil-crystal-synergies'
import { Sparkles, Clock, ArrowRight } from 'lucide-react'

export default function NewArrivalsPage() {
  const oils = getAllOils()

  return (
    <div className="min-h-screen bg-[#0a080c]">
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#c9a227] block mb-6">
                Just Released
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#f5f3ef] leading-[1.1] mb-6">
                New Arrivals
              </h1>
              <p className="text-[#a69b8a] text-lg leading-relaxed">
                Discover our freshest creations. Each new arrival represents months 
                of careful sourcing, blending, and energetic alignment.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#a69b8a]">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Updated weekly</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {oils.map((oil) => (
              <article key={oil.id} className="group">
                <Link href={`/oil/${oil.id}`} className="block">
                  <div className="relative aspect-[4/5] bg-[#141218] overflow-hidden mb-6">
                    <Image
                      src={oil.image}
                      alt={oil.commonName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a080c]/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#c9a227] text-[#0a080c] text-xs font-medium uppercase tracking-wider">
                        New
                      </span>
                    </div>
                  </div>
                  <p className="text-[#c9a227] italic font-display text-sm mb-1">{oil.technicalName}</p>
                  <h3 className="font-display text-2xl text-[#f5f3ef] mb-2">{oil.commonName}</h3>
                  <p className="text-[#a69b8a] text-sm line-clamp-2">{oil.baseProperties[0]}</p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-[#1c181f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <Sparkles className="w-8 h-8 text-[#c9a227] mx-auto mb-6" />
          <h2 className="font-display text-3xl text-[#f5f3ef] mb-4">Join The Inner Circle</h2>
          <p className="text-[#a69b8a] max-w-xl mx-auto mb-8">
            Be the first to know about new releases, exclusive offers, and limited editions.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-[#141218] border border-[#262228] text-[#f5f3ef] placeholder:text-[#a69b8a]/50 focus:outline-none focus:border-[#c9a227] transition-colors"
            />
            <button type="submit" className="btn-luxury">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  )
}
