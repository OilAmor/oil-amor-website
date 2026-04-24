/**
 * Chain Inventory & Unlock System
 * 
 * Manages diffuser necklace chains that unlock as customers
 * progress through the Crystal Circle tiers.
 * 
 * Chain selections are persisted to Redis rewards store.
 */

import {
  TierLevel,
  ChainType,
  CRYSTAL_CIRCLE_TIERS,
  isTierHigher,
  TIER_ORDER
} from './tiers';
import { getCustomerRewardsProfile, invalidateProfileCache } from './customer-rewards';
import { updateCustomerRewardsData, getCustomerRewardsData } from './rewards-store';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ChainConfig {
  name: string;
  description: string;
  tierRequired: TierLevel;
  value: number;
  image: string;
  specifications: ChainSpecifications;
  careInstructions: string[];
  inStock: boolean;
}

export interface ChainSpecifications {
  length: string;
  material: string;
  clasp: string;
  weight: string;
  finish: string;
  hypoallergenic: boolean;
}

export interface ChainOption {
  type: ChainType;
  config: ChainConfig;
  isLocked: boolean;
  isSelected: boolean;
  unlockProgress: number;
}

export interface CustomerChainSelection {
  customerId: string;
  selectedChain: ChainType | null;
  preferredChain: ChainType | null;
  availableChains: ChainType[];
  history: ChainSelectionHistory[];
}

export interface ChainSelectionHistory {
  chainType: ChainType;
  selectedAt: Date;
  deselectedAt?: Date;
  orderId?: string;
}

// ============================================================================
// CHAIN CATALOG
// ============================================================================

export const CHAIN_CATALOG: Record<ChainType, ChainConfig> = {
  'silver-plated': {
    name: 'Silver-Plated Chain',
    description: 'Elegant 18-inch chain with a brilliant silver finish. Features a secure lobster clasp and tarnish-resistant coating for lasting shine. The perfect foundation for your crystal diffuser jewelry journey.',
    tierRequired: 'sprout',
    value: 28,
    image: '/chains/silver-plated.jpg',
    specifications: {
      length: '18 inches (45.7 cm)',
      material: 'Brass base with silver plating',
      clasp: 'Lobster claw',
      weight: '3.2 grams',
      finish: 'High-polish mirror',
      hypoallergenic: true
    },
    careInstructions: [
      'Store in provided pouch when not in use',
      'Avoid contact with perfumes and lotions',
      'Clean gently with soft cloth',
      'Remove before swimming or showering'
    ],
    inStock: true
  },
  'gold-plated': {
    name: 'Gold-Plated Chain',
    description: 'Luxurious 18-inch chain in warm, rich gold tone. Crafted with premium plating over a durable brass core. Adds a touch of sophistication to your aromatherapy ritual.',
    tierRequired: 'bloom',
    value: 32,
    image: '/chains/gold-plated.jpg',
    specifications: {
      length: '18 inches (45.7 cm)',
      material: 'Brass base with 14k gold plating',
      clasp: 'Lobster claw',
      weight: '3.4 grams',
      finish: 'Warm gold luster',
      hypoallergenic: true
    },
    careInstructions: [
      'Store separately to prevent scratching',
      'Keep away from harsh chemicals',
      'Wipe with soft cloth after wearing',
      'Avoid prolonged water exposure'
    ],
    inStock: true
  },
  'sterling-silver': {
    name: 'Sterling Silver Chain',
    description: 'Premium 925 sterling silver chain with substantial weight and mirror-like finish. The natural antimicrobial properties of silver complement your wellness journey. Heirloom quality craftsmanship.',
    tierRequired: 'radiance',
    value: 65,
    image: '/chains/sterling-silver.jpg',
    specifications: {
      length: '18 inches (45.7 cm)',
      material: '925 Sterling Silver',
      clasp: 'Premium lobster claw',
      weight: '5.8 grams',
      finish: 'High-polish mirror',
      hypoallergenic: true
    },
    careInstructions: [
      'Polish regularly with silver cloth',
      'Store in anti-tarnish pouch',
      'Can be worn daily, gentle cleaning recommended',
      'Professional cleaning once yearly'
    ],
    inStock: true
  },
  '14k-gold-filled': {
    name: '14k Gold-Filled Chain',
    description: 'The pinnacle of luxury. Solid 14k gold bonded to a brass core for lifetime durability. Rich color, substantial weight, and heirloom quality. A true investment piece for your Crystal Circle journey.',
    tierRequired: 'luminary',
    value: 120,
    image: '/chains/14k-gold-filled.jpg',
    specifications: {
      length: '18 inches (45.7 cm)',
      material: '14k Gold-Filled (5% gold by weight)',
      clasp: 'Heavy-duty lobster claw',
      weight: '6.2 grams',
      finish: 'Rich, deep gold',
      hypoallergenic: true
    },
    careInstructions: [
      'Can be worn continuously, even in water',
      'Clean with mild soap and water',
      'Buff with soft cloth to maintain luster',
      'Store separately to prevent tangling'
    ],
    inStock: true
  }
};

