/**
 * Order Completion Logic
 * Handles unlocking oils when orders are completed
 * Pure purchase → unlocks Pure refills
 * Enhanced purchase → unlocks ALL strengths (Pure + Enhanced)
 * Community blends → Shares custom mixes to community when user consents
 * User blends → Saves blends to user's personal library for re-purchase
 */

import { UnlockedOil, Order, OrderItem } from '@/lib/context/user-context'
import { OrderCustomMix } from '@/lib/db/schema/orders'
import { saveBlendToLibrary } from '@/lib/brand-ambassador'
import { trackReferral, extractShareCodeFromUrl } from '@/lib/brand-ambassador'
import { calculateRefillPrice } from '@/lib/refill/recipe-scaling'

export interface OrderCompletionResult {
  success: boolean
  newUnlocks: UnlockedOil[]
  upgradedUnlocks: { oilId: string; from: 'pure'; to: 'enhanced' }[]
  errors?: string[]
}

/**
 * Process an order completion and determine what oils should be unlocked
 * 
 * Rules:
 * - Pure oil purchase → Unlocks Pure refills for that oil
 * - Enhanced oil purchase → Unlocks BOTH Pure AND Enhanced refills for that oil
 * - If already unlocked as Pure and now buying Enhanced → Upgrade to Enhanced
 */
export function processOrderCompletion(
  order: Order,
  existingUnlocks: UnlockedOil[]
): OrderCompletionResult {
  const newUnlocks: UnlockedOil[] = []
  const upgradedUnlocks: { oilId: string; from: 'pure'; to: 'enhanced' }[] = []
  const errors: string[] = []

  for (const item of order.items) {
    // Skip items that aren't oils
    if (!item.oilId) {
      errors.push(`Item ${item.name} has no oilId`)
      continue
    }

    const existingUnlock = existingUnlocks.find(u => u.oilId === item.oilId)

    if (!existingUnlock) {
      // New unlock
      newUnlocks.push({
        oilId: item.oilId,
        unlockedAt: new Date().toISOString(),
        unlockedBy: order.id,
        type: item.type, // 'pure' or 'enhanced'
      })
    } else if (existingUnlock.type === 'pure' && item.type === 'enhanced') {
      // Upgrade from Pure to Enhanced (unlocks all strengths)
      upgradedUnlocks.push({
        oilId: item.oilId,
        from: 'pure',
        to: 'enhanced',
      })
    }
    // If already unlocked as enhanced, no change needed
  }

  return {
    success: errors.length === 0,
    newUnlocks,
    upgradedUnlocks,
    errors: errors.length > 0 ? errors : undefined,
  }
}

/**
 * Apply unlocks to existing list (for state updates)
 */
export function applyUnlocks(
  existingUnlocks: UnlockedOil[],
  result: OrderCompletionResult
): UnlockedOil[] {
  let updated = [...existingUnlocks]

  // Add new unlocks
  updated = [...updated, ...result.newUnlocks]

  // Apply upgrades
  for (const upgrade of result.upgradedUnlocks) {
    updated = updated.map(u =>
      u.oilId === upgrade.oilId ? { ...u, type: 'enhanced' } : u
    )
  }

  return updated
}

/**
 * Check if an order item grants enhanced access
 * Enhanced access means all strengths (5%-75%) are available for refill
 */
export function hasEnhancedAccess(
  oilId: string,
  unlockedOils: UnlockedOil[]
): boolean {
  const unlock = unlockedOils.find(u => u.oilId === oilId)
  return unlock?.type === 'enhanced'
}

/**
 * Get the highest tier unlock for an oil
 * Returns 'enhanced' if any order unlocked it as enhanced, otherwise 'pure' if unlocked, null if locked
 */
export function getOilUnlockTier(
  oilId: string,
  unlockedOils: UnlockedOil[]
): 'enhanced' | 'pure' | null {
  const unlock = unlockedOils.find(u => u.oilId === oilId)
  if (!unlock) return null
  return unlock.type
}

