'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, 
  Sparkles,
  HelpCircle,
  Shuffle
} from 'lucide-react'
import { 
  CHARM_OPTIONS, 
  CharmOption,
  MYSTERY_CHARM_CONFIG,
  CharmType
} from '@/lib/products/attachment-options'
import { cn } from '@/lib/utils'

interface CharmSelectorProps {
  selectedCharmId: string | undefined
  isMysterySelected: boolean
  onSelectCharm: (charmId: string) => void
  onSelectMystery: () => void
}

const typeIcons: Record<CharmType, string> = {
  'crystal': '💎',
  'metal': '⚙️',
  'wood': '🪵',
  'symbol': '✨',
}

const typeLabels: Record<CharmType, string> = {
  'crystal': 'Crystal',
  'metal': 'Metal',
  'wood': 'Wood',
  'symbol': 'Symbol',
}

const rarityColors: Record<string, string> = {
  'common': 'text-[#a69b8a]',
  'uncommon': 'text-green-400',
  'rare': 'text-blue-400',
  'legendary': 'text-[#c9a227]',
}

function CharmCard({ 
  charm, 
  isSelected, 
  onClick 
}: { 
  charm: CharmOption
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-4 rounded-xl border transition-all text-left h-full',
        isSelected
          ? 'bg-[#c9a227]/10 border-[#c9a227]'
          : 'bg-[#111] border-[#f5f3ef]/10 hover:border-[#f5f3ef]/30'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{typeIcons[charm.type]}</span>
        {isSelected && <Check className="w-5 h-5 text-[#c9a227]" />}
      </div>
      
      <h4 className={cn(
        'font-medium text-sm',
        isSelected ? 'text-[#f5f3ef]' : 'text-[#a69b8a]'
      )}>
        {charm.name}
      </h4>
      
      <p className="text-xs text-[#a69b8a] mt-1">{typeLabels[charm.type]}</p>
      
      {charm.rarity && (
        <p className={cn('text-xs mt-1 capitalize', rarityColors[charm.rarity])}>
          {charm.rarity}
        </p>
      )}
      
      <p className="text-xs text-[#c9a227] mt-2">+${charm.price.toFixed(2)}</p>
    </button>
  )
}

export function CharmSelector({ 
  selectedCharmId, 
  isMysterySelected,
  onSelectCharm,
  onSelectMystery
}: CharmSelectorProps) {
  const [filterType, setFilterType] = useState<CharmType | 'all'>('all')
  
  const filteredCharms = filterType === 'all' 
    ? CHARM_OPTIONS 
    : CHARM_OPTIONS.filter(c => c.type === filterType)
  
  const types = Array.from(new Set(CHARM_OPTIONS.map(c => c.type)))
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[#f5f3ef]">Select Charm</h3>
      
      {/* Mystery Charm Option */}
      <button
        onClick={onSelectMystery}
        className={cn(
          'w-full p-4 rounded-xl border transition-all text-left',
          isMysterySelected
            ? 'bg-gradient-to-r from-[#c9a227]/20 to-purple-500/20 border-[#c9a227]'
            : 'bg-[#111] border-[#f5f3ef]/10 hover:border-[#f5f3ef]/30'
        )}
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#c9a227] to-purple-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className={cn(
                'font-medium',
                isMysterySelected ? 'text-[#f5f3ef]' : 'text-[#a69b8a]'
              )}>
                {MYSTERY_CHARM_CONFIG.name}
              </h4>
              {isMysterySelected && <Check className="w-5 h-5 text-[#c9a227]" />}
            </div>
            <p className="text-sm text-[#a69b8a] mt-1">
              {MYSTERY_CHARM_CONFIG.description}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs">
                <Shuffle className="w-3 h-3" />
                Random Selection
              </span>
              {MYSTERY_CHARM_CONFIG.price === 0 ? (
                <span className="text-xs text-[#2ecc71]">Free</span>
              ) : (
                <span className="text-xs text-[#c9a227]">+${MYSTERY_CHARM_CONFIG.price.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </button>
      
      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[#f5f3ef]/10" />
        <span className="text-xs text-[#a69b8a]">Or choose a specific charm</span>
        <div className="flex-1 h-px bg-[#f5f3ef]/10" />
      </div>
      
      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs transition-colors',
            filterType === 'all'
              ? 'bg-[#c9a227] text-[#0a080c]'
              : 'bg-[#111] text-[#a69b8a] border border-[#f5f3ef]/10'
          )}
        >
          All Types
        </button>
        {types.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1',
              filterType === type
                ? 'bg-[#c9a227] text-[#0a080c]'
                : 'bg-[#111] text-[#a69b8a] border border-[#f5f3ef]/10'
            )}
          >
            <span>{typeIcons[type]}</span>
            {typeLabels[type]}
          </button>
        ))}
      </div>
      
      {/* Charm Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredCharms.map(charm => (
          <CharmCard
            key={charm.id}
            charm={charm}
            isSelected={selectedCharmId === charm.id && !isMysterySelected}
            onClick={() => onSelectCharm(charm.id)}
          />
        ))}
      </div>
    </div>
  )
}
