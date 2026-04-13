'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Wine, 
  Shield, 
  Sparkles, 
  Droplets, 
  Wind,
  Sun,
  ArrowRight,
  Check,
  Info,
  ShoppingBag,
  Leaf,
  Beaker,
  Crown,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// MIRON VIOLET GLASS BOTTLE DATA
// ============================================================================

interface BottleProduct {
  id: string
  name: string
  description: string
  size: string
  price: number
  features: string[]
  image: string
  type: 'dropper' | 'roller' | 'spray'
  inStock: boolean
}

const BOTTLE_PRODUCTS: BottleProduct[] = [
  {
    id: 'miron-30ml-dropper',
    name: 'Miron Violet Glass Dropper Bottle',
    description: 'The perfect vessel for your pure essential oil blends. Includes precision glass dropper for accurate dispensing.',
    size: '30ml',
    price: 24.95,
    features: [
      'Precision glass dropper included',
      'Blocks 100% of UV-A & UV-B rays',
      'Allows beneficial violet & infrared light',
      'Preserves potency for 2+ years',
      'Reusable & refillable',
    ],
    image: '/images/bottles/miron-dropper-30ml.jpg',
    type: 'dropper',
    inStock: true,
  },
  {
    id: 'miron-50ml-dropper',
    name: 'Miron Violet Glass Dropper Bottle',
    description: 'Our most popular size for custom blends. Generous capacity with the same protective properties.',
    size: '50ml',
    price: 34.95,
    features: [
      'Precision glass dropper included',
      'Blocks 100% of UV-A & UV-B rays',
      'Allows beneficial violet & infrared light',
      'Preserves potency for 2+ years',
      'Reusable & refillable',
    ],
    image: '/images/bottles/miron-dropper-50ml.jpg',
    type: 'dropper',
    inStock: true,
  },
  {
    id: 'miron-10ml-roller',
    name: 'Miron Violet Glass Roller Bottle',
    description: 'Elegant roller bottle for on-the-go application. Stainless steel roller ball for smooth, even distribution.',
    size: '10ml',
    price: 19.95,
    features: [
      'Stainless steel roller ball',
      'Perfect for carrier oil blends',
      'Blocks harmful light spectrum',
      'Pocket & purse friendly',
      'Leak-proof design',
    ],
    image: '/images/bottles/miron-roller-10ml.jpg',
    type: 'roller',
    inStock: true,
  },
  {
    id: 'miron-100ml-refill',
    name: 'Miron Violet Glass Refill Bottle',
    description: 'Part of our Forever Bottle program. Large capacity for refills with wide mouth for easy filling.',
    size: '100ml',
    price: 49.95,
    features: [
      'Wide mouth for easy refilling',
      'Part of Forever Bottle program',
      '$5 credit when returned empty',
      'Laboratory-grade glass',
      'Lifetime durability',
    ],
    image: '/images/bottles/miron-refill-100ml.jpg',
    type: 'dropper',
    inStock: true,
  },
]

// ============================================================================
// SCIENTIFIC FACTS ABOUT MIRON GLASS
// ============================================================================

const MIRON_SCIENCE = [
  {
    title: 'Violet Light Protection',
    description: 'Miron glass blocks the complete spectrum of visible light except for violet and infrared rays, which have been shown to enhance the molecular structure of organic materials.',
    icon: Sun,
  },
  {
    title: 'UV Radiation Blocking',
    description: 'Unlike clear, amber, or green glass, Miron violet glass blocks 100% of UV-A and UV-B rays, preventing photo-oxidation and degradation of sensitive compounds.',
    icon: Shield,
  },
  {
    title: 'Natural Preservation',
    description: 'Studies demonstrate that rose water stored in Miron glass maintains its natural pH balance and active compounds for years, versus months in conventional glass.',
    icon: Leaf,
  },
  {
    title: 'Energetic Enhancement',
    description: 'Violet light has the highest frequency in the visible spectrum. Miron glass allows these high-frequency rays to penetrate, potentially enhancing the energetic properties of your oils.',
    icon: Sparkles,
  },
]

// ============================================================================
// COMPARISON DATA
// ============================================================================

const GLASS_COMPARISON = [
  { feature: 'UV-A Protection', clear: '0%', amber: '60%', miron: '100%' },
  { feature: 'UV-B Protection', clear: '0%', amber: '40%', miron: '100%' },
  { feature: 'Visible Light Blocking', clear: '0%', amber: '70%', miron: '99%' },
  { feature: 'Infrared Transmission', clear: 'Yes', amber: 'Partial', miron: 'Optimized' },
  { feature: 'Violet Light Entry', clear: 'Yes', amber: 'No', miron: 'Yes (Beneficial)' },
  { feature: 'Shelf Life Extension', clear: '3-6 months', amber: '6-12 months', miron: '24+ months' },
]

