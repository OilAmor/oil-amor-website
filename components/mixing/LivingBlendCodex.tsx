/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE LIVING BLEND CODEX - Single Page Revelation
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * No slides. No mystical fluff. Just pure, living knowledge.
 * Every component matters. Every change alters the soul.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

'use client'


import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Droplets, Mountain, Wind, Sparkles, Clock, Sun, Moon, Shield, Heart, AlertTriangle, CheckCircle, Droplet, Flame, Download, Share2, BookOpen, Mail, Loader2, Check, Info, Pill, Baby, Beaker, Microscope } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BlendCodex } from '@/lib/atelier/living-blend-codex'
import type { SafetyValidationResult, SafetyWarning, ExperienceLevel, RiskLevel } from '@/lib/safety/comprehensive-safety-v2'
import { getInteractionsForMix, OilInteraction, SYNERGISTIC_COMBINATIONS, getOilInteraction } from '@/lib/safety/oil-interactions'
import { OIL_WISDOM } from '@/lib/atelier/oil-wisdom'

interface LivingBlendCodexProps {
  codex: BlendCodex | null
  isOpen: boolean
  onClose: () => void
}

export function LivingBlendCodex({ codex, isOpen, onClose }: LivingBlendCodexProps) {
  if (!codex || !isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Main Codex Container */}
        <div className="relative min-h-screen flex items-start justify-center p-4 pt-16 md:pt-20 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-4xl"
          >
            {/* The Living Scroll */}
            <div 
              className="relative rounded-3xl overflow-hidden border border-white/10"
              style={{
                background: `linear-gradient(180deg, rgba(10,8,12,0.98) 0%, rgba(15,13,18,0.95) 100%)`,
                boxShadow: `0 0 60px ${codex.aura.primaryColor}20, inset 0 0 60px rgba(201,162,39,0.03)`
              }}
            >
              {/* Living Aura Background */}
              <div 
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: codex.aura.gradient }}
              />

              {/* Header */}
              <CodexHeader codex={codex} onClose={onClose} />

              {/* Content */}
              <div className="relative p-6 md:p-8 space-y-8">
                {/* The Essence */}
                <EssenceSection codex={codex} />

                {/* Composition Grid */}
                <CompositionGrid codex={codex} />

                {/* Component Weave */}
                <ComponentWeave codex={codex} />

                {/* Blend Science & Chemistry */}
                <BlendScienceSection codex={codex} />

                {/* Practical Profile */}
                <PracticalProfile codex={codex} />

                {/* Timing & Safety */}
                <TimingSafetySection codex={codex} />

                {/* The Ritual */}
                <RitualSection codex={codex} />

                {/* Action Buttons */}
                <ActionButtons onClose={onClose} codex={codex} />
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

function CodexHeader({ codex, onClose }: { codex: BlendCodex; onClose: () => void }) {
  return (
    <div className="relative p-6 border-b border-white/10">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
      >
        <X className="w-5 h-5 text-white/60" />
      </button>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Aura Indicator */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ 
            background: `linear-gradient(135deg, ${codex.aura.primaryColor}40, ${codex.aura.secondaryColor}20)`,
            boxShadow: `0 0 30px ${codex.aura.primaryColor}30`
          }}
        >
          <Sparkles className="w-8 h-8" style={{ color: codex.aura.primaryColor }} />
        </div>

        <div className="flex-1">
          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-serif text-white/90">
            {codex.name}
          </h1>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-white/60">
              {codex.soulHash}
            </span>
            <span className="text-xs text-white/50">
              {codex.composition.vibrationalFrequency}Hz
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#C9A227]/20 text-[#C9A227]">
              {codex.uniquenessScore}% Unique
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function EssenceSection({ codex }: { codex: BlendCodex }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider">
        The Essence
      </h2>
      <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light">
        {codex.essence}
      </p>
    </section>
  )
}