// Chain display order
export const CHAIN_DISPLAY_ORDER: ChainType[] = [
  'silver-plated',
  'gold-plated',
  'sterling-silver',
  '14k-gold-filled'
];

// ============================================================================
// CHAIN AVAILABILITY FUNCTIONS
// ============================================================================

/**
 * Get all available chains for a customer's tier
 * @param tier - Customer's current tier
 * @returns Array of available chain options
 */
export function getAvailableChains(tier: TierLevel): ChainOption[] {
  const tierConfig = CRYSTAL_CIRCLE_TIERS[tier];
  const unlockedChainTypes = tierConfig.unlockedChains;
  
  return CHAIN_DISPLAY_ORDER.map(chainType => {
    const config = CHAIN_CATALOG[chainType];
    const isUnlocked = unlockedChainTypes.includes(chainType);
    
    return {
      type: chainType,
      config,
      isLocked: !isUnlocked,
      isSelected: false,
      unlockProgress: calculateUnlockProgress(tier, chainType)
    };
  });
}

/**
 * Check if a specific chain is available to a customer
 * @param customerId - Customer's unique identifier
 * @param chainType - Type of chain to check
 * @returns Boolean indicating if customer can select this chain
 */
export async function canCustomerSelectChain(
  customerId: string,
  chainType: ChainType
): Promise<boolean> {
  const profile = await getCustomerRewardsProfile(customerId);
  return profile.unlockedChains.includes(chainType);
}

/**
 * Check if a chain type is available at a specific tier
 * @param tier - Tier level to check
 * @param chainType - Chain type to check
 * @returns Boolean indicating availability
 */
export function isChainAvailableAtTier(
  tier: TierLevel,
  chainType: ChainType
): boolean {
  const tierConfig = CRYSTAL_CIRCLE_TIERS[tier];
  return tierConfig.unlockedChains.includes(chainType);
}

/**
 * Get the minimum tier required for a chain
 * @param chainType - Chain type to check
 * @returns Minimum tier level required
 */
export function getRequiredTierForChain(chainType: ChainType): TierLevel {
  return CHAIN_CATALOG[chainType].tierRequired;
}

/**
 * Calculate unlock progress percentage to a chain
 * @param currentTier - Current tier level
 * @param targetChain - Target chain type
 * @returns Progress percentage (0-100)
 */
function calculateUnlockProgress(
  currentTier: TierLevel,
  targetChain: ChainType
): number {
  const requiredTier = CHAIN_CATALOG[targetChain].tierRequired;
  
  if (isTierHigher(currentTier, requiredTier) || currentTier === requiredTier) {
    return 100;
  }
  
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  const requiredIndex = TIER_ORDER.indexOf(requiredTier);
  
  if (currentIndex === -1 || requiredIndex === -1) {
    return 0;
  }
  
  const tiersAway = requiredIndex - currentIndex;
  return Math.max(0, 100 - tiersAway * 25);
}

/**
 * Get chains that will unlock at the next tier
 * @param currentTier - Current tier level
 * @returns Array of chains that will unlock next
 */
export function getNextUnlockableChains(currentTier: TierLevel): ChainType[] {
  const currentTierIndex = TIER_ORDER.indexOf(currentTier);
  const nextTier = TIER_ORDER[currentTierIndex + 1];
  
  if (!nextTier) {
    return [];
  }
  
  const currentUnlocked = CRYSTAL_CIRCLE_TIERS[currentTier].unlockedChains;
  const nextUnlocked = CRYSTAL_CIRCLE_TIERS[nextTier].unlockedChains;
  
  return nextUnlocked.filter(chain => !currentUnlocked.includes(chain));
}

/**
 * Get detailed chain information with customer context
 * @param customerId - Customer's unique identifier
 * @param chainType - Chain type to get info for
 * @returns Detailed chain information
 */
export async function getChainDetails(
  customerId: string,
  chainType: ChainType
): Promise<ChainOption & { customerCanSelect: boolean }> {
  const profile = await getCustomerRewardsProfile(customerId);
  const availableChains = getAvailableChains(profile.currentTier);
  const chainOption = availableChains.find(c => c.type === chainType);
  
  if (!chainOption) {
    throw new Error(`Invalid chain type: ${chainType}`);
  }
  
  return {
    ...chainOption,
    customerCanSelect: profile.unlockedChains.includes(chainType)
  };
}

