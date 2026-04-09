'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Sparkles, 
  Wind, 
  Flame, 
  Droplets, 
  Mountain, 
  Cloud,
  Moon,
  Sun,
  Clock,
  Leaf,
  Zap,
  Heart,
  Eye,
  Crown,
  MessageCircle,
  Gem,
  Scroll
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BlendRevelation, ElementBalance } from '@/lib/atelier/blend-revelation-engine'

interface BlendRevelationModalProps {
  revelation: BlendRevelation | null
  isOpen: boolean
  onClose: () => void
}

const ElementIcon = ({ element, className }: { element: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    fire: <Flame className={cn('text-orange-400', className)} />,
    water: <Droplets className={cn('text-blue-400', className)} />,
    earth: <Mountain className={cn('text-emerald-400', className)} />,
    air: <Wind className={cn('text-cyan-400', className)} />,
    ether: <Sparkles className={cn('text-violet-400', className)} />
  }
  return <>{icons[element] || <Sparkles className={className} />}</>
}

const ChakraIcon = ({ chakra }: { chakra: string }) => {
  const icons: Record<string, React.ReactNode> = {
    'root': <Mountain className="w-4 h-4 text-red-400" />,
    'sacral': <Droplets className="w-4 h-4 text-orange-400" />,
    'solar-plexus': <Sun className="w-4 h-4 text-yellow-400" />,
    'heart': <Heart className="w-4 h-4 text-green-400" />,
    'throat': <MessageCircle className="w-4 h-4 text-cyan-400" />,
    'third-eye': <Eye className="w-4 h-4 text-indigo-400" />,
    'crown': <Crown className="w-4 h-4 text-violet-400" />
  }
  return <>{icons[chakra] || <Sparkles className="w-4 h-4" />}</>
}

