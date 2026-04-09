/**
 * Oil Amor Product Configurator Constants
 * Design tokens, animation configurations, and static data
 */

import { BottleSize, Chakra, CordType, CrystalConfig, Elemental, Element, TierLevel } from '../types'

// ============================================================================
// DESIGN TOKENS - Miron Violetglass Palette
// ============================================================================

export const COLORS = {
  miron: {
    violet: '#3D2B5A',
    dark: '#1a0f2e',
    light: '#5a4575',
    glass: 'rgba(61, 43, 90, 0.3)',
    glow: 'rgba(61, 43, 90, 0.6)',
  },
  gold: {
    DEFAULT: '#C9A227',
    light: '#E5C84B',
    dark: '#9A7B1A',
    muted: 'rgba(201, 162, 39, 0.3)',
  },
  cream: {
    DEFAULT: '#F5F1E8',
    light: '#FFFCF5',
    dark: '#E8E0D0',
  },
  charcoal: {
    DEFAULT: '#2D2D2D',
    light: '#4A4A4A',
    dark: '#1A1A1A',
  },
  chakra: {
    root: '#C62828',
    sacral: '#F57C00',
    solarPlexus: '#FBC02D',
    heart: '#388E3C',
    throat: '#1976D2',
    thirdEye: '#7B1FA2',
    crown: '#5E35B1',
  },
  element: {
    earth: '#5D4037',
    water: '#0277BD',
    fire: '#D84315',
    air: '#E0E0E0',
    ether: '#B39DDB',
  },
} as const

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const FONTS = {
  heading: 'Cormorant Garamond, Georgia, serif',
  body: 'Inter, system-ui, sans-serif',
  accent: 'Cormorant Garamond, Georgia, serif',
} as const

// ============================================================================
// ANIMATION CONFIGURATIONS
// ============================================================================

export const TRANSITIONS = {
  crystalSelect: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  contentReveal: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1],
  },
  synergyUpdate: {
    duration: 0.2,
    ease: 'easeOut',
  },
  priceUpdate: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  },
  addToCart: {
    duration: 0.6,
    ease: [0.4, 0, 0.2, 1],
  },
  hover: {
    duration: 0.2,
    ease: 'easeInOut',
  },
  stagger: {
    staggerChildren: 0.05,
    delayChildren: 0.1,
  },
} as const

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  crystalCard: {
    initial: { opacity: 0, scale: 0.9, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -10 },
    selected: { scale: 1.05, boxShadow: `0 0 20px ${COLORS.miron.glow}` },
    hover: { scale: 1.02, y: -2 },
  },
  bottleFly: {
    initial: { x: 0, y: 0, scale: 1 },
    animate: { 
      x: 300, 
      y: -200, 
      scale: 0.2,
      opacity: 0,
    },
  },
  progressBar: {
    initial: { width: 0 },
    animate: { width: '100%' },
  },
} as const

// ============================================================================
// CRYSTAL MAPPING BY BOTTLE SIZE
// ============================================================================

export const CRYSTAL_MAPPING: Record<BottleSize, CrystalConfig> = {
  [BottleSize.SMALL]: {
    count: 3,
    description: 'Crystal Whisper - Subtle energetic presence',
  },
  [BottleSize.MEDIUM]: {
    count: 7,
    description: 'Crystal Garden - Balanced energy matrix',
  },
  [BottleSize.LARGE]: {
    count: 12,
    description: 'Crystal Sanctuary - Full spectrum power',
  },
} as const

// ============================================================================
// PRICING CONSTANTS
// ============================================================================

export const PRICING = {
  basePrice: {
    [BottleSize.SMALL]: 45,
    [BottleSize.MEDIUM]: 89,
    [BottleSize.LARGE]: 189,
  },
  cordUpgrades: {
    [CordType.BLACK_COTTON]: 0,
    [CordType.BROWN_HEMP]: 0,
    [CordType.BEIGE_LINEN]: 0,
    [CordType.GOLD_CHAIN]: 15,
    [CordType.SILVER_CHAIN]: 12,
    [CordType.ROSE_GOLD_CHAIN]: 18,
  },
  extraCrystals: 25,
  charmBase: 8,
  tierDiscount: {
    ['seed' as TierLevel]: 0,
    ['sprout' as TierLevel]: 0,
    ['bloom' as TierLevel]: 0,
    ['radiance' as TierLevel]: 0.10,
    ['luminary' as TierLevel]: 0.15,
  },
} as const

// ============================================================================
// TIER REQUIREMENTS
// ============================================================================

