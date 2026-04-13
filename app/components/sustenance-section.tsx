'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Layers, RefreshCw } from 'lucide-react'

const pillars = [
  {
    icon: Shield,
    title: 'Eternal Refill',
    description: 'Your Miron bottle is designed for infinite refills. Bring it to any boutique or order by post.',
  },
  {
    icon: Layers,
    title: 'Direct Trade',
    description: 'We work directly with distillers and miners. Fair wages. Complete traceability. No middlemen.',
  },
  {
    icon: RefreshCw,
    title: 'Zero Waste',
    description: 'Plastic-free packaging. Compostable fillers. Every pouch returned earns account credit.',
  },
]

const stats = [
  { value: 2847, label: 'Bottles refilled this month', suffix: '' },
  { value: 142, label: 'Kilograms of plastic prevented', suffix: 'kg' },
  { value: 1, label: 'Percent for the Planet', suffix: '%' },
]

export function SustenanceSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' })

  return (
    <section 
      id="sustenance" 
      ref={sectionRef}
      className="py-24 lg:py-32 bg-miron-void text-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[400px] lg:h-[500px] hidden lg:flex items-center justify-center"
          >
            {/* Earth Layer */}
            <div 
              className="absolute w-[350px] h-[350px] rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #251440 0%, #1a0f2e 50%, #0a0612 100%)',
                opacity: 0.5,
              }}
            />
            
            {/* Crystal Layer */}
            <motion.div
              className="absolute w-[250px] h-[250px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(201,162,39,0.2) 0%, transparent 70%)',
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* Glow Layer */}
            <div 
              className="absolute w-[150px] h-[150px] rounded-full blur-[40px]"
              style={{
                background: 'radial-gradient(circle, #c9a227 0%, transparent 70%)',
                opacity: 0.3,
              }}
            />
          </motion.div>

          {/* Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="section-eyebrow"
            >
              <span className="bg-gold-light" />
              Sustenance
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-display text-4xl lg:text-5xl font-light text-white leading-tight mb-12"
            >
              Everything returns<br />to the <em className="text-gold-light italic">earth</em>.
            </motion.h2>

            {/* Pillars */}
            <div className="space-y-8 mb-12">
              {pillars.map((pillar, index) => (
                <Pillar key={pillar.title} pillar={pillar} index={index} isInView={isInView} />
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10"
            >
              {stats.map((stat) => (
                <Stat key={stat.label} stat={stat} isInView={isInView} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Pillar({ 
  pillar, 
  index,
  isInView 
}: { 
  pillar: typeof pillars[0]
  index: number
  isInView: boolean 
}) {
  const Icon = pillar.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2 + index * 0.1 
      }}
      className="flex gap-6"
    >
      <div className="w-16 h-16 rounded-full border border-gold-pure/30 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-gold-pure" />
      </div>
      <div>
        <h4 className="font-display text-xl text-white mb-2">
          {pillar.title}
        </h4>
        <p className="text-white/60 leading-relaxed">
          {pillar.description}
        </p>
      </div>
    </motion.div>
  )
}

function Stat({ stat, isInView }: { stat: typeof stats[0]; isInView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const startTime = performance.now()

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(stat.value * easeOut)
      
      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)
  }, [isInView, stat.value])

  return (
    <div className="text-center lg:text-left">
      <span className="font-display text-3xl lg:text-4xl text-gold-pure block">
        {count.toLocaleString()}{stat.suffix}
      </span>
      <span className="text-xs text-white/50 mt-1 block">
        {stat.label}
      </span>
    </div>
  )
}
