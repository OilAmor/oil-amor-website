/**
 * Oil Amor — Order Enricher
 * Scales recipes, calculates commissions, and populates order items with full data
 */

import { EnrichedOrderItem } from './types'
import { OrderCustomMix } from '@/lib/db/schema/orders'
import { db } from '@/lib/db'
import { communityBlends, blendCommissions, userBlendStats, orders } from '@/lib/db/schema-refill'
import { eq, sql } from 'drizzle-orm'

// ============================================================================
// RECIPE SCALING
// ============================================================================

export interface ScaledRecipe {
  oils: Array<{ oilName: string; ml: number; percentage: number }>
  carrierOil?: string
  carrierMl?: number
  totalVolume: number
}

export function scaleRecipe(
  originalOils: Array<{ oilName: string; ml: number; percentage: number }>,
  originalCarrierOil: string | undefined,
  originalCarrierMl: number | undefined,
  sourceVolume: number,
  targetVolume: number,
  mode: 'pure' | 'carrier'
): ScaledRecipe {
  const ratio = targetVolume / sourceVolume

  const scaledOils = originalOils.map(o => ({
    oilName: o.oilName,
    percentage: o.percentage,
    ml: Math.round(o.ml * ratio * 10) / 10, // Round to 1 decimal
  }))

  let carrierMl: number | undefined
  if (mode === 'carrier' && originalCarrierOil) {
    carrierMl = originalCarrierMl
      ? Math.round(originalCarrierMl * ratio * 10) / 10
      : Math.round((targetVolume - scaledOils.reduce((sum, o) => sum + o.ml, 0)) * 10) / 10
  }

  return {
    oils: scaledOils,
    carrierOil: originalCarrierOil,
    carrierMl,
    totalVolume: targetVolume,
  }
}

// ============================================================================
// REFILL ENRICHMENT
// ============================================================================

export async function enrichRefillItem(
  item: EnrichedOrderItem
): Promise<EnrichedOrderItem> {
  if (!item.isRefill) return item

  const { originalBatchId, originalOrderId, sourceVolume, targetVolume } = item

  // Try to find original blend data
  let originalRecipe: OrderCustomMix | null = null

  if (originalBatchId) {
    const { getBatchRecord } = await import('@/lib/batch/records')
    const batch = await getBatchRecord(originalBatchId)
    if (batch) {
      originalRecipe = {
        recipeName: batch.blendName,
        mode: batch.carrierOil ? 'carrier' : 'pure',
        oils: batch.oils.map(o => ({
          oilId: o.oilId || '',
          oilName: o.oilName,
          ml: o.ml,
          percentage: o.percentage,
        })),
        carrierOilId: batch.carrierOil,
        carrierRatio: batch.carrierPercentage,
        totalVolume: batch.size as any,
        safetyScore: batch.safetyScore || 95,
        safetyRating: 'safe',
        safetyWarnings: batch.safetyWarnings || [],
        labCertified: true,
      }
    }
  }

  if (!originalRecipe && originalOrderId) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, originalOrderId as any),
    })
    if (order) {
      const items = (order as any).items || []
      const mixItem = items.find((i: any) => i.customMix)
      if (mixItem?.customMix) {
        originalRecipe = mixItem.customMix
      }
    }
  }

  if (!originalRecipe || !sourceVolume || !targetVolume) {
    return item
  }

  const scaled = scaleRecipe(
    originalRecipe.oils,
    originalRecipe.carrierOilId,
    originalRecipe.carrierRatio ? (sourceVolume * originalRecipe.carrierRatio / 100) : undefined,
    sourceVolume,
    targetVolume,
    originalRecipe.mode
  )

  return {
    ...item,
    scaledRecipe: scaled,
    customMix: {
      name: originalRecipe.recipeName || 'Refill Blend',
      mode: originalRecipe.mode,
      totalVolume: targetVolume,
      oils: scaled.oils.map(o => ({
        oilId: '',
        oilName: o.oilName,
        ml: o.ml,
        percentage: o.percentage,
      })),
      carrierOil: scaled.carrierOil,
      carrierPercentage: originalRecipe.carrierRatio,
      carrierMl: scaled.carrierMl,
      safetyScore: originalRecipe.safetyScore,
      safetyRating: originalRecipe.safetyRating,
      safetyWarnings: originalRecipe.safetyWarnings,
      batchId: `OA-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    },
  }
}

// ============================================================================
// COMMUNITY BLEND ENRICHMENT
// ============================================================================

export async function enrichCommunityBlendItem(
  item: EnrichedOrderItem
): Promise<EnrichedOrderItem> {
  if (!item.communityBlendId) return item

  const blend = await db.query.communityBlends.findFirst({
    where: eq(communityBlends.id, item.communityBlendId as any),
  })

  if (!blend) return item

  const recipe = (blend as any).recipe || {}
  const saleAmount = item.totalPrice * 100 // Convert to cents
  const commissionRate = 10 // 10%
  const commissionAmount = Math.round(saleAmount * commissionRate / 100)

  return {
    ...item,
    communityBlendName: blend.name,
    communityBlendCreatorId: blend.creatorId,
    communityBlendCreatorName: blend.creatorName,
    commissionRate,
    commissionAmount: commissionAmount / 100, // Back to dollars for display
    customMix: recipe.oils ? {
      name: blend.name,
      mode: recipe.mode || 'pure',
      totalVolume: item.bottleSize || recipe.bottleSize || 30,
      oils: (recipe.oils || []).map((o: any) => ({
        oilId: o.oilId || '',
        oilName: o.oilName || o.name || '',
        ml: o.ml || 0,
        percentage: o.percentage || 0,
      })),
      carrierOil: recipe.carrierOilId,
      crystal: (blend as any).crystalId,
      safetyScore: 95,
      safetyRating: 'safe',
      safetyWarnings: [],
      batchId: `OA-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    } : undefined,
  }
}