export const TIER_REQUIREMENTS = {
  [TierLevel.SEED]: {
    minOrders: 0,
    minBottles: 0,
    benefits: ['Standard pricing', 'Basic crystals'],
  },
  [TierLevel.SPROUT]: {
    minOrders: 1,
    minBottles: 2,
    benefits: ['Free shipping', 'Early access to new oils'],
  },
  [TierLevel.BLOOM]: {
    minOrders: 3,
    minBottles: 6,
    benefits: ['Gold chain unlocked', 'Free charm every 3rd purchase', 'Birthday gift'],
  },
  [TierLevel.RADIANCE]: {
    minOrders: 6,
    minBottles: 15,
    benefits: ['10% off refills', 'Quarterly crystal box', 'Sterling silver chain'],
  },
  [TierLevel.LUMINARY]: {
    minOrders: 12,
    minBottles: 30,
    benefits: ['15% off refills', 'Annual retreat invitation', 'Personal consultation'],
  },
} as const

// ============================================================================
// ACCESSORY UNLOCK REQUIREMENTS
// ============================================================================

// Note: Cords are now managed by the Crystal Circle chain system
// See lib/rewards/chain-system.ts for chain unlocks by tier
export const CORD_UNLOCKS: Record<CordType, TierLevel> = {
  [CordType.BLACK_COTTON]: TierLevel.SEED,
  [CordType.BROWN_HEMP]: TierLevel.SEED,
  [CordType.BEIGE_LINEN]: TierLevel.SEED,
  [CordType.GOLD_CHAIN]: TierLevel.BLOOM,
  [CordType.SILVER_CHAIN]: TierLevel.SPROUT,
  [CordType.ROSE_GOLD_CHAIN]: TierLevel.RADIANCE,
}

// ============================================================================
// CHAKRA DISPLAY DATA
// ============================================================================

export const CHAKRA_DATA: Record<Chakra, { name: string; color: string; symbol: string; location: string }> = {
  [Chakra.ROOT]: {
    name: 'Root',
    color: COLORS.chakra.root,
    symbol: '🔴',
    location: 'Base of spine',
  },
  [Chakra.SACRAL]: {
    name: 'Sacral',
    color: COLORS.chakra.sacral,
    symbol: '🟠',
    location: 'Lower abdomen',
  },
  [Chakra.SOLAR_PLEXUS]: {
    name: 'Solar Plexus',
    color: COLORS.chakra.solarPlexus,
    symbol: '🟡',
    location: 'Upper abdomen',
  },
  [Chakra.HEART]: {
    name: 'Heart',
    color: COLORS.chakra.heart,
    symbol: '🟢',
    location: 'Center of chest',
  },
  [Chakra.THROAT]: {
    name: 'Throat',
    color: COLORS.chakra.throat,
    symbol: '🔵',
    location: 'Throat',
  },
  [Chakra.THIRD_EYE]: {
    name: 'Third Eye',
    color: COLORS.chakra.thirdEye,
    symbol: '🟣',
    location: 'Between eyebrows',
  },
  [Chakra.CROWN]: {
    name: 'Crown',
    color: COLORS.chakra.crown,
    symbol: '🟪',
    location: 'Top of head',
  },
}

// ============================================================================
// ELEMENT DISPLAY DATA
// ============================================================================

export const ELEMENT_DATA: Record<Element, { name: string; color: string; symbol: string; qualities: string[] }> = {
  [Elemental.EARTH]: {
    name: 'Earth',
    color: COLORS.element.earth,
    symbol: '🌍',
    qualities: ['Grounding', 'Stability', 'Nurturing'],
  },
  [Elemental.WATER]: {
    name: 'Water',
    color: COLORS.element.water,
    symbol: '💧',
    qualities: ['Flow', 'Emotion', 'Intuition'],
  },
  [Elemental.FIRE]: {
    name: 'Fire',
    color: COLORS.element.fire,
    symbol: '🔥',
    qualities: ['Transformation', 'Passion', 'Energy'],
  },
  [Elemental.AIR]: {
    name: 'Air',
    color: COLORS.element.air,
    symbol: '💨',
    qualities: ['Intellect', 'Communication', 'Freedom'],
  },
  [Elemental.ETHER]: {
    name: 'Ether',
    color: COLORS.element.ether,
    symbol: '✨',
    qualities: ['Spirit', 'Connection', 'Cosmic'],
  },
}

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const

// ============================================================================
// ACCESSIBILITY
// ============================================================================

export const ARIA_LABELS = {
  crystalSelector: 'Select a crystal for your oil blend',
  sizeSelector: 'Choose your bottle size',
  accessorySelector: 'Choose your cord, charm, or extra crystals',
  synergyDisplay: 'Learn about the crystal and oil synergy',
  addToCart: 'Add customized product to cart',
  mysteryCrystal: 'Let us choose a crystal for you',
  bottlePreview: 'Preview of your customized bottle',
} as const

// ============================================================================
// PERFORMANCE CONSTANTS
// ============================================================================

export const PERFORMANCE = {
  debounceDelay: 150,
  synergyCacheTime: 5 * 60 * 1000, // 5 minutes
  imageLazyOffset: '100px',
  maxRetries: 3,
  animationTimeout: 200, // ms for animation completion
} as const
