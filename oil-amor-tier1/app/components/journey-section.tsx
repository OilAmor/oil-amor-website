'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Immerse',
    description: 'Receive your Miron Violetglass vessel. Inside: pure essential oil meeting ethically-sourced crystal chips. Each stone drilled and waiting.',
    color: 'immerse',
  },
  {
    number: '02',
    title: 'Infuse',
    description: 'With each drop, the crystals absorb the oil\'s aromatic signature. Days become weeks. The stones become saturated with your personal ritual.',
    color: 'infuse',
  },
  {
    number: '03',
    title: 'Transcend',
    description: 'The bottle empties. Thread the crystals using the included silk cord. Create your bracelet, your necklace, your amulet — scented with memory.',
    color: 'transcend',
  },
]

export function JourneySection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' })

  return (
    <section 
      id="journey" 
      ref={sectionRef}
      className="py-24 lg:py-32 bg-cream-warm"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="section-eyebrow justify-center"
          >
            <span />
            The Journey
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl font-light text-miron-void"
          >
            From vessel to <em className="text-miron-light italic">veneration</em>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 mb-20">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* Transformation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="bg-white rounded-lg p-8 lg:p-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
        >
          {/* Before */}
          <div className="text-center">
            <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-6 block">
              The Vessel
            </span>
            <div className="w-40 h-40 flex items-center justify-center">
              <div className="relative w-12 h-28 rounded-lg overflow-hidden bg-gradient-to-br from-miron-mid to-miron-base">
                <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-b from-gold-pure/40 to-gold-pure/60" />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[6px] tracking-widest text-white/60">
                  ✦✦✦
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className="w-16 h-5 text-gold-pure hidden md:block" />
          <ArrowRight className="w-5 h-16 text-gold-pure md:hidden rotate-90" />

          {/* After */}
          <div className="text-center">
            <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-6 block">
              The Artifact
            </span>
            <div className="w-40 h-40 flex items-center justify-center">
              <div className="relative">
                <div className="w-20 h-0.5 bg-gold-pure rounded-full" />
                <div className="flex justify-center gap-3 -mt-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 bg-gradient-to-br from-miron-glow to-gold-pure"
                      style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-10%' })

  const circleColors: Record<string, string> = {
    immerse: 'from-miron-glow to-miron-base',
    infuse: 'from-gold-pure/40 to-gold-pure/20',
    transcend: 'from-gold-light to-gold-pure',
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.15 
      }}
      className="text-center"
    >
      <span className="font-display text-sm font-semibold text-gold-pure mb-6 block">
        {step.number}
      </span>
      
      {/* Visual Circle */}
      <div className="w-24 h-24 mx-auto mb-6 rounded-full border border-gold-pure flex items-center justify-center">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-b ${circleColors[step.color]}`} />
      </div>
      
      <h3 className="font-display text-2xl lg:text-3xl text-miron-void mb-4">
        {step.title}
      </h3>
      <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
        {step.description}
      </p>
    </motion.div>
  )
}
