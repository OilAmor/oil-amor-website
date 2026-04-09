'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, Droplets, Wind, Flame, Mountain, Infinity, Music, Gem, Leaf, Clock, Moon, Sun, Star } from 'lucide-react';
import { AdvancedBlendRevelation } from '@/lib/atelier/blend-revelation-engine-v2';
import { ATELIER_CORD_OPTIONS } from '@/lib/atelier/cord-data-atelier';

interface AdvancedBlendRevelationModalProps {
  revelation: AdvancedBlendRevelation | null;
  isOpen: boolean;
  onClose: () => void;
  isGenerating: boolean;
}

const elementIcons: Record<string, React.ReactNode> = {
  fire: <Flame className="w-5 h-5" />,
  water: <Droplets className="w-5 h-5" />,
  earth: <Mountain className="w-5 h-5" />,
  air: <Wind className="w-5 h-5" />,
  ether: <Infinity className="w-5 h-5" />
};

const elementColors: Record<string, string> = {
  fire: 'from-orange-500 to-red-600',
  water: 'from-cyan-500 to-blue-600',
  earth: 'from-amber-600 to-stone-700',
  air: 'from-sky-400 to-indigo-500',
  ether: 'from-violet-400 to-purple-600'
};

export function AdvancedBlendRevelationModal({
  revelation,
  isOpen,
  onClose,
  isGenerating
}: AdvancedBlendRevelationModalProps) {
  if (!isOpen) return null;

  if (isGenerating) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md p-8 rounded-3xl bg-gradient-to-br from-[#242038] to-[#1a1525] border border-[#c9a227]/30 text-center"
          >
            <motion.div
              // @ts-ignore - framer-motion type issue with rotation
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="mx-auto mb-6"
            >
              <Sparkles className="w-16 h-16 text-[#c9a227]" />
            </motion.div>
            <h3 className="text-2xl font-light text-[#f4f2f5] mb-3">
              Decoding Your Blend DNA
            </h3>
            <p className="text-[#f4f2f5]/60">
              Analyzing elemental composition, dilution wisdom, and mystical resonance...
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  // @ts-ignore - framer-motion type issue with opacity array
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-[#c9a227]"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!revelation) return null;

  const { elements, frequency, dilutionWisdom, carrierIntelligence, narrative, composition, mystical, guidance } = revelation;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="min-h-screen px-4 py-8 md:py-12"
          onClick={e => e.stopPropagation()}
        >
          <div className="max-w-4xl mx-auto">
            {/* Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#242038] via-[#2a1f3a] to-[#1a1525] border border-[#c9a227]/30 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 text-[#f4f2f5]/60 hover:text-[#f4f2f5] hover:bg-black/50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Aura Glow */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${revelation.auraColor}40, transparent 70%)`
                }}
              />

              {/* Header Content */}
              <div className="relative p-8 md:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-[#c9a227] to-[#a88420] shadow-lg shadow-[#c9a227]/30"
                >
                  <span className="text-4xl">{revelation.archetype.symbol}</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-light text-[#f4f2f5] mb-2 tracking-wide"
                >
                  {revelation.blendName}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-[#c9a227] font-light tracking-widest uppercase mb-4"
                >
                  {revelation.soulName}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center justify-center gap-3"
                >
                  <span className="px-4 py-1.5 rounded-full bg-[#c9a227]/20 text-[#c9a227] text-sm">
                    {revelation.archetype.name}
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-[#f4f2f5]/10 text-[#f4f2f5]/80 text-sm">
                    {revelation.subArchetype}
                  </span>
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#242038] to-[#2a1f3a] border border-[#f4f2f5]/20 text-[#f4f2f5]/80 text-sm">
                    <Music className="w-3.5 h-3.5" />
                    {frequency.note} • {frequency.hz}Hz
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              {/* Dilution Wisdom Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#242038] to-[#1a1525] border border-[#c9a227]/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-[#c9a227]/20">
                    <Droplets className="w-5 h-5 text-[#c9a227]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#f4f2f5]">Dilution Mastery</h3>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#f4f2f5]/60 text-sm">Strength</span>
                    <span className="text-[#c9a227] font-medium">{dilutionWisdom.strengthLevel}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#f4f2f5]/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${revelation.frequency.hz}%` }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 via-[#c9a227] to-purple-500"
                    />
                  </div>
                  <p className="text-right text-xs text-[#f4f2f5]/40 mt-1">
                    {revelation.frequency.hz}Hz
                  </p>
                </div>

                <p className="text-[#f4f2f5]/70 text-sm leading-relaxed mb-4">
                  {dilutionWisdom.potencyDescription}
                </p>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span className="text-[#f4f2f5]/60">{dilutionWisdom.longevity}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Zap className="w-4 h-4 text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span className="text-[#f4f2f5]/60">{dilutionWisdom.absorptionRate}</span>
                  </div>
                </div>

                {dilutionWisdom.safetyConsiderations && dilutionWisdom.safetyConsiderations.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs text-amber-400 font-medium mb-1">⚠️ Safety Notes</p>
                    {dilutionWisdom.safetyConsiderations.map((note, i) => (
                      <p key={i} className="text-xs text-amber-400/80">• {note}</p>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Carrier Intelligence Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#242038] to-[#1a1525] border border-[#c9a227]/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-[#c9a227]/20">
                    <Leaf className="w-5 h-5 text-[#c9a227]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#f4f2f5]">Carrier Intelligence</h3>
                </div>

                <p className="text-[#c9a227] font-medium mb-1">{carrierIntelligence.role}</p>
                <p className="text-[#f4f2f5]/70 text-sm leading-relaxed mb-4">
                  {carrierIntelligence.synergy}
                </p>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-[#f4f2f5]/40 uppercase tracking-wide">Texture</span>
                    <p className="text-sm text-[#f4f2f5]/80">{carrierIntelligence.textureProfile}</p>
                  </div>
                  <div>
                    <span className="text-xs text-[#f4f2f5]/40 uppercase tracking-wide">Absorption</span>
                    <p className="text-sm text-[#f4f2f5]/80">{carrierIntelligence.absorptionQuality}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {carrierIntelligence.skinBenefits.slice(0, 2).map((benefit, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-[#f4f2f5]/5 text-[#f4f2f5]/60 text-xs">
                      {benefit}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Narrative: Invocation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#2a1f3a] to-[#1a1525] border border-[#c9a227]/20"
              >
                <h3 className="text-lg font-medium text-[#f4f2f5] mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#c9a227]" />
                  The Invocation
                </h3>
                <p className="text-[#f4f2f5]/80 text-lg leading-relaxed italic font-light">
                  &ldquo;{narrative.invocation}&rdquo;
                </p>
              </motion.div>

              {/* Elemental Analysis */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#242038] to-[#1a1525] border border-[#c9a227]/20"
              >
                <h3 className="text-lg font-medium text-[#f4f2f5] mb-4">Elemental Balance</h3>
                
                <div className="space-y-3">
                  {(['fire', 'water', 'earth', 'air', 'ether'] as const).map((element) => {
                    const value = elements[element];
                    return (
                      <div key={element} className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${elementColors[element]}`}>
                          {elementIcons[element]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="capitalize text-sm text-[#f4f2f5]/80">{element}</span>
                            <span className="text-sm text-[#f4f2f5]/60">{value}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#f4f2f5]/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${value}%` }}
                              transition={{ delay: 1 + value * 0.01, duration: 0.5 }}
                              className={`h-full rounded-full bg-gradient-to-r ${elementColors[element]}`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-[#f4f2f5]/10">
                  <p className="text-sm text-[#f4f2f5]/60">
                    <span className="text-[#c9a227]">Dominant:</span> {elements.dominant.charAt(0).toUpperCase() + elements.dominant.slice(1)}
                  </p>
                  <p className="text-sm text-[#f4f2f5]/60">
                    <span className="text-[#c9a227]">Balance:</span> {elements.balance.charAt(0).toUpperCase() + elements.balance.slice(1)}
                  </p>
                </div>
              </motion.div>

              {/* Composition Analysis */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#242038] to-[#1a1525] border border-[#c9a227]/20"
              >
                <h3 className="text-lg font-medium text-[#f4f2f5] mb-4">Scent Architecture</h3>
                
                <div className="space-y-4">
                  {composition.topNotes.length > 0 && (
                    <div>
                      <p className="text-xs text-[#f4f2f5]/40 uppercase tracking-wide mb-1">Top Notes</p>
                      <p className="text-sm text-[#f4f2f5]/80">{composition.topNotes.join(' • ')}</p>
                    </div>
                  )}
                  
                  {composition.heartNotes.length > 0 && (
                    <div>
                      <p className="text-xs text-[#f4f2f5]/40 uppercase tracking-wide mb-1">Heart Notes</p>
                      <p className="text-sm text-[#f4f2f5]/80">{composition.heartNotes.join(' • ')}</p>
                    </div>
                  )}
                  
                  {composition.baseNotes.length > 0 && (
                    <div>
                      <p className="text-xs text-[#f4f2f5]/40 uppercase tracking-wide mb-1">Base Notes</p>
                      <p className="text-sm text-[#f4f2f5]/80">{composition.baseNotes.join(' • ')}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-[#f4f2f5]/10 space-y-2">
                  <p className="text-sm text-[#f4f2f5]/60">
                    <span className="text-[#c9a227]">Evolution:</span> {composition.evaporationCurve}
                  </p>
                  <p className="text-sm text-[#f4f2f5]/60">
                    <span className="text-[#c9a227]">Sillage:</span> {composition.sillage}
                  </p>
                </div>
              </motion.div>

              {/* Crystal & Cord Harmony */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#2a1f3a] to-[#1a1525] border border-[#c9a227]/20"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Gem className="w-5 h-5 text-[#c9a227]" />
                      <h3 className="text-lg font-medium text-[#f4f2f5]">Crystal Harmony</h3>
                    </div>
                    <p className="text-[#f4f2f5]/70 text-sm leading-relaxed">{narrative.crystalHarmony}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#8B7355] to-[#5C4A3a]" />
                      <h3 className="text-lg font-medium text-[#f4f2f5]">Cord Grounding</h3>
                    </div>
                    <p className="text-[#f4f2f5]/70 text-sm leading-relaxed">{narrative.cordGrounding}</p>
                  </div>
                </div>
              </motion.div>

              {/* The Journey */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#2a1f3a] to-[#1a1525] border border-[#c9a227]/20"
              >
                <h3 className="text-lg font-medium text-[#f4f2f5] mb-4">Your Journey</h3>
                <p className="text-[#f4f2f5]/80 leading-relaxed">{narrative.journey}</p>
              </motion.div>

              {/* Mystical Properties */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#242038] to-[#1a1525] border border-[#c9a227]/20"
              >
                <h3 className="text-lg font-medium text-[#f4f2f5] mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#c9a227]" />
                  Mystical Resonance
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#f4f2f5]/60 text-sm">Tarot</span>
                    <span className="text-[#f4f2f5] text-sm">{mystical.tarotCard}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#f4f2f5]/60 text-sm">Numerology</span>
                    <span className="text-[#f4f2f5] text-sm">{mystical.numerology}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#f4f2f5]/60 text-sm">Sacred Geometry</span>
                    <span className="text-[#f4f2f5] text-sm">{mystical.sacredGeometry}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#f4f2f5]/10">
                  <p className="text-xs text-[#f4f2f5]/40 uppercase tracking-wide mb-2">Zodiac Resonance</p>
                  <p className="text-sm text-[#f4f2f5]/70">{mystical.zodiacResonance.join(' • ')}</p>
                </div>
              </motion.div>

              {/* Optimal Timing */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#242038] to-[#1a1525] border border-[#c9a227]/20"
              >
                <h3 className="text-lg font-medium text-[#f4f2f5] mb-4 flex items-center gap-2">
                  <Moon className="w-5 h-5 text-[#c9a227]" />
                  Optimal Timing
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-[#f4f2f5]/40" />
                    <span className="text-sm text-[#f4f2f5]/60">Time:</span>
                    <span className="text-sm text-[#f4f2f5]">{guidance.optimalTiming.timeOfDay}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-[#f4f2f5]/40" />
                    <span className="text-sm text-[#f4f2f5]/60">Moon:</span>
                    <span className="text-sm text-[#f4f2f5]">{guidance.optimalTiming.moonPhase}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[#f4f2f5]/40" />
                    <span className="text-sm text-[#f4f2f5]/60">Season:</span>
                    <span className="text-sm text-[#f4f2f5]">{guidance.optimalTiming.season}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#f4f2f5]/10">
                  <p className="text-xs text-[#f4f2f5]/40 uppercase tracking-wide mb-2">Chakra Activation</p>
                  <div className="flex flex-wrap gap-2">
                    {guidance.chakraActivation.map((chakra, i) => (
                      <span key={i} className="px-2 py-1 rounded-full bg-[#c9a227]/10 text-[#c9a227] text-xs">
                        {chakra}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Affirmations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#c9a227]/10 via-[#2a1f3a] to-[#1a1525] border border-[#c9a227]/30"
              >
                <h3 className="text-lg font-medium text-[#f4f2f5] mb-4">Your Affirmations</h3>
                <div className="space-y-3">
                  {guidance.affirmations.map((affirmation, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + i * 0.1 }}
                      className="text-[#f4f2f5]/80 italic font-light text-lg"
                    >
                      &ldquo;{affirmation}&rdquo;
                    </motion.p>
                  ))}
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="md:col-span-2 text-center pt-4"
              >
                <p className="text-xs text-[#f4f2f5]/30">
                  Blend Revelation Engine v2.0 • {revelation.cacheKey} • {new Date(revelation.generatedAt).toLocaleDateString()}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AdvancedBlendRevelationModal;
