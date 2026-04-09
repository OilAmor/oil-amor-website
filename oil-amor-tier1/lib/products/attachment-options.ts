/**
 * Oil Amor Cord & Charm System
 * Forever Bottle attachment customization
 */

// ============================================================================
// CORD OPTIONS
// ============================================================================

export type CordMaterial = 'waxed-cotton' | 'hemp' | 'jute' | 'vegan-leather' | 'recycled-silk' | 'organic-linen' | 'cork'
export type CordAesthetic = 'rustic' | 'minimal' | 'luxury' | 'bohemian' | 'natural' | 'industrial'

export interface CordOption {
  id: string
  name: string
  material: CordMaterial
  color: string
  hexColor: string
  price: number
  
  // Sustainability metrics
  sustainability: {
    biodegradable: boolean
    carbonFootprint: 'low' | 'medium' | 'high'
    waterUsage: 'low' | 'medium' | 'high'
    origin: string
    certifications?: string[] // e.g., ['GOTS', 'OEKO-TEX']
  }
  
  // Physical properties
  properties: {
    durability: number // 1-10
    waterResistance: number // 1-10
    flexibility: number // 1-10
    texture: 'smooth' | 'textured' | 'braided' | 'twisted'
    thickness: 'thin' | 'medium' | 'thick'
  }
  
  // Aesthetic
  aesthetic: CordAesthetic
  description: string
  careInstructions: string
  
  // Availability
  inStock: boolean
  lowStock?: boolean
}

export const CORD_OPTIONS: CordOption[] = [
  {
    id: 'waxed-cotton-natural',
    name: 'Heritage Waxed Cotton',
    material: 'waxed-cotton',
    color: 'Natural Brown',
    hexColor: '#8B7355',
    price: 0,
    sustainability: {
      biodegradable: true,
      carbonFootprint: 'low',
      waterUsage: 'medium',
      origin: 'Australia',
      certifications: ['OEKO-TEX'],
    },
    properties: {
      durability: 8,
      waterResistance: 9,
      flexibility: 7,
      texture: 'smooth',
      thickness: 'medium',
    },
    aesthetic: 'rustic',
    description: 'Classic waxed cotton cord with a heritage feel. Water-resistant and ages beautifully with a natural patina.',
    careInstructions: 'Wipe clean with damp cloth. Re-wax annually if needed.',
    inStock: true,
  },
  {
    id: 'waxed-cotton-black',
    name: 'Midnight Waxed Cotton',
    material: 'waxed-cotton',
    color: 'Black',
    hexColor: '#1a1a1a',
    price: 0,
    sustainability: {
      biodegradable: true,
      carbonFootprint: 'low',
      waterUsage: 'medium',
      origin: 'Australia',
    },
    properties: {
      durability: 8,
      waterResistance: 9,
      flexibility: 7,
      texture: 'smooth',
      thickness: 'medium',
    },
    aesthetic: 'minimal',
    description: 'Sleek black waxed cotton for a modern, sophisticated look.',
    careInstructions: 'Wipe clean with damp cloth.',
    inStock: true,
  },
  {
    id: 'hemp-natural',
    name: 'Raw Hemp Fiber',
    material: 'hemp',
    color: 'Natural Green-Brown',
    hexColor: '#4A5D23',
    price: 0,
    sustainability: {
      biodegradable: true,
      carbonFootprint: 'low',
      waterUsage: 'low',
      origin: 'Nepal',
      certifications: ['GOTS', 'Fair Trade'],
    },
    properties: {
      durability: 9,
      waterResistance: 5,
      flexibility: 6,
      texture: 'textured',
      thickness: 'medium',
    },
    aesthetic: 'bohemian',
    description: 'Sustainably grown hemp with natural texture. Strong, durable, and eco-friendly. Softens with use.',
    careInstructions: 'Hand wash in cold water. Air dry.',
    inStock: true,
  },
  {
    id: 'vegan-leather-black',
    name: 'Midnight Vegan Leather',
    material: 'vegan-leather',
    color: 'Black',
    hexColor: '#0a0a0a',
    price: 2.00,
    sustainability: {
      biodegradable: false,
      carbonFootprint: 'medium',
      waterUsage: 'medium',
      origin: 'Italy',
    },
    properties: {
      durability: 10,
      waterResistance: 8,
      flexibility: 8,
      texture: 'smooth',
      thickness: 'medium',
    },
    aesthetic: 'luxury',
    description: 'Premium Italian vegan leather. Sophisticated, durable, and cruelty-free.',
    careInstructions: 'Wipe with damp cloth. Condition occasionally.',
    inStock: true,
  },
]

