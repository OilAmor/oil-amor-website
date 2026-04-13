'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Unlock, 
  Droplets, 
  Truck, 
  RotateCcw,
  ChevronRight,
  Beaker,
  CircleDot,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react'
import Link from 'next/link'

// ============================================================================
// TYPES
// ============================================================================
interface Step {
  id: number
  number: string
  title: string
  subtitle: string
  description: string
  icon: React.ElementType
  details: {
    title: string
    points: string[]
  }[]
  cta?: {
    label: string
    href: string
  }
  color: string
}

// ============================================================================
// STEP DATA - ENTERPRISE GRADE
// ============================================================================
const STEPS: Step[] = [
  {
    id: 1,
    number: '01',
    title: 'Acquisition',
    subtitle: 'Your Forever Bottle',
    description: 'Select any oil from our curated collection. Your initial purchase includes a precision-applicator Forever Bottle in Miron Violetglass, charged with crystal synergies. This is the foundation of your sustainable wellness journey.',
    icon: ShoppingBag,
    details: [
      {
        title: 'Pure Essential Oil',
        points: [
          'Precision glass dropper for controlled dispensing',
          'Undiluted therapeutic-grade essential oil',
          'Crystal-charged with 12 chips (30ml)',
          'Miron Violetglass biophotonic protection'
        ]
      },
      {
        title: 'Carrier Enhanced Blend',
        points: [
          'Medical-grade stainless steel rollerball',
          'Pre-diluted for immediate topical application',
          '5% to 75% concentration options',
          'Synergistic carrier oil pairing'
        ]
      }
    ],
    cta: {
      label: 'Explore Collection',
      href: '/oils'
    },
    color: '#c9a227'
  },
  {
    id: 2,
    number: '02',
    title: 'Authentication',
    subtitle: 'Permanent Unlock',
    description: 'Upon delivery, your oil type is permanently authenticated in our system. This exclusive access grants you lifetime refill privileges for that specific oil—pure or enhanced, any concentration, forever.',
    icon: Unlock,
    details: [
      {
        title: 'Pure Essential Unlock',
        points: [
          'Access to 100% pure essential oil refills only',
          '50ml and 100ml Miron Violetglass vessels',
          'Precision pour cap included',
          'Identical therapeutic grade as original'
        ]
      },
      {
        title: 'Enhanced Blend Unlock',
        points: [
          'Full spectrum: 5%, 10%, 25%, 50%, 75% concentrations',
          'Flexibility to adjust strength per order',
          'Same carrier oil or alternative selection',
          'Complete formulation control'
        ]
      }
    ],
    color: '#2ecc71'
  },
  {
    id: 3,
    number: '03',
    title: 'Replenishment',
    subtitle: 'Elite Refill Selection',
    description: 'From your private account dashboard, access your authenticated oils. Select your vessel size, formulation, and concentration. Each refill arrives with a precision pour cap for seamless transfer into your Forever Bottle.',
    icon: Droplets,
    details: [
      {
        title: '50ml Refill Vessel',
        points: [
          'Refills 30ml Forever Bottle 1.6x',
          'Ideal for personal rotation',
          'Compact storage footprint',
          'Premium Miron Violetglass construction'
        ]
      },
      {
        title: '100ml Refill Vessel',
        points: [
          'Refills 30ml Forever Bottle 3.3x',
          'Maximum value proposition',
          'Best price-per-milliliter ratio',
          'Recommended for daily-use oils'
        ]
      }
    ],
    cta: {
      label: 'View Pricing',
      href: '#refill-grid'
    },
    color: '#c9a227'
  },
  {
    id: 4,
    number: '04',
    title: 'Delivery',
    subtitle: 'Direct to Your Door',
    description: 'Your refills ship in premium Miron Violetglass vessels identical to your Forever Bottle. Each package includes a precision pour cap for spill-free transfer. Unbox, uncap, and replenish your collection with zero waste.',
    icon: Truck,
    details: [
      {
        title: 'Premium Packaging',
        points: [
          'Miron Violetglass biophotonic protection',
          'Precision pour cap included',
          'Minimalist, plastic-free packaging',
          'Carbon-neutral shipping option'
        ]
      },
      {
        title: 'Transfer Ritual',
        points: [
          'Attach pour cap to refill vessel',
          'Invert over Forever Bottle',
          'Controlled flow, zero spillage',
          'Your crystals remain in place'
        ]
      }
    ],
    color: '#2ecc71'
  },
  {
    id: 5,
    number: '05',
    title: 'Circulation',
    subtitle: 'Optional Return & Reward',
    description: 'Your empty refill vessels hold value. Return them undamaged via prepaid label for a $5 account credit—applicable to any future purchase. Or retain them for your own decanting needs. The choice is entirely yours.',
    icon: RotateCcw,
    details: [
      {
        title: 'Return for Credit',
        points: [
          'Prepaid return label via account dashboard',
          '$5 credit per undamaged vessel',
          'Credit applies to any Oil Amor product',
          'Stackable with other promotions'
        ]
      },
      {
        title: 'Retain for Reuse',
        points: [
          'Vessels perfect for DIY formulations',
          'Travel-size decanting',
          'Gifting to friends and family',
          'Personal organization systems'
        ]
      }
    ],
    cta: {
      label: 'Learn More',
      href: '/sustainability'
    },
    color: '#2ecc71'
  }
]

