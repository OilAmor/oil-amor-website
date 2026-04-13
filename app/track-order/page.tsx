'use client'

import { Package, Truck, CheckCircle, Clock } from 'lucide-react'

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-[#0a080c]">
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <Package className="w-12 h-12 text-[#c9a227] mx-auto mb-6" />
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#f5f3ef] leading-[1.1] mb-6">
              Track Order
            </h1>
            <p className="text-[#a69b8a] text-lg leading-relaxed">
              Enter your order details to check the status of your delivery.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-xl mx-auto px-6 lg:px-12">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] mb-3">
                Order Number
              </label>
              <input
                type="text"
                placeholder="e.g., OA-12345678"
                className="w-full px-6 py-4 bg-[#141218] border border-[#262228] text-[#f5f3ef] placeholder:text-[#a69b8a]/50 focus:outline-none focus:border-[#c9a227] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] mb-3">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-6 py-4 bg-[#141218] border border-[#262228] text-[#f5f3ef] placeholder:text-[#a69b8a]/50 focus:outline-none focus:border-[#c9a227] transition-colors"
              />
            </div>
            <button type="submit" className="w-full btn-luxury py-4">
              Track Order
            </button>
          </form>
        </div>
      </section>

      <section className="py-24 border-t border-[#1c181f]">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="font-display text-3xl text-[#f5f3ef] text-center mb-12">Delivery Timeline</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: CheckCircle, title: 'Order Placed', desc: 'Confirmation sent', time: 'Day 0' },
              { icon: Package, title: 'Processing', desc: 'Carefully packed', time: '1-2 days' },
              { icon: Truck, title: 'Shipped', desc: 'On its way to you', time: '3-5 days' },
              { icon: Clock, title: 'Delivered', desc: 'Enjoy your oils', time: '5-7 days total' },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#141218] border border-[#262228] flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-[#c9a227]" />
                </div>
                <div className="text-[0.625rem] uppercase tracking-[0.2em] text-[#c9a227] mb-2">{step.time}</div>
                <h3 className="text-[#f5f3ef] font-medium mb-1">{step.title}</h3>
                <p className="text-[#a69b8a] text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-[#1c181f]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <h2 className="font-display text-3xl text-[#f5f3ef] text-center mb-12">Shipping Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 border border-[#262228] bg-[#141218]/30">
              <h3 className="text-[#f5f3ef] font-medium mb-4">Australia</h3>
              <ul className="space-y-3 text-[#a69b8a] text-sm">
                <li className="flex justify-between"><span>Standard</span><span>5-7 business days</span></li>
                <li className="flex justify-between"><span>Express</span><span>2-3 business days</span></li>
                <li className="flex justify-between"><span>Free over</span><span>$150</span></li>
              </ul>
            </div>
            <div className="p-8 border border-[#262228] bg-[#141218]/30">
              <h3 className="text-[#f5f3ef] font-medium mb-4">International</h3>
              <ul className="space-y-3 text-[#a69b8a] text-sm">
                <li className="flex justify-between"><span>Standard</span><span>10-20 business days</span></li>
                <li className="flex justify-between"><span>Express</span><span>5-10 business days</span></li>
                <li className="flex justify-between"><span>Free over</span><span>$300</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
