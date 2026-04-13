'use client'

import { ShieldCheck, Truck, RefreshCcw, Leaf } from 'lucide-react'

const badges = [
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    description: '256-bit SSL encryption',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: RefreshCcw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: Leaf,
    title: 'Sustainable',
    description: 'Zero-waste packaging',
  },
]

export function TrustBadges() {
  return (
    <div className="bg-cream border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          {badges.map((badge) => {
            const Icon = badge.icon
            return (
              <div key={badge.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-miron-void/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-miron-void" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-miron-void">{badge.title}</h3>
                  <p className="text-xs text-gray-500">{badge.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
