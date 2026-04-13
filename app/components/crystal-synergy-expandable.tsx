'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Sparkles, Zap, Heart, Sun, Moon, Wind } from 'lucide-react'
import type { CrystalPairing } from '@/lib/content/oil-crystal-synergies'

interface CrystalSynergyExpandableProps {
  crystal: CrystalPairing
}

const CHAKRA_ICONS: Record<string, typeof Heart> = {
  'root': Zap,
  'sacral': Sun,
  'solar-plexus': Sun,
  'heart': Heart,
  'throat': Wind,
  'third-eye': Moon,
  'crown': Sparkles,
}

const CHAKRA_COLORS: Record<string, string> = {
  'root': '#dc2626',
  'sacral': '#ea580c',
  'solar-plexus': '#ca8a04',
  'heart': '#16a34a',
  'throat': '#0891b2',
  'third-eye': '#7c3aed',
  'crown': '#9333ea',
}

export function CrystalSynergyExpandable({ crystal }: CrystalSynergyExpandableProps) {
  const [expanded, setExpanded] = useState(false)
  
  const ChakraIcon = CHAKRA_ICONS[crystal.chakra] || Sparkles
  const chakraColor = CHAKRA_COLORS[crystal.chakra] || '#c9a227'
  
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#c9a227]/5 to-transparent border border-[#c9a227]/20">
      {/* Header with Crystal Name */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[#f5f3ef] font-medium text-lg">{crystal.name}</h3>
          <p className="text-[#a69b8a] text-sm mt-1">{crystal.frequency} • {crystal.chakra} chakra</p>
        </div>
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${chakraColor}20` }}
        >
          <ChakraIcon className="w-6 h-6" style={{ color: chakraColor }} />
        </div>
      </div>
      
      {/* Always Visible - Short Description */}
      <p className="text-[#f5f3ef]/80 text-sm leading-relaxed mb-4">
        {crystal.synergyDescription}
      </p>
      
      {/* Expand Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2.5 rounded-lg border border-[#c9a227]/30 text-[#c9a227] text-sm font-medium 
                   flex items-center justify-center gap-2 hover:bg-[#c9a227]/10 transition-colors"
      >
        {expanded ? 'Show Less' : 'Explore Full Synergy'}
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {/* Ritual Description */}
              {(crystal as any).ritualDescription && (
                <div className="p-4 rounded-xl bg-[#111] border border-[#f5f3ef]/10">
                  <h4 className="text-[#c9a227] text-sm font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Ritual Practice
                  </h4>
                  <p className="text-[#a69b8a] text-sm leading-relaxed">
                    {(crystal as any).ritualDescription}
                  </p>
                </div>
              )}
              
              {/* Chakra Information */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#111] border border-[#f5f3ef]/10">
                  <p className="text-[#a69b8a] text-xs mb-1">Chakra</p>
                  <p className="text-[#f5f3ef] text-sm capitalize">{crystal.chakra.replace('-', ' ')}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#111] border border-[#f5f3ef]/10">
                  <p className="text-[#a69b8a] text-xs mb-1">Frequency</p>
                  <p className="text-[#f5f3ef] text-sm">{crystal.frequency}</p>
                </div>
              </div>
              
              {/* Benefits Grid */}
              {crystal.benefits && crystal.benefits.length > 0 && (
                <div>
                  <h4 className="text-[#f5f3ef] text-sm font-medium mb-2">Combined Benefits</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {crystal.benefits.map((benefit, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#111] border border-[#f5f3ef]/5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                        <span className="text-[#a69b8a] text-xs">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Intentions */}
              {'intentions' in crystal && Array.isArray((crystal as any).intentions) && (crystal as any).intentions.length > 0 && (
                <div>
                  <h4 className="text-[#f5f3ef] text-sm font-medium mb-2">Intentions</h4>
                  <div className="flex flex-wrap gap-2">
                    {(crystal as any).intentions.map((intention: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full bg-[#c9a227]/10 text-[#c9a227] text-xs border border-[#c9a227]/20"
                      >
                        {intention}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Zodiac Affinities */}
              {'zodiac' in crystal && Array.isArray((crystal as any).zodiac) && (crystal as any).zodiac.length > 0 && (
                <div className="flex items-center gap-3 pt-2 border-t border-[#f5f3ef]/10">
                  <span className="text-[#a69b8a] text-xs">Zodiac Affinity:</span>
                  <div className="flex gap-1">
                    {(crystal as any).zodiac.map((sign: string, i: number) => (
                      <span key={i} className="text-[#f5f3ef] text-xs">{sign}{i < (crystal as any).zodiac.length - 1 ? ',' : ''}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