// ============================================================================
// CHARM OPTIONS
// ============================================================================

export type CharmType = 'crystal' | 'metal' | 'wood' | 'symbol'
export type MetalType = 'silver' | 'gold' | 'brass' | 'copper' | 'rose-gold'

export interface CharmOption {
  id: string
  name: string
  type: CharmType
  
  // Crystal specific
  crystal?: {
    type: string
    properties: string[]
    chakra?: string
    zodiac?: string[]
  }
  
  // Metal specific
  metal?: {
    type: MetalType
    purity?: string
  }
  
  // Visual
  description: string
  symbolism: string
  price: number
  
  // Random pool for "Mystery" selection
  inRandomPool: boolean
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary'
  
  // Availability
  inStock: boolean
  limitedEdition?: boolean
}

export const CHARM_OPTIONS: CharmOption[] = [
  {
    id: 'charm-amethyst-point',
    name: 'Amethyst Point',
    type: 'crystal',
    crystal: {
      type: 'amethyst',
      properties: ['Calm', 'Clarity', 'Spiritual Growth'],
      chakra: 'Crown',
      zodiac: ['Pisces', 'Virgo', 'Aquarius'],
    },
    description: 'Natural amethyst crystal point. Deep purple with natural striations.',
    symbolism: 'Clarity, peace, and spiritual awakening',
    price: 4.95,
    inRandomPool: true,
    rarity: 'common',
    inStock: true,
  },
  {
    id: 'charm-rose-quartz-heart',
    name: 'Rose Quartz Heart',
    type: 'crystal',
    crystal: {
      type: 'rose-quartz',
      properties: ['Love', 'Compassion', 'Emotional Healing'],
      chakra: 'Heart',
      zodiac: ['Taurus', 'Libra'],
    },
    description: 'Carved rose quartz heart. Soft pink with natural inclusions.',
    symbolism: 'Unconditional love and emotional healing',
    price: 4.95,
    inRandomPool: true,
    rarity: 'common',
    inStock: true,
  },
  {
    id: 'charm-tiger-eye',
    name: 'Tiger\'s Eye',
    type: 'crystal',
    crystal: {
      type: 'tiger-eye',
      properties: ['Courage', 'Confidence', 'Willpower'],
      chakra: 'Solar Plexus',
      zodiac: ['Leo', 'Capricorn'],
    },
    description: 'Golden-brown tiger\'s eye with chatoyant bands.',
    symbolism: 'Courage, confidence, and personal power',
    price: 4.95,
    inRandomPool: true,
    rarity: 'common',
    inStock: true,
  },
  {
    id: 'charm-brass-sun',
    name: 'Brass Sun',
    type: 'metal',
    metal: { type: 'brass' },
    description: 'Etched brass sun symbol. Warm golden tone.',
    symbolism: 'Vitality, energy, and life force',
    price: 2.95,
    inRandomPool: true,
    rarity: 'common',
    inStock: true,
  },
  {
    id: 'charm-evil-eye',
    name: 'Evil Eye',
    type: 'symbol',
    description: 'Traditional glass evil eye bead. Protection symbol.',
    symbolism: 'Protection from negative energies',
    price: 2.95,
    inRandomPool: true,
    rarity: 'common',
    inStock: true,
  },
]

// ============================================================================
// MYSTERY CHARM SYSTEM
// ============================================================================

export interface MysteryCharmConfig {
  enabled: boolean
  name: string
  description: string
  price: number
}

export const MYSTERY_CHARM_CONFIG: MysteryCharmConfig = {
  enabled: true,
  name: 'Mystery Charm',
  description: 'Let the universe choose your crystal companion. Each mystery charm is intuitively selected from our collection.',
  price: 0,
}

