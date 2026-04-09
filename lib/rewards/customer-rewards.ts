// =============================================================================
// Customer Rewards System
// =============================================================================
// Manages customer rewards profiles and tier calculations
// =============================================================================

import { db } from '@/lib/db'
import { customerRewards, CustomerRewards } from '@/lib/db/schema-refill'
import { eq } from 'drizzle-orm'

// =============================================================================
// CRYSTAL CIRCLE TIER CONFIGURATION
// =============================================================================

export interface CrystalCircleTier {
  name: string
  minSpend: number
  refillDiscount: number
  benefits: string[]
}

export const CRYSTAL_CIRCLE_TIERS: Record<string, CrystalCircleTier> = {
  amber: {
    name: 'Amber',
    minSpend: 0,
    refillDiscount: 0,
    benefits: ['Standard pricing', 'Birthday bonus'],
  },
  amethyst: {
    name: 'Amethyst',
    minSpend: 200,
    refillDiscount: 5,
    benefits: ['5% refill discount', 'Early access to new oils', 'Birthday bonus'],
  },
  rose_quartz: {
    name: 'Rose Quartz',
    minSpend: 500,
    refillDiscount: 10,
    benefits: ['10% refill discount', 'Free shipping on refills', 'Early access', 'Birthday bonus'],
  },
  sapphire: {
    name: 'Sapphire',
    minSpend: 1000,
    refillDiscount: 15,
    benefits: ['15% refill discount', 'Free shipping on all orders', 'Exclusive blends', 'Priority support'],
  },
  diamond: {
    name: 'Diamond',
    minSpend: 2500,
    refillDiscount: 20,
    benefits: ['20% refill discount', 'Free shipping', 'Exclusive blends', 'Priority support', 'Personalized consultations'],
  },
}

// =============================================================================
// REWARDS PROFILE FUNCTIONS
// =============================================================================

/**
 * Get or create customer rewards profile
 */
export async function getCustomerRewardsProfile(customerId: string): Promise<CustomerRewards> {
  // Try to find existing profile
  let profile = await db.query.customerRewards.findFirst({
    where: eq(customerRewards.customerId, customerId),
  })

  // Create new profile if not found
  if (!profile) {
    const [newProfile] = await db.insert(customerRewards)
      .values({
        customerId,
        currentTier: 'amber',
        accountCredit: '0',
        reservedCredit: '0',
        refillUnlocked: false,
        totalPurchases: 0,
        totalSpent: '0',
      })
      .returning()
    
    profile = newProfile
  }

  return profile
}

/**
 * Update customer's tier based on total spend
 */
export async function updateCustomerTier(customerId: string): Promise<void> {
  const profile = await getCustomerRewardsProfile(customerId)
  const totalSpent = parseFloat(profile.totalSpent.toString())

  // Determine appropriate tier
  let newTier = 'amber'
  const tiers = ['diamond', 'sapphire', 'rose_quartz', 'amethyst', 'amber']
  
  for (const tier of tiers) {
    if (totalSpent >= CRYSTAL_CIRCLE_TIERS[tier].minSpend) {
      newTier = tier
      break
    }
  }

  // Update if tier changed
  if (newTier !== profile.currentTier) {
    await db.update(customerRewards)
      .set({ 
        currentTier: newTier,
        updatedAt: new Date(),
      })
      .where(eq(customerRewards.customerId, customerId))
  }
}

/**
 * Add purchase to customer history
 */
export async function recordPurchase(
  customerId: string, 
  amount: number,
  unlockRefill: boolean = false
): Promise<void> {
  const profile = await getCustomerRewardsProfile(customerId)
  
  const newTotalSpent = parseFloat(profile.totalSpent.toString()) + amount
  const newTotalPurchases = profile.totalPurchases + 1
  
  await db.update(customerRewards)
    .set({
      totalSpent: newTotalSpent.toString(),
      totalPurchases: newTotalPurchases,
      refillUnlocked: unlockRefill || profile.refillUnlocked,
      updatedAt: new Date(),
    })
    .where(eq(customerRewards.customerId, customerId))
  
  // Check if tier should be updated
  await updateCustomerTier(customerId)
}

/**
 * Get customer's current tier benefits
 */
export async function getTierBenefits(customerId: string): Promise<CrystalCircleTier> {
  const profile = await getCustomerRewardsProfile(customerId)
  return CRYSTAL_CIRCLE_TIERS[profile.currentTier]
}

/**
 * Unlock refill eligibility for customer
 */
export async function unlockRefillEligibility(customerId: string): Promise<void> {
  await db.update(customerRewards)
    .set({
      refillUnlocked: true,
      updatedAt: new Date(),
    })
    .where(eq(customerRewards.customerId, customerId))
}

/**
 * Check if customer has unlocked refills
 */
export async function hasRefillUnlocked(customerId: string): Promise<boolean> {
  const profile = await getCustomerRewardsProfile(customerId)
  return profile.refillUnlocked
}
