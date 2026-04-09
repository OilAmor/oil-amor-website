// ========================================
// Content API - Main Export
// ========================================

// Types (from types.ts - canonical source)
export type {
  BottleSize,
  TierLevel,
  Chakra,
  Element,
  Zodiac,
  Intention,
  Crystal,
  SynergyContent,
  RitualStep,
} from './types'

// Crystal config (excluding types that conflict with ./types)
export {
  type CrystalConfig,
  BOTTLE_CRYSTAL_MAPPING,
  getCrystalCountForBottle,
  getCrystalWeightForBottle,
  getBottleDescription,
  getCrystalConfigForBottle,
  getAllBottleConfigs,
  calculateCrystalCount,
  isValidBottleSize,
  getBottleSizeOptions,
  getNextBottleSize,
  getPreviousBottleSize,
  compareBottleSizes,
} from './crystal-config'

// Product Configuration (excluding types that conflict with ./types)
export {
  type ProductType,
  type CarrierOil,
  type CordOption,
  BOTTLE_SIZES,
  CARRIER_OILS,
  CARRIER_COMPARISON,
  CARRIER_GUIDANCE,
  CORD_OPTIONS,
  FREE_SHIPPING_THRESHOLD,
  DEFAULT_SHIPPING_COST,
  REFILL_SIZES,
  type RefillSize,
  type OilPricing,
  type RefillSavings,
  getRefillSavings,
  type PurchaseRecord,
  getRefillEligibleOils,
  getLockedOils,
} from './product-config'

// Oil & Crystal Database (excluding types/functions that conflict)
export {
  type CrystalPairing,
  type OilProfile,
  ALL_CRYSTALS,
  OIL_DATABASE,
  getOilById,
  getOilByHandle,
  getCrystalById,
  getCrystalPairing,
  getAllOils,
  // Note: getAllCrystals is exported from ./crystals instead
  getSizeInfo,
  getSynergiesByCarrier,
  getTotalSynergyCount,
  getOilsByChakra,
  getOilsByElement,
} from './oil-crystal-synergies'

// API Functions
export * from './synergy'
export * from './crystals'
export * from './cords'

// Cache Utilities
export {
  getRedisClient,
  getFromCache,
  setCache,
  generateCacheKey,
  warmCache,
  revalidateCache,
  deleteCache,
  deleteCachePattern,
} from './cache'