const ArchetypeVisual = ({ archetype }: { archetype: string }) => {
  const visuals: Record<string, { symbol: string; color: string; glow: string }> = {
    'the-warrior': { symbol: '⚔️', color: 'from-orange-500 to-red-600', glow: 'shadow-orange-500/50' },
    'the-healer': { symbol: '💚', color: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-400/50' },
    'the-mystic': { symbol: '🔮', color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/50' },
    'the-groundskeeper': { symbol: '🌳', color: 'from-amber-600 to-stone-600', glow: 'shadow-amber-600/50' },
    'the-messenger': { symbol: '🕊️', color: 'from-sky-400 to-cyan-500', glow: 'shadow-sky-400/50' },
    'the-alchemist': { symbol: '⚗️', color: 'from-amber-400 to-yellow-500', glow: 'shadow-amber-400/50' },
    'the-sanctuary': { symbol: '🛡️', color: 'from-teal-400 to-emerald-500', glow: 'shadow-teal-400/50' },
    'the-ignite': { symbol: '🔥', color: 'from-red-500 to-orange-500', glow: 'shadow-red-500/50' },
    'the-deep-dive': { symbol: '🌊', color: 'from-blue-600 to-indigo-700', glow: 'shadow-blue-600/50' },
    'the-ascension': { symbol: '☀️', color: 'from-yellow-300 to-amber-400', glow: 'shadow-yellow-300/50' },
    'the-forest-whisper': { symbol: '🌲', color: 'from-green-600 to-emerald-700', glow: 'shadow-green-600/50' },
    'the-celestial-dance': { symbol: '✨', color: 'from-indigo-400 to-violet-500', glow: 'shadow-indigo-400/50' },
    'the-shadow-work': { symbol: '🌑', color: 'from-slate-600 to-zinc-700', glow: 'shadow-slate-600/50' },
    'the-dawn-bringer': { symbol: '🌅', color: 'from-rose-400 to-orange-400', glow: 'shadow-rose-400/50' },
    'the-night-keeper': { symbol: '🌙', color: 'from-indigo-600 to-purple-700', glow: 'shadow-indigo-600/50' }
  }
  
  const visual = visuals[archetype] || visuals['the-alchemist']
  
  return (
    <div className={cn(
      'w-24 h-24 rounded-full flex items-center justify-center text-4xl',
      'bg-gradient-to-br',
      visual.color,
      'shadow-lg',
      visual.glow,
      'animate-pulse'
    )}>
      {visual.symbol}
    </div>
  )
}

const ElementBalanceBars = ({ elements }: { elements: ElementBalance }) => {
  const sortedElements = Object.entries(elements)
    .filter(([key]) => key !== 'dominant')
    .sort((a, b) => b[1] - a[1]) as [string, number][]
  
  const colors: Record<string, string> = {
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    earth: 'bg-emerald-500',
    air: 'bg-cyan-400',
    ether: 'bg-violet-500'
  }
  
  return (
    <div className="space-y-2">
      {sortedElements.map(([element, value]) => (
        <div key={element} className="flex items-center gap-2">
          <ElementIcon element={element} className="w-4 h-4" />
          <span className="text-xs text-[#a69b8a] w-12 capitalize">{element}</span>
          <div className="flex-1 h-2 bg-[#0a080c] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={cn('h-full rounded-full', colors[element])}
            />
          </div>
          <span className="text-xs text-[#f5f3ef] w-8 text-right">{value}%</span>
        </div>
      ))}
    </div>
  )
}

export function BlendRevelationModal({ revelation, isOpen, onClose }: BlendRevelationModalProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isRevealing, setIsRevealing] = useState(false)
  
  useEffect(() => {
    if (isOpen && revelation) {
      setIsRevealing(true)
      setCurrentSection(0)
      
      // Auto-advance through sections
      const timer = setInterval(() => {
        setCurrentSection(prev => {
          if (prev >= 4) {
            clearInterval(timer)
            setIsRevealing(false)
            return prev
          }
          return prev + 1
        })
      }, 2000)
      
      return () => clearInterval(timer)
    }
  }, [isOpen, revelation])
  
  if (!revelation) return null
  
  const sections = [
    { title: 'The Archetype', content: revelation.narrative.opening },
    { title: 'The Journey', content: revelation.narrative.journey },
    { title: 'The Transformation', content: revelation.narrative.transformation },
    { title: 'Crystal Harmony', content: revelation.narrative.crystalHarmony },
    { title: 'Cord Connection', content: revelation.narrative.cordConnection }
  ]
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-gradient-to-b from-[#111] to-[#0a080c] rounded-3xl border border-[#f5f3ef]/10 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#f5f3ef]/10">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#c9a227]" />
                <span className="text-[#a69b8a] text-sm tracking-widest uppercase">Blend Revelation</span>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#0a080c] border border-[#f5f3ef]/10 flex items-center justify-center text-[#a69b8a] hover:text-[#f5f3ef] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-6 md:p-8">
              <div className="max-w-4xl mx-auto">
                {/* Title Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="flex justify-center mb-6"
                  >
                    <ArchetypeVisual archetype={revelation.archetype} />
                  </motion.div>
                  
                  <h2 className="text-3xl md:text-4xl font-serif text-[#f5f3ef] mb-2">
                    {revelation.blendName}
                  </h2>
                  <p className="text-[#c9a227] text-lg capitalize mb-4">
                    {revelation.archetype.replace(/-/g, ' ')}
                  </p>
                  <p className="text-[#a69b8a] text-lg italic max-w-2xl mx-auto">
                    "{revelation.poeticEssence}"
                  </p>
                </motion.div>
                
                {/* Grid Layout */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Narrative */}
                  <div className="space-y-6">
                    {sections.map((section, index) => (
                      <motion.div
                        key={section.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: currentSection >= index ? 1 : 0.3,
                          x: 0
                        }}
                        transition={{ delay: index * 0.3 }}
                        className={cn(
                          'p-4 rounded-xl border transition-all',
                          currentSection === index 
                            ? 'bg-[#c9a227]/10 border-[#c9a227]/30' 
                            : 'bg-[#0a080c] border-[#f5f3ef]/5'
                        )}
                      >
                        <h3 className="text-sm font-medium text-[#c9a227] uppercase tracking-wider mb-2">
                          {section.title}
                        </h3>
                        <p className="text-[#f5f3ef] leading-relaxed">
                          {section.content}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Right Column - Details */}
                  <div className="space-y-6">
                    {/* Element Balance */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="p-4 rounded-xl bg-[#0a080c] border border-[#f5f3ef]/10"
                    >
                      <h3 className="text-sm font-medium text-[#a69b8a] uppercase tracking-wider mb-4">
                        Elemental Balance
                      </h3>
                      <ElementBalanceBars elements={revelation.elements} />
                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <span className="text-[#a69b8a]">Dominant:</span>
                        <ElementIcon element={revelation.elements.dominant} className="w-4 h-4" />
                        <span className="text-[#f5f3ef] capitalize">{revelation.elements.dominant}</span>
                      </div>
                    </motion.div>
                    
                    {/* Chakras */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="p-4 rounded-xl bg-[#0a080c] border border-[#f5f3ef]/10"
                    >
                      <h3 className="text-sm font-medium text-[#a69b8a] uppercase tracking-wider mb-4">
                        Chakra Resonance
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {revelation.chakras.map((chakra, index) => (
                          <div
                            key={chakra}
                            className={cn(
                              'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
                              index === 0 
                                ? 'bg-[#c9a227]/20 text-[#c9a227] border border-[#c9a227]/30' 
                                : 'bg-[#f5f3ef]/5 text-[#a69b8a] border border-[#f5f3ef]/10'
                            )}
                          >
                            <ChakraIcon chakra={chakra} />
                            <span className="capitalize">{chakra.replace(/-/g, ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                    
                    {/* Timing */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="p-4 rounded-xl bg-[#0a080c] border border-[#f5f3ef]/10"
                    >
                      <h3 className="text-sm font-medium text-[#a69b8a] uppercase tracking-wider mb-4">
                        Optimal Timing
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 rounded-lg bg-[#111]">
                          <Clock className="w-5 h-5 mx-auto mb-1 text-[#c9a227]" />
                          <p className="text-xs text-[#a69b8a]">Time</p>
                          <p className="text-sm text-[#f5f3ef] capitalize">{revelation.timeOfDay}</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-[#111]">
                          <Moon className="w-5 h-5 mx-auto mb-1 text-[#c9a227]" />
                          <p className="text-xs text-[#a69b8a]">Moon</p>
                          <p className="text-sm text-[#f5f3ef] capitalize">{revelation.moonPhase}</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-[#111]">
                          <Leaf className="w-5 h-5 mx-auto mb-1 text-[#c9a227]" />
                          <p className="text-xs text-[#a69b8a]">Season</p>
                          <p className="text-sm text-[#f5f3ef] capitalize">{revelation.seasonalResonance}</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Usage Intent */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="p-4 rounded-xl bg-[#0a080c] border border-[#f5f3ef]/10"
                    >
                      <h3 className="text-sm font-medium text-[#a69b8a] uppercase tracking-wider mb-4">
                        Best Used For
                      </h3>
                      <ul className="space-y-2">
                        {revelation.usageIntent.map((intent, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-[#f5f3ef]">
                            <Zap className="w-4 h-4 text-[#c9a227]" />
                            {intent}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                    
                    {/* Vibration */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-[#c9a227]/10 to-purple-500/10 border border-[#c9a227]/20"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-[#c9a227] uppercase tracking-wider">
                            Vibrational Frequency
                          </h3>
                          <p className="text-xs text-[#a69b8a] mt-1">
                            Unique energetic signature
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-serif text-[#f5f3ef]">{revelation.vibration}</p>
                          <p className="text-xs text-[#a69b8a]">Hz</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-[#f5f3ef]/10 flex justify-between items-center">
              <div className="text-xs text-[#a69b8a]">
                Revelation ID: {revelation.cacheKey}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-full bg-[#c9a227] text-[#0a080c] font-medium hover:bg-[#f5f3ef] transition-colors"
              >
                Embrace This Blend
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BlendRevelationModal