// ============================================================================
// CHAIN SELECTION MANAGEMENT - WITH PERSISTENCE
// ============================================================================

/**
 * Select a chain for a customer's order
 * Persists the selection to Redis rewards store
 * 
 * @param customerId - Customer's unique identifier
 * @param chainType - Selected chain type
 * @param orderId - Associated order ID (optional)
 * @returns Success status
 */
export async function selectChain(
  customerId: string,
  chainType: ChainType,
  orderId?: string
): Promise<{ success: boolean; error?: string }> {
  // Verify customer can select this chain
  const canSelect = await canCustomerSelectChain(customerId, chainType);
  
  if (!canSelect) {
    return {
      success: false,
      error: `Chain ${chainType} is not unlocked for this customer`
    };
  }
  
  const config = CHAIN_CATALOG[chainType];
  
  if (!config.inStock) {
    return {
      success: false,
      error: `Chain ${chainType} is currently out of stock`
    };
  }
  
  // Get current rewards data to update history
  const metafields = await getCustomerRewardsData(customerId);
  const history: ChainSelectionHistory[] = (metafields.chain_history as ChainSelectionHistory[]) || [];
  
  // Record selection
  const selection: ChainSelectionHistory = {
    chainType,
    selectedAt: new Date(),
    orderId
  };
  
  // Update history
  const updatedHistory = [...history, selection];
  
  // Persist to Redis rewards store
  await updateCustomerRewardsData(customerId, {
    preferred_chain: chainType,
    last_chain_selected: chainType,
    chain_history: updatedHistory.slice(-10), // Keep last 10 selections
  });
  
  // Invalidate cache so next fetch gets updated data
  await invalidateProfileCache(customerId);
  
  return { success: true };
}

/**
 * Set customer's preferred/default chain
 * This is their default choice for future orders
 * 
 * @param customerId - Customer's unique identifier
 * @param chainType - Preferred chain type
 * @returns Boolean indicating success
 */
export async function setPreferredChain(
  customerId: string,
  chainType: ChainType
): Promise<boolean> {
  const profile = await getCustomerRewardsProfile(customerId);
  const tier = CRYSTAL_CIRCLE_TIERS[profile.currentTier];
  
  // Check if chain is unlocked
  if (!tier.unlockedChains.includes(chainType)) {
    return false;
  }
  
  // Update customer preference in Redis rewards store
  await updateCustomerRewardsData(customerId, {
    preferred_chain: chainType,
  });
  
  // Invalidate cache
  await invalidateProfileCache(customerId);
  
  return true;
}

/**
 * Get customer's chain selection data
 * @param customerId - Customer's unique identifier
 * @returns Current selection details
 */
export async function getCustomerChainSelection(
  customerId: string
): Promise<CustomerChainSelection> {
  const profile = await getCustomerRewardsProfile(customerId);
  const metafields = await getCustomerRewardsData(customerId);
  
  // Get preferred chain from metafields, fallback to first unlocked
  const preferredChain = (metafields.preferred_chain as ChainType) || 
                         profile.unlockedChains[0] || 
                         null;
  
  // Get last selected chain
  const lastSelected = (metafields.last_chain_selected as ChainType) || preferredChain;
  
  // Get history
  const history = (metafields.chain_history as ChainSelectionHistory[]) || [];
  
  return {
    customerId,
    selectedChain: lastSelected,
    preferredChain,
    availableChains: profile.unlockedChains,
    history: history.map(h => ({
      ...h,
      selectedAt: new Date(h.selectedAt)
    }))
  };
}

/**
 * Get default chain for a tier
 * @param tier - Tier level
 * @returns Default chain type for the tier
 */
export function getDefaultChainForTier(tier: TierLevel): ChainType | null {
  const unlockedChains = CRYSTAL_CIRCLE_TIERS[tier].unlockedChains;
  return unlockedChains.length > 0 ? unlockedChains[0] : null;
}

/**
 * Get chain upgrade path
 * @param currentChain - Current chain type
 * @returns Next chain in upgrade path or null
 */
export function getNextChainUpgrade(currentChain: ChainType): ChainType | null {
  const currentIndex = CHAIN_DISPLAY_ORDER.indexOf(currentChain);
  
  if (currentIndex === -1 || currentIndex >= CHAIN_DISPLAY_ORDER.length - 1) {
    return null;
  }
  
  return CHAIN_DISPLAY_ORDER[currentIndex + 1];
}

// ============================================================================
// CHAIN COMPARISON & RECOMMENDATIONS
// ============================================================================

/**
 * Compare two chains
 * @param chainA - First chain type
 * @param chainB - Second chain type
 * @returns Comparison result with differences
 */
