/**
 * Client-Safe Inventory Helpers
 * 
 * Pure functions for checking preorder status that can be imported
 * safely in client components (no server-side DB dependencies).
 */

// Oils that are currently in stock and ship immediately
export const STOCKED_OIL_IDS = new Set([
  'tea-tree',
  'lavender',
  'jojoba',
  'lemongrass',
  'clove-bud',
  'eucalyptus',
])

export interface OrderItemForInventory {
  type?: string
  customMix?: {
    oils?: Array<{ oilId: string; ml: number; oilName?: string; name?: string }>
    totalVolume?: number
    crystalId?: string
    cordId?: string
  }
  configuration?: {
    oils?: Array<{ name: string; ml: number }>
    bottleSize?: string
    crystalName?: string
    cord?: string
  }
  attachment?: {
    cordId?: string
  }
  quantity?: number
  unlocksOilId?: string
  productId?: string
  name?: string
}

function extractOilIdFromName(name?: string): string | undefined {
  if (!name) return undefined
  const lower = name.toLowerCase()
  if (lower.includes('lavender')) return 'lavender'
  if (lower.includes('tea tree')) return 'tea-tree'
  if (lower.includes('eucalyptus')) return 'eucalyptus'
  if (lower.includes('lemongrass')) return 'lemongrass'
  if (lower.includes('clove')) return 'clove-bud'
  if (lower.includes('jojoba')) return 'jojoba'
  return undefined
}

/**
 * Check if a cart/order contains any preorder oils
 * Returns true if ANY oil in the cart is not in the stocked list
 */
export function hasPreorderItems(items: OrderItemForInventory[]): boolean {
  for (const item of items) {
    // Check custom blend oils
    const blendOils = item.customMix?.oils || item.configuration?.oils || []
    for (const oil of blendOils) {
      const oilId = (oil as any).oilId || extractOilIdFromName((oil as any).name || (oil as any).oilName)
      if (oilId && !STOCKED_OIL_IDS.has(oilId)) {
        return true
      }
    }

    // Check standard product oils
    const oilId = item.unlocksOilId || extractOilIdFromName(item.name)
    if (oilId && !STOCKED_OIL_IDS.has(oilId)) {
      return true
    }
  }

  return false
}

/**
 * Get a human-readable list of preorder oils in the cart
 */
export function getPreorderOils(items: OrderItemForInventory[]): string[] {
  const preorderOils = new Set<string>()

  for (const item of items) {
    const blendOils = item.customMix?.oils || item.configuration?.oils || []
    for (const oil of blendOils) {
      const oilId = (oil as any).oilId || extractOilIdFromName((oil as any).name || (oil as any).oilName)
      if (oilId && !STOCKED_OIL_IDS.has(oilId)) {
        preorderOils.add((oil as any).oilName || (oil as any).name || oilId)
      }
    }

    const oilId = item.unlocksOilId || extractOilIdFromName(item.name)
    if (oilId && !STOCKED_OIL_IDS.has(oilId)) {
      preorderOils.add(item.name || oilId)
    }
  }

  return Array.from(preorderOils)
}
