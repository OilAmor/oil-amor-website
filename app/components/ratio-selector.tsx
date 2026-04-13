'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Droplets,
  Info,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import {
  CARRIER_RATIOS,
  getRatioBenefits,
  getSafetyWarnings,
  getRecommendedRatio,
  USE_CASE_DESCRIPTIONS,
  type RatioPreset,
  type UseCase,
} from '@/lib/content/ratio-engine'
import { formatPrice } from '@/lib/content/pricing-engine-final'

interface RatioSelectorProps {
  oilId: string
  selectedRatio: RatioPreset | undefined
  onRatioChange: (ratio: RatioPreset) => void
  currentPrice?: number
}

export function RatioSelector({ 
  oilId, 
  selectedRatio,
  onRatioChange,
  currentPrice,
}: RatioSelectorProps) {
  const [useCase, setUseCase] = useState<UseCase>('daily')
  const [showDetails, setShowDetails] = useState(false)
  
  // Default to first ratio if none selected
  const effectiveRatio = selectedRatio || CARRIER_RATIOS[0]
  
  const benefits = getRatioBenefits(oilId, effectiveRatio.id)
  const warnings = getSafetyWarnings(oilId, effectiveRatio)
  
  const handleRatioSelect = (ratio: RatioPreset) => {
    onRatioChange(ratio)
  }
  
  const handleUseCaseSelect = (newUseCase: UseCase) => {
    setUseCase(newUseCase)
    const recommendedRatioId = getRecommendedRatio(newUseCase)
    const recommendedRatio = CARRIER_RATIOS.find(r => r.id === recommendedRatioId)
    if (recommendedRatio) {
      onRatioChange(recommendedRatio)
    }
  }
  
  // Don't render if no ratio available
  if (!selectedRatio) return null
  
  return (
    <div className="space-y-4 pt-4 border-t border-[#f5f3ef]/10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[#f5f3ef] font-medium flex items-center gap-2">
          <Droplets className="w-4 h-4 text-[#c9a227]" />
          Enhancement Strength
          <span className="text-xs text-[#a69b8a] font-normal">(Max 75%)</span>
        </h3>
      </div>
      
      {/* Visual Ratio Bar */}
      <div className="relative h-12 rounded-xl overflow-hidden bg-[#111] border border-[#f5f3ef]/10">
        {/* Essential Oil Portion */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#c9a227] to-[#c9a227]/80 flex items-center justify-center"
          initial={{ width: 0 }}
          animate={{ width: `${effectiveRatio.essentialOilPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {effectiveRatio.essentialOilPercent >= 15 && (
            <span className="text-[#0a080c] font-bold text-sm">
              {effectiveRatio.essentialOilPercent}%
            </span>
          )}
        </motion.div>
        
        {/* Carrier Oil Portion */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 bg-[#f5f3ef]/5 flex items-center justify-end pr-4"
          initial={{ width: 0 }}
          animate={{ width: `${effectiveRatio.carrierOilPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {effectiveRatio.carrierOilPercent >= 25 && (
            <span className="text-[#a69b8a] text-xs">
              {effectiveRatio.carrierOilPercent}% Carrier
            </span>
          )}
        </motion.div>
        
        {/* Divider */}
        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-[#0a080c]"
          style={{ left: `${effectiveRatio.essentialOilPercent}%` }}
        />
      </div>
      
      {/* Quick Select Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {CARRIER_RATIOS.map((preset) => (
          <motion.button
            key={preset.id}
            onClick={() => handleRatioSelect(preset)}
            className={`relative p-3 rounded-lg border transition-all ${
              effectiveRatio.id === preset.id
                ? 'bg-[#c9a227]/20 border-[#c9a227]'
                : 'bg-[#0a080c]/50 border-[#f5f3ef]/10 hover:border-[#f5f3ef]/30'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <p className={`text-xs font-medium ${
              effectiveRatio.id === preset.id ? 'text-[#c9a227]' : 'text-[#f5f3ef]'
            }`}>
              {preset.essentialOilPercent}%
            </p>
            <p className="text-[10px] text-[#a69b8a] mt-0.5">{preset.name}</p>
            
            {effectiveRatio.id === preset.id && (
              <motion.div
                layoutId="ratioCheck"
                className="absolute -top-1 -right-1 w-4 h-4 bg-[#c9a227] rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-[#0a080c]" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Use Case Selector */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(USE_CASE_DESCRIPTIONS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => handleUseCaseSelect(key as UseCase)}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
              useCase === key
                ? 'bg-[#c9a227] text-[#0a080c]'
                : 'bg-[#111] text-[#a69b8a] hover:text-[#f5f3ef]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      
      {/* Benefits & Description */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-[#c9a227]/5 to-transparent border border-[#c9a227]/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c9a227]/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#c9a227]" />
          </div>
          <div>
            <h4 className="text-[#f5f3ef] font-medium text-sm">{benefits?.benefit}</h4>
            <p className="text-[#a69b8a] text-sm mt-1">{benefits?.explanation}</p>
          </div>
        </div>
      </div>
      
      {/* Warnings */}
      <AnimatePresence>
        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {warnings.map((warning, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg flex items-start gap-2 ${
                  warning.severity === 'danger'
                    ? 'bg-red-500/10 border border-red-500/30'
                    : warning.severity === 'warning'
                    ? 'bg-orange-500/10 border border-orange-500/30'
                    : 'bg-[#c9a227]/10 border border-[#c9a227]/30'
                }`}
              >
                {warning.severity === 'danger' ? (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                ) : warning.severity === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-[#c9a227] flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`text-sm font-medium ${
                    warning.severity === 'danger'
                      ? 'text-red-400'
                      : warning.severity === 'warning'
                      ? 'text-orange-400'
                      : 'text-[#c9a227]'
                  }`}>
                    {warning.condition}
                  </p>
                  <p className="text-[#a69b8a] text-xs mt-0.5">{warning.message}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Expand Details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full py-2 flex items-center justify-center gap-2 text-[#a69b8a] text-sm hover:text-[#f5f3ef] transition-colors"
      >
        {showDetails ? 'Show Less' : 'Learn More About This Strength'}
        {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {/* Expanded Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-2"
          >
            {/* Best For */}
            <div>
              <h5 className="text-[#f5f3ef] text-sm font-medium mb-2">Best For</h5>
              <div className="flex flex-wrap gap-2">
                {effectiveRatio.bestFor.map(item => (
                  <span
                    key={item}
                    className="px-2 py-1 rounded-full bg-[#111] text-[#a69b8a] text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Benefits List */}
            <div>
              <h5 className="text-[#f5f3ef] text-sm font-medium mb-2">Benefits</h5>
              <ul className="space-y-1.5">
                {effectiveRatio.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-[#2ecc71] flex-shrink-0 mt-0.5" />
                    <span className="text-[#f5f3ef]/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
