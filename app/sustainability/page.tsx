import { Metadata } from 'next'
import { Leaf, RefreshCw, Package, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sustainability | Oil Amor',
  description: 'Our commitment to the planet through refillable bottles, ethical sourcing, and zero-waste practices.',
}

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20 text-center">
          <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a] block mb-6">
            Our Commitment
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#f5f3ef] leading-[1.1] mb-6">
            Designed for <span className="italic text-[#c9a227]">Forever</span>
          </h1>
          <p className="text-[#a69b8a] max-w-2xl mx-auto leading-relaxed">
            Sustainability isn&apos;t a feature—it&apos;s our foundation. From refillable Miron bottles 
            to ethical sourcing, every decision considers its impact on the planet.
          </p>
        </div>

        {/* Pillars */}
        <div className="space-y-20">
          {/* Forever Bottles */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#c9a227]/10 flex items-center justify-center mb-6">
                <RefreshCw className="w-6 h-6 text-[#c9a227]" />
              </div>
              <h2 className="font-display text-3xl text-[#f5f3ef] mb-4">
                The Forever Bottle
              </h2>
              <p className="text-[#a69b8a] leading-relaxed mb-4">
                Our Miron violet glass bottles are designed to last a lifetime. When you run low, 
                simply return your bottle for a refill at a discount—no new packaging required.
              </p>
              <p className="text-[#a69b8a] leading-relaxed">
                Miron glass naturally filters light to preserve the potency of your oils, 
                extending their shelf life naturally without preservatives.
              </p>
            </div>
            <div className="aspect-square bg-[#141218] border border-[#262228] flex items-center justify-center">
              <div className="text-center p-12">
                <RefreshCw className="w-24 h-24 text-[#c9a227]/20 mx-auto mb-6" />
                <span className="font-display text-6xl text-[#c9a227] block mb-2">∞</span>
                <span className="text-[#a69b8a] text-sm">Refills per bottle</span>
              </div>
            </div>
          </section>

          {/* Ethical Sourcing */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
              <div className="w-12 h-12 rounded-full bg-[#c9a227]/10 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-[#c9a227]" />
              </div>
              <h2 className="font-display text-3xl text-[#f5f3ef] mb-4">
                Ethical Sourcing
              </h2>
              <p className="text-[#a69b8a] leading-relaxed mb-4">
                Our essential oils are sourced from sustainable farms that prioritize soil health, 
                biodiversity, and fair wages for workers. We know the origin of every drop.
              </p>
              <p className="text-[#a69b8a] leading-relaxed">
                Our crystals are ethically mined, with full traceability from mine to atelier. 
                We work directly with small-scale miners who use responsible practices.
              </p>
            </div>
            <div className="aspect-square bg-[#141218] border border-[#262228] flex items-center justify-center md:order-1">
              <div className="text-center p-12">
                <Globe className="w-24 h-24 text-[#c9a227]/20 mx-auto mb-6" />
                <span className="font-display text-6xl text-[#c9a227] block mb-2">100%</span>
                <span className="text-[#a69b8a] text-sm">Traceable sourcing</span>
              </div>
            </div>
          </section>

          {/* Zero Waste */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#c9a227]/10 flex items-center justify-center mb-6">
                <Package className="w-6 h-6 text-[#c9a227]" />
              </div>
              <h2 className="font-display text-3xl text-[#f5f3ef] mb-4">
                Plastic-Free Packaging
              </h2>
              <p className="text-[#a69b8a] leading-relaxed mb-4">
                Every order ships in recyclable, plastic-free packaging. Our boxes are made from 
                post-consumer waste and printed with soy-based inks.
              </p>
              <p className="text-[#a69b8a] leading-relaxed">
                We use mushroom-based protective packaging instead of bubble wrap, and 
                compostable tape for sealing.
              </p>
            </div>
            <div className="aspect-square bg-[#141218] border border-[#262228] flex items-center justify-center">
              <div className="text-center p-12">
                <Package className="w-24 h-24 text-[#c9a227]/20 mx-auto mb-6" />
                <span className="font-display text-6xl text-[#c9a227] block mb-2">0</span>
                <span className="text-[#a69b8a] text-sm">Plastic in packaging</span>
              </div>
            </div>
          </section>

          {/* Carbon */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
              <div className="w-12 h-12 rounded-full bg-[#c9a227]/10 flex items-center justify-center mb-6">
                <Leaf className="w-6 h-6 text-[#c9a227]" />
              </div>
              <h2 className="font-display text-3xl text-[#f5f3ef] mb-4">
                Carbon Conscious
              </h2>
              <p className="text-[#a69b8a] leading-relaxed mb-4">
                We offset 100% of our shipping emissions through verified carbon offset programs. 
                Our atelier runs on renewable energy, and we&apos;re working toward carbon-negative operations.
              </p>
              <p className="text-[#a69b8a] leading-relaxed">
                Local customers on the Central Coast can opt for bicycle delivery, 
                eliminating emissions entirely.
              </p>
            </div>
            <div className="aspect-square bg-[#141218] border border-[#262228] flex items-center justify-center md:order-1">
              <div className="text-center p-12">
                <Leaf className="w-24 h-24 text-[#c9a227]/20 mx-auto mb-6" />
                <span className="font-display text-6xl text-[#c9a227] block mb-2">100%</span>
                <span className="text-[#a69b8a] text-sm">Carbon neutral shipping</span>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-32 pt-20 border-t border-[#262228] text-center">
          <h3 className="font-display text-2xl text-[#f5f3ef] mb-4">
            Join the Refill Revolution
          </h3>
          <p className="text-[#a69b8a] mb-8 max-w-md mx-auto">
            Experience the luxury of sustainable beauty. Return your empty bottle for a refill 
            and save $5 while saving the planet.
          </p>
          <a href="/returns" className="btn-luxury inline-block">
            Start Your Refill
          </a>
        </div>
      </div>
    </div>
  )
}
