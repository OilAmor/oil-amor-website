'use client'

import { motion } from 'framer-motion'
import { Gem, Lock, Unlock, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { TierType, TIER_COLORS } from '../../styles/design-system'

export interface Milestone {
  id: string
  name: string
  description: string
  requiredCrystals: number
  reward: string
  unlocked: boolean
}

export interface CollectionProgressProps {
  currentCrystals: number
  totalCrystals: number
  tier: TierType
  tierProgress: number
  milestones: Milestone[]
  nextJewelryUnlock: number
  className?: string
}

export function CollectionProgress({
  currentCrystals,
  totalCrystals,
  tier,
  tierProgress,
  milestones,
  nextJewelryUnlock,
  className,
}: CollectionProgressProps) {
  const crystalsUntilNext = Math.max(0, nextJewelryUnlock - currentCrystals)

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl text-miron-dark">Crystal Collection</h3>
          <p className="text-sm text-miron-dark/60">
            {currentCrystals} of {totalCrystals} collected
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider"
          style={{
            background: TIER_COLORS[tier].gradient,
            color: TIER_COLORS[tier].text,
          }}
        >
          {tier} Tier
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {/* Overall Progress */}
        <div>
          <ProgressBar
            value={currentCrystals}
            max={totalCrystals}
            variant="tier"
            showLabel
            labelFormat={(val, max) => `${val}/${max} crystals`}
          />
        </div>

        {/* Tier Progress */}
        <div className="p-4 rounded-xl bg-miron-dark/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-miron-dark/60">Tier Progress</span>
            <span className="text-sm font-medium text-miron-dark">{Math.round(tierProgress)}%</span>
          </div>
          <ProgressBar value={tierProgress} max={100} variant="crystal" showLabel={false} />
        </div>
      </div>

      {/* Next Jewelry Unlock */}
      {crystalsUntilNext > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gold-pure/10 border border-gold-pure/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold-pure/20 flex items-center justify-center">
              <Gem className="w-6 h-6 text-gold-dark" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-miron-dark">Next Jewelry Piece</h4>
              <p className="text-sm text-miron-dark/60">
                Collect {crystalsUntilNext} more crystals to unlock
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-gold-dark animate-pulse" />
          </div>
        </motion.div>
      )}

      {/* Milestones */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider text-miron-dark/50 font-medium">
          Collection Milestones
        </h4>
        <div className="grid gap-2">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center gap-4 p-3 rounded-lg transition-colors',
                milestone.unlocked
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-miron-dark/5 opacity-60'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  milestone.unlocked ? 'bg-green-500 text-white' : 'bg-miron-dark/20'
                )}
              >
                {milestone.unlocked ? (
                  <Unlock className="w-5 h-5" />
                ) : (
                  <Lock className="w-5 h-5 text-miron-dark/40" />
                )}
              </div>
              <div className="flex-1">
                <h5
                  className={cn(
                    'font-medium text-sm',
                    milestone.unlocked ? 'text-miron-dark' : 'text-miron-dark/60'
                  )}
                >
                  {milestone.name}
                </h5>
                <p className="text-xs text-miron-dark/50">{milestone.description}</p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    'text-xs font-medium',
                    milestone.unlocked ? 'text-green-600' : 'text-miron-dark/40'
                  )}
                >
                  {milestone.requiredCrystals} crystals
                </span>
                <p className="text-xs text-miron-dark/40">{milestone.reward}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Compact version for sidebar/header
export function CollectionProgressCompact({
  currentCrystals,
  tier,
  nextJewelryUnlock,
  className,
}: Pick<CollectionProgressProps, 'currentCrystals' | 'tier' | 'nextJewelryUnlock' | 'className'>) {
  const crystalsUntilNext = Math.max(0, nextJewelryUnlock - currentCrystals)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: TIER_COLORS[tier].gradient }}
      >
        <Gem className="w-4 h-4" style={{ color: TIER_COLORS[tier].text }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-miron-dark capitalize">{tier} Tier</span>
          <span className="text-xs text-miron-dark/50">• {currentCrystals} crystals</span>
        </div>
        {crystalsUntilNext > 0 && (
          <p className="text-xs text-gold-dark truncate">
            {crystalsUntilNext} until jewelry unlock
          </p>
        )}
      </div>
    </div>
  )
}

export default CollectionProgress