/**
 * Calculate available refill types for an oil
 */
export function getAvailableRefillTypes(
  oilId: string,
  unlockedOils: UnlockedOil[]
): { pure: boolean; enhanced: boolean } {
  const tier = getOilUnlockTier(oilId, unlockedOils)
  return {
    pure: tier !== null, // Pure is available if any unlock exists
    enhanced: tier === 'enhanced', // Enhanced only if explicitly unlocked
  }
}

// ============================================================================
// COMMUNITY BLEND SHARING
// ============================================================================

export interface CommunityBlendShare {
  shouldShare: boolean
  blendName: string
  creatorId: string
  creatorName: string
  recipe: OrderCustomMix
  orderId: string
}

/**
 * Extract community blend shares from an order
 * Called when order is completed to share blends user consented to share
 */
export function extractCommunityBlendShares(order: Order): CommunityBlendShare[] {
  const shares: CommunityBlendShare[] = []

  for (const item of order.items) {
    // Check if this is a custom mix with community sharing enabled
    if (item.customMix?.shareToCommunity) {
      shares.push({
        shouldShare: true,
        blendName: item.customMix.recipeName,
        creatorId: item.customMix.creatorId || order.customerId || 'anonymous',
        creatorName: item.customMix.creatorName || 'Anonymous Alchemist',
        recipe: item.customMix,
        orderId: order.id,
      })
    }
  }

  return shares
}

/**
 * Process community blend shares after order completion
 * Creates AND publishes blends since user has already consented and purchased
 * Returns results of share attempts for user feedback
 */
