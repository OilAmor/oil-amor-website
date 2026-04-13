// ========================================
// Content API Types
// ========================================

export type BottleSize = '5ml' | '10ml' | '15ml' | '20ml' | '30ml'

export type TierLevel = 'seed' | 'sprout' | 'bloom' | 'radiance' | 'luminary'

export type Chakra =
  | 'root'
  | 'sacral'
  | 'solar-plexus'
  | 'heart'
  | 'throat'
  | 'third-eye'
  | 'crown'
  | 'all'

export type Element = 'earth' | 'water' | 'fire' | 'air' | 'ether'

export type Zodiac =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces'

export type Intention =
  | 'calm'
  | 'energy'
  | 'love'
  | 'clarity'
  | 'protection'
  | 'abundance'
  | 'healing'
  | 'spiritual'
  | 'creativity'
  | 'sleep'

// ========================================
// Crystal Types
// ========================================

export interface CrystalProperties {
  chakra: Chakra
  element: Element
  zodiac: Zodiac[]
  origin: string
  meaning: string
}

export interface CrystalImage {
  asset: {
    _ref: string
    url: string
  }
  alt?: string
  caption?: string
}

export interface EducationalContentBlock {
  _key: string
  title: string
  content: any[] // Portable Text
  type: 'history' | 'formation' | 'care' | 'healing' | 'meditation'
}

export interface Crystal {
  _id: string
  _type: 'crystal'
  name: string
  slug: { current: string }
  properties: CrystalProperties
  images: CrystalImage[]
  availability: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued'
  educationalContent: EducationalContentBlock[]
  hardness?: number
  colorVariants: string[]
  featured: boolean
}

export interface CrystalPropertiesResponse {
  chakra: Chakra
  element: Element
  zodiac: Zodiac[]
  origin: string
  meaning: string
  hardness?: number
  colorVariants: string[]
}

// ========================================
// Synergy Content Types
// ========================================

export interface RitualStep {
  _key: string
  stepNumber: number
  title: string
  instruction: string
  duration?: string
}

export interface ColorPalette {
  primary?: string
  secondary?: string
  accent?: string
}

export interface SynergyContent {
  _id: string
  _type: 'synergyContent'
  oil: {
    _ref: string
    title?: string
    slug?: { current: string }
  }
  crystal: {
    _ref: string
    name?: string
    slug?: { current: string }
  }
  headline: string
  story: any[] // Portable Text
  scientificNote: string
  ritualInstructions: RitualStep[]
  frequency?: number
  frequencyName?: string
  collectionTheme?: string
  chakraAlignment: Chakra
  element: Element
  zodiacAffinity: Zodiac[]
  bestTime: 'morning' | 'midday' | 'evening' | 'night' | 'any'
  intention: Intention
  featuredImage?: {
    asset: {
      _ref: string
      url: string
    }
    alt?: string
  }
  colorPalette?: ColorPalette
  isFeatured: boolean
  priority: number
}

export interface SynergyContentResponse {
  _id: string
  headline: string
  story: any[]
  scientificNote: string
  ritualInstructions: RitualStep[]
  frequency?: number
  frequencyName?: string
  collectionTheme?: string
  chakraAlignment: Chakra
  element: Element
  zodiacAffinity: Zodiac[]
  bestTime: string
  intention: string
  colorPalette?: ColorPalette
  oil: {
    _id: string
    title: string
    slug: string
    botanicalName?: string
  }
  crystal: {
    _id: string
    name: string
    slug: string
    properties?: CrystalProperties
  }
}

// ========================================
// Cord/Charm/Chain Types
// ========================================

export type CordType = 'cord' | 'charm' | 'chain'

export interface CordOption {
  _id: string
  name: string
  slug: string
  type: CordType
  material: string
  tierRequirement: TierLevel
  price: number
  images: CrystalImage[]
  description?: any[] // Portable Text
  shortDescription?: string
  color?: string
  length?: string
  availability: 'available' | 'limited' | 'unavailable'
  purchaseCountRequirement: number
  isDefault: boolean
  sortOrder: number
  symbolism?: string
  careInstructions?: string
}

export interface CharmOption extends CordOption {
  type: 'charm'
  symbolism: string
}

export interface ChainOption extends CordOption {
  type: 'chain'
  length: string
}

// ========================================
// Oil Types (Extended)
// ========================================

export interface OilSynergy {
  _key: string
  crystal: {
    _ref: string
    name?: string
  }
  content?: {
    _ref: string
  }
  strength: 'primary' | 'secondary' | 'tertiary'
}

export interface TherapeuticProperties {
  primary: string[]
  emotional: string[]
  physical: string[]
  spiritual: string[]
}

export interface BotanicalOrigin {
  plantPart?: string
  harvestingInfo?: string
  sustainabilityNotes?: string
}

export interface ExtractionMethod {
  method: string
  details?: string
}

export interface SafetyNotes {
  dilutionRequired: boolean
  maxDilution?: number
  contraindications: string[]
  additionalWarnings?: string
}

export interface OlfactoryProfile {
  topNotes: string[]
  heartNotes: string[]
  baseNotes: string[]
}

export interface ExtendedOil {
  _id: string
  _type: 'oil'
  title: string
  slug: { current: string }
  botanicalName: string
  commonName?: string
  origin?: string
  description?: string
  story?: any[]
  price: number
  crystal: {
    name: string
    property?: string
    color?: string
    reference?: { _ref: string }
  }
  synergies: OilSynergy[]
  therapeuticProperties: TherapeuticProperties
  botanicalOrigin: BotanicalOrigin
  extractionMethod: ExtractionMethod
  safetyNotes: SafetyNotes
  olfactoryProfile?: OlfactoryProfile
  category: string
  benefits: string[]
  usage?: any[]
  mainImage?: {
    asset: {
      _ref: string
      url: string
    }
    alt?: string
  }
  featured: boolean
  badge?: string
}

// ========================================
// Cache Types
// ========================================

export interface CacheConfig {
  ttl: number // seconds
  key: string
  tags?: string[]
}

export const DEFAULT_CACHE_TTL = {
  SYNERGY: 60 * 60 * 24, // 24 hours
  CRYSTAL: 60 * 60 * 6, // 6 hours
  CORD: 60 * 60 * 2, // 2 hours
  OIL: 60 * 60 * 12, // 12 hours
}
