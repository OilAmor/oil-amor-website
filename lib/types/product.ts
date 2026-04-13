/**
 * Product Type Definitions
 */

import type { ID, Price, Image, SEO } from './index'

export type Chakra =
  | 'root'
  | 'sacral'
  | 'solar-plexus'
  | 'heart'
  | 'throat'
  | 'third-eye'
  | 'crown'

export type Element = 'earth' | 'water' | 'fire' | 'air'

export type CrystalRarity = 'common' | 'uncommon' | 'rare' | 'legendary'

export interface Crystal {
  id: ID
  slug: string
  name: string
  description: string
  meaning: string
  properties: {
    chakra: Chakra
    element: Element
    zodiac: string[]
    healing: string[]
  }
  images: Image[]
  color: string
  rarity: CrystalRarity
  origin?: string
  availability: 'in-stock' | 'low-stock' | 'out-of-stock'
  isUnlocked: boolean
}

export interface CrystalOption extends Crystal {
  isRecommended: boolean
  pairingReason?: string
}

export type ExtractionMethod = 
  | 'steam-distillation'
  | 'cold-pressed'
  | 'co2-extraction'

export type OilCategory =
  | 'floral'
  | 'citrus'
  | 'herbal'
  | 'woody'
  | 'spicy'
  | 'earthy'

export interface Oil {
  id: ID
  slug: string
  name: string
  commonName: string
  botanicalName: string
  description: string
  category: OilCategory
  origin: string
  extractionMethod: ExtractionMethod
  therapeuticProperties: string[]
  images: Image[]
  featuredImage?: Image
  price: Price
  recommendedCrystals: string[]
  seo: SEO
}

export type BottleSize = '5ml' | '10ml' | '15ml' | '30ml'

export interface SynergyContent {
  id: ID
  headline: string
  story: string
  scientificNote: string
  ritualInstructions: {
    step: number
    title: string
    description: string
    duration?: string
  }[]
  chakra: Chakra
  element: Element
  zodiac: string[]
}

export type CordType = 
  | 'black-cotton' 
  | 'brown-hemp' 
  | 'beige-linen' 
  | 'gold-chain' 
  | 'silver-chain'

export interface CordOption {
  id: ID
  name: string
  type: CordType
  tierRequired: string
  price: number
}