// ============================================================================
// RECORD COMMISSION
// ============================================================================

export async function recordCommission(
  orderId: string,
  item: EnrichedOrderItem,
  purchaserId: string
): Promise<void> {
  if (!item.communityBlendId || !item.communityBlendCreatorId) return

  const saleAmountCents = Math.round(item.totalPrice * 100)
  const commissionRate = item.commissionRate || 10
  const commissionAmount = Math.round(saleAmountCents * commissionRate / 100)

  try {
    // Insert commission record
    await db.insert(blendCommissions).values({
      blendId: item.communityBlendId as any,
      creatorId: item.communityBlendCreatorId,
      orderId,
      purchaserId,
      saleAmount: saleAmountCents,
      commissionRate,
      commissionAmount,
      status: 'purchased',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Update creator stats
    const existingStats = await db.query.userBlendStats.findFirst({
      where: eq(userBlendStats.userId, item.communityBlendCreatorId),
    })

    if (existingStats) {
      await db.update(userBlendStats)
        .set({
          totalCommissionEarned: sql`${userBlendStats.totalCommissionEarned} + ${commissionAmount}`,
          pendingCommission: sql`${userBlendStats.pendingCommission} + ${commissionAmount}`,
          totalPurchasesOfBlends: sql`${userBlendStats.totalPurchasesOfBlends} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(userBlendStats.userId, item.communityBlendCreatorId))
    } else {
      await db.insert(userBlendStats).values({
        userId: item.communityBlendCreatorId,
        totalCommissionEarned: commissionAmount,
        pendingCommission: commissionAmount,
        totalPurchasesOfBlends: 1,
        updatedAt: new Date(),
      })
    }

    // Update blend purchase count
    await db.update(communityBlends)
      .set({
        purchaseCount: sql`${communityBlends.purchaseCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(communityBlends.id, item.communityBlendId as any))

  } catch (err) {
    console.error(`[Commission] Failed to record commission for ${orderId}:`, err)
    // Don't fail the order — commissions are best-effort
  }
}

// ============================================================================
// FULL ORDER ENRICHMENT
// ============================================================================

export async function enrichOrderItems(
  items: EnrichedOrderItem[]
): Promise<EnrichedOrderItem[]> {
  const enriched: EnrichedOrderItem[] = []

  for (const item of items) {
    let enrichedItem = item

    if (item.type === 'refill') {
      enrichedItem = await enrichRefillItem(item)
    }

    if (item.type === 'community_blend') {
      enrichedItem = await enrichCommunityBlendItem(enrichedItem)
    }

    enriched.push(enrichedItem)
  }

  return enriched
}