// ============================================================================
// STEP CARD COMPONENT
// ============================================================================
function StepCard({ step, index, isActive, onActivate }: { 
  step: Step
  index: number
  isActive: boolean
  onActivate: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const Icon = step.icon
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Connection Line */}
      {index < STEPS.length - 1 && (
        <div className="hidden lg:block absolute top-20 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: index * 0.15 + 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full origin-left"
            style={{ 
              background: `linear-gradient(90deg, ${step.color}40, ${STEPS[index + 1].color}40)` 
            }}
          />
        </div>
      )}
      
      {/* Card */}
      <motion.div
        onClick={onActivate}
        className={`relative p-6 lg:p-8 rounded-2xl cursor-pointer transition-all duration-500 ${
          isActive 
            ? 'bg-[#111] border border-[#f5f3ef]/20' 
            : 'bg-transparent border border-[#f5f3ef]/5 hover:border-[#f5f3ef]/10'
        }`}
        whileHover={{ y: -4 }}
      >
        {/* Number Badge */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            animate={{ 
              backgroundColor: isActive ? step.color : 'rgba(245, 243, 239, 0.05)',
              borderColor: isActive ? step.color : 'rgba(245, 243, 239, 0.1)'
            }}
            className="w-16 h-16 rounded-2xl border flex items-center justify-center"
          >
            <span 
              className="font-serif text-2xl transition-colors duration-300"
              style={{ color: isActive ? '#0a080c' : step.color }}
            >
              {step.number}
            </span>
          </motion.div>
          
          <motion.div
            animate={{ rotate: isActive ? 90 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 rounded-full border border-[#f5f3ef]/10 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-[#a69b8a]" />
          </motion.div>
        </div>
        
        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${step.color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color: step.color }} />
          </div>
          <div>
            <h3 className="font-serif text-xl lg:text-2xl text-[#f5f3ef] mb-1">
              {step.title}
            </h3>
            <p className="text-sm text-[#a69b8a] tracking-wide uppercase">
              {step.subtitle}
            </p>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-[#a69b8a] text-sm leading-relaxed mb-6">
          {step.description}
        </p>
        
        {/* Expanded Content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t border-[#f5f3ef]/10">
                <div className="grid md:grid-cols-2 gap-6">
                  {step.details.map((detail, i) => (
                    <motion.div
                      key={detail.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-xl bg-[#0a080c] border border-[#f5f3ef]/5"
                    >
                      <h4 className="text-[#f5f3ef] font-medium text-sm mb-3 flex items-center gap-2">
                        {i === 0 ? (
                          <Beaker className="w-4 h-4" style={{ color: step.color }} />
                        ) : (
                          <CircleDot className="w-4 h-4" style={{ color: step.color }} />
                        )}
                        {detail.title}
                      </h4>
                      <ul className="space-y-2">
                        {detail.points.map((point, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-[#a69b8a]">
                            <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: step.color }} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
                
                {/* CTA */}
                {step.cta && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                  >
                    <Link
                      href={step.cta.href}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all"
                      style={{ 
                        backgroundColor: `${step.color}20`,
                        color: step.color,
                        border: `1px solid ${step.color}40`
                      }}
                    >
                      {step.cta.label}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Active Indicator */}
        <motion.div
          initial={false}
          animate={{ 
            opacity: isActive ? 1 : 0,
            scale: isActive ? 1 : 0.8
          }}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
          style={{ backgroundColor: step.color }}
        />
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// PROGRESS INDICATOR
// ============================================================================
function ProgressIndicator({ activeStep }: { activeStep: number }) {
  return (
    <div className="hidden lg:flex items-center justify-center gap-2 mb-16">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <motion.button
            onClick={() => {}}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index + 1 === activeStep 
                ? 'bg-[#f5f3ef] scale-125' 
                : index + 1 < activeStep 
                  ? 'bg-[#f5f3ef]/50' 
                  : 'bg-[#f5f3ef]/10'
            }`}
          />
          {index < STEPS.length - 1 && (
            <div className="w-8 h-px bg-[#f5f3ef]/10 mx-2" />
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function RefillSteps() {
  const [activeStep, setActiveStep] = useState(1)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  
  return (
    <section ref={sectionRef} className="py-24 lg:py-32 px-6 border-y border-[#f5f3ef]/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 lg:mb-24"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-8">
            <Sparkles className="w-4 h-4 text-[#c9a227]" />
            <span className="text-[#c9a227] text-sm font-medium tracking-wide">The Forever Bottle Program</span>
          </div>
          
          {/* Title */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#f5f3ef] mb-6">
            Five Steps to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#c9a227] via-[#f5f3ef] to-[#2ecc71]">
              Sustainable Luxury
            </span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-[#a69b8a] text-lg max-w-2xl mx-auto leading-relaxed">
            An elegant ecosystem designed for the discerning connoisseur. 
            Premium oils, perpetual value, zero compromise.
          </p>
        </motion.div>
        
        {/* Progress */}
        <ProgressIndicator activeStep={activeStep} />
        
        {/* Steps Grid */}
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-4">
          {STEPS.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              isActive={activeStep === step.id}
              onActivate={() => setActiveStep(step.id)}
            />
          ))}
        </div>
        
        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-[#a69b8a]">
            Questions? Visit our{' '}
            <Link href="/faq" className="text-[#c9a227] hover:underline">
              FAQ
            </Link>
            {' '}or{' '}
            <Link href="/contact" className="text-[#c9a227] hover:underline">
              contact our concierge
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