export function selectRandomCharm(): CharmOption {
  const pool = CHARM_OPTIONS.filter(c => c.inRandomPool && c.inStock)
  return pool[Math.floor(Math.random() * pool.length)]
}

// ============================================================================
// ATTACHMENT SELECTION
// ============================================================================

export type AttachmentType = 'cord' | 'charm' | 'none'

export interface AttachmentSelection {
  type: AttachmentType
  cordId?: string
  charmId?: string
  isMysteryCharm: boolean
}

export function getDefaultAttachment(orderCount: number): AttachmentSelection {
  if (orderCount === 0) {
    return {
      type: 'cord',
      cordId: 'waxed-cotton-natural',
      isMysteryCharm: false,
    }
  } else if (orderCount >= 5) {
    return {
      type: 'charm',
      isMysteryCharm: true,
    }
  } else {
    return {
      type: 'cord',
      cordId: 'waxed-cotton-natural',
      isMysteryCharm: false,
    }
  }
}

export function getAttachmentPrice(selection: AttachmentSelection): number {
  if (selection.type === 'none') return 0
  
  if (selection.type === 'cord' && selection.cordId) {
    const cord = CORD_OPTIONS.find(c => c.id === selection.cordId)
    return cord?.price || 0
  }
  
  if (selection.type === 'charm') {
    if (selection.isMysteryCharm) {
      return MYSTERY_CHARM_CONFIG.price
    }
    if (selection.charmId) {
      const charm = CHARM_OPTIONS.find(c => c.id === selection.charmId)
      return charm?.price || 0
    }
  }
  
  return 0
}

// ============================================================================
// ATTACHMENT RECOMMENDATION & VALIDATION
// ============================================================================

export interface AttachmentRecommendation {
  type: AttachmentType
  cordId?: string
  charmId?: string
  isMysteryCharm: boolean
  reason: string
}

export function getAttachmentRecommendation(
  oilId: string,
  orderCount: number,
  preferences?: {
    aesthetic?: CordAesthetic
    sustainability?: boolean
    budget?: number
  }
): AttachmentRecommendation {
  // First-time orders get a cord
  if (orderCount === 0) {
    if (preferences?.sustainability) {
      return {
        type: 'cord',
        cordId: 'hemp-natural',
        isMysteryCharm: false,
        reason: 'Eco-friendly hemp for sustainability-conscious customers',
      }
    }
    return {
      type: 'cord',
      cordId: 'waxed-cotton-natural',
      isMysteryCharm: false,
      reason: 'Classic heritage look for first-time customers',
    }
  }
  
  // Loyal customers (5+ orders) get mystery charm option
  if (orderCount >= 5) {
    return {
      type: 'charm',
      isMysteryCharm: true,
      reason: 'Free mystery charm for loyal customers',
    }
  }
  
  // Default to cord
  return {
    type: 'cord',
    cordId: preferences?.aesthetic === 'luxury' ? 'vegan-leather-black' : 'waxed-cotton-natural',
    isMysteryCharm: false,
    reason: 'Standard cord attachment',
  }
}

export interface AttachmentValidationResult {
  valid: boolean
  errors: string[]
}

export function validateAttachment(selection: AttachmentSelection): AttachmentValidationResult {
  const errors: string[] = []
  
  if (selection.type === 'cord') {
    if (!selection.cordId) {
      errors.push('Cord ID is required for cord attachment')
    } else {
      const cord = CORD_OPTIONS.find(c => c.id === selection.cordId)
      if (!cord) {
        errors.push(`Invalid cord ID: ${selection.cordId}`)
      } else if (!cord.inStock) {
        errors.push(`Cord ${cord.name} is out of stock`)
      }
    }
  }
  
  if (selection.type === 'charm' && !selection.isMysteryCharm) {
    if (!selection.charmId) {
      errors.push('Charm ID is required for non-mystery charm')
    } else {
      const charm = CHARM_OPTIONS.find(c => c.id === selection.charmId)
      if (!charm) {
        errors.push(`Invalid charm ID: ${selection.charmId}`)
      } else if (!charm.inStock) {
        errors.push(`Charm ${charm.name} is out of stock`)
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}
