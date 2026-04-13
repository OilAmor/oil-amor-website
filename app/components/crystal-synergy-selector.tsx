'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OilProfile, CrystalPairing } from '../../lib/content/oil-crystal-synergies'
import { Check, Sparkles, Music, Heart, Zap, Shield } from 'lucide-react'

interface CrystalSynergySelectorProps {
  oil: OilProfile
  onCrystalSelect?: (crystal: CrystalPairing) => void
}

export function CrystalSynergySelector({ oil, onCrystalSelect }: CrystalSynergySelectorProps) {
  const [selectedCrystal, setSelectedCrystal] = useState<CrystalPairing>(oil.crystalPairings[0])

  const handleCrystalSelect = (crystal: CrystalPairing) => {
    setSelectedCrystal(crystal)
    onCrystalSelect?.(crystal)
  }

  const getChakraIcon = (chakra: string) => {
    switch (chakra) {
      case 'root': return <div className="w-3 h-3 rounded-full bg-red-600" />
      case 'sacral': return <div className="w-3 h-3 rounded-full bg-orange-500" />
      case 'solar-plexus': return <div className="w-3 h-3 rounded-full bg-yellow-500" />
      case 'heart': return <Heart className="w-3 h-3 text-green-500" />
      case 'throat': return <div className="w-3 h-3 rounded-full bg-blue-500" />
      case 'third-eye': return <div className="w-3 h-3 rounded-full bg-purple-500" />
      case 'crown': return <div className="w-3 h-3 rounded-full bg-violet-400" />
      default: return <div className="w-3 h-3 rounded-full bg-gray-500" />
    }
  }

  const getElementIcon = (element: string) => {
    switch (element) {
      case 'fire': return <Zap className="w-3 h-3 text-orange-400" />
      case 'water': return <div className="w-3 h-3 rounded-full bg-blue-400" />
      case 'earth': return <div className="w-3 h-3 rounded-full bg-amber-700" />
      case 'air': return <div className="w-3 h-3 rounded-full bg-gray-300" />
      default: return null
    }
  }

  return (
    <div className="space-y-12">
      {/* Crystal Selection Grid */}
      <div>
        <h3 className="text-[0.625rem] uppercase tracking-[0.3em] text-[#a69b8a] mb-6">
          Choose Your Crystal Pairing
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {oil.crystalPairings.map((crystal) => (
            <motion.button
              key={crystal.id}
              onClick={() => handleCrystalSelect(crystal)}
              className={`relative p-6 text-left border transition-all duration-500 group ${
                selectedCrystal.id === crystal.id
                  ? 'border-[#c9a227] bg-[#c9a227]/5'
                  : 'border-[#262228] bg-[#141218] hover:border-[#3d383f]'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selected Indicator */}
              {selectedCrystal.id === crystal.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#c9a227] flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-[#0a080c]" />
                </motion.div>
              )}

              {/* Crystal Color Indicator */}
              <div
                className="w-12 h-12 rounded-full mb-4 shadow-lg"
                style={{ backgroundColor: crystal.color, boxShadow: `0 0 20px ${crystal.color}40` }}
              />

              {/* Crystal Name */}
              <h4 className="font-display text-xl text-[#f5f3ef] mb-1">
                {crystal.name}
              </h4>
              
              {/* Technical Name */}
              <p className="text-[0.625rem] text-[#a69b8a] italic mb-3">
                {crystal.technicalName.split(' - ')[0]}
              </p>

              {/* Chakra & Element */}
              <div className="flex items-center gap-3 text-[0.625rem] uppercase tracking-wider text-[#a69b8a]">
                <span className="flex items-center gap-1.5">
                  {getChakraIcon(crystal.chakra)}
                  {crystal.chakra}
                </span>
                <span className="flex items-center gap-1.5">
                  {getElementIcon(crystal.element)}
                  {crystal.element}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Dynamic Synergy Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCrystal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="border border-[#262228] bg-[#141218]/50 p-8 lg:p-12"
        >
          {/* Synergy Title */}
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-[#c9a227]" />
            <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#c9a227]">
              The Synergy
            </span>
          </div>

          <h2 className="font-display text-3xl lg:text-4xl text-[#f5f3ef] mb-6">
            {selectedCrystal.synergyTitle}
          </h2>

          {/* Synergy Description */}
          <p className="text-[#a69b8a] leading-relaxed mb-8 text-lg">
            {selectedCrystal.synergyDescription}
          </p>

          {/* Ritual Section */}
          <div className="border-t border-[#262228] pt-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-4 h-4 text-[#c9a227]" />
              <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#c9a227]">
                The Ritual
              </span>
            </div>
            <p className="text-[#f5f3ef] leading-relaxed italic">
              {selectedCrystal.ritual}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCrystal.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227] mt-2 flex-shrink-0" />
                <span className="text-[#a69b8a] text-sm">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* Frequency */}
          {selectedCrystal.frequency && (
            <div className="mt-8 pt-8 border-t border-[#262228] flex items-center gap-3">
              <Music className="w-4 h-4 text-[#c9a227]" />
              <span className="text-[0.625rem] uppercase tracking-[0.3em] text-[#c9a227]">
                Healing Frequency
              </span>
              <span className="text-[#f5f3ef] ml-auto">
                {selectedCrystal.frequency}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
