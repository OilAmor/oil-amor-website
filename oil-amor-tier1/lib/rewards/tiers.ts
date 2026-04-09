/**
 * Crystal Circle Tier System Configuration
 * 
 * SINGLE SOURCE OF TRUTH for the Crystal Circle rewards tier system.
 * This file consolidates all tier definitions - do not define tiers elsewhere.
 * 
 * Sacred journey from Seed to Luminary - tier progression defines
 * customer benefits, chain unlocks, charm access, and refill discounts.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export const TierLevel = {
  SEED: 'seed',
  SPROUT: 'sprout',
  BLOOM: 'bloom',
  RADIANCE: 'radiance',
  LUMINARY: 'luminary',
} as const

export type TierLevel = typeof TierLevel[keyof typeof TierLevel]

export interface TierConfig {
  name: string;
  level: number;
  minSpend: number;
  maxSpend: number;
  benefits: string[];
  unlockedChains: ChainType[];
  unlockedCharms: string[];
  refillDiscount: number;
  icon: TierIcon;
  color: string;
  description: string;
}

export type ChainType = 'silver-plated' | 'gold-plated' | 'sterling-silver' | '14k-gold-filled';

export type TierIcon = 'seedling' | 'sprout' | 'flower' | 'sun' | 'star';

// ============================================================================
// TIER CONFIGURATION - SINGLE SOURCE OF TRUTH
// ============================================================================

export const CRYSTAL_CIRCLE_TIERS: Record<TierLevel, TierConfig> = {
  seed: {
    name: 'Seed',
    level: 1,
    minSpend: 0,
    maxSpend: 149,
    benefits: [
      'Standard shipping',
      'Access to member pricing'
    ],
    unlockedChains: [],
    unlockedCharms: [],
    refillDiscount: 0,
    icon: 'seedling',
    color: '#8B7355',
    description: 'Every journey begins with a single seed. Welcome to Crystal Circle.'
  },
  sprout: {
    name: 'Sprout',
    level: 2,
    minSpend: 150,
    maxSpend: 349,
    benefits: [
      'Free shipping on all orders',
      'Early access to new oil releases',
      'Silver-plated chain option unlocked'
    ],
    unlockedChains: ['silver-plated'],
    unlockedCharms: ['crescent-moon'],
    refillDiscount: 0,
    icon: 'sprout',
    color: '#4A7C59',
    description: 'You\'re growing! Unlock your first chain and watch your collection bloom.'
  },
  bloom: {
    name: 'Bloom',
    level: 3,
    minSpend: 350,
    maxSpend: 699,
    benefits: [
      'Gold-plated chain option unlocked',
      'Free charm with every 3rd purchase',
      'Birthday crystal gift'
    ],
    unlockedChains: ['silver-plated', 'gold-plated'],
    unlockedCharms: ['crescent-moon', 'lotus-flower'],
    refillDiscount: 0,
    icon: 'flower',
    color: '#C9A0DC',
    description: 'In full bloom! Enjoy premium chains and growing charm collection.'
  },
  radiance: {
    name: 'Radiance',
    level: 4,
    minSpend: 700,
    maxSpend: 1499,
    benefits: [
      'Sterling silver chain option unlocked',
      'Quarterly exclusive crystal box',
      '10% off all refills'
    ],
    unlockedChains: ['silver-plated', 'gold-plated', 'sterling-silver'],
    unlockedCharms: ['crescent-moon', 'lotus-flower', 'tree-of-life', 'evil-eye'],
    refillDiscount: 10,
    icon: 'sun',
    color: '#FFD700',
    description: 'Shining bright! Premium chains, quarterly gifts, and refill savings.'
  },
  luminary: {
    name: 'Luminary',
    level: 5,
    minSpend: 1500,
    maxSpend: Infinity,
    benefits: [
      '14k gold-filled chain option unlocked',
      'Personal wellness consultation',
      '15% off all refills',
      'Annual Crystal Circle retreat invitation'
    ],
    unlockedChains: ['silver-plated', 'gold-plated', 'sterling-silver', '14k-gold-filled'],
    unlockedCharms: ['all'],
    refillDiscount: 15,
    icon: 'star',
    color: '#B76E79',
    description: 'You\'ve reached the pinnacle. Experience luxury, exclusivity, and divine service.'
  }
};

// Ordered array for progression calculations
export const TIER_ORDER: TierLevel[] = ['seed', 'sprout', 'bloom', 'radiance', 'luminary'];

// Tier hierarchy mapping for quick comparisons
export const TIER_HIERARCHY: Record<TierLevel, number> = {
  seed: 1,
  sprout: 2,
  bloom: 3,
  radiance: 4,
  luminary: 5
};

// ============================================================================
// TIER CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate the tier level based on total customer spend
 * @param totalSpend - Customer's lifetime spend amount
 * @returns The corresponding tier level
 */
