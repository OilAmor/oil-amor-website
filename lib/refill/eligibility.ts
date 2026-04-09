// =============================================================================
// Refill Eligibility System
// =============================================================================
// Checks if customers are eligible for Forever Bottle refills
// Uses customer rewards profile and real bottle data
// =============================================================================

import { getCustomerRewardsProfile, CRYSTAL_CIRCLE_TIERS } from '@/lib/rewards/customer-rewards'
import { getCustomerForeverBottles } from '@/lib/refill/forever-bottle'
import { ForeverBottle } from '@/lib/db/schema-refill'

// =============================================================================
// TYPES
// =============================================================================

export interface RefillPricing {
  standardPrice: number
  discountedPrice: number
  creditApplied: number
  finalPrice: number
  tierDiscount: number
}

export interface RefillEligibility {
  canRefill: boolean
  reason?: string
  availableBottles: ForeverBottle[]
  pricing: RefillPricing | null
}

// =============================================================================
// ELIGIBILITY CHECK
// =============================================================================

/**
 * Check if a customer is eligible for refills
 * 
 * This function uses the customer rewards profile and real bottle data
 * to determine eligibility. It does NOT query non-existent tables.
 */
export async function checkRefillEligibility(
  customerId: string,
  oilType: string
): Promise<RefillEligibility> {
  // Get customer profile from rewards system
  const profile = await getCustomerRewardsProfile(customerId)
  
  // Check if refill is unlocked
  if (!profile.refillUnlocked) {
    return {
      canRefill: false,
      reason: 'Complete your first 30ml purchase to unlock refills',
      availableBottles: [],
      pricing: null,
    }
  }
  
  // Get customer's forever bottles
  const bottles = await getCustomerForeverBottles(customerId)
  const matchingBottles = bottles.filter(
    b => b.oilType === oilType && b.status === 'active'
  )
  
  if (matchingBottles.length === 0) {
    return {
      canRefill: false,
      reason: 'You need a Forever Bottle for this oil type',
      availableBottles: [],
      pricing: null,
    }
  }

  // Check if any bottle has remaining credits
  const bottlesWithCredits = matchingBottles.filter(b => b.creditsRemaining > 0)
  
  if (bottlesWithCredits.length === 0) {
    return {
      canRefill: false,
      reason: 'All your Forever Bottles for this oil type have been exhausted',
      availableBottles: matchingBottles,
      pricing: null,
    }
  }
  
  // Calculate pricing with tier discount
  const tier = CRYSTAL_CIRCLE_TIERS[profile.currentTier]
  const standardPrice = 35
  const discount = tier.refillDiscount
  const discountedPrice = Math.round(standardPrice * (1 - discount / 100) * 100) / 100
  const creditApplied = 5 // Standard credit applied after return
  const finalPrice = Math.max(0, discountedPrice - creditApplied)
  
  return {
    canRefill: true,
    availableBottles: bottlesWithCredits,
    pricing: {
      standardPrice,
      discountedPrice,
      creditApplied,
      finalPrice,
      tierDiscount: discount,
    },
  }
}

// =============================================================================
// BATCH ELIGIBILITY CHECKS
// =============================================================================

/**
 * Check eligibility for multiple oil types at once
 */
export async function checkMultiOilEligibility(
  customerId: string,
  oilTypes: string[]
): Promise<Record<string, RefillEligibility>> {
  const results: Record<string, RefillEligibility> = {}
  
  await Promise.all(
    oilTypes.map(async (oilType) => {
      results[oilType] = await checkRefillEligibility(customerId, oilType)
    })
  )
  
  return results
}

/**
 * Get all eligible bottles for a customer (across all oil types)
 */
export async function getAllEligibleBottles(
  customerId: string
): Promise<ForeverBottle[]> {
  // Get customer profile to check if refills are unlocked
  const profile = await getCustomerRewardsProfile(customerId)
  
  if (!profile.refillUnlocked) {
    return []
  }
  
  // Get all active bottles with remaining credits
  const bottles = await getCustomerForeverBottles(customerId)
  return bottles.filter(b => b.status === 'active' && b.creditsRemaining > 0)
}

// =============================================================================
// PRICING CALCULATIONS
// =============================================================================

/**
 * Calculate refill price for a customer
 */
export async function calculateRefillPrice(
  customerId: string,
  basePrice: number = 35
): Promise<RefillPricing> {
  const profile = await getCustomerRewardsProfile(customerId)
  const tier = CRYSTAL_CIRCLE_TIERS[profile.currentTier]
  
  const discount = tier.refillDiscount
  const discountedPrice = Math.round(basePrice * (1 - discount / 100) * 100) / 100
  const creditApplied = 5
  const finalPrice = Math.max(0, discountedPrice - creditApplied)
  
  return {
    standardPrice: basePrice,
    discountedPrice,
    creditApplied,
    finalPrice,
    tierDiscount: discount,
  }
}

/**
 * Get pricing breakdown for display
 */
export async function getPricingBreakdown(
  customerId: string
): Promise<{
  basePrice: number
  tierDiscount: number
  tierDiscountAmount: number
  priceAfterDiscount: number
  creditApplied: number
  finalPrice: number
  savings: number
}> {
  const profile = await getCustomerRewardsProfile(customerId)
  const tier = CRYSTAL_CIRCLE_TIERS[profile.currentTier]
  
  const basePrice = 35
  const discount = tier.refillDiscount
  const tierDiscountAmount = Math.round(basePrice * (discount / 100) * 100) / 100
  const priceAfterDiscount = basePrice - tierDiscountAmount
  const creditApplied = 5
  const finalPrice = Math.max(0, priceAfterDiscount - creditApplied)
  const savings = basePrice - finalPrice
  
  return {
    basePrice,
    tierDiscount: discount,
    tierDiscountAmount,
    priceAfterDiscount,
    creditApplied,
    finalPrice,
    savings,
  }
}
