/**
 * Oil Amor Shopify Integration Layer
 * 
 * Complete commerce backbone connecting Oil Amor's customizations to Shopify
 */

// Cart Transformation
export {
  transformToCartItems,
  addConfiguredProductToCart,
  updateCartLine,
  removeCartLines,
  getCart,
  extractConfiguredProducts,
  calculateTotalCredit,
  groupCartLinesByConfiguration,
  type ConfiguredProduct,
  type CartLineItem,
  type ShopifyCart,
  type CartTransformationResult,
  type BottleSize,
} from './cart-transformer'

// Metafields
export {
  METAFIELD_NAMESPACES,
  setOilMetafields,
  setCrystalMetafields,
  setProductConfigMetafields,
  getCustomerMetafields,
  updateCustomerMetafields,
  incrementCustomerMetafield,
  addToCustomerArrayMetafield,
  getRefillMetafields,
  registerForeverBottle,
  getOilMetafieldsStorefront,
  getCrystalMetafieldsStorefront,
  incrementProductAnalytics,
  recordPopularCombination,
  type OilMetafields,
  type CrystalMetafields,
  type ProductConfigMetafields,
  type CustomerMetafields,
  type RefillMetafields,
  type AnalyticsMetafields,
} from './metafields'

// Checkout Extensions
export {
  customizeCheckout,
  generateTierDiscountCode,
  applyCreditToCheckout,
  checkTierUpgrade,
  applyTierDiscountToLineItems,
  calculateCheckoutTotals,
  type CheckoutCustomization,
  type DiscountCode,
  type CheckoutLineItem,
} from './checkout-extensions'

// Product Sync
export {
  syncOilToShopify,
  syncCrystalToShopify,
  createBottleSizeVariants,
  bulkSyncOils,
  bulkSyncCrystals,
  syncFromSanity,
  BOTTLE_SIZE_CONFIG,
  type OilContent,
  type CrystalContent,
  type ProductVariantInput,
  type SyncResult,
} from './product-sync'

// Inventory Management
export {
  checkComponentAvailability,
  reserveComponents,
  confirmReservation,
  releaseComponentReservation,
  getFullInventory,
  checkLowInventory,
  cleanupExpiredReservations,
  getActiveReservations,
  bulkUpdateInventory,
  COMPONENT_SKUS,
  type ComponentInventory,
  type InventoryReservation,
  type AvailabilityCheck,
} from './inventory'

// Customer Authentication
export {
  authenticateCustomer,
  syncCustomerData,
  withCustomerAuth,
  withOptionalAuth,
  setCustomerAccessToken,
  getCustomerIdFromCookie,
  clearCustomerAccessToken,
  createCustomerAccount,
  loginCustomer,
  logoutCustomer,
  recoverPassword,
  hasUnlockedChain,
  hasCollectedCharm,
  getTierProgress,
  getNextTier,
  type ShopifyCustomer,
  type CustomerRewardsProfile,
  type AuthenticatedContext,
  type AuthenticatedHandler,
  type Handler,
} from './customer-auth'