export function calculateTier(totalSpend: number): TierLevel {
  const spend = Math.max(0, totalSpend);
  
  for (let i = TIER_ORDER.length - 1; i >= 0; i--) {
    const tier = TIER_ORDER[i];
    const config = CRYSTAL_CIRCLE_TIERS[tier];
    
    if (spend >= config.minSpend) {
      return tier;
    }
  }
  
  return 'seed';
}

/**
 * Get the next tier level from the current tier
 * @param currentTier - Current tier level
 * @returns Next tier level or null if at maximum tier
 */
export function getNextTier(currentTier: TierLevel): TierLevel | null {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  
  if (currentIndex === -1 || currentIndex >= TIER_ORDER.length - 1) {
    return null;
  }
  
  return TIER_ORDER[currentIndex + 1];
}

/**
 * Get the previous tier level
 * @param currentTier - Current tier level
 * @returns Previous tier level or null if at minimum tier
 */
export function getPreviousTier(currentTier: TierLevel): TierLevel | null {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return TIER_ORDER[currentIndex - 1];
}

/**
 * Calculate the amount needed to reach the next tier
 * @param currentSpend - Current total spend
 * @param currentTier - Current tier level
 * @returns Amount needed to reach next tier (0 if at max tier)
 */
export function getSpendToNextTier(
  currentSpend: number,
  currentTier: TierLevel
): number {
  const nextTier = getNextTier(currentTier);
  
  if (!nextTier) {
    return 0;
  }
  
  const nextTierConfig = CRYSTAL_CIRCLE_TIERS[nextTier];
  const amountNeeded = nextTierConfig.minSpend - currentSpend;
  
  return Math.max(0, parseFloat(amountNeeded.toFixed(2)));
}

/**
 * Calculate progress percentage to next tier
 * @param currentSpend - Current total spend
 * @param currentTier - Current tier level
 * @returns Progress percentage (0-100), 100 if at max tier
 */
export function getProgressToNextTier(
  currentSpend: number,
  currentTier: TierLevel
): number {
  const nextTier = getNextTier(currentTier);
  
  if (!nextTier) {
    return 100;
  }
  
  const currentTierConfig = CRYSTAL_CIRCLE_TIERS[currentTier];
  const nextTierConfig = CRYSTAL_CIRCLE_TIERS[nextTier];
  
  const spendRange = nextTierConfig.minSpend - currentTierConfig.minSpend;
  const spendProgress = currentSpend - currentTierConfig.minSpend;
  
  if (spendRange <= 0) {
    return 100;
  }
  
  const percentage = (spendProgress / spendRange) * 100;
  return Math.min(100, Math.max(0, parseFloat(percentage.toFixed(2))));
}

/**
 * Get detailed progress information for the next tier
 * @param currentSpend - Current total spend
 * @param currentTier - Current tier level
 * @returns Progress details including current, target, and percentage
 */
export function getTierProgressDetails(
  currentSpend: number,
  currentTier: TierLevel
): {
  current: number;
  target: number;
  percentage: number;
  amountNeeded: number;
  nextTierName: string | null;
} {
  const nextTier = getNextTier(currentTier);
  
  if (!nextTier) {
    return {
      current: currentSpend,
      target: currentSpend,
      percentage: 100,
      amountNeeded: 0,
      nextTierName: null
    };
  }
  
  const nextTierConfig = CRYSTAL_CIRCLE_TIERS[nextTier];
  const percentage = getProgressToNextTier(currentSpend, currentTier);
  const amountNeeded = getSpendToNextTier(currentSpend, currentTier);
  
  return {
    current: parseFloat(currentSpend.toFixed(2)),
    target: nextTierConfig.minSpend,
    percentage,
    amountNeeded,
    nextTierName: nextTierConfig.name
  };
}

/**
 * Check if a tier upgrade has occurred
 * @param previousSpend - Previous total spend
 * @param newSpend - New total spend after order
 * @returns Object with upgrade status and new tier if upgraded
 */