function CompositionGrid({ codex }: { codex: BlendCodex }) {
  const { elemental, noteDistribution, oils } = codex.composition

  const ElementIcon = {
    fire: Flame,
    water: Droplets,
    earth: Mountain,
    air: Wind
  }[elemental.dominant] || Sparkles

  return (
    <section className="grid md:grid-cols-3 gap-4">
      {/* Elemental Balance */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">
          Elemental Nature
        </h3>
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `${codex.aura.primaryColor}20` }}
          >
            <ElementIcon className="w-5 h-5" style={{ color: codex.aura.primaryColor }} />
          </div>
          <span className="text-lg font-medium capitalize" style={{ color: codex.aura.primaryColor }}>
            {elemental.dominant}
          </span>
        </div>
        <div className="space-y-1.5">
          {(Object.entries(elemental)
            .filter(([k]) => k !== 'dominant') as [string, number][])
            .sort((a, b) => b[1] - a[1])
            .map(([element, value]) => (
              <div key={element} className="flex items-center gap-2">
                <span className="text-xs text-white/50 w-10 capitalize">{element}</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: 
                        element === 'fire' ? '#DC2626' :
                        element === 'water' ? '#0891B2' :
                        element === 'earth' ? '#92400E' : '#E0F2FE'
                    }}
                  />
                </div>
                <span className="text-xs text-white/30 w-8 text-right">{Math.round(value)}%</span>
              </div>
            ))}
        </div>
      </div>

      {/* Note Distribution */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">
          Aromatic Structure
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Top Notes', value: noteDistribution.top, color: '#FBBF24', desc: 'First impression' },
            { label: 'Heart Notes', value: noteDistribution.heart, color: '#F472B6', desc: 'True character' },
            { label: 'Base Notes', value: noteDistribution.base, color: '#8B5CF6', desc: 'Lasting memory' }
          ].map((note) => (
            <div key={note.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/70">{note.label}</span>
                <span className="text-white/40">{Math.round(note.value)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${note.value}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: note.color }}
                />
              </div>
              <span className="text-[10px] text-white/30">{note.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Oil Breakdown */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">
          Composition ({oils.length} Oils)
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {oils
            .sort((a, b) => b.percentage - a.percentage)
            .map((oil, i) => (
              <motion.div
                key={oil.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-white/80">{oil.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">{oil.ml}ml</span>
                  <span className="text-xs text-[#C9A227] w-10 text-right">{Math.round(oil.percentage)}%</span>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  )
}

function ComponentWeave({ codex }: { codex: BlendCodex }) {
  return (
    <section className="p-5 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/5">
      <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
        Component Weave
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {/* Crystal */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${codex.crystal.frequencyShift > 0 ? '#FBBF24' : '#8B5CF6'}20` }}
            >
              <Sparkles className="w-4 h-4" style={{ color: codex.crystal.frequencyShift > 0 ? '#FBBF24' : '#8B5CF6' }} />
            </div>
            <span className="text-sm font-medium text-white/90">{codex.crystal.name}</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            {codex.crystal.verb} the blend. Amplifies: {codex.crystal.amplifies.slice(0, 2).join(', ')}.
            Shifts frequency by {codex.crystal.frequencyShift > 0 ? '+' : ''}{codex.crystal.frequencyShift}Hz.
          </p>
        </div>

        {/* Cord */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#92400E]/20 flex items-center justify-center">
              <Mountain className="w-4 h-4 text-[#92400E]" />
            </div>
            <span className="text-sm font-medium text-white/90">{codex.cord.name}</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            {codex.cord.verb}, {codex.cord.effect}. {codex.cord.duration}.
          </p>
        </div>

        {/* Carrier */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0891B2]/20 flex items-center justify-center">
              <Droplet className="w-4 h-4 text-[#0891B2]" />
            </div>
            <span className="text-sm font-medium text-white/90">{codex.carrier.name}</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            {codex.carrier.absorption} absorption. {codex.carrier.extendsNotes} Feel: {codex.carrier.feel}.
          </p>
        </div>
      </div>
    </section>
  )
}

function BlendScienceSection({ codex }: { codex: BlendCodex }) {
  const oilIds = codex.composition.oils.map(o => o.id)
  const oilNames = new Map(codex.composition.oils.map(o => [o.id, o.name]))

  const problematic = getInteractionsForMix(oilIds)
  const synergistic: typeof SYNERGISTIC_COMBINATIONS[0][] = []
  for (const combo of SYNERGISTIC_COMBINATIONS) {
    const matchCount = combo.oils.filter(id => oilIds.includes(id)).length
    if (matchCount >= 2) {
      synergistic.push(combo)
    }
  }

  const constituentCounts: Record<string, number> = {}
  const contraindications: string[] = []
  oilIds.forEach(id => {
    const wisdom = OIL_WISDOM[id]
    if (wisdom) {
      wisdom.constituents.primary.forEach(c => {
        constituentCounts[c] = (constituentCounts[c] || 0) + 1
      })
      contraindications.push(...wisdom.therapeutic.contraindications)
    }
  })
  const dominantConstituents = Object.entries(constituentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  const hasScience = problematic.length > 0 || synergistic.length > 0 || dominantConstituents.length > 0 || contraindications.length > 0
  if (!hasScience) return null

  return (
    <section className="p-5 rounded-2xl bg-gradient-to-br from-[#1a1033]/80 to-[#0f0a12] border border-[#8B5CF6]/20">
      <h2 className="text-sm font-medium text-[#A855F7] uppercase tracking-wider mb-4 flex items-center gap-2">
        <Microscope className="w-4 h-4" />
        Blend Science & Chemistry
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Chemistry Profile */}
        <div className="space-y-3">
          <h3 className="text-xs text-white/40 uppercase tracking-wider flex items-center gap-1">
            <Beaker className="w-3 h-3" />
            Dominant Chemistry
          </h3>
          {dominantConstituents.length > 0 ? (
            <div className="space-y-2">
              {dominantConstituents.map(([constituent, count]) => (
                <div key={constituent} className="flex items-center justify-between text-sm">
                  <span className="text-white/80 capitalize">{constituent}</span>
                  <span className="text-xs text-white/40">{count} oil{count > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/50">No dominant chemical markers identified.</p>
          )}

          {contraindications.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">General Cautions</span>
              {Array.from(new Set(contraindications)).slice(0, 3).map((c, i) => (
                <p key={i} className="text-xs text-white/60">• {c}</p>
              ))}
            </div>
          )}
        </div>

        {/* Interactions */}
        <div className="space-y-3">
          <h3 className="text-xs text-white/40 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Interactions & Synergies
          </h3>

          {problematic.length === 0 && synergistic.length === 0 && (
            <p className="text-xs text-white/50">No documented interactions or synergies for this specific combination.</p>
          )}

          {problematic.map((interaction, i) => (
            <div
              key={i}
              className={cn(
                'rounded-lg border p-3',
                interaction.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                interaction.severity === 'high' ? 'bg-amber-500/10 border-amber-500/30' :
                'bg-white/5 border-white/10'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  'text-[10px] font-medium uppercase tracking-wider',
                  interaction.severity === 'critical' ? 'text-red-400' :
                  interaction.severity === 'high' ? 'text-amber-400' :
                  'text-white/50'
                )}>
                  {interaction.severity}
                </span>
                <span className="text-xs text-white/30">•</span>
                <span className="text-xs text-white/70">{oilNames.get(interaction.oilId1) || interaction.oilId1} + {oilNames.get(interaction.oilId2) || interaction.oilId2}</span>
              </div>
              <p className="text-sm text-white/90 font-medium">{interaction.title}</p>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">{interaction.explanation}</p>
              <p className="text-xs text-[#c9a227] mt-1.5">{interaction.recommendation}</p>
            </div>
          ))}

          {synergistic.map((combo, i) => (
            <div key={`syn-${i}`} className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-400">Synergy</span>
              </div>
              <p className="text-sm text-white/90 font-medium">{combo.name}</p>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">{combo.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PracticalProfile({ codex }: { codex: BlendCodex }) {
  const topTherapeutic = Object.entries(codex.therapeuticScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  return (
    <section className="grid md:grid-cols-2 gap-4">
      {/* Therapeutic Scores */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="text-xs text-white/40 uppercase tracking-wider mb-4">
          Therapeutic Profile
        </h3>
        <div className="space-y-3">
          {topTherapeutic.map(([name, score], i) => (
            <div key={name}>
              <div className="flex justify-between text-xs mb-1">
                <span className={cn(
                  "text-white/70",
                  score > 60 && "text-[#C9A227]"
                )}>{name}</span>
                <span className={cn(
                  "text-white/40",
                  score > 60 && "text-[#C9A227]"
                )}>{score}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                  className={cn(
                    "h-full rounded-full",
                    score > 60 ? "bg-[#C9A227]" : "bg-white/30"
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Best For */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <span className="text-xs text-white/40">Best For:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {codex.bestFor.map((use) => (
              <span 
                key={use}
                className="px-2 py-1 rounded-full bg-white/10 text-xs text-white/70"
              >
                {use}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Application Methods */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="text-xs text-white/40 uppercase tracking-wider mb-4">
          Application Methods
        </h3>
        <div className="space-y-3">
          {codex.applicationMethods.map((method, i) => (
            <motion.div
              key={method.method}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-3 rounded-xl border",
                method.suitability > 70 
                  ? "bg-[#C9A227]/10 border-[#C9A227]/30" 
                  : "bg-white/5 border-white/5"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-sm font-medium",
                  method.suitability > 70 ? "text-[#C9A227]" : "text-white/80"
                )}>
                  {method.method}
                </span>
                <span className="text-xs text-white/40">{method.suitability}% match</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                {method.instructions}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function getWarningMessageForLevel(warning: SafetyWarning, experience: ExperienceLevel): string {
  switch (experience) {
    case 'professional':
      return warning.messageProfessional || warning.messageAdvanced || warning.messageIntermediate || warning.message
    case 'advanced':
      return warning.messageAdvanced || warning.messageIntermediate || warning.message
    case 'intermediate':
      return warning.messageIntermediate || warning.message
    case 'beginner':
    default:
      return warning.message
  }
}

const riskConfig: Record<RiskLevel, { icon: React.ReactNode; label: string; color: string; bg: string; border: string }> = {
  info:    { icon: <Info className="w-3 h-3" />, label: 'Info',    color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  low:     { icon: <Info className="w-3 h-3" />, label: 'Note',    color: 'text-green-400',   bg: 'bg-green-500/10',   border: 'border-green-500/20' },
  moderate:{ icon: <AlertTriangle className="w-3 h-3" />, label: 'Caution', color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  high:    { icon: <AlertTriangle className="w-3 h-3" />, label: 'Warning', color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20' },
  critical:{ icon: <AlertTriangle className="w-3 h-3" />, label: 'Critical',color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20' },
}

function ComprehensiveSafetySection({ validation }: { validation: SafetyValidationResult }) {
  const experience = validation.experienceLevel || 'beginner'
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-white/60" />
          <span className="text-sm font-medium text-white/80">Safety Engine Assessment</span>
        </div>
        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium',
          validation.safetyScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
          validation.safetyScore >= 60 ? 'bg-amber-500/20 text-amber-400' :
          'bg-red-500/20 text-red-400'
        )}>
          Score: {validation.safetyScore}/100
        </span>
      </div>

      {validation.warnings.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          No warnings found for your profile.
        </div>
      ) : (
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {validation.warnings.map((warning) => {
            const config = riskConfig[warning.riskLevel]
            const message = getWarningMessageForLevel(warning, experience)
            return (
              <div
                key={warning.id}
                className={cn('rounded-xl border p-3', config.bg, config.border)}
              >
                <div className="flex items-start gap-2">
                  <div className={cn('mt-0.5', config.color)}>{config.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('text-[10px] font-medium uppercase tracking-wider', config.color)}>
                        {config.label}
                      </span>
                      {warning.routeSpecific && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60">
                          {warning.routeSpecific.join(', ')}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-white/90 mt-0.5">{warning.title}</h4>
                    <p className="text-xs text-white/60 mt-0.5 leading-relaxed">{message}</p>
                    {warning.alternatives && warning.alternatives.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="text-[10px] text-[#c9a227]">Alternatives:</span>
                        {warning.alternatives.map((alt) => (
                          <span key={alt} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#c9a227]/10 text-[#c9a227]">
                            {alt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TimingSafetySection({ codex }: { codex: BlendCodex }) {
  const { timing, safety } = codex

  return (
    <section className="grid md:grid-cols-2 gap-4">
      {/* Timing */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/20">
        <h3 className="text-xs text-indigo-300/70 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Timing & Maturation
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Sun className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs text-white/40">Best Time</span>
              <p className="text-sm text-white/80">{timing.timeOfDay.join(', ')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Moon className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-xs text-white/40">Lunar Phase</span>
              <p className="text-sm text-white/80">{timing.lunarPhase}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mountain className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs text-white/40">Season</span>
              <p className="text-sm text-white/80">{timing.season}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <span className="text-xs text-white/40">Maturation</span>
            <p className="text-sm text-white/80">
              Peak character at <span className="text-[#C9A227]">day {timing.maturation.peakDay}</span> — {timing.maturation.character}
            </p>
            <p className="text-xs text-white/50 mt-1">
              Shelf life: {timing.maturation.shelfLife}
            </p>
          </div>
        </div>
      </div>

      {/* Safety */}
      <div className={cn(
        "p-5 rounded-2xl border",
        safety.level === 'safe' ? "bg-emerald-900/10 border-emerald-500/20" :
        safety.level === 'caution' ? "bg-amber-900/10 border-amber-500/20" :
        "bg-red-900/10 border-red-500/20"
      )}>
        <h3 className={cn(
          "text-xs uppercase tracking-wider mb-4 flex items-center gap-2",
          safety.level === 'safe' ? "text-emerald-300/70" :
          safety.level === 'caution' ? "text-amber-300/70" :
          "text-red-300/70"
        )}>
          <Shield className="w-3 h-3" />
          Safety & Cautions
        </h3>

        {codex.safetyValidation ? (
          <ComprehensiveSafetySection validation={codex.safetyValidation} />
        ) : (
          <div className="space-y-3">
            {/* Safety Level Badge */}
            <div className="flex items-center gap-2">
              {safety.level === 'safe' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <span className={cn(
                "text-sm font-medium capitalize",
                safety.level === 'safe' ? "text-emerald-400" :
                safety.level === 'caution' ? "text-amber-400" :
                "text-red-400"
              )}>
                {safety.level} — {safety.level === 'safe' ? 'Generally safe for intended use' : 'Use with awareness'}
              </span>
            </div>

            {/* Pregnancy */}
            {!safety.pregnancySafe && (
              <div className="flex items-start gap-2 text-xs">
                <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5" />
                <span className="text-white/70">Not recommended during pregnancy</span>
              </div>
            )}

            {/* Age Restriction */}
            {safety.ageRestriction && (
              <div className="text-xs text-white/60">
                Age: {safety.ageRestriction}
              </div>
            )}

            {/* Contraindications */}
            {safety.contraindications.length > 0 && (
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                {safety.contraindications.map((caution, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/70">{caution}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function RitualSection({ codex }: { codex: BlendCodex }) {
  return (
    <section className="p-5 rounded-2xl bg-gradient-to-r from-[#C9A227]/10 to-amber-900/10 border border-[#C9A227]/30">
      <h2 className="text-sm font-medium text-[#C9A227] uppercase tracking-wider mb-4 flex items-center gap-2">
        <Heart className="w-4 h-4" />
        The Ritual
      </h2>
      
      <div className="space-y-4">
        {/* Intention */}
        <div>
          <span className="text-xs text-white/40">Intention Setting</span>
          <p className="text-white/90 italic mt-1">&ldquo;{codex.ritual.intention}.&rdquo;</p>
        </div>

        {/* Application */}
        <div>
          <span className="text-xs text-white/40">Application</span>
          <p className="text-sm text-white/80 mt-1">{codex.ritual.application}</p>
        </div>

        {/* Storage */}
        <div className="pt-3 border-t border-white/10">
          <span className="text-xs text-white/40">Storage</span>
          <p className="text-sm text-white/80 mt-1">{codex.ritual.storage}</p>
        </div>
      </div>
    </section>
  )
}

function ActionButtons({ onClose, codex }: { onClose: () => void; codex: BlendCodex }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  
  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/codex/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codex, action: 'generate' })
      })
      
      if (!response.ok) throw new Error('Failed to generate PDF')
      
      const { html } = await response.json()
      
      // Open HTML in new window for printing/PDF save
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(html)
        printWindow.document.close()
        
        // Wait for styles to load then trigger print
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }
  
  const sendEmail = async () => {
    if (!email) return
    
    setEmailStatus('sending')
    try {
      const response = await fetch('/api/codex/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codex, action: 'email', email })
      })
      
      if (!response.ok) throw new Error('Failed to send email')
      
      setEmailStatus('sent')
      setTimeout(() => {
        setShowEmailModal(false)
        setEmail('')
        setEmailStatus('idle')
      }, 2000)
    } catch (error) {
      console.error('Email sending failed:', error)
      alert('Failed to send email. Please try again.')
      setEmailStatus('idle')
    }
  }
  
  return (
    <>
      <section className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a080c] via-[#0a080c] to-transparent pt-8">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
          
          {/* Save as PDF Button */}
          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="flex-1 px-4 py-3 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Save as PDF'}</span>
          </button>
          
          {/* Share Button */}
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex-1 px-4 py-3 rounded-xl bg-[#C9A227] text-[#0a080c] hover:bg-[#f5f3ef] transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Mail className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </section>
      
      {/* Email Share Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setShowEmailModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none"
            >
              <div className="bg-[#111] rounded-2xl border border-white/10 p-6 w-full max-w-md pointer-events-auto">
                <h3 className="text-lg font-medium text-white/90 mb-2">
                  Share "{codex.name}"
                </h3>
                <p className="text-sm text-white/50 mb-4">
                  Send this Living Blend Codex as a beautiful PDF to someone special.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="friend@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]/50"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowEmailModal(false)}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendEmail}
                      disabled={!email || emailStatus === 'sending'}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#C9A227] text-[#0a080c] hover:bg-[#f5f3ef] transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                    >
                      {emailStatus === 'sending' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : emailStatus === 'sent' ? (
                        <>
                          <Check className="w-4 h-4" />
                          Sent!
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Send PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default LivingBlendCodex
