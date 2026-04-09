'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface RitualStep {
  title: string
  description: string
  duration?: string
  tip?: string
}

export interface RitualStepsProps {
  title: string
  subtitle?: string
  steps: RitualStep[]
  variant?: 'accordion' | 'timeline' | 'cards'
  className?: string
}

export function RitualSteps({
  title,
  subtitle,
  steps,
  variant = 'accordion',
  className,
}: RitualStepsProps) {
  const [openStep, setOpenStep] = useState<number | null>(0)

  if (variant === 'timeline') {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="text-center mb-8">
          <h3 className="font-display text-2xl text-miron-dark mb-2">{title}</h3>
          {subtitle && <p className="text-miron-dark/60">{subtitle}</p>}
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gold-pure/30" />

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12"
              >
                {/* Step Number */}
                <div className="absolute left-0 w-8 h-8 rounded-full bg-gold-pure text-miron-void font-display font-medium flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="pb-2">
                  <h4 className="font-display text-lg text-miron-dark mb-1">{step.title}</h4>
                  <p className="text-sm text-miron-dark/70 leading-relaxed">{step.description}</p>
                  {step.duration && (
                    <span className="inline-block mt-2 text-xs text-gold-dark font-medium">
                      {step.duration}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'cards') {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="text-center mb-8">
          <h3 className="font-display text-2xl text-miron-dark mb-2">{title}</h3>
          {subtitle && <p className="text-miron-dark/60">{subtitle}</p>}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-cream-warm/50 border border-miron-dark/5 hover:border-gold-pure/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gold-pure/20 flex items-center justify-center text-gold-dark font-display font-medium mb-4">
                {index + 1}
              </div>
              <h4 className="font-display text-lg text-miron-dark mb-2">{step.title}</h4>
              <p className="text-sm text-miron-dark/70 leading-relaxed mb-3">{step.description}</p>
              {step.duration && (
                <span className="text-xs text-gold-dark font-medium">{step.duration}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Accordion variant (default)
  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-center mb-8">
        <h3 className="font-display text-2xl text-miron-dark mb-2">{title}</h3>
        {subtitle && <p className="text-miron-dark/60">{subtitle}</p>}
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              'border rounded-xl overflow-hidden transition-colors',
              openStep === index
                ? 'border-gold-pure/30 bg-gold-pure/5'
                : 'border-miron-dark/10 hover:border-miron-dark/20'
            )}
          >
            <button
              type="button"
              onClick={() => setOpenStep(openStep === index ? null : index)}
              className="w-full flex items-center gap-4 p-4 text-left"
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-display font-medium text-sm transition-colors',
                  openStep === index
                    ? 'bg-gold-pure text-miron-void'
                    : 'bg-miron-dark/10 text-miron-dark'
                )}
              >
                {openStep === index ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="flex-1 font-medium text-miron-dark">{step.title}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-miron-dark/40 transition-transform',
                  openStep === index && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {openStep === index && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-4 pb-4 pt-0">
                    <div className="pl-12">
                      <p className="text-sm text-miron-dark/70 leading-relaxed mb-3">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-4">
                        {step.duration && (
                          <span className="text-xs text-gold-dark font-medium">
                            {step.duration}
                          </span>
                        )}
                        {step.tip && (
                          <span className="text-xs text-miron-dark/50 italic">{step.tip}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RitualSteps
