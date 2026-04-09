// Tier Level - both type and const for value usage
export const TierLevel = {
  SEED: 'seed',
  SPROUT: 'sprout',
  BLOOM: 'bloom',
  RADIANCE: 'radiance',
  LUMINARY: 'luminary',
} as const

export type TierLevel = typeof TierLevel[keyof typeof TierLevel]

export type ChainType = 'silver-plated' | 'gold-plated' | 'sterling-silver' | '14k-gold-filled'

export interface Oil {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  botanicalName: string
  origin: string
  extractionMethod: string
  therapeuticProperties: string[]
  recommendedCrystals: string[]
}

export interface Crystal {
  id: string
  name: string
  slug: string
  description: string
  image: string
  chakra: Chakra
  element: Element
  zodiac: string[]
  meaning: string
  hardness?: number
}

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary'

export interface CrystalOption extends Crystal {
  isUnlocked: boolean
  isRecommended: boolean
  rarity: Rarity
  imageUrl?: string
  properties: {
    chakra: Chakra
    element: Element
  }
}

// Chakra - both const and type
export const Chakra = {
  ROOT: 'root',
  SACRAL: 'sacral',
  SOLAR_PLEXUS: 'solar-plexus',
  HEART: 'heart',
  THROAT: 'throat',
  THIRD_EYE: 'third-eye',
  CROWN: 'crown',
} as const

export type Chakra = typeof Chakra[keyof typeof Chakra]

// Element - both const and type (renamed to avoid DOM Element conflict)
export const Elemental = {
  EARTH: 'earth',
  WATER: 'water',
  FIRE: 'fire',
  AIR: 'air',
  ETHER: 'ether',
} as const

export type Element = typeof Elemental[keyof typeof Elemental]

export interface SynergyContent {
  id: string
  oilSlug: string
  crystalSlug: string
  headline: string
  story: string
  scientificNote: string
  ritualInstructions: RitualStep[]
  frequency?: string
  chakra: Chakra
  element: Element
  zodiac: string[]
}

export interface RitualStep {
  step: number
  title: string
  description: string
  duration?: string
}

export interface CordOption {
  id: string
  name: string
  description?: string
  type: "cord" | "chain"
  material: string
  tierRequired: TierLevel
  price: number
  isUnlocked: boolean
}

export interface CharmOption {
  id: string
  name: string
  material: string
  meaning: string
  symbol: string
  price: number
  isUnlocked: boolean
  unlockAtPurchase?: number
  unlockAtTier?: TierLevel
}

export interface ConfiguredProduct {
  oilId: string
  oilVariantId?: string
  crystalId: string
  crystalType?: string
  crystalCount?: number
  bottleSize: BottleSize
  accessory: AccessorySelection
  quantity: number
  unitPrice: number
  totalPrice: number
  customerTier?: TierLevel
  creditToApply?: number
  configuration: {
    oilName: string
    crystalName: string
    sizeName: string
    accessoryName: string
  }
}

export interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  price: number
  quantity: number
  image?: string
  properties?: Record<string, string>
}

export interface ShopifyCart {
  id: string
  lines: CartItem[]
  checkoutUrl: string
  totalQuantity: number
  totalItems?: number
  cost: {
    subtotalAmount: { amount: string; currencyCode: string }
    totalAmount: { amount: string; currencyCode: string }
  }
}

export interface CustomerRewardsProfile {
  customerId: string
  currentTier: TierLevel
  totalSpend: number
  purchaseCount: number
  accountCredit: number
  unlockedChains: ChainType[]
  collectedCharms: string[]
  refillUnlocked: boolean
}

export interface ForeverBottle {
  id: string
  serialNumber: string
  oilType: string
  status: "active" | "empty" | "in-transit" | "refilled"
  currentFillLevel: number
  refillCount: number
}

export interface ShopifyImage {
  url: string
  altText?: string
  width?: number
  height?: number
}

