import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllOils } from '../../../lib/content/oil-crystal-synergies'
import { ArrowRight, Star, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bestsellers | Oil Amor',
  description: 'Discover our most beloved essential oil and crystal pairings, chosen by thousands of conscious customers.',
}

export default function BestsellersPage() {
  const oils = getAllOils()
  
  const bestsellers = [
    { oil: oils[0], rank: 1, sales: '2,847', rating: 4.9, reviews: 324 },
    { oil: oils[1], rank: 2, sales: '2,156', rating: 4.8, reviews: 278 },
    { oil: oils[4], rank: 3, sales: '1,943', rating: 4.9, reviews: 256 },
  ]

  return (
    <div className="min-h-screen bg-[#0a080c]">
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#c9a227] block mb-6">
              Customer Favorites
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#f5f3ef] leading-[1.1] mb-6">
              Bestsellers
            </h1>
            <p className="text-[#a69b8a] text-lg leading-relaxed">
              Our most cherished creations, selected by thousands of customers 
              who have discovered the transformative power of crystal-infused aromatherapy.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="space-y-24">
            {bestsellers.map((item, index) => (
              <article 
                key={item.oil.id}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`relative aspect-[4/5] bg-[#141218] overflow-hidden ${
                  index % 2 === 1 ? 'lg:order-2' : ''
                }`}>
                  <Image
                    src={item.oil.image}
                    alt={item.oil.commonName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a080c]/60 via-transparent to-transparent" />
                  <div className="absolute top-6 left-6">
                    <div className="w-16 h-16 rounded-full bg-[#c9a227] flex items-center justify-center">
                      <span className="font-display text-2xl text-[#0a080c]">#{item.rank}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#c9a227] fill-[#c9a227]" />
                        <span className="text-[#f5f3ef] font-medium">{item.rating}</span>
                        <span className="text-[#a69b8a] text-sm">({item.reviews} reviews)</span>
                      </div>
                      <div className="text-[#a69b8a] text-sm">{item.sales} sold</div>
                    </div>
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <p className="text-[#c9a227] italic font-display text-lg mb-2">
                    {item.oil.technicalName}
                  </p>
                  <h2 className="font-display text-4xl lg:text-5xl text-[#f5f3ef] mb-6">
                    {item.oil.commonName}
                  </h2>
                  <p className="text-[#a69b8a] leading-relaxed mb-8">
                    {item.oil.baseProperties[0]}. {item.oil.baseProperties[1]}. 
                    A customer favorite for those seeking {item.oil.crystalPairings[0].benefits[0].toLowerCase()} 
                    and {item.oil.crystalPairings[0].benefits[1].toLowerCase()}.
                  </p>
                  <div className="mb-8 p-6 border border-[#262228] bg-[#141218]/50">
                    <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a] block mb-4">
                      Most Popular Pairing
                    </span>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full"
                        style={{ backgroundColor: item.oil.crystalPairings[0].color }}
                      />
                      <div>
                        <p className="text-[#f5f3ef] font-medium">{item.oil.crystalPairings[0].name}</p>
                        <p className="text-[#a69b8a] text-sm">{item.oil.crystalPairings[0].synergyTitle}</p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/oil/${item.oil.id}`} className="inline-flex items-center gap-3 group">
                    <span className="btn-luxury">Configure Your Blend</span>
                    <ArrowRight className="w-5 h-5 text-[#c9a227] transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
