/**
 * Crystal Circle Rewards System
 * 
 * Main entry point for the Oil Amor loyalty program.
 * Export all types, functions, and utilities for the rewards system.
 * 
 * NOTE: This system uses Shopify customer metafields as the SINGLE SOURCE OF TRUTH
 * for customer rewards data. Redis is used only for caching.
 */

// ============================================================================
// TIER SYSTEM - SINGLE SOURCE OF TRUTH
// ============================================================================

export {
  // Constants
  CRYSTAL_CIRCLE_TIERS,
  TIER_ORDER,
  TIER_HIERARCHY,
  
  // Types
  type TierLevel,
  type TierConfig,
  type ChainType,
  type TierIcon,
  
  // Functions
  calculateTier,
  getNextTier,
  getPreviousTier,
  getSpendToNextTier,
  getProgressToNextTier,
  getTierProgressDetails,
  checkTierUpgrade,
  getTierDisplayName,
  getAllUnlockedBenefits,
  getTierExclusiveBenefits,
  isValidTier,
  getTierRank,
  compareTiers,
  isTierHigher,
  isTierLower
} from './tiers';

// ============================================================================
// CUSTOMER REWARDS - SHOPIFY METAFIELDS AS SOURCE OF TRUTH
// ============================================================================

export {
  // Types
  type CrystalCount,
  type CreditTransaction,
  type CustomerRewardsProfile,
  type RewardsUpdateResult,
  type RewardsNotification,
  type OrderInfo,
  type OrderItem,
  type ShopifyOrder,
  type CreditReservation,
  
  // Profile Functions
  getCustomerRewardsProfile,
  createDefaultProfile,
  
  // Spend & Tier Functions
  updateCustomerSpend,
  upgradeCustomerTier,
  unlockRefillForCustomer,
  
  // Credit Functions
  addAccountCredit,
  useAccountCredit,
  getAvailableCredit,
  getCreditHistory,
  
  // Credit Reservation Pattern
  reserveCreditForCheckout,
  commitCreditReservation,
  releaseCreditReservation,
  
  // Webhook Integration
  handleShopifyOrderWebhook,
  
  // Cache Management
  invalidateProfileCache,
  
  // Batch Operations
  getBatchCustomerProfiles
} from './customer-rewards';

// ============================================================================
// CHAIN SYSTEM - WITH PERSISTENCE TO SHOPIFY METAFIELDS
// ============================================================================

export {
  // Constants
  CHAIN_CATALOG,
  CHAIN_DISPLAY_ORDER,
  
  // Types
  type ChainConfig,
  type ChainSpecifications,
  type ChainOption,
  type CustomerChainSelection,
  type ChainSelectionHistory,
  
  // Availability Functions
  getAvailableChains,
  canCustomerSelectChain,
  isChainAvailableAtTier,
  getRequiredTierForChain,
  getNextUnlockableChains,
  getChainDetails,
  
  // Selection Management with Persistence
  selectChain,
  setPreferredChain,
  getCustomerChainSelection,
  
  // Utility Functions
  getDefaultChainForTier,
  getNextChainUpgrade,
  compareChains,
  getChainRecommendation,
  isChainInStock,
  updateChainStock,
  getChainInventoryStatus,
  formatChainName,
  getChainImage,
  getChainValue,
  isValidChainType,
  getUnlockedChainsValue
} from './chain-system';

// ============================================================================
// CHARM SYSTEM - WITH PERSISTENCE TO SHOPIFY METAFIELDS
// ============================================================================

export {
  // Constants
  CHARM_CATALOG,
  CHARM_DISPLAY_ORDER,
  CHARM_MILESTONES,
  
  // Types
  type CharmConfig,
  type UnlockCondition,
  type CharmOption,
  type CustomerCharmCollection,
  type CharmMilestone,
  type CharmClaim,
  
  // Availability Functions
  getAvailableCharms,
  isCharmUnlocked,
  hasCustomerClaimedCharm,
  getCharmsAtMilestone,
  getNextCharmMilestone,
  
  // Collection Management with Persistence
  getCustomerCharmCollection,
  claimCharm,
  equipCharm,
  unequipCharm,
  
  // Recommendation Functions
  getNextCharmRecommendation,
  getRecentlyUnlockedCharms,
  
  // Utility Functions
  isValidCharmId,
  getCharmDisplayInfo,
  getCharmsByTier,
  getCharmsByPurchaseCount,
  formatUnlockCondition,
  calculateCollectionValue
} from './charm-system';

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export {
  // Types
  type NotificationType,
  type NotificationPayload,
  type NotificationChannel,
  type EmailTemplateData,
  
  // Functions
  createTierUpgradeNotification,
  createChainUnlockNotification,
  createCharmUnlockNotification,
  createCreditEarnedNotification,
  createCreditExpiringNotification,
  createMilestoneNotification,
  createRefillReminderNotification,
  createBirthdayGiftNotification,
  createQuarterlyBoxNotification,
  getCustomerNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  sendBulkNotification,
  scheduleNotification,
  cancelScheduledNotification
} from './notifications';

// ============================================================================
// INTEGRATION HELPERS
// ============================================================================

/**
 * Calculate refill price with tier discount applied
 */
export function calculateRefillPrice(
  basePrice: number,
  tier: import('./tiers').TierLevel
): { originalPrice: number; discountedPrice: number; savings: number } {
  const { CRYSTAL_CIRCLE_TIERS } = require('./tiers');
  const config = CRYSTAL_CIRCLE_TIERS[tier];
  const discount = config?.refillDiscount || 0;
  
  const savings = basePrice * (discount / 100);
  const discountedPrice = basePrice - savings;
  
  return {
    originalPrice: basePrice,
    discountedPrice: parseFloat(discountedPrice.toFixed(2)),
    savings: parseFloat(savings.toFixed(2))
  };
}

/**
 * Check if customer qualifies for free shipping
 */
export function qualifiesForFreeShipping(tier: import('./tiers').TierLevel): boolean {
  const freeShippingTiers: string[] = ['sprout', 'bloom', 'radiance', 'luminary'];
  return freeShippingTiers.includes(tier);
}

/**
 * Get shipping method for tier
 */
export function getTierShippingMethod(tier: import('./tiers').TierLevel): string {
  const shippingMethods: Record<string, string> = {
    seed: 'Standard',
    sprout: 'Free Standard',
    bloom: 'Free Expedited',
    radiance: 'Free Priority',
    luminary: 'Free Overnight'
  };
  return shippingMethods[tier] || 'Standard';
}

/**
 * Check if customer gets quarterly box
 */
export function qualifiesForQuarterlyBox(tier: import('./tiers').TierLevel): boolean {
  return tier === 'radiance' || tier === 'luminary';
}

/**
 * Check if customer gets birthday gift
 */
export function qualifiesForBirthdayGift(tier: import('./tiers').TierLevel): boolean {
  return tier === 'bloom' || tier === 'radiance' || tier === 'luminary';
}

/**
 * Calculate charm discount for free charm benefit
 * Bloom tier: every 3rd purchase
 */
export function qualifiesForFreeCharm(
  purchaseCount: number,
  tier: import('./tiers').TierLevel
): boolean {
  if (tier === 'bloom' || tier === 'radiance' || tier === 'luminary') {
    return purchaseCount > 0 && purchaseCount % 3 === 0;
  }
  return false;
}

// ============================================================================
// VERSION
// ============================================================================

export const CRYSTAL_CIRCLE_VERSION = '2.0.0';