export interface PriceDisplayProps {
  price: number
  originalPrice?: number
  currency?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export interface BottleSizeOption {
  size: BottleSize
  name: string
  price: number
  volume: number
  description: string
  isPopular?: boolean
}

export interface ProductConfiguratorProps {
  product?: {
    oil: Oil
    availableCrystals: (Crystal & { isUnlocked: boolean; isRecommended: boolean; rarity: string; properties: { chakra: Chakra; element: Element } })[]
    availableSizes: BottleSizeOption[]
    availableCords: CordOption[]
    availableCharms: CharmOption[]
  }
  // Simple mode props (for oil product pages)
  oil?: { id: string; name: string }
  crystalPairings?: { id: string; name: string; chakra?: string; element?: string; reason: string }[]
  onConfigurationChange?: (config: {
    size: { id: string; label: string; ml: number }
    type: 'pure' | 'carrier'
    carrier: string
    ratio?: { name: string; oilPercent: number; carrierPercent: number }
    selectedCrystal?: { id: string; name: string; chakra?: string; element?: string; reason: string }
    selectedCord?: { id: string; name: string; price: number }
    price: number
    breakdown?: any
  }) => void
  initialCrystal?: Crystal
  customerTier?: TierLevel
  purchaseHistory?: {
    uniqueOils: string[]
    uniqueCrystals: string[]
    cordCount: number
  }
}

export interface CrystalSelectorProps {
  crystals: CrystalOption[]
  selectedCrystal: CrystalOption | null
  oilSlug: string
  onSelect: (crystal: Crystal) => void
}

export interface AccessorySelectorProps {
  options: {
    cords: CordOption[]
    charms: CharmOption[]
    extraCrystals: boolean
  }
  selectedOption: AccessorySelection
  customerTier: TierLevel
  cordCount: number
  onSelect: (selection: AccessorySelection) => void
}

export interface AccessorySelection {
  type: "cord" | "charm" | "extra-crystals"
  cordType?: string
  charmType?: string
  extraCrystalCount?: number
}

// Configurator Store Types
export const BottleSize = {
  SMALL: '5ml',
  MEDIUM: '15ml',
  LARGE: '30ml',
} as const

export type BottleSize = typeof BottleSize[keyof typeof BottleSize]

export const CordType = {
  BLACK_COTTON: 'black-cotton',
  BROWN_HEMP: 'brown-hemp',
  BEIGE_LINEN: 'beige-linen',
  GOLD_CHAIN: 'gold-chain',
  SILVER_CHAIN: 'silver-chain',
  ROSE_GOLD_CHAIN: 'rose-gold-chain',
} as const

export type CordType = typeof CordType[keyof typeof CordType]

export interface PurchaseHistory {
  count: number
  hasRefillBottle?: boolean
  totalOrders?: number
  uniqueOils?: string[]
  uniqueCrystals?: string[]
  cordCount?: number
}

export interface ConfiguratorState {
  selectedOil: Oil | null
  selectedCrystal: Crystal | null
  selectedSize: BottleSize
  selectedAccessory: AccessorySelection
  synergyContent: SynergyContent | null
  isLoading: boolean
  customerTier: TierLevel
  purchaseHistory: PurchaseHistory | null
  isAddingToCart?: boolean
  showCollectionProgress?: boolean
}

export interface ConfiguratorActions {
  setOil: (oil: Oil) => void
  setCrystal: (crystal: Crystal) => Promise<void>
  setSize: (size: BottleSize) => void
  setAccessory: (accessory: AccessorySelection) => void
  calculatePrice: () => number
  buildCartItem: () => ConfiguredProduct | null
  reset: () => void
}

export type ConfiguratorStore = ConfiguratorState & ConfiguratorActions

export interface CrystalConfig {
  count: number
  description: string
}

// ============================================================================
// SHOPIFY TYPES
// ============================================================================

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  productType: string
  tags: string[]
  vendor: string
  featuredImage?: {
    url: string
    altText?: string
  }
  priceRange?: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
    maxVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  variants: {
    edges: Array<{
      node: ShopifyProductVariant
    }>
  }
  metafields?: {
    edges: Array<{
      node: {
        namespace: string
        key: string
        value: string
      }
    }>
  }
}

export interface ShopifyProductVariant {
  id: string
  title: string
  sku: string
  price: {
    amount: string
    currencyCode: string
  }
  compareAtPrice?: {
    amount: string
    currencyCode: string
  }
  availableForSale: boolean
  selectedOptions: Array<{
    name: string
    value: string
  }>
  image?: {
    url: string
    altText?: string
  }
}

// ============================================================================
// CART TYPES
// ============================================================================

export interface CartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      id: string
      title: string
      featuredImage?: {
        url: string
        altText?: string
      }
    }
    price: {
      amount: string
      currencyCode: string
    }
  }
  attributes: Array<{
    key: string
    value: string
  }>
}

export interface Cart {
  id: string
  lines: {
    edges: Array<{
      node: CartLine
    }>
  }
  cost: {
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    totalTaxAmount?: {
      amount: string
      currencyCode: string
    }
    totalAmount?: {
      amount: string
      currencyCode: string
    }
  }
  checkoutUrl: string
  totalQuantity: number
}

// ============================================================================
// VIEW MODE
// ============================================================================

export type ViewMode = 'grid' | 'list'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface BottlePreviewProps {
  size: BottleSize
  crystalCount: number
  className?: string
}

export interface BottleSizeSelectorProps {
  sizes: BottleSizeOption[]
  selectedSize: BottleSize
  onSelect: (size: BottleSize) => void
  crystalMapping: Record<BottleSize, { count: number; description: string }>
}

export interface SynergyDisplayProps {
  oilName: string
  crystalName: string
  synergy: {
    headline: string
    story: string
    scientificNote?: string
  } | null
}
