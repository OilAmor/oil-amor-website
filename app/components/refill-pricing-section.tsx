'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  RefreshCw, 
  Droplets,
  ChevronRight,
  Sparkles,
  Package,
  Unlock,
  FlaskConical,
  ArrowUpRight,
  Check
} from 'lucide-react'
import { calculatePrice, formatPrice } from '@/lib/content/pricing-engine-final'

interface RefillPricingSectionProps {
  oilId: string
  oilName: string
  selectedSizeId: string
}

export function RefillPricingSection({
  oilId,
  oilName,
  selectedSizeId,
}: RefillPricingSectionProps) {
  const [activeTab, setActiveTab] = useState<'calculator' | 'howitworks'>('calculator')
  const [selectedType, setSelectedType] = useState<'pure' | 'enhanced'>('pure')
  const [selectedRatio, setSelectedRatio] = useState(25)
  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('100ml')
  const [expandedStep, setExpandedStep] = useState<number | null>(1)

  // Calculate prices
  const prices = {
    '50ml': {
      pure: calculatePrice({ oilId, sizeMl: 50, type: 'pure', isRefill: true }),
      enhanced: {
        5: calculatePrice({ oilId, sizeMl: 50, type: 'carrier', ratio: 0.05, isRefill: true }),
        10: calculatePrice({ oilId, sizeMl: 50, type: 'carrier', ratio: 0.10, isRefill: true }),
        25: calculatePrice({ oilId, sizeMl: 50, type: 'carrier', ratio: 0.25, isRefill: true }),
        50: calculatePrice({ oilId, sizeMl: 50, type: 'carrier', ratio: 0.50, isRefill: true }),
        75: calculatePrice({ oilId, sizeMl: 50, type: 'carrier', ratio: 0.75, isRefill: true }),
      }
    },
    '100ml': {
      pure: calculatePrice({ oilId, sizeMl: 100, type: 'pure', isRefill: true }),
      enhanced: {
        5: calculatePrice({ oilId, sizeMl: 100, type: 'carrier', ratio: 0.05, isRefill: true }),
        10: calculatePrice({ oilId, sizeMl: 100, type: 'carrier', ratio: 0.10, isRefill: true }),
        25: calculatePrice({ oilId, sizeMl: 100, type: 'carrier', ratio: 0.25, isRefill: true }),
        50: calculatePrice({ oilId, sizeMl: 100, type: 'carrier', ratio: 0.50, isRefill: true }),
        75: calculatePrice({ oilId, sizeMl: 100, type: 'carrier', ratio: 0.75, isRefill: true }),
      }
    }
  }

  const currentPrice = selectedType === 'pure' 
    ? prices[selectedSize].pure 
    : prices[selectedSize].enhanced[selectedRatio as 5 | 10 | 25 | 50 | 75]

  const savingsVsOriginal = selectedSize === '100ml' 
    ? Math.round((calculatePrice({ oilId, sizeMl: 30, type: 'pure' }) * 3.3 - currentPrice) / (calculatePrice({ oilId, sizeMl: 30, type: 'pure' }) * 3.3) * 100)
    : Math.round((calculatePrice({ oilId, sizeMl: 30, type: 'pure' }) * 1.6 - currentPrice) / (calculatePrice({ oilId, sizeMl: 30, type: 'pure' }) * 1.6) * 100)

  const steps = [
    {
      id: 1,
      number: '01',
      title: 'Acquire Your Forever Bottle',
      subtitle: 'The foundation of sustainable luxury',
      content: `Your initial purchase includes a precision-crafted Miron Violetglass bottle with crystal infusion. Pure Essential oils feature a glass dropper for controlled dispensing. Carrier Enhanced blends include a medical-grade stainless steel rollerball for immediate topical application.`,
      details: ['Miron Violetglass biophotonic protection', 'Crystal-charged with synergistic gemstones', 'Precision dropper or rollerball applicator', 'Yours to keep forever']
    },
    {
      id: 2,
      number: '02', 
      title: 'Unlock Refill Privileges',
      subtitle: 'Permanent access to exclusive pricing',
      content: `Upon delivery, this oil type is permanently authenticated in your account. Pure Essential purchases unlock pure refills only. Carrier Enhanced purchases unlock all concentrations—5%, 10%, 25%, 50%, and 75%—with complete flexibility to adjust strength per order.`,
      details: ['Pure → Pure (100%) refills only', 'Enhanced → All strengths (5%-75%)', 'Switch concentrations anytime', 'Lifetime access for this oil type']
    },
    {
      id: 3,
      number: '03',
      title: 'Order Elite Refills',
      subtitle: 'Visit the refill store from your account',
      content: `Visit the Refill Store from your account dashboard to reorder 50ml or 100ml refills anytime. Each refill vessel includes a precision-engineered pour cap for seamless transfer into your Forever Bottle—zero spillage, zero waste.`,
      details: ['Access the Refill Store from your account', '50ml: Refills 30ml bottle 1.6x', '100ml: Refills 30ml bottle 3.3x (Best Value)', 'Precision pour cap included', 'No subscription required']
    },
    {
      id: 4,
      number: '04',
      title: 'Receive & Transfer',
      subtitle: 'Miron Violetglass delivered to your door',
      content: `Your refills ship in the same elite Miron Violetglass vessels as your original—filtering harmful light while preserving potency. Transfer using the included pour cap, or use directly from the refill vessel.`,
      details: ['Miron Violetglass biophotonic protection', 'Preserves potency & extends shelf life', 'Precision pour cap for spill-free transfer', 'Minimalist, plastic-free packaging']
    },
    {
      id: 5,
      number: '05',
      title: 'Return & Earn',
      subtitle: 'Optional circular economy participation',
      content: `Your empty refill vessels hold value. Return undamaged bottles via prepaid label for $5 account credit applicable to any purchase—or retain them for personal decanting, travel, or gifting. Your Forever Bottle (30ml or under) requires no return.`,
      details: ['Return optional—keep if preferred', '$5 credit per undamaged vessel', 'Prepaid label from your dashboard', 'Original bottle: yours forever']
    }
  ]

  return (
    <section className="mt-12">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#f5f3ef] flex items-center justify-center shadow-lg shadow-[#c9a227]/20">
          <RefreshCw className="w-7 h-7 text-[#0a080c]" />
        </div>
        <div>
          <h3 className="font-serif text-2xl text-[#f5f3ef]">The Forever Bottle Program</h3>
          <p className="text-[#a69b8a] text-sm">Sustainable luxury. Exclusive pricing. Lifetime access.</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-3xl bg-gradient-to-b from-[#111] to-[#0a080c] border border-[#f5f3ef]/10 overflow-hidden">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-[#f5f3ef]/10">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'calculator'
                ? 'text-[#f5f3ef] bg-[#f5f3ef]/5'
                : 'text-[#a69b8a] hover:text-[#f5f3ef]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Refill Pricing
          </button>
          <button
            onClick={() => setActiveTab('howitworks')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'howitworks'
                ? 'text-[#f5f3ef] bg-[#f5f3ef]/5'
                : 'text-[#a69b8a] hover:text-[#f5f3ef]'
            }`}
          >
            <Package className="w-4 h-4" />
            How It Works
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            
            {/* CALCULATOR TAB */}
            {activeTab === 'calculator' && (
              <motion.div
                key="calculator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Format Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedType('pure')}
                    className={`p-4 rounded-2xl border transition-all text-left ${
                      selectedType === 'pure'
                        ? 'bg-[#c9a227]/10 border-[#c9a227]'
                        : 'bg-[#0a080c] border-[#f5f3ef]/10 hover:border-[#f5f3ef]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${selectedType === 'pure' ? 'text-[#c9a227]' : 'text-[#f5f3ef]'}`}>
                        Pure Essential
                      </span>
                      {selectedType === 'pure' && <Check className="w-4 h-4 text-[#c9a227]" />}
                    </div>
                    <p className="text-xs text-[#a69b8a]">100% undiluted therapeutic oil</p>
                  </button>
                  
                  <button
                    onClick={() => setSelectedType('enhanced')}
                    className={`p-4 rounded-2xl border transition-all text-left ${
                      selectedType === 'enhanced'
                        ? 'bg-[#2ecc71]/10 border-[#2ecc71]'
                        : 'bg-[#0a080c] border-[#f5f3ef]/10 hover:border-[#f5f3ef]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${selectedType === 'enhanced' ? 'text-[#2ecc71]' : 'text-[#f5f3ef]'}`}>
                        Carrier Enhanced
                      </span>
                      {selectedType === 'enhanced' && <Check className="w-4 h-4 text-[#2ecc71]" />}
                    </div>
                    <p className="text-xs text-[#a69b8a]">Pre-diluted 5%—75% strength</p>
                  </button>
                </div>

                {/* Strength Selector (Enhanced only) */}
                <AnimatePresence>
                  {selectedType === 'enhanced' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-[#a69b8a] uppercase tracking-wider mb-3">Select Concentration</p>
                      <div className="grid grid-cols-5 gap-2">
                        {[5, 10, 25, 50, 75].map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() => setSelectedRatio(ratio)}
                            className={`py-3 rounded-xl text-sm font-medium transition-all ${
                              selectedRatio === ratio
                                ? 'bg-[#2ecc71] text-[#0a080c]'
                                : 'bg-[#0a080c] text-[#a69b8a] border border-[#f5f3ef]/10 hover:border-[#2ecc71]/50'
                            }`}
                          >
                            {ratio}%
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Size & Price Display */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* 50ml */}
                  <button
                    onClick={() => setSelectedSize('50ml')}
                    className={`relative p-6 rounded-2xl border transition-all text-left ${
                      selectedSize === '50ml'
                        ? 'bg-[#0a080c] border-[#c9a227]'
                        : 'bg-[#111] border-[#f5f3ef]/10 hover:border-[#f5f3ef]/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-[#a69b8a] text-xs uppercase tracking-wider mb-1">50ml Refill</p>
                        <p className="font-serif text-3xl text-[#f5f3ef]">
                          {formatPrice(selectedType === 'pure' ? prices['50ml'].pure : prices['50ml'].enhanced[selectedRatio as 5 | 10 | 25 | 50 | 75])}
                        </p>
                      </div>
                      {selectedSize === '50ml' && (
                        <div className="w-6 h-6 rounded-full bg-[#c9a227] flex items-center justify-center">
                          <Check className="w-4 h-4 text-[#0a080c]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#a69b8a]">Refills 30ml bottle 1.6×</p>
                  </button>

                  {/* 100ml - Featured */}
                  <button
                    onClick={() => setSelectedSize('100ml')}
                    className={`relative p-6 rounded-2xl border transition-all text-left overflow-hidden ${
                      selectedSize === '100ml'
                        ? 'bg-[#0a080c] border-[#c9a227]'
                        : 'bg-[#111] border-[#f5f3ef]/10 hover:border-[#f5f3ef]/30'
                    }`}
                  >
                    {/* Best Value Badge */}
                    <div className="absolute top-0 right-0 px-3 py-1 bg-[#c9a227] text-[#0a080c] text-xs font-medium rounded-bl-xl">
                      Best Value
                    </div>
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-[#a69b8a] text-xs uppercase tracking-wider mb-1">100ml Refill</p>
                        <p className="font-serif text-3xl text-[#f5f3ef]">
                          {formatPrice(selectedType === 'pure' ? prices['100ml'].pure : prices['100ml'].enhanced[selectedRatio as 5 | 10 | 25 | 50 | 75])}
                        </p>
                      </div>
                      {selectedSize === '100ml' && (
                        <div className="w-6 h-6 rounded-full bg-[#c9a227] flex items-center justify-center">
                          <Check className="w-4 h-4 text-[#0a080c]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#a69b8a]">Refills 30ml bottle 3.3×</p>
                    <p className="text-xs text-[#2ecc71] mt-1">Save {savingsVsOriginal}% vs buying bottles</p>
                  </button>
                </div>

                {/* Premium Inclusions */}
                <div className="p-4 rounded-2xl bg-[#0a080c] border border-[#f5f3ef]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <FlaskConical className="w-5 h-5 text-[#c9a227]" />
                    <span className="text-[#f5f3ef] font-medium">Premium Inclusions</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-xs text-[#a69b8a]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                      Miron Violetglass vessel
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#a69b8a]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                      Precision pour cap
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#a69b8a]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                      Biophotonic protection
                    </div>
                  </div>
                </div>

                {/* Note */}
                <p className="text-xs text-[#a69b8a] text-center">
                  Refills available after purchasing this oil. 
                  <button 
                    onClick={() => setActiveTab('howitworks')} 
                    className="text-[#c9a227] hover:underline ml-1"
                  >
                    Learn how it works
                  </button>
                </p>
              </motion.div>
            )}

            {/* HOW IT WORKS TAB */}
            {activeTab === 'howitworks' && (
              <motion.div
                key="howitworks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {steps.map((step) => (
                  <motion.div
                    key={step.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      expandedStep === step.id
                        ? 'bg-[#0a080c] border-[#c9a227]/40'
                        : 'bg-[#111] border-[#f5f3ef]/5 hover:border-[#f5f3ef]/20'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                      className="w-full p-5 flex items-center gap-4 text-left"
                    >
                      {/* Step Number */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg transition-all ${
                        expandedStep === step.id
                          ? 'bg-[#c9a227] text-[#0a080c]'
                          : 'bg-[#0a080c] text-[#c9a227] border border-[#c9a227]/30'
                      }`}>
                        {step.number}
                      </div>
                      
                      {/* Title */}
                      <div className="flex-1">
                        <h4 className={`font-medium transition-colors ${
                          expandedStep === step.id ? 'text-[#f5f3ef]' : 'text-[#a69b8a]'
                        }`}>
                          {step.title}
                        </h4>
                        {expandedStep !== step.id && (
                          <p className="text-xs text-[#a69b8a]/70 mt-0.5">{step.subtitle}</p>
                        )}
                      </div>
                      
                      {/* Arrow */}
                      <ChevronRight className={`w-5 h-5 text-[#a69b8a] transition-transform ${
                        expandedStep === step.id ? 'rotate-90' : ''
                      }`} />
                    </button>

                    <AnimatePresence>
                      {expandedStep === step.id && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-0">
                            <div className="pl-16">
                              <p className="text-[#a69b8a] text-sm leading-relaxed mb-4">
                                {step.content}
                              </p>
                              
                              {/* Detail Pills */}
                              <div className="flex flex-wrap gap-2">
                                {step.details.map((detail, i) => (
                                  <span 
                                    key={i}
                                    className="px-3 py-1.5 rounded-full bg-[#111] border border-[#f5f3ef]/10 text-xs text-[#a69b8a]"
                                  >
                                    {detail}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