export function checkTierUpgrade(
  previousSpend: number,
  newSpend: number
): {
  upgraded: boolean;
  previousTier: TierLevel;
  newTier: TierLevel;
  tiersCrossed: TierLevel[];
} {
  const previousTier = calculateTier(previousSpend);
  const newTier = calculateTier(newSpend);
  
  const upgraded = TIER_ORDER.indexOf(newTier) > TIER_ORDER.indexOf(previousTier);
  
  const tiersCrossed: TierLevel[] = [];
  if (upgraded) {
    const prevIndex = TIER_ORDER.indexOf(previousTier);
    const newIndex = TIER_ORDER.indexOf(newTier);
    for (let i = prevIndex + 1; i <= newIndex; i++) {
      tiersCrossed.push(TIER_ORDER[i]);
    }
  }
  
  return {
    upgraded,
    previousTier,
    newTier,
    tiersCrossed
  };
}

/**
 * Get tier display name with proper formatting
 * @param tier - Tier level
 * @returns Formatted display name
 */
export function getTierDisplayName(tier: TierLevel): string {
  return CRYSTAL_CIRCLE_TIERS[tier].name;
}

/**
 * Get all benefits up to and including the current tier
 * @param tier - Current tier level
 * @returns Array of all unlocked benefits
 */
export function getAllUnlockedBenefits(tier: TierLevel): string[] {
  const tierIndex = TIER_ORDER.indexOf(tier);
  const allBenefits: string[] = [];
  
  for (let i = 0; i <= tierIndex; i++) {
    const currentTier = TIER_ORDER[i];
    allBenefits.push(...CRYSTAL_CIRCLE_TIERS[currentTier].benefits);
  }
  
  return [...new Set(allBenefits)];
}

/**
 * Get benefits that are newly unlocked at a specific tier
 * @param tier - Tier level to check
 * @returns Array of exclusive benefits for this tier
 */
export function getTierExclusiveBenefits(tier: TierLevel): string[] {
  const tierIndex = TIER_ORDER.indexOf(tier);
  
  if (tierIndex === 0) {
    return CRYSTAL_CIRCLE_TIERS[tier].benefits;
  }
  
  const previousTier = TIER_ORDER[tierIndex - 1];
  const currentBenefits = CRYSTAL_CIRCLE_TIERS[tier].benefits;
  const previousBenefits = CRYSTAL_CIRCLE_TIERS[previousTier].benefits;
  
  return currentBenefits.filter(benefit => !previousBenefits.includes(benefit));
}

/**
 * Validate if a tier is valid
 * @param tier - Tier level to validate
 * @returns Boolean indicating if tier is valid
 */
export function isValidTier(tier: string): tier is TierLevel {
  return TIER_ORDER.includes(tier as TierLevel);
}

/**
 * Get tier rank number (1-5)
 * @param tier - Tier level
 * @returns Rank number (1 = Seed, 5 = Luminary)
 */
export function getTierRank(tier: TierLevel): number {
  return TIER_ORDER.indexOf(tier) + 1;
}

/**
 * Compare two tiers
 * @param tierA - First tier
 * @param tierB - Second tier
 * @returns Negative if A < B, 0 if equal, positive if A > B
 */
export function compareTiers(tierA: TierLevel, tierB: TierLevel): number {
  return TIER_ORDER.indexOf(tierA) - TIER_ORDER.indexOf(tierB);
}

/**
 * Check if tierA is higher than tierB
 * @param tierA - First tier
 * @param tierB - Second tier
 * @returns Boolean indicating if A is higher than B
 */
export function isTierHigher(tierA: TierLevel, tierB: TierLevel): boolean {
  return compareTiers(tierA, tierB) > 0;
}

/**
 * Check if tierA is lower than tierB
 * @param tierA - First tier
 * @param tierB - Second tier
 * @returns Boolean indicating if A is lower than B
 */
export function isTierLower(tierA: TierLevel, tierB: TierLevel): boolean {
  return compareTiers(tierA, tierB) < 0;
}

/**
 * Get customer tier by customer ID
 * Stub implementation - returns seed tier by default
 * @param customerId - The customer ID
 * @returns Tier information
 */
export async function getCustomerTier(customerId: string): Promise<{ tier: TierLevel; spend: number }> {
  // In production, this would fetch from database
  return {
    tier: 'seed',
    spend: 0
  }
}
