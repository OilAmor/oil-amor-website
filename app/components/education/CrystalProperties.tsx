'use client'

import { Flame, Droplets, Mountain, Wind, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ELEMENT_COLORS, CHAKRA_COLORS, ElementType, ChakraType } from '../../styles/design-system'

export interface CrystalPropertiesProps {
  element?: ElementType
  chakra?: ChakraType
  zodiac?: string[]
  properties: string[]
  className?: string
}

const elementIcons: Record<ElementType, typeof Flame> = {
  fire: Flame,
  water: Droplets,
  earth: Mountain,
  air: Wind,
  spirit: Sparkles,
}

const chakraLabels: Record<ChakraType, string> = {
  root: 'Root',
  sacral: 'Sacral',
  solar: 'Solar Plexus',
  heart: 'Heart',
  throat: 'Throat',
  thirdEye: 'Third Eye',
  crown: 'Crown',
}

const elementLabels: Record<ElementType, string> = {
  fire: 'Fire',
  water: 'Water',
  earth: 'Earth',
  air: 'Air',
  spirit: 'Spirit',
}

export function CrystalProperties({
  element,
  chakra,
  zodiac,
  properties,
  className,
}: CrystalPropertiesProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Element & Chakra Row */}
      <div className="flex flex-wrap gap-3">
        {element && (
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium"
            style={{ backgroundColor: ELEMENT_COLORS[element] }}
          >
            {(() => {
              const Icon = elementIcons[element]
              return <Icon className="w-4 h-4" />
            })()}
            <span>{elementLabels[element]}</span>
          </div>
        )}

        {chakra && (
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium"
            style={{ backgroundColor: CHAKRA_COLORS[chakra] }}
          >
            <Sparkles className="w-4 h-4" />
            <span>{chakraLabels[chakra]}</span>
          </div>
        )}
      </div>

      {/* Zodiac */}
      {zodiac && zodiac.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-miron-dark/50">Zodiac:</span>
          <div className="flex gap-1">
            {zodiac.map((sign) => (
              <span
                key={sign}
                className="px-2 py-0.5 bg-miron-dark/5 rounded text-miron-dark/70"
              >
                {sign}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Properties */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-miron-dark/50 mb-2">
          Metaphysical Properties
        </h4>
        <div className="flex flex-wrap gap-2">
          {properties.map((property) => (
            <span
              key={property}
              className="px-3 py-1.5 bg-gold-pure/10 text-gold-dark text-sm rounded-full"
            >
              {property}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Compact version for product cards
export function CrystalPropertiesCompact({
  element,
  chakra,
  className,
}: Pick<CrystalPropertiesProps, 'element' | 'chakra' | 'className'>) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {element && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: ELEMENT_COLORS[element] }}
          title={`${elementLabels[element]} Element`}
        >
          {(() => {
            const Icon = elementIcons[element]
            return <Icon className="w-3 h-3 text-white" />
          })()}
        </div>
      )}
      {chakra && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: CHAKRA_COLORS[chakra] }}
          title={`${chakraLabels[chakra]} Chakra`}
        >
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  )
}

export default CrystalProperties
