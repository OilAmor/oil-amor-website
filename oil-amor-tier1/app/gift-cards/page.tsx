import { Metadata } from 'next'
import Link from 'next/link'
import { Gift, Sparkles, Mail, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gift Cards | Oil Amor',
  description: 'Give the gift of transformation. Digital gift cards for essential oils and crystal jewelry.',
}

const giftCardAmounts = [
  { amount: 50, popular: false },
  { amount: 100, popular: true },
  { amount: 200, popular: false },
  { amount: 500, popular: false },
]

export default function GiftCardsPage() {
  return (
    <div className="min-h-screen bg-[#0a080c]">
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <Gift className="w-12 h-12 text-[#c9a227] mx-auto mb-6" />
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#f5f3ef] leading-[1.1] mb-6">
              Gift Cards
            </h1>
            <p className="text-[#a69b8a] text-lg leading-relaxed">
              Give the gift of transformation. Our digital gift cards allow your loved ones 
              to choose their perfect oil and crystal pairing.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftCardAmounts.map((card) => (
              <button
                key={card.amount}
                className={`relative p-8 border text-left transition-all hover:border-[#c9a227] ${
                  card.popular ? 'border-[#c9a227] bg-[#c9a227]/5' : 'border-[#262228] bg-[#141218]'
                }`}
              >
                {card.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#c9a227] text-[#0a080c] text-xs font-medium uppercase tracking-wider">
                    Popular
                  </span>
                )}
                <div className="font-display text-4xl text-[#f5f3ef] mb-2">${card.amount}</div>
                <div className="text-[#a69b8a] text-sm">Digital Gift Card</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-[#1c181f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl text-[#f5f3ef] mb-6">
                How It Works
              </h2>
              <div className="space-y-8">
                {[
                  { icon: Sparkles, title: 'Choose Amount', desc: 'Select from $50 to $500' },
                  { icon: Mail, title: 'Personalize', desc: 'Add a heartfelt message' },
                  { icon: Heart, title: 'Instant Delivery', desc: 'Sent via email immediately' },
                ].map((step, i) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#141218] border border-[#262228] flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-5 h-5 text-[#c9a227]" />
                    </div>
                    <div>
                      <div className="text-[0.625rem] uppercase tracking-[0.2em] text-[#c9a227] mb-1">Step {i + 1}</div>
                      <h3 className="text-[#f5f3ef] font-medium mb-1">{step.title}</h3>
                      <p className="text-[#a69b8a] text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 lg:p-12 border border-[#262228] bg-[#141218]/50">
              <h3 className="font-display text-2xl text-[#f5f3ef] mb-6">Gift Card Details</h3>
              <ul className="space-y-4 text-[#a69b8a]">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-2 flex-shrink-0" />
                  Valid for 3 years from purchase date
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-2 flex-shrink-0" />
                  Can be used across multiple purchases
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-2 flex-shrink-0" />
                  No additional processing fees
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-2 flex-shrink-0" />
                  Redeemable online only
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
