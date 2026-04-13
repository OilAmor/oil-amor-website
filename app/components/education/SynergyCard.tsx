'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles, FlaskConical, BookOpen, Sparkle } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Card } from '../../components/ui/Card'

export interface SynergyCardProps {
  oil: {
    name: string
    image: string
    origin: string
    note: string
  }
  crystal: {
    name: string
    image: string
    origin: string
    property: string
  }
  headline: string
  story: string
  scientificNote: string
  ritual: {
    title: string
    steps: string[]
  }
  className?: string
}

export function SynergyCard({
  oil,
  crystal,
  headline,
  story,
  scientificNote,
  ritual,
  className,
}: SynergyCardProps) {
  return (
    <Card variant="elevated" padding="lg" className={cn('overflow-hidden', className)}>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Visual Section */}
        <div className="relative">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-miron-dark/5 to-miron-dark/10">
            {/* Oil Image */}
            <div className="absolute top-4 left-4 w-1/2 aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={oil.image}
                alt={oil.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-miron-void/80 to-transparent">
                <p className="text-white text-xs font-medium">{oil.name}</p>
                <p className="text-white/60 text-[10px]">{oil.origin}</p>
              </div>
            </div>
            
            {/* Crystal Image */}
            <div className="absolute bottom-4 right-4 w-1/2 aspect-square rounded-lg overflow-hidden shadow-xl">
              <Image
                src={crystal.image}
                alt={crystal.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-miron-void/80 to-transparent">
                <p className="text-white text-xs font-medium">{crystal.name}</p>
                <p className="text-white/60 text-[10px]">{crystal.origin}</p>
              </div>
            </div>

            {/* Synergy Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full bg-gold-pure/20 backdrop-blur flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-gold-pure" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {/* Headline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-gold-dark" />
              <span className="text-xs uppercase tracking-wider text-gold-dark font-medium">
                Sacred Synergy
              </span>
            </div>
            <h3 className="font-display text-2xl lg:text-3xl text-miron-dark leading-tight">
              {headline}
            </h3>
          </div>

          {/* Story */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-miron-dark/40 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-miron-dark mb-1">The Story</h4>
                <p className="text-sm text-miron-dark/70 leading-relaxed">{story}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-miron-dark/40 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-miron-dark mb-1">Scientific Note</h4>
                <p className="text-sm text-miron-dark/70 leading-relaxed">{scientificNote}</p>
              </div>
            </div>
          </div>

          {/* Ritual */}
          <div className="p-4 rounded-xl bg-miron-dark/5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkle className="w-4 h-4 text-gold-dark" />
              <h4 className="text-sm font-medium text-miron-dark">{ritual.title}</h4>
            </div>
            <ol className="space-y-2">
              {ritual.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-miron-dark/70">
                  <span className="w-5 h-5 rounded-full bg-gold-pure/20 text-gold-dark text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default SynergyCard