export function compareChains(
  chainA: ChainType,
  chainB: ChainType
): {
  differences: Record<string, { a: unknown; b: unknown }>;
  upgrade: boolean;
} {
  const configA = CHAIN_CATALOG[chainA];
  const configB = CHAIN_CATALOG[chainB];
  
  const differences: Record<string, { a: unknown; b: unknown }> = {};
  
  // Compare value
  if (configA.value !== configB.value) {
    differences.value = { a: configA.value, b: configB.value };
  }
  
  // Compare material
  if (configA.specifications.material !== configB.specifications.material) {
    differences.material = {
      a: configA.specifications.material,
      b: configB.specifications.material
    };
  }
  
  // Compare weight
  if (configA.specifications.weight !== configB.specifications.weight) {
    differences.weight = {
      a: configA.specifications.weight,
      b: configB.specifications.weight
    };
  }
  
  // Determine if B is an upgrade from A
  const indexA = CHAIN_DISPLAY_ORDER.indexOf(chainA);
  const indexB = CHAIN_DISPLAY_ORDER.indexOf(chainB);
  const upgrade = indexB > indexA;
  
  return { differences, upgrade };
}

/**
 * Get chain recommendation for customer
 * @param customerId - Customer's unique identifier
 * @returns Recommended chain type with reasoning
 */
export async function getChainRecommendation(
  customerId: string
): Promise<{ chain: ChainType; reason: string } | null> {
  const profile = await getCustomerRewardsProfile(customerId);
  
  if (profile.unlockedChains.length === 0) {
    return null;
  }
  
  // Get preferred chain if set
  const metafields = await getCustomerRewardsData(customerId);
  const preferredChain = metafields.preferred_chain as ChainType;
  
  if (preferredChain && profile.unlockedChains.includes(preferredChain)) {
    const config = CHAIN_CATALOG[preferredChain];
    return {
      chain: preferredChain,
      reason: `Your preferred ${config.name} is ready for your next order`
    };
  }
  
  // Recommend the highest unlocked chain
  const recommendedChain = profile.unlockedChains[profile.unlockedChains.length - 1];
  const config = CHAIN_CATALOG[recommendedChain];
  
  return {
    chain: recommendedChain,
    reason: `As a ${profile.currentTier} member, enjoy the premium ${config.name} with ${config.specifications.material}`
  };
}

// ============================================================================
// INVENTORY MANAGEMENT
// ============================================================================

/**
 * Check if a chain is in stock
 * @param chainType - Chain type to check
 * @returns Boolean indicating stock status
 */
export function isChainInStock(chainType: ChainType): boolean {
  return CHAIN_CATALOG[chainType].inStock;
}

/**
 * Update chain stock status
 * @param chainType - Chain type to update
 * @param inStock - New stock status
 */
export function updateChainStock(chainType: ChainType, inStock: boolean): void {
  (CHAIN_CATALOG[chainType] as ChainConfig).inStock = inStock;
}

/**
 * Get all chains with stock status
 * @returns Array of chains with availability
 */
export function getChainInventoryStatus(): Array<{
  type: ChainType;
  name: string;
  inStock: boolean;
  tierRequired: TierLevel;
}> {
  return CHAIN_DISPLAY_ORDER.map(chainType => ({
    type: chainType,
    name: CHAIN_CATALOG[chainType].name,
    inStock: CHAIN_CATALOG[chainType].inStock,
    tierRequired: CHAIN_CATALOG[chainType].tierRequired
  }));
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format chain display name
 * @param chainType - Chain type
 * @returns Formatted display name
 */
export function formatChainName(chainType: ChainType): string {
  return CHAIN_CATALOG[chainType].name;
}

/**
 * Get chain image URL
 * @param chainType - Chain type
 * @returns Image URL path
 */
export function getChainImage(chainType: ChainType): string {
  return CHAIN_CATALOG[chainType].image;
}

/**
 * Get chain value (for credit/refund purposes)
 * @param chainType - Chain type
 * @returns Monetary value
 */
export function getChainValue(chainType: ChainType): number {
  return CHAIN_CATALOG[chainType].value;
}

/**
 * Validate chain type
 * @param chain - String to validate
 * @returns Boolean indicating if valid chain type
 */
export function isValidChainType(chain: string): chain is ChainType {
  return CHAIN_DISPLAY_ORDER.includes(chain as ChainType);
}

/**
 * Get total value of unlocked chains
 * @param tier - Customer tier
 * @returns Total value of all unlocked chains
 */
export function getUnlockedChainsValue(tier: TierLevel): number {
  const unlockedChains = CRYSTAL_CIRCLE_TIERS[tier].unlockedChains;
  return unlockedChains.reduce((total, chain) => {
    return total + CHAIN_CATALOG[chain].value;
  }, 0);
}