// ============================================================================
// COMPONENT: Science Card
// ============================================================================

function ScienceCard({ fact, index }: { fact: typeof MIRON_SCIENCE[0]; index: number }) {
  const Icon = fact.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-[#2d1b4e]/50 to-[#1a1033] border border-[#8B5CF6]/30"
    >
      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#A855F7]" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{fact.title}</h3>
      <p className="text-sm text-[#c4b5fd] leading-relaxed">{fact.description}</p>
    </motion.div>
  )
}

// ============================================================================
// COMPONENT: Bottle Card
// ============================================================================

function BottleCard({ bottle, index }: { bottle: BottleProduct; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "relative rounded-2xl border transition-all duration-300 overflow-hidden",
        isHovered 
          ? 'bg-[#2d1b4e]/80 border-[#8B5CF6] shadow-xl shadow-[#8B5CF6]/20' 
          : 'bg-[#111] border-[#f5f3ef]/10'
      )}>
        {/* Product Image Placeholder */}
        <div className="relative aspect-square bg-gradient-to-br from-[#2d1b4e] to-[#1a1033] flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#8B5CF6]/10 via-transparent to-transparent" />
          
          {/* Bottle Icon Representation */}
          <div className="relative z-10">
            <div className={cn(
              "w-24 h-32 rounded-full bg-gradient-to-b from-[#4c1d95] via-[#2d1b4e] to-[#1a1033] border-2 border-[#8B5CF6]/50 flex items-center justify-center transition-transform duration-300",
              isHovered && 'scale-110'
            )}>
              {bottle.type === 'dropper' ? (
                <Droplets className="w-10 h-10 text-[#A855F7]/70" />
              ) : (
                <Wind className="w-10 h-10 text-[#A855F7]/70" />
              )}
            </div>
            {/* Size Label */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#8B5CF6] text-white text-xs font-medium">
              {bottle.size}
            </div>
          </div>

          {/* Stock Badge */}
          {!bottle.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="px-4 py-2 rounded-full bg-[#f5f3ef]/10 text-[#f5f3ef] text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-serif text-lg text-[#f5f3ef]">{bottle.name}</h3>
            <span className="text-[#c9a227] font-display text-xl whitespace-nowrap">
              ${bottle.price.toFixed(2)}
            </span>
          </div>
          
          <p className="text-sm text-[#a69b8a] mb-4 line-clamp-2">
            {bottle.description}
          </p>

          {/* Features Toggle */}
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="flex items-center gap-1 text-xs text-[#8B5CF6] hover:text-[#A855F7] transition-colors mb-3"
          >
            {showFeatures ? (
              <>Hide features <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>View features <ChevronDown className="w-3 h-3" /></>
            )}
          </button>

          {/* Features List */}
          {showFeatures && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4"
            >
              <ul className="space-y-2">
                {bottle.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#a69b8a]">
                    <Check className="w-3.5 h-3.5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Add to Cart Button */}
          <button
            disabled={!bottle.inStock}
            className={cn(
              "w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
              bottle.inStock
                ? 'bg-[#c9a227] text-[#0a080c] hover:bg-[#f5f3ef]'
                : 'bg-[#f5f3ef]/10 text-[#a69b8a] cursor-not-allowed'
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            {bottle.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function BottlesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'dropper' | 'roller'>('all')
  const [showComparison, setShowComparison] = useState(false)

  const filteredBottles = BOTTLE_PRODUCTS.filter(bottle => 
    activeTab === 'all' || bottle.type === activeTab
  )

  return (
    <main className="min-h-screen bg-[#0a080c]">
      {/* Hero Section - Miron Violet Theme */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b4e]/30 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#8B5CF6]/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <span className="px-4 py-1.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A855F7] text-sm font-medium flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Premium Collection
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl text-center text-white mb-6"
          >
            Miron Violet Glass
            <span className="block text-[#A855F7]">Bottles & Accessories</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-[#c4b5fd] text-lg max-w-2xl mx-auto mb-8"
          >
            The same laboratory-grade violet glass we use for our essential oils, 
            now available for your own blends and precious contents.
          </motion.p>

          {/* Key Benefits Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {[
              { icon: Shield, text: 'UV Protection' },
              { icon: Sparkles, text: 'Preserves Potency' },
              { icon: Leaf, text: 'Natural Preservation' },
              { icon: Droplets, text: 'Laboratory Grade' },
            ].map((benefit, i) => (
              <span 
                key={i}
                className="px-4 py-2 rounded-full bg-[#1a1033] border border-[#8B5CF6]/30 text-[#ddd6fe] text-sm flex items-center gap-2"
              >
                <benefit.icon className="w-4 h-4 text-[#A855F7]" />
                {benefit.text}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#products"
              className="px-8 py-4 rounded-full bg-[#c9a227] text-[#0a080c] font-medium hover:bg-[#f5f3ef] transition-colors flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Bottles
            </a>
            <a
              href="#science"
              className="px-8 py-4 rounded-full bg-[#2d1b4e] border border-[#8B5CF6]/50 text-[#ddd6fe] font-medium hover:bg-[#4c1d95] transition-colors flex items-center gap-2"
            >
              <Beaker className="w-5 h-5" />
              The Science
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Miron Glass Section */}
      <section id="science" className="py-20 px-6 border-t border-[#f5f3ef]/10 bg-gradient-to-b from-[#1a1033]/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
              Why Miron Violet Glass?
            </h2>
            <p className="text-[#a69b8a] max-w-2xl mx-auto">
              Developed in Europe and backed by scientific research, Miron violet glass 
              offers unmatched protection for sensitive organic materials.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MIRON_SCIENCE.map((fact, index) => (
              <ScienceCard key={fact.title} fact={fact} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Glass Comparison Section */}
      <section className="py-20 px-6 border-t border-[#f5f3ef]/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-white mb-4">
              How Miron Compares
            </h2>
            <p className="text-[#a69b8a]">
              See the difference between conventional glass and Miron violet glass
            </p>
          </div>

          <button
            onClick={() => setShowComparison(!showComparison)}
            className="w-full p-4 rounded-xl bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] flex items-center justify-between hover:border-[#8B5CF6]/50 transition-colors mb-4"
          >
            <span className="flex items-center gap-2">
              <Info className="w-5 h-5 text-[#8B5CF6]" />
              View Glass Comparison Chart
            </span>
            {showComparison ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showComparison && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl overflow-hidden border border-[#f5f3ef]/10">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#2d1b4e]">
                      <th className="p-4 text-left text-[#f5f3ef] font-medium">Feature</th>
                      <th className="p-4 text-center text-[#a69b8a]">Clear Glass</th>
                      <th className="p-4 text-center text-[#a69b8a]">Amber/Brown</th>
                      <th className="p-4 text-center text-[#A855F7] font-medium">Miron Violet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GLASS_COMPARISON.map((row, i) => (
                      <tr key={i} className={cn(
                        'border-t border-[#f5f3ef]/10',
                        i % 2 === 0 ? 'bg-[#111]' : 'bg-[#0a080c]'
                      )}>
                        <td className="p-4 text-[#f5f3ef] text-sm">{row.feature}</td>
                        <td className="p-4 text-center text-[#a69b8a] text-sm">{row.clear}</td>
                        <td className="p-4 text-center text-[#a69b8a] text-sm">{row.amber}</td>
                        <td className="p-4 text-center">
                          <span className="px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#A855F7] text-sm font-medium">
                            {row.miron}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-6 border-t border-[#f5f3ef]/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
              Our Bottle Collection
            </h2>
            <p className="text-[#a69b8a] max-w-2xl mx-auto mb-8">
              Each bottle is crafted from genuine Miron violet glass and includes 
              premium accessories for dispensing your precious blends.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm transition-all flex items-center gap-2',
                  activeTab === 'all'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'bg-[#111] text-[#a69b8a] border border-[#f5f3ef]/10 hover:border-[#8B5CF6]/50'
                )}
              >
                All Bottles
              </button>
              <button
                onClick={() => setActiveTab('dropper')}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm transition-all flex items-center gap-2',
                  activeTab === 'dropper'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'bg-[#111] text-[#a69b8a] border border-[#f5f3ef]/10 hover:border-[#8B5CF6]/50'
                )}
              >
                <Droplets className="w-4 h-4" />
                Dropper Bottles
              </button>
              <button
                onClick={() => setActiveTab('roller')}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm transition-all flex items-center gap-2',
                  activeTab === 'roller'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'bg-[#111] text-[#a69b8a] border border-[#f5f3ef]/10 hover:border-[#8B5CF6]/50'
                )}
              >
                <Wind className="w-4 h-4" />
                Roller Bottles
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBottles.map((bottle, index) => (
              <BottleCard key={bottle.id} bottle={bottle} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Forever Bottle Program CTA */}
      <section className="py-20 px-6 border-t border-[#f5f3ef]/10">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2d1b4e] to-[#4c1d95]" />
            <div className="absolute inset-0 bg-[url('/patterns/violet-glass-pattern.svg')] opacity-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6]/30 rounded-full blur-[100px]" />
            
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/30 text-[#ddd6fe] text-xs mb-4">
                    <Star className="w-3.5 h-3.5" />
                    Sustainable Program
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl text-white mb-3">
                    Join the Forever Bottle Program
                  </h2>
                  <p className="text-[#c4b5fd] mb-6">
                    Purchase any Miron 100ml bottle and join our sustainable refill program. 
                    Return your empty bottle for a $5 credit toward your next purchase.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Link
                      href="/refill"
                      className="px-6 py-3 rounded-full bg-[#c9a227] text-[#0a080c] font-medium hover:bg-[#f5f3ef] transition-colors flex items-center gap-2"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/mixing-atelier"
                      className="px-6 py-3 rounded-full bg-[#1a1033] border border-[#8B5CF6]/50 text-[#ddd6fe] font-medium hover:bg-[#4c1d95] transition-colors flex items-center gap-2"
                    >
                      <Beaker className="w-4 h-4" />
                      Create a Blend
                    </Link>
                  </div>
                </div>

                {/* Decorative Bottle Stack */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-40">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-28 rounded-full bg-gradient-to-b from-[#4c1d95] via-[#2d1b4e] to-[#1a1033] border-2 border-[#8B5CF6]/50" />
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-20 rounded-full bg-gradient-to-b from-[#5b21b6] via-[#4c1d95] to-[#2d1b4e] border-2 border-[#8B5CF6]/50" />
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-12 h-16 rounded-full bg-gradient-to-b from-[#7c3aed] via-[#5b21b6] to-[#4c1d95] border-2 border-[#8B5CF6]/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 border-t border-[#f5f3ef]/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-white mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What makes Miron violet glass different from amber glass?',
                a: 'While amber glass blocks some UV light, Miron violet glass blocks the complete spectrum of visible light except for violet and infrared rays. This unique property not only protects but actually enhances the natural preservation of organic materials.',
              },
              {
                q: 'Can I use these bottles for other liquids besides essential oils?',
                a: 'Absolutely! Miron glass is perfect for any sensitive organic materials including herbal tinctures, cosmetics, cooking oils, and even water. The protective properties benefit any natural substance.',
              },
              {
                q: 'How long will my oils last in Miron glass?',
                a: 'Studies have shown that essential oils stored in Miron glass maintain their potency and chemical composition for 2+ years, compared to 3-6 months in clear glass or 6-12 months in amber glass.',
              },
              {
                q: 'Are the bottles dishwasher safe?',
                a: 'We recommend hand washing your Miron bottles with warm water and mild soap. The glass itself is extremely durable, but the dropper and roller mechanisms are best preserved through gentle hand washing.',
              },
              {
                q: 'What is the Forever Bottle program?',
                a: 'When you purchase a 100ml Miron bottle, you can return it empty to us for a $5 store credit. We sanitize and refill the bottle, creating a sustainable closed-loop system.',
              },
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 border-t border-[#f5f3ef]/10">
        <div className="max-w-4xl mx-auto text-center">
          <Wine className="w-16 h-16 mx-auto mb-6 text-[#8B5CF6]" />
          <h2 className="font-serif text-3xl text-white mb-4">
            Experience the Miron Difference
          </h2>
          <p className="text-[#a69b8a] mb-8 max-w-xl mx-auto">
            Give your essential oils the protection they deserve with genuine 
            Miron Violet Glass bottles.
          </p>
          <a
            href="#products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#c9a227] text-[#0a080c] font-medium hover:bg-[#f5f3ef] transition-colors"
          >
            Shop Bottles
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </main>
  )
}

// ============================================================================
// COMPONENT: FAQ Item
// ============================================================================

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-[#f5f3ef]/10 bg-[#111] overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left"
      >
        <span className="text-[#f5f3ef] font-medium pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#8B5CF6] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#a69b8a] flex-shrink-0" />
        )}
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-5 pb-5"
        >
          <p className="text-[#a69b8a] leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </motion.div>
  )
}
