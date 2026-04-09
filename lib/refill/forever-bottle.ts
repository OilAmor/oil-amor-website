// =============================================================================
// Forever Bottle Management
// =============================================================================
// Functions for managing Forever Bottles and their credits
// =============================================================================

import { db } from '@/lib/db'
import { foreverBottles, customerCredits, ForeverBottle, CustomerCredit } from '@/lib/db/schema-refill'
import { eq, and, gt } from 'drizzle-orm'

// =============================================================================
// BOTTLE RETRIEVAL
// =============================================================================

/**
 * Get all Forever Bottles for a customer
 */
export async function getCustomerForeverBottles(
  customerId: string
): Promise<ForeverBottle[]> {
  const bottles = await db.query.foreverBottles.findMany({
    where: eq(foreverBottles.customerId, customerId),
    orderBy: (bottles, { desc }) => [desc(bottles.purchasedAt)],
  })
  
  return bottles
}

/**
 * Get a specific bottle by ID
 */
export async function getBottleById(
  bottleId: string
): Promise<ForeverBottle | null> {
  const bottle = await db.query.foreverBottles.findFirst({
    where: eq(foreverBottles.id, bottleId),
  })
  
  return bottle || null
}

/**
 * Get active bottles with remaining credits
 */
export async function getActiveBottlesWithCredits(
  customerId: string
): Promise<ForeverBottle[]> {
  const bottles = await db.query.foreverBottles.findMany({
    where: and(
      eq(foreverBottles.customerId, customerId),
      eq(foreverBottles.status, 'active'),
      gt(foreverBottles.creditsRemaining, 0)
    ),
    orderBy: (bottles, { desc }) => [desc(bottles.purchasedAt)],
  })
  
  return bottles
}

// =============================================================================
// BOTTLE MANAGEMENT
// =============================================================================

/**
 * Register a new Forever Bottle (called when 30ml bottle is purchased)
 */
export async function registerForeverBottle(data: {
  orderId: string
  orderNumber?: string
  customerId: string
  customerEmail: string
  customerName?: string
  bottleSku: string
  bottleSize: string
  bottleMaterial?: string
  oilType: string
  totalCredits?: number
  crystalVialType?: string
  purchasedAt?: Date
}): Promise<ForeverBottle> {
  const [bottle] = await db.insert(foreverBottles)
    .values({
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      customerId: data.customerId,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      bottleSku: data.bottleSku,
      bottleSize: data.bottleSize,
      bottleMaterial: data.bottleMaterial || 'Glass',
      oilType: data.oilType,
      totalCredits: data.totalCredits || 6,
      creditsRemaining: data.totalCredits || 6,
      status: 'active',
      crystalVialType: data.crystalVialType,
      purchasedAt: data.purchasedAt || new Date(),
    })
    .returning()
  
  return bottle
}

/**
 * Update bottle status
 */
export async function updateBottleStatus(
  bottleId: string,
  status: 'active' | 'exhausted' | 'cancelled'
): Promise<void> {
  await db.update(foreverBottles)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(foreverBottles.id, bottleId))
}

/**
 * Decrement credits remaining when a refill is used
 */
export async function useCredit(
  bottleId: string
): Promise<boolean> {
  const bottle = await getBottleById(bottleId)
  
  if (!bottle || bottle.creditsRemaining <= 0) {
    return false
  }
  
  const newCreditsRemaining = bottle.creditsRemaining - 1
  const newStatus = newCreditsRemaining === 0 ? 'exhausted' : bottle.status
  
  await db.update(foreverBottles)
    .set({
      creditsRemaining: newCreditsRemaining,
      status: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(foreverBottles.id, bottleId))
  
  return true
}

// =============================================================================
// CREDIT MANAGEMENT
// =============================================================================

/**
 * Get all credits for a bottle
 */
export async function getBottleCredits(
  bottleId: string
): Promise<CustomerCredit[]> {
  const credits = await db.query.customerCredits.findMany({
    where: eq(customerCredits.bottleId, bottleId),
    orderBy: (credits, { asc }) => [asc(credits.creditNumber)],
  })
  
  return credits
}

/**
 * Get available credits for a bottle
 */
export async function getAvailableCredits(
  bottleId: string
): Promise<CustomerCredit[]> {
  const credits = await db.query.customerCredits.findMany({
    where: and(
      eq(customerCredits.bottleId, bottleId),
      eq(customerCredits.status, 'available')
    ),
    orderBy: (credits, { asc }) => [asc(credits.creditNumber)],
  })
  
  return credits
}

/**
 * Mark a credit as used
 */
export async function markCreditUsed(
  creditId: string,
  orderId: string,
  oilSelections?: string[]
): Promise<void> {
  await db.update(customerCredits)
    .set({
      status: 'used',
      usedAt: new Date(),
      usedForOrderId: orderId,
      oilSelections: oilSelections || [],
      updatedAt: new Date(),
    })
    .where(eq(customerCredits.id, creditId))
}

/**
 * Initialize credits for a new bottle
 */
export async function initializeBottleCredits(
  bottleId: string,
  customerId: string,
  totalCredits: number = 6
): Promise<CustomerCredit[]> {
  const creditsToInsert: {
    bottleId: string
    customerId: string
    creditNumber: number
    status: 'available'
  }[] = []
  
  for (let i = 1; i <= totalCredits; i++) {
    creditsToInsert.push({
      bottleId,
      customerId,
      creditNumber: i,
      status: 'available',
    })
  }
  
  const credits = await db.insert(customerCredits)
    .values(creditsToInsert)
    .returning()
  
  return credits
}

// =============================================================================
// BOTTLE STATISTICS
// =============================================================================

/**
 * Get bottle usage statistics
 */
export async function getBottleStats(
  bottleId: string
): Promise<{
  totalCredits: number
  usedCredits: number
  remainingCredits: number
  usagePercentage: number
}> {
  const bottle = await getBottleById(bottleId)
  
  if (!bottle) {
    throw new Error('Bottle not found')
  }
  
  const credits = await getBottleCredits(bottleId)
  const usedCredits = credits.filter(c => c.status === 'used').length
  
  return {
    totalCredits: bottle.totalCredits,
    usedCredits,
    remainingCredits: bottle.creditsRemaining,
    usagePercentage: Math.round((usedCredits / bottle.totalCredits) * 100),
  }
}

/**
 * Check if customer has any bottles eligible for refill
 */
export async function hasRefillableBottles(customerId: string): Promise<boolean> {
  const bottles = await getActiveBottlesWithCredits(customerId)
  return bottles.length > 0
}