export interface CommunityShareResult {
  success: boolean
  blendName: string
  blendId?: string
  slug?: string
  error?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function processCommunityBlendShares(
  order: Order,
  createBlendFn: (input: Record<string, any>) => Promise<{ success: boolean; blendId?: string; error?: string }>,
  publishBlendFn?: (input: { blendId: string; creatorId: string; orderId: string; consentToShare: boolean }) => Promise<{ success: boolean; slug?: string; error?: string }>
): Promise<CommunityShareResult[]> {
  const shares = extractCommunityBlendShares(order)
  const results: CommunityShareResult[] = []

  for (const share of shares) {
    try {
      // Calculate price in cents (default $35 = 3500 cents for custom blends)
      const priceCents = 3500

      // Transform recipe to CommunityBlend format
      const communityRecipe = {
        mode: share.recipe.mode,
        bottleSize: share.recipe.totalVolume,
        strength: share.recipe.carrierRatio ? Math.round(share.recipe.carrierRatio * 100) : 100,
        oils: share.recipe.oils.map(oil => ({
          oilId: oil.oilId,
          name: oil.oilName || oil.oilId,
          ml: Number(((share.recipe.totalVolume * (1 - (share.recipe.carrierRatio || 0)) * oil.percentage) / 100).toFixed(2)),
        })),
        // Include additional recipe details
        carrierOilId: share.recipe.carrierOilId,
        crystalId: share.recipe.crystalId,
      }

      // Create the blend
      const result = await createBlendFn({
        creatorId: share.creatorId,
        creatorName: share.creatorName,
        name: share.blendName,
        description: share.recipe.intendedUse 
          ? `A custom blend designed for ${share.recipe.intendedUse}. Created with intention in the Oil Amor Mixing Atelier.`
          : `Custom blend created in the Mixing Atelier with intention and care.`,
        story: share.recipe.intendedUse 
          ? `This blend was crafted to support ${share.recipe.intendedUse}. The creator carefully selected each oil for its unique properties and how they harmonize together.`
          : undefined,
        recipe: communityRecipe,
        revelationData: share.recipe.revelationData,
        price: priceCents,
        // Store additional metadata
        originalOrderId: share.orderId,
        consentToShare: true,
      })

      if (result.success && result.blendId && publishBlendFn) {
        // Immediately publish the blend since user has already consented and purchased
        const publishResult = await publishBlendFn({
          blendId: result.blendId,
          creatorId: share.creatorId,
          orderId: share.orderId,
          consentToShare: true,
        })

        results.push({
          success: publishResult.success,
          blendName: share.blendName,
          blendId: result.blendId,
          slug: publishResult.slug,
          error: publishResult.error,
        })
      } else {
        results.push({
          success: result.success,
          blendName: share.blendName,
          blendId: result.blendId,
          error: result.error,
        })
      }
    } catch (error) {
      results.push({
        success: false,
        blendName: share.blendName,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return results
}

// ============================================================================
// USER BLEND LIBRARY (MY BLENDS)
// ============================================================================

export interface UserBlendSaveResult {
  success: boolean
  blendId?: string
  shareCode?: string
  blendName: string
  error?: string
}

export interface UnlockedRefillResult {
  success: boolean
  refillId?: string
  blendName: string
  availableSizes: Array<{ size: 50 | 100; price: number }>
  error?: string
}

/**
 * Save all custom mix blends from an order to user's personal library
 * Called after order completion so user can re-purchase their blends
 */
export async function saveBlendsToUserLibrary(
  order: Order,
  userId: string
): Promise<UserBlendSaveResult[]> {
  const results: UserBlendSaveResult[] = []

  for (const item of order.items) {
    // Only save custom mixes
    if (!item.customMix) continue

    try {
      const result = await saveBlendToLibrary({
        userId,
        name: item.customMix.recipeName,
        description: `Created in the Mixing Atelier`,
        intendedUse: item.customMix.intendedUse,
        recipe: {
          mode: item.customMix.mode,
          oils: item.customMix.oils.map(o => ({
            ...o,
            drops: o.drops ?? Math.round((o.ml || 0) * 20),
          })),
          carrierRatio: item.customMix.carrierRatio,
          totalVolume: item.customMix.totalVolume,
          safetyScore: item.customMix.safetyScore,
          safetyRating: item.customMix.safetyRating,
          safetyWarnings: item.customMix.safetyWarnings,
        },
        tags: item.customMix.intendedUse ? [item.customMix.intendedUse] : [],
        createdFromOrderId: order.id,
        isPublic: item.customMix.shareToCommunity || false,
      })

      results.push({
        success: result.success,
        blendId: result.blendId,
        shareCode: result.shareCode,
        blendName: item.customMix.recipeName,
        error: result.error,
      })
    } catch (error) {
      results.push({
        success: false,
        blendName: item.customMix.recipeName,
        error: error instanceof Error ? error.message : 'Failed to save blend',
      })
    }
  }

  return results
}

// ============================================================================
// UNLOCK REFILLS FOR CUSTOM BLENDS
// ============================================================================

/**
 * Unlock custom blend refills after purchase
 * Makes the blend available in the refill store at 50ml and 100ml sizes
 */
export async function unlockCustomBlendRefills(
  order: Order,
  userId: string,
  shareCodes?: Record<string, string> // Map of recipeName -> shareCode
): Promise<UnlockedRefillResult[]> {
  const results: UnlockedRefillResult[] = []
  
  // Import here to avoid circular dependency
  const { createUnlockedRefill } = await import('@/lib/refill/unlocked-refills')
  
  for (const item of order.items) {
    // Only process custom mixes
    if (!item.customMix) continue
    
    try {
      const result = await createUnlockedRefill({
        userId,
        originalOrderId: order.id,
        name: item.customMix.recipeName,
        description: `Created in the Mixing Atelier`,
        intendedUse: item.customMix.intendedUse,
        customMix: item.customMix,
        tags: item.customMix.tags,
        shareCode: shareCodes?.[item.customMix.recipeName],
      })
      
      results.push({
        success: result.success,
        refillId: result.refillId,
        blendName: item.customMix.recipeName,
        availableSizes: [
          { size: 50, price: calculateRefillPrice(50, item.customMix.mode) },
          { size: 100, price: calculateRefillPrice(100, item.customMix.mode) },
        ],
        error: result.error,
      })
    } catch (error) {
      results.push({
        success: false,
        blendName: item.customMix.recipeName,
        availableSizes: [],
        error: error instanceof Error ? error.message : 'Failed to unlock refill',
      })
    }
  }
  
  return results
}

// ============================================================================
// REFERRAL TRACKING (BRAND AMBASSADOR)
// ============================================================================

export interface ReferralTrackingInput {
  order: Order
  referringShareCode?: string | null
  referringBlendId?: string | null
  userAgent?: string
  ipAddress?: string
}

export interface ReferralResult {
  success: boolean
  creditEarned?: number
  referrerUserId?: string
  error?: string
}

/**
 * Track referrals from share links when order is completed
 * Called after order completion to award credits to referrer
 */
export async function trackBlendReferral(
  input: ReferralTrackingInput
): Promise<ReferralResult> {
  // Check if this order came from a share link
  const shareCode = input.referringShareCode
  
  if (!shareCode) {
    return { success: true } // No referral, that's fine
  }

  try {
    // Calculate total purchase amount in cents
    const totalAmount = Math.round(input.order.total * 100)

    const result = await trackReferral({
      shareCode,
      orderId: input.order.id,
      purchaseAmount: totalAmount,
      referredUserId: input.order.customerId,
      referrerIp: input.ipAddress,
      userAgent: input.userAgent,
    })

    return {
      success: result.success,
      creditEarned: result.creditEarned,
      error: result.error,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to track referral',
    }
  }
}

// ============================================================================
// COMPLETE ORDER PROCESSING
// ============================================================================

export interface CompleteOrderResult {
  orderId: string
  unlockResult: OrderCompletionResult
  communityShares: CommunityShareResult[]
  savedBlends: UserBlendSaveResult[]
  unlockedRefills: UnlockedRefillResult[]
  referralResult?: ReferralResult
  xpEarned: number
}

/**
 * Complete order processing - handles all post-purchase actions
 * 
 * This is the main function to call when an order is successfully completed
 */
export async function completeOrderProcessing(
  order: Order,
  userId: string,
  existingUnlocks: UnlockedOil[],
  options?: {
    referringShareCode?: string
    userAgent?: string
    ipAddress?: string
  }
): Promise<CompleteOrderResult> {
  // 1. Process oil unlocks
  const unlockResult = processOrderCompletion(order, existingUnlocks)

  // 2. Share to community (if user consented)
  const communityShares = await processCommunityBlendShares(
    order,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (input: any) => {
      // Import dynamically to avoid circular dependency
      const { createCommunityBlend } = await import('@/lib/community-blends/actions')
      return createCommunityBlend(input)
    },
    // Publish blend immediately since user has already consented and purchased
    async (input) => {
      const { publishBlend } = await import('@/lib/community-blends/actions')
      const result = await publishBlend(input)
      return {
        success: result.success,
        error: result.error,
      }
    }
  )

  // 3. Save to user's personal library (My Blends)
  const savedBlends = await saveBlendsToUserLibrary(order, userId)

  // 4. Unlock refills for custom blends (makes them available in refill store)
  const shareCodeMap = savedBlends.reduce((map, blend) => {
    if (blend.shareCode) {
      map[blend.blendName] = blend.shareCode
    }
    return map
  }, {} as Record<string, string>)
  const unlockedRefills = await unlockCustomBlendRefills(order, userId, shareCodeMap)

  // 5. Track referral if came from share link
  const referralResult = await trackBlendReferral({
    order,
    referringShareCode: options?.referringShareCode,
    userAgent: options?.userAgent,
    ipAddress: options?.ipAddress,
  })

  // 6. Calculate XP earned
  const xpEarned = calculateOrderXP(order, existingUnlocks)

  return {
    orderId: order.id,
    unlockResult,
    communityShares,
    savedBlends,
    unlockedRefills,
    referralResult,
    xpEarned,
  }
}

// ============================================================================
// XP CALCULATION
// ============================================================================

/**
 * Calculate collector XP from an order
 * Base: 50 XP per order
 * Bonus: 25 XP per unique oil
 * Bonus: 50 XP for first enhanced purchase of an oil
 */
export function calculateOrderXP(
  order: Order,
  existingUnlocks: UnlockedOil[]
): number {
  let xp = 50 // Base XP

  const uniqueOils = new Set(order.items.map(i => i.oilId))
  xp += uniqueOils.size * 25 // Bonus per unique oil

  // Bonus for first enhanced purchase
  for (const item of order.items) {
    if (item.type === 'enhanced') {
      const existing = existingUnlocks.find(u => u.oilId === item.oilId)
      if (!existing || existing.type === 'pure') {
        xp += 50 // First enhanced bonus
      }
    }
  }

  return xp
}

// ============================================================================
// SHOPIFY ORDER FORMATTING
// ============================================================================

/**
 * Format order data from Shopify webhook or API
 */
export function formatOrderFromShopify(
  shopifyOrder: {
    id: string
    createdAt: string
    displayFinancialStatus?: string
    lineItems: Array<{
      title: string
      variant?: {
        sku?: string
        product?: {
          id: string
          title: string
          productType?: string
          metafields?: Array<{
            namespace: string
            key: string
            value: string
          }>
        }
      }
      quantity: number
      originalTotalSet: {
        presentmentMoney: {
          amount: string
          currencyCode: string
        }
      }
    }>
    subtotalPriceSet: {
      presentmentMoney: {
        amount: string
        currencyCode: string
      }
    }
  }
): Order {
  // Map Shopify order to our Order format
  const items: OrderItem[] = shopifyOrder.lineItems.map(lineItem => {
    // Extract oil ID from SKU or product metadata
    const sku = lineItem.variant?.sku || ''
    const oilId = extractOilIdFromSKU(sku) || 
                  lineItem.variant?.product?.metafields?.find(
                    m => m.namespace === 'oil_amor' && m.key === 'oil_id'
                  )?.value ||
                  'unknown'

    // Determine type from product type or variant title
    const productType = lineItem.variant?.product?.productType || ''
    const variantTitle = lineItem.title.toLowerCase()
    const type: 'pure' | 'enhanced' = 
      productType.toLowerCase().includes('enhanced') || 
      variantTitle.includes('enhanced') 
        ? 'enhanced' 
        : 'pure'

    return {
      oilId,
      name: lineItem.title,
      size: extractSizeFromTitle(lineItem.title),
      type,
      price: parseFloat(lineItem.originalTotalSet.presentmentMoney.amount),
    }
  })

  return {
    id: shopifyOrder.id,
    date: shopifyOrder.createdAt,
    status: mapShopifyStatus(shopifyOrder.displayFinancialStatus),
    items,
    total: parseFloat(shopifyOrder.subtotalPriceSet.presentmentMoney.amount),
  }
}

// Helper to extract oil ID from SKU
function extractOilIdFromSKU(sku: string): string | null {
  // Expected format: OIL-LAVENDER-30 or similar
  const match = sku.match(/^OIL-([A-Z-]+)-\d+$/i)
  return match ? match[1].toLowerCase().replace(/-/g, '-') : null
}

// Helper to extract size from title
function extractSizeFromTitle(title: string): string {
  const match = title.match(/(\d+)\s*ml/i)
  return match ? `${match[1]}ml` : '30ml'
}

// Helper to map Shopify status to our status
function mapShopifyStatus(
  status?: string
): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'processing'
    case 'pending':
      return 'pending'
    case 'refunded':
    case 'voided':
      return 'cancelled'
    default:
      return 'processing'
  }
}
