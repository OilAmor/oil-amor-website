'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  Leaf, 
  Droplets, 
  Info,
  Globe,
  Award
} from 'lucide-react'
import { 
  CORD_OPTIONS, 
  CordOption,
  CordMaterial 
} from '@/lib/products/attachment-options'
import { cn } from '@/lib/utils'

interface CordSelectorProps {
  selectedCordId: string | undefined
  onSelect: (cordId: string) => void
}

const materialIcons: Record<CordMaterial, string> = {
  'waxed-cotton': '🧵',
  'hemp': '🌿',
  'jute': '🌾',
  'vegan-leather': '♻️',
  'recycled-silk': '🧣',
  'organic-linen': '🌱',
  'cork': '🍾',
}

const materialLabels: Record<CordMaterial, string> = {
  'waxed-cotton': 'Waxed Cotton',
  'hemp': 'Hemp',
  'jute': 'Jute',
  'vegan-leather': 'Vegan Leather',
  'recycled-silk': 'Recycled Silk',
  'organic-linen': 'Organic Linen',
  'cork': 'Cork',
}

function CordCard({ 
  cord, 
  isSelected, 
  onClick 
}: { 
  cord: CordOption
  isSelected: boolean
  onClick: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)
  
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={cn(
          'w-full p-4 rounded-xl border transition-all text-left',
          isSelected
            ? 'bg-[#c9a227]/10 border-[#c9a227]'
            : 'bg-[#111] border-[#f5f3ef]/10 hover:border-[#f5f3ef]/30'
        )}
      >
        <div className="flex items-start gap-4">
          {/* Color Swatch */}
          <div 
            className="w-16 h-16 rounded-lg flex-shrink-0 border-2 border-white/10"
            style={{ backgroundColor: cord.hexColor }}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className={cn(
                  'font-medium',
                  isSelected ? 'text-[#f5f3ef]' : 'text-[#a69b8a]'
                )}>
                  {cord.name}
                </h4>
                <p className="text-xs text-[#a69b8a]">{cord.color}</p>
              </div>
              {isSelected && <Check className="w-5 h-5 text-[#c9a227] flex-shrink-0" />}
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg">{materialIcons[cord.material]}</span>
              <span className="text-xs text-[#a69b8a]">{materialLabels[cord.material]}</span>
              
              {cord.price === 0 ? (
                <span className="ml-auto text-xs text-[#2ecc71]">Free</span>
              ) : (
                <span className="ml-auto text-xs text-[#c9a227]">+${cord.price.toFixed(2)}</span>
              )}
            </div>
            
            {/* Sustainability Badges */}
            <div className="flex flex-wrap gap-1 mt-2">
              {cord.sustainability.biodegradable && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2ecc71]/10 text-[#2ecc71] text-[10px]">
                  <Leaf className="w-3 h-3" />
                  Biodegradable
                </span>
              )}
              {cord.sustainability.carbonFootprint === 'low' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px]">
                  <Globe className="w-3 h-3" />
                  Low Carbon
                </span>
              )}
              {cord.sustainability.certifications?.map(cert => (
                <span key={cert} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c9a227]/10 text-[#c9a227] text-[10px]">
                  <Award className="w-3 h-3" />
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Expand Details */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
          className="flex items-center gap-1 mt-3 text-xs text-[#a69b8a] hover:text-[#f5f3ef]"
        >
          <Info className="w-3 h-3" />
          {showDetails ? 'Hide details' : 'Show details'}
        </button>
        
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-[#f5f3ef]/10">
                <p className="text-sm text-[#a69b8a] mb-3">{cord.description}</p>
                
                {/* Properties */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 rounded-lg bg-[#0a080c]">
                    <p className="text-xs text-[#a69b8a]">Durability</p>
                    <div className="flex justify-center gap-0.5 mt-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            'w-1.5 h-3 rounded-sm',
                            i < cord.properties.durability ? 'bg-[#c9a227]' : 'bg-[#f5f3ef]/10'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-[#0a080c]">
                    <p className="text-xs text-[#a69b8a]">Water Res.</p>
                    <div className="flex justify-center gap-0.5 mt-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            'w-1.5 h-3 rounded-sm',
                            i < cord.properties.waterResistance ? 'bg-[#c9a227]' : 'bg-[#f5f3ef]/10'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-[#0a080c]">
                    <p className="text-xs text-[#a69b8a]">Flexibility</p>
                    <div className="flex justify-center gap-0.5 mt-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            'w-1.5 h-3 rounded-sm',
                            i < cord.properties.flexibility ? 'bg-[#c9a227]' : 'bg-[#f5f3ef]/10'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-[#a69b8a]">
                  <Droplets className="w-3 h-3 inline mr-1" />
                  Care: {cord.careInstructions}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}

export function CordSelector({ selectedCordId, onSelect }: CordSelectorProps) {
  const [filterMaterial, setFilterMaterial] = useState<CordMaterial | 'all'>('all')
  
  const filteredCords = filterMaterial === 'all' 
    ? CORD_OPTIONS 
    : CORD_OPTIONS.filter(c => c.material === filterMaterial)
  
  const materials = Array.from(new Set(CORD_OPTIONS.map(c => c.material)))
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[#f5f3ef]">Select Cord</h3>
      
      {/* Material Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterMaterial('all')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs transition-colors',
            filterMaterial === 'all'
              ? 'bg-[#c9a227] text-[#0a080c]'
              : 'bg-[#111] text-[#a69b8a] border border-[#f5f3ef]/10'
          )}
        >
          All Materials
        </button>
        {materials.map(material => (
          <button
            key={material}
            onClick={() => setFilterMaterial(material)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1',
              filterMaterial === material
                ? 'bg-[#c9a227] text-[#0a080c]'
                : 'bg-[#111] text-[#a69b8a] border border-[#f5f3ef]/10'
            )}
          >
            <span>{materialIcons[material]}</span>
            {materialLabels[material]}
          </button>
        ))}
      </div>
      
      {/* Cord Grid */}
      <div className="grid gap-3">
        {filteredCords.map(cord => (
          <CordCard
            key={cord.id}
            cord={cord}
            isSelected={selectedCordId === cord.id}
            onClick={() => onSelect(cord.id)}
          />
        ))}
      </div>
    </div>
  )
}
