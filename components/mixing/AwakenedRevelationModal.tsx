/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AWAKENED REVELATION MODAL v2.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * A visual cathedral for blend consciousness.
 * 
 * Features:
 * - Constellation visualization with animated star connections
 * - Living particle systems representing elemental forces
 * - Sacred geometry animations unique to each blend
 * - Frequency waveform visualization
 * - Chakra web with energy flow animations
 * - Temporal timeline showing maturation curve
 * - Procedural color gradients from blend DNA
 * 
 * No templates. Pure procedural sacred art.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { X, Sparkles, Clock, Zap, Wind, Droplets, Mountain, Flame, Orbit, Star, Waves, Hexagon, Circle, Triangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { 
  AwakenedRevelation, 
  BlendSoulSignature, 
  StarMap, 
  ChakraWeb,
  ElementalMatrix,
  TemporalReading,
  ArcanaReading,
  EmergencePattern,
  VisualSignature
} from '@/lib/atelier/awakened-revelation-engine'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface AwakenedRevelationModalProps {
  revelation: AwakenedRevelation | null
  isOpen: boolean
  onClose: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  maxLife: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function AwakenedRevelationModal({ revelation, isOpen, onClose }: AwakenedRevelationModalProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isRevealing, setIsRevealing] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  
  const initializeParticles = useCallback(() => {
    if (!revelation) return
    
    const visualDNA = revelation.soulSignature.visualDNA
    const newParticles: Particle[] = []
    
    for (let i = 0; i < Math.min(30, visualDNA.particleSystem.count); i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
        color: visualDNA.particleSystem.colors[i % visualDNA.particleSystem.colors.length] || '#C9A227',
        life: 100 + Math.random() * 100,
        maxLife: 200
      })
    }
    
    setParticles(newParticles)
  }, [revelation])
  
  // Initialize revelation sequence
  useEffect(() => {
    if (isOpen && revelation) {
      setIsRevealing(true)
      setCurrentSection(0)
      initializeParticles()
      
      // Auto-advance through sections
      const timer = setInterval(() => {
        setCurrentSection(prev => {
          if (prev >= 6) {
            clearInterval(timer)
            setIsRevealing(false)
            return prev
          }
          return prev + 1
        })
      }, 2500)
      
      return () => clearInterval(timer)
    }
  }, [isOpen, revelation, initializeParticles])
  
  // Particle animation loop
  useEffect(() => {
    if (!isOpen || particles.length === 0) return
    
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => {
        let newX = p.x + p.vx
        let newY = p.y + p.vy
        
        // Boundary wrap
        if (newX < 0) newX = 100
        if (newX > 100) newX = 0
        if (newY < 0) newY = 100
        if (newY > 100) newY = 0
        
        return {
          ...p,
          x: newX,
          y: newY,
          life: p.life - 0.5
        }
      }).filter(p => p.life > 0))
    }, 50)
    
    return () => clearInterval(interval)
  }, [isOpen, particles.length])
  
  if (!revelation || !isOpen) return null
  
  const { soulSignature, metadata } = revelation
  const sections = [
    { title: 'Soul Signature', component: SoulSignatureSection },
    { title: 'Elemental Matrix', component: ElementalMatrixSection },
    { title: 'Chakra Web', component: ChakraWebSection },
    { title: 'Constellation Map', component: ConstellationSection },
    { title: 'Temporal Wisdom', component: TemporalSection },
    { title: 'Arcana Reading', component: ArcanaSection },
    { title: 'The Revelation', component: RevelationSection }
  ]
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        {/* Animated Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${soulSignature.visualDNA.primaryGradient[0]}20 0%, ${soulSignature.visualDNA.primaryGradient[1]}15 50%, ${soulSignature.visualDNA.primaryGradient[2]}10 100%)`
          }}
        >
          {/* Particle Field */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  opacity: particle.life / particle.maxLife * 0.8,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [particle.life / particle.maxLife * 0.8, particle.life / particle.maxLife * 0.4, particle.life / particle.maxLife * 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ))}
          </div>
          
          {/* Sacred Geometry Overlay */}
          <SacredGeometryOverlay geometry={soulSignature.visualDNA.sacredGeometry} />
        </div>
        
        {/* Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Container */}
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden pointer-events-auto"
          >
            {/* Main Card */}
            <div 
              ref={containerRef}
              className="relative rounded-3xl overflow-hidden border border-white/10"
              style={{
                background: `linear-gradient(180deg, rgba(10,8,12,0.98) 0%, rgba(20,18,24,0.95) 100%)`,
                boxShadow: `0 0 100px ${soulSignature.visualDNA.primaryGradient[0]}30, inset 0 0 100px rgba(201,162,39,0.05)`
              }}
            >
              {/* Header */}
              <div className="relative p-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Soul Hash */}
                    <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs tracking-wider text-[#C9A227]">
                      {soulSignature.hash}
                    </div>
                    
                    {/* Frequency Display */}
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Waves className="w-4 h-4" />
                      <span>{soulSignature.vibrationalFrequency}Hz</span>
                    </div>
                    
                    {/* Uniqueness Score */}
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C9A227]" />
                      <span className="text-sm text-[#C9A227]">{metadata.uniquenessScore}% Unique</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>
                
                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {sections.map((_, i) => (
                    <motion.div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        i <= currentSection ? "bg-[#C9A227] w-6" : "bg-white/20"
                      )}
                      animate={i === currentSection ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Content Area */}
              <div className="relative p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {(() => {
                      const SectionComponent = sections[currentSection].component
                      return <SectionComponent revelation={revelation} />
                    })()}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Navigation Footer */}
              <div className="relative p-4 border-t border-white/5 flex justify-between items-center">
                <button
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-sm text-white/40">
                  {sections[currentSection].title}
                </span>
                
                <button
                  onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                  disabled={currentSection === sections.length - 1}
                  className="px-4 py-2 rounded-lg text-sm bg-[#C9A227]/20 text-[#C9A227] hover:bg-[#C9A227]/30 disabled:opacity-30 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function SoulSignatureSection({ revelation }: { revelation: AwakenedRevelation }) {
  const { soulSignature, invocation, essenceReading, metadata } = revelation
  
  return (
    <div className="space-y-6">
      {/* Invocation */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30"
        >
          <Sparkles className="w-4 h-4 text-[#C9A227]" />
          <span className="text-sm text-[#C9A227]">Soul Signature Detected</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-serif italic text-white/90 leading-relaxed"
        >
          &quot;{invocation}&quot;
        </motion.h2>
      </div>
      
      {/* Essence Reading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/10"
      >
        <h3 className="text-sm font-medium text-[#C9A227] mb-3 uppercase tracking-wider">Essence Reading</h3>
        <p className="text-white/80 leading-relaxed">{essenceReading}</p>
      </motion.div>
      
      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="p-4 rounded-xl bg-white/5 text-center">
          <div className="text-2xl font-serif text-[#C9A227]">{metadata.emergenceCount}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Emergences</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 text-center">
          <div className="text-2xl font-serif text-[#C9A227]">{metadata.complexityDepth}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Depth Score</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 text-center">
          <div className="text-2xl font-serif text-[#C9A227]">{soulSignature.chakraConstellation.activationSequence.length}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Active Chakras</div>
        </div>
      </motion.div>
    </div>
  )
}

function ElementalMatrixSection({ revelation }: { revelation: AwakenedRevelation }) {
  const { elementalResonance } = revelation.soulSignature
  const { interactions } = elementalResonance
  
  const elements = [
    { key: 'fire', name: 'Fire', icon: Flame, color: '#DC2626', value: elementalResonance.fire },
    { key: 'water', name: 'Water', icon: Droplets, color: '#0891B2', value: elementalResonance.water },
    { key: 'earth', name: 'Earth', icon: Mountain, color: '#92400E', value: elementalResonance.earth },
    { key: 'air', name: 'Air', icon: Wind, color: '#E0F2FE', value: elementalResonance.air },
    { key: 'aether', name: 'Aether', icon: Sparkles, color: '#C084FC', value: elementalResonance.aether }
  ]
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif text-white/90 text-center">Elemental Matrix</h3>
      
      {/* Elemental Bars */}
      <div className="space-y-4">
        {elements.map((element, i) => (
          <motion.div
            key={element.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <div className="flex items-center gap-3 mb-2">
              <element.icon className="w-5 h-5" style={{ color: element.color }} />
              <span className="text-sm text-white/80 w-16">{element.name}</span>
              <span className="text-sm text-white/60">{element.value}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${element.value}%` }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: element.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Balance State */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-4 rounded-xl bg-gradient-to-r from-[#C9A227]/10 to-transparent border border-[#C9A227]/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#C9A227]" />
          </div>
          <div>
            <div className="text-sm text-white/60">Balance State</div>
            <div className="text-lg font-medium text-[#C9A227] capitalize">
              {elementalResonance.balanceState}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Elemental Interactions */}
      {interactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">Elemental Interactions</h4>
          {interactions.slice(0, 3).map((interaction, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded bg-[#C9A227]/20 text-[#C9A227]">
                  {interaction.phenomenon}
                </span>
                <span className="text-xs text-white/40">{interaction.intensity.toFixed(0)}% intensity</span>
              </div>
              <p className="text-sm text-white/70">{interaction.description}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function ChakraWebSection({ revelation }: { revelation: AwakenedRevelation }) {
  const { chakraConstellation } = revelation.soulSignature
  const { nodes, pathways, dominantCurrent, resonanceQuality } = chakraConstellation
  
  const chakraOrder = ['root', 'sacral', 'solarPlexus', 'heart', 'throat', 'thirdEye', 'crown']
  const chakraNames: Record<string, string> = {
    root: 'Root',
    sacral: 'Sacral',
    solarPlexus: 'Solar Plexus',
    heart: 'Heart',
    throat: 'Throat',
    thirdEye: 'Third Eye',
    crown: 'Crown'
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-serif text-white/90">Chakra Web</h3>
        <p className="text-sm text-white/50 mt-1">{resonanceQuality} resonance</p>
      </div>
      
      {/* Chakra Visualization */}
      <div className="relative h-80 flex items-center justify-center">
        {/* Energy Pathways SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
          {/* Draw pathways */}
          {pathways.map((pathway, i) => {
            const fromIndex = chakraOrder.indexOf(pathway.from)
            const toIndex = chakraOrder.indexOf(pathway.to)
            const fromY = 280 - (fromIndex * 40)
            const toY = 280 - (toIndex * 40)
            const fromX = 60
            const toX = 340
            
            return (
              <motion.path
                key={i}
                d={`M ${fromX} ${fromY} Q 200 ${(fromY + toY) / 2} ${toX} ${toY}`}
                fill="none"
                stroke={nodes[pathway.from].color}
                strokeWidth={pathway.strength / 20}
                strokeOpacity={0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.2 }}
              />
            )
          })}
        </svg>
        
        {/* Chakra Nodes */}
        <div className="relative flex flex-col justify-between h-full py-2">
          {chakraOrder.map((chakraKey, i) => {
            const node = nodes[chakraKey]
            const isDominant = chakraKey === dominantCurrent
            
            return (
              <motion.div
                key={chakraKey}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                {/* Node */}
                <motion.div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                    node.activated ? "border-current" : "border-white/20"
                  )}
                  style={{ 
                    color: node.color,
                    boxShadow: node.activated ? `0 0 20px ${node.color}40` : 'none'
                  }}
                  animate={node.activated ? {
                    boxShadow: [
                      `0 0 10px ${node.color}20`,
                      `0 0 30px ${node.color}60`,
                      `0 0 10px ${node.color}20`
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isDominant && (
                    <motion.div
                      className="w-3 h-3 rounded-full bg-current"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                
                {/* Label */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm",
                      node.activated ? "text-white" : "text-white/40"
                    )}>
                      {chakraNames[chakraKey]}
                    </span>
                    {node.activated && (
                      <span className="text-xs text-white/40">{Math.round(node.intensity)}%</span>
                    )}
                  </div>
                  {node.activated && (
                    <div className="h-1 bg-white/10 rounded-full mt-1 w-24 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${node.intensity}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: node.color }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Frequency */}
                <span className="text-xs text-white/30 font-mono w-12 text-right">
                  {node.frequency}Hz
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
      
      {/* Activation Sequence */}
      <div className="p-4 rounded-xl bg-white/5">
        <div className="text-sm text-white/60 mb-2">Activation Sequence</div>
        <div className="flex flex-wrap gap-2">
          {chakraConstellation.activationSequence.map((chakra, i) => (
            <motion.span
              key={chakra}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/80"
              style={{ borderColor: nodes[chakra].color, borderWidth: 1 }}
            >
              {i + 1}. {chakraNames[chakra]}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ConstellationSection({ revelation }: { revelation: AwakenedRevelation }) {
  const { constellation } = revelation.soulSignature.visualDNA
  const { stars, connections, rotation } = constellation
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-serif text-white/90">Constellation Map</h3>
        <p className="text-sm text-white/50 mt-1">Celestial resonance pattern</p>
      </div>
      
      {/* Constellation Visualization */}
      <div className="relative h-80 bg-gradient-to-b from-transparent to-black/20 rounded-2xl overflow-hidden">
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 300"
          animate={{ rotate: rotation }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          {/* Connection Lines */}
          {connections.map((conn, i) => {
            const fromStar = stars.find(s => s.id === conn.from)
            const toStar = stars.find(s => s.id === conn.to)
            if (!fromStar || !toStar) return null
            
            return (
              <motion.line
                key={i}
                x1={fromStar.x * 400}
                y1={fromStar.y * 300}
                x2={toStar.x * 400}
                y2={toStar.y * 300}
                stroke={conn.type === 'solid' ? '#C9A227' : conn.type === 'pulsing' ? '#C9A22780' : '#C9A22740'}
                strokeWidth={conn.strength / 30}
                strokeDasharray={conn.type === 'ethereal' ? '5,5' : '0'}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              />
            )
          })}
          
          {/* Stars */}
          {stars.map((star, i) => (
            <motion.g key={star.id}>
              <motion.circle
                cx={star.x * 400}
                cy={star.y * 300}
                r={star.magnitude}
                fill={star.color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
              <motion.circle
                cx={star.x * 400}
                cy={star.y * 300}
                r={star.magnitude * 3}
                fill="none"
                stroke={star.color}
                strokeWidth={0.5}
                opacity={0.3}
                animate={{ r: [star.magnitude * 2, star.magnitude * 4, star.magnitude * 2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            </motion.g>
          ))}
        </motion.svg>
        
        {/* Star Labels */}
        <div className="absolute inset-0 pointer-events-none">
          {stars.slice(0, 4).map((star, i) => (
            <motion.div
              key={star.id}
              className="absolute text-xs text-white/60 bg-black/50 px-2 py-0.5 rounded"
              style={{
                left: `${star.x * 100}%`,
                top: `${star.y * 100}%`,
                transform: 'translate(-50%, -150%)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {star.oil}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Connection Legend */}
      <div className="flex justify-center gap-6 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-[#C9A227]" />
          <span>Strong Synergy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-[#C9A22780]" />
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-[#C9A22740] border-dashed" />
          <span>Subtle</span>
        </div>
      </div>
    </div>
  )
}

function TemporalSection({ revelation }: { revelation: AwakenedRevelation }) {
  const { temporalSignature } = revelation.soulSignature
  const { lunarPhase, celestialAlignment, seasonalResonance, optimalUsageWindows, maturationCurve } = temporalSignature
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif text-white/90 text-center">Temporal Wisdom</h3>
      
      {/* Current Celestial State */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-b from-purple-900/30 to-transparent border border-purple-500/30 text-center"
        >
          <MoonIcon phase={lunarPhase} />
          <div className="text-xs text-purple-300 mt-2 uppercase tracking-wider">Lunar Phase</div>
          <div className="text-sm text-white/90 mt-1">{lunarPhase.split(' - ')[0]}</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-gradient-to-b from-amber-900/30 to-transparent border border-amber-500/30 text-center"
        >
          <Star className="w-8 h-8 text-amber-400 mx-auto" />
          <div className="text-xs text-amber-300 mt-2 uppercase tracking-wider">Celestial</div>
          <div className="text-sm text-white/90 mt-1">{celestialAlignment.split(' - ')[0]}</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-gradient-to-b from-emerald-900/30 to-transparent border border-emerald-500/30 text-center"
        >
          <Waves className="w-8 h-8 text-emerald-400 mx-auto" />
          <div className="text-xs text-emerald-300 mt-2 uppercase tracking-wider">Seasonal</div>
          <div className="text-sm text-white/90 mt-1">{seasonalResonance.split(' - ')[0]}</div>
        </motion.div>
      </div>
      
      {/* Optimal Usage Windows */}
      <div className="p-4 rounded-xl bg-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-[#C9A227]" />
          <span className="text-sm font-medium text-white/80">Optimal Usage Windows</span>
        </div>
        <div className="space-y-2">
          {optimalUsageWindows.map((window, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center justify-between p-2 rounded-lg bg-white/5"
            >
              <span className="text-sm text-white/80">{window.period}</span>
              <div className="flex items-center gap-3">
                <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${window.potency}%` }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="h-full rounded-full bg-[#C9A227]"
                  />
                </div>
                <span className="text-xs text-white/50 w-24 text-right">{window.quality}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Maturation Curve */}
      <div className="p-4 rounded-xl bg-white/5">
        <div className="text-sm font-medium text-white/80 mb-3">Maturation Timeline</div>
        <div className="relative h-32">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1="0" y1={100 - y} x2="300" y2={100 - y} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            ))}
            
            {/* Curve */}
            <motion.path
              d={`M 0 ${100 - maturationCurve[0].potency} ${maturationCurve.map((stage, i) => {
                const x = (i / (maturationCurve.length - 1)) * 300
                const y = 100 - stage.potency
                return `L ${x} ${y}`
              }).join(' ')}`}
              fill="none"
              stroke="#C9A227"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
            
            {/* Points */}
            {maturationCurve.map((stage, i) => (
              <motion.circle
                key={i}
                cx={(i / (maturationCurve.length - 1)) * 300}
                cy={100 - stage.potency}
                r="4"
                fill="#C9A227"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.2 }}
              />
            ))}
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-white/40">
            {maturationCurve.map((stage, i) => (
              <span key={i}>Day {stage.day}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ArcanaSection({ revelation }: { revelation: AwakenedRevelation }) {
  const { arcanaSignature, emergenceProfile } = revelation.soulSignature
  const { tarotCard, numerology, sacredGeometry, runeInfluence, colorOracle } = arcanaSignature
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif text-white/90 text-center">Arcana Reading</h3>
      
      {/* Tarot Card */}
      <motion.div
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.6 }}
        className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30"
      >
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-24 h-36 rounded-lg border-2 flex flex-col items-center justify-center p-2 text-center",
            tarotCard.reversed ? "border-red-500/50 rotate-180" : "border-purple-500/50"
          )}>
            <span className="text-xs text-purple-300 uppercase tracking-wider">
              {tarotCard.arcana}
            </span>
            <span className="text-lg font-serif text-white mt-1">{tarotCard.card}</span>
            {tarotCard.reversed && (
              <span className="text-xs text-red-400 mt-2">Reversed</span>
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm text-purple-300 mb-1">{tarotCard.meaning}</div>
            <p className="text-sm text-white/70">{tarotCard.blendResonance}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Numerology & Sacred Geometry */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-white/5"
        >
          <div className="text-xs text-white/50 uppercase tracking-wider mb-3">Numerology</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-white/60">Soul</span>
              <span className="text-lg font-serif text-[#C9A227]">{numerology.soulNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-white/60">Path</span>
              <span className="text-lg font-serif text-[#C9A227]">{numerology.pathNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-white/60">Destiny</span>
              <span className="text-lg font-serif text-[#C9A227]">{numerology.destinyNumber}</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-white/5"
        >
          <div className="text-xs text-white/50 uppercase tracking-wider mb-3">Sacred Geometry</div>
          <div className="text-center">
            <div className="text-lg font-serif text-[#C9A227]">{sacredGeometry.primary}</div>
            <div className="text-xs text-white/50 mt-1">{sacredGeometry.frequency}Hz</div>
            <div className="text-xs text-white/40 mt-2">{sacredGeometry.significance}</div>
          </div>
        </motion.div>
      </div>
      
      {/* Rune & Color */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl bg-gradient-to-br from-amber-900/20 to-transparent border border-amber-500/20"
        >
          <div className="text-xs text-amber-500/70 uppercase tracking-wider mb-2">Rune Influence</div>
          <div className="text-sm text-white/80">{runeInfluence}</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl bg-white/5"
        >
          <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Color Oracle</div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: colorOracle.dominant }} />
              <div className="w-6 h-6 rounded" style={{ backgroundColor: colorOracle.secondary }} />
              <div className="w-6 h-6 rounded" style={{ backgroundColor: colorOracle.accent }} />
            </div>
          </div>
          <div className="text-sm text-white/70">{colorOracle.meaning}</div>
        </motion.div>
      </div>
      
      {/* Emergence Patterns */}
      {emergenceProfile.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <div className="text-xs text-white/50 uppercase tracking-wider">Detected Patterns</div>
          {emergenceProfile.slice(0, 2).map((pattern, i) => (
            <div 
              key={i}
              className={cn(
                "p-3 rounded-lg border",
                pattern.rarity === 'legendary' && "bg-yellow-500/10 border-yellow-500/30",
                pattern.rarity === 'epic' && "bg-purple-500/10 border-purple-500/30",
                pattern.rarity === 'rare' && "bg-blue-500/10 border-blue-500/30",
                pattern.rarity === 'uncommon' && "bg-emerald-500/10 border-emerald-500/30",
                pattern.rarity === 'common' && "bg-white/5 border-white/10"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded uppercase",
                  pattern.rarity === 'legendary' && "bg-yellow-500/20 text-yellow-400",
                  pattern.rarity === 'epic' && "bg-purple-500/20 text-purple-400",
                  pattern.rarity === 'rare' && "bg-blue-500/20 text-blue-400",
                  pattern.rarity === 'uncommon' && "bg-emerald-500/20 text-emerald-400",
                  pattern.rarity === 'common' && "bg-white/10 text-white/60"
                )}>
                  {pattern.rarity}
                </span>
                <span className="text-sm font-medium text-white">{pattern.name}</span>
              </div>
              <p className="text-xs text-white/60">{pattern.description}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function RevelationSection({ revelation }: { revelation: AwakenedRevelation }) {
  const { journeyMap, mysteryRevealed, practicalMysticism, closingBlessing, soulSignature } = revelation
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif text-white/90 text-center">The Complete Revelation</h3>
      
      {/* Journey Map */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-3"
      >
        <div className="text-xs text-white/50 uppercase tracking-wider">The Journey</div>
        {journeyMap.map((stage, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex gap-3 p-3 rounded-lg bg-white/5"
          >
            <div className="w-6 h-6 rounded-full bg-[#C9A227]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-[#C9A227]">{i + 1}</span>
            </div>
            <p className="text-sm text-white/80">{stage}</p>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Mystery Revealed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-xl bg-gradient-to-br from-purple-900/30 to-transparent border border-purple-500/30"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">Mystery Revealed</span>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">{mysteryRevealed}</p>
      </motion.div>
      
      {/* Practical Mysticism */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-4 rounded-xl bg-white/5"
      >
        <div className="text-sm font-medium text-white/80 mb-2">Practical Mysticism</div>
        <p className="text-sm text-white/60 leading-relaxed">{practicalMysticism}</p>
      </motion.div>
      
      {/* Closing Blessing */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="text-center pt-4 border-t border-white/10"
      >
        <p className="text-lg font-serif italic text-[#C9A227]">&quot;{closingBlessing}&quot;</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
          <span>Transmission complete</span>
          <span className="font-mono text-[#C9A227]">{soulSignature.hash}</span>
        </div>
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function SacredGeometryOverlay({ geometry }: { geometry: VisualSignature['sacredGeometry'] }) {
  return (
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <motion.svg
        className="w-full h-full"
        viewBox="0 0 400 400"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        {geometry.type === 'flower' && (
          <>
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.circle
                key={i}
                cx={200 + 60 * Math.cos((angle * Math.PI) / 180)}
                cy={200 + 60 * Math.sin((angle * Math.PI) / 180)}
                r={60}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-[#C9A227]"
              />
            ))}
          </>
        )}
        
        {geometry.type === 'metatron' && (
          <>
            {[0, 30, 60, 90, 120, 150].map((angle, i) => (
              <motion.line
                key={i}
                x1={200}
                y1={200}
                x2={200 + 100 * Math.cos((angle * Math.PI) / 180)}
                y2={200 + 100 * Math.sin((angle * Math.PI) / 180)}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-[#C9A227]"
              />
            ))}
          </>
        )}
        
        {geometry.type === 'torus' && (
          <motion.ellipse
            cx={200}
            cy={200}
            rx={100}
            ry={60}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-[#C9A227]"
          />
        )}
        
        {/* Central circle always present */}
        <motion.circle
          cx={200}
          cy={200}
          r={30}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-[#C9A227]"
          animate={{ r: [30, 35, 30] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.svg>
    </div>
  )
}

function MoonIcon({ phase }: { phase: string }) {
  // Determine moon phase icon
  let icon = <Circle className="w-8 h-8 text-purple-400" />
  
  if (phase.includes('New')) {
    icon = <Circle className="w-8 h-8 text-purple-400" />
  } else if (phase.includes('Full')) {
    icon = <div className="w-8 h-8 rounded-full bg-purple-400" />
  } else if (phase.includes('Crescent')) {
    icon = <div className="w-8 h-8 rounded-full bg-gradient-to-r from-transparent to-purple-400" />
  } else if (phase.includes('Gibbous')) {
    icon = <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
  } else if (phase.includes('Quarter')) {
    icon = <div className="w-8 h-8 rounded-full bg-gradient-to-r from-transparent via-purple-400 to-purple-400" style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)' }} />
  }
  
  return <div className="mx-auto">{icon}</div>
}

// Default export
export default AwakenedRevelationModal
