/**
 * Oil Amor Component Inventory Management
 * Tracks and manages inventory for crystals, cords, charms, and bottles
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client'
import { BottleSize } from './cart-transformer'

// ========================================
// Types & Interfaces
// ========================================

export interface ComponentInventory {
  crystals: Record<string, number> // crystal slug → count
  cords: Record<string, number>
  charms: Record<string, number>
  bottles: Record<string, number> // size → count
}

export interface InventoryReservation {
  orderId: string
  items: Array<{
    type: 'crystal' | 'cord' | 'charm' | 'bottle'
    sku: string
    quantity: number
  }>
  reservedAt: Date
  expiresAt: Date
  status: 'pending' | 'confirmed' | 'released'
}

export interface AvailabilityCheck {
  available: boolean
  missingComponents: string[]
  availableQuantities: Record<string, number>
}

// ========================================
// Component SKUs Configuration
// ========================================

export const COMPONENT_SKUS = {
  crystals: {
    amethyst: 'CRYSTAL-AMETHYST',
    'rose-quartz': 'CRYSTAL-ROSE-QTZ',
    'clear-quartz': 'CRYSTAL-CLEAR-QTZ',
    citrine: 'CRYSTAL-CITRINE',
    'black-tourmaline': 'CRYSTAL-BLK-TRML',
    carnelian: 'CRYSTAL-CARNELIAN',
    aventurine: 'CRYSTAL-AVENTURINE',
    sodalite: 'CRYSTAL-SODALITE',
    moonstone: 'CRYSTAL-MOONSTN',
    labradorite: 'CRYSTAL-LABRADO',
    lapis: 'CRYSTAL-LAPIS',
    'tiger-eye': 'CRYSTAL-TIGER-EYE',
  },
  cords: {
    'waxed-cotton': 'CORD-WAX-COTTON',
    hemp: 'CORD-HEMP',
    silk: 'CORD-SILK',
    leather: 'CORD-LEATHER',
    'gold-chain': 'CORD-GLD-CHAIN',
    'silver-chain': 'CORD-SLV-CHAIN',
    'rose-gold-chain': 'CORD-RSGLD-CHAIN',
  },
  charms: {
    'crescent-moon': 'CHARM-CRESCENT',
    sun: 'CHARM-SUN',
    stars: 'CHARM-STARS',
    'tree-of-life': 'CHARM-TREE',
    lotus: 'CHARM-LOTUS',
    om: 'CHARM-OM',
    hamsa: 'CHARM-HAMSA',
    evil_eye: 'CHARM-EVIL-EYE',
  },
  bottles: {
    '5ml': 'BOTTLE-5ML',
    '10ml': 'BOTTLE-10ML',
    '15ml': 'BOTTLE-15ML',
    '20ml': 'BOTTLE-20ML',
    '30ml': 'BOTTLE-30ML',
  },
} as const

// ========================================
// In-Memory Reservation Store
// In production, use Redis or database
// ========================================

const reservations = new Map<string, InventoryReservation>()

// ========================================
// Shopify Client
// ========================================

const adminClient = {
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN || '',
  apiVersion: process.env.SHOPIFY_ADMIN_API_VERSION || '2024-01',
  accessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
}

// ========================================
// Inventory Check Functions
// ========================================

/**
 * Check if all components are available for a configuration
 */
export async function checkComponentAvailability(configuration: {
  crystalType: string
  crystalCount: number
  accessory: {
    type: 'cord' | 'charm' | 'extra-crystals'
    cordType?: string
    charmType?: string
    extraCrystalCount?: number
  }
  bottleSize: BottleSize
}): Promise<AvailabilityCheck> {
  const missingComponents: string[] = []
  const availableQuantities: Record<string, number> = {}

  // Check crystal availability
  const crystalSku = COMPONENT_SKUS.crystals[configuration.crystalType as keyof typeof COMPONENT_SKUS.crystals]
  if (crystalSku) {
    const crystalQty = await getInventoryQuantity(crystalSku)
    const totalCrystalsNeeded = configuration.crystalCount + 
      (configuration.accessory.type === 'extra-crystals' ? (configuration.accessory.extraCrystalCount || 0) : 0)
    
    availableQuantities[crystalSku] = crystalQty
    
    if (crystalQty < totalCrystalsNeeded) {
      missingComponents.push(
        `${configuration.crystalType} (need ${totalCrystalsNeeded}, have ${crystalQty})`
      )
    }
  } else {
    missingComponents.push(`Unknown crystal type: ${configuration.crystalType}`)
  }

  // Check cord availability
  if (configuration.accessory.type === 'cord' && configuration.accessory.cordType) {
    const cordSku = COMPONENT_SKUS.cords[configuration.accessory.cordType as keyof typeof COMPONENT_SKUS.cords]
    if (cordSku) {
      const cordQty = await getInventoryQuantity(cordSku)
      availableQuantities[cordSku] = cordQty
      
      if (cordQty < 1) {
        missingComponents.push(`${configuration.accessory.cordType} cord (out of stock)`)
      }
    } else {
      missingComponents.push(`Unknown cord type: ${configuration.accessory.cordType}`)
    }
  }

  // Check charm availability
  if (configuration.accessory.type === 'charm' && configuration.accessory.charmType) {
    const charmSku = COMPONENT_SKUS.charms[configuration.accessory.charmType as keyof typeof COMPONENT_SKUS.charms]
    if (charmSku) {
      const charmQty = await getInventoryQuantity(charmSku)
      availableQuantities[charmSku] = charmQty
      
      if (charmQty < 1) {
        missingComponents.push(`${configuration.accessory.charmType} charm (out of stock)`)
      }
    } else {
      missingComponents.push(`Unknown charm type: ${configuration.accessory.charmType}`)
    }
  }

  // Check bottle availability
  const bottleSku = COMPONENT_SKUS.bottles[configuration.bottleSize]
  if (bottleSku) {
    const bottleQty = await getInventoryQuantity(bottleSku)
    availableQuantities[bottleSku] = bottleQty
    
    if (bottleQty < 1) {
      missingComponents.push(`${configuration.bottleSize} bottle (out of stock)`)
    }
  } else {
    missingComponents.push(`Unknown bottle size: ${configuration.bottleSize}`)
  }

  return {
    available: missingComponents.length === 0,
    missingComponents,
    availableQuantities,
  }
}

/**
 * Get inventory quantity for a SKU from Shopify
 */
async function getInventoryQuantity(sku: string): Promise<number> {
  const query = `
    query GetInventory($sku: String!) {
      productVariants(first: 1, query: $sku) {
        edges {
          node {
            inventoryQuantity
            inventoryItem {
              id
              tracked
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch(
      `https://${adminClient.storeDomain}/admin/api/${adminClient.apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminClient.accessToken,
        },
        body: JSON.stringify({
          query,
          variables: { sku: `sku:${sku}` },
        }),
      }
    )

    const data = await response.json()
    const variant = data.data?.productVariants?.edges?.[0]?.node

    if (!variant) {
      console.warn(`Product variant not found for SKU: ${sku}`)
      return 0
    }

    // If not tracked, assume unlimited availability
    if (!variant.inventoryItem?.tracked) {
      return 9999
    }

    return variant.inventoryQuantity || 0
  } catch (error) {
    console.error(`Error fetching inventory for ${sku}:`, error)
    return 0
  }
}

// ========================================
// Reservation Functions
// ========================================

/**
 * Reserve components for an order
 * Prevents overselling during checkout process
 */
export async function reserveComponents(
  configuration: {
    crystalType: string
    crystalCount: number
    accessory: {
      type: 'cord' | 'charm' | 'extra-crystals'
      cordType?: string
      charmType?: string
      extraCrystalCount?: number
    }
    bottleSize: BottleSize
  },
  orderId: string,
  expiresInMinutes: number = 30
): Promise<void> {
  // First check availability
  const availability = await checkComponentAvailability(configuration)
  
  if (!availability.available) {
    throw new Error(
      `Cannot reserve components. Missing: ${availability.missingComponents.join(', ')}`
    )
  }

  const items: InventoryReservation['items'] = []

  // Reserve crystals
  const crystalSku = COMPONENT_SKUS.crystals[configuration.crystalType as keyof typeof COMPONENT_SKUS.crystals]
  if (crystalSku) {
    items.push({
      type: 'crystal',
      sku: crystalSku,
      quantity: configuration.crystalCount,
    })
  }

  // Reserve extra crystals if applicable
  if (configuration.accessory.type === 'extra-crystals' && configuration.accessory.extraCrystalCount) {
    if (crystalSku) {
      items.push({
        type: 'crystal',
        sku: crystalSku,
        quantity: configuration.accessory.extraCrystalCount,
      })
    }
  }

  // Reserve cord
  if (configuration.accessory.type === 'cord' && configuration.accessory.cordType) {
    const cordSku = COMPONENT_SKUS.cords[configuration.accessory.cordType as keyof typeof COMPONENT_SKUS.cords]
    if (cordSku) {
      items.push({
        type: 'cord',
        sku: cordSku,
        quantity: 1,
      })
    }
  }

  // Reserve charm
  if (configuration.accessory.type === 'charm' && configuration.accessory.charmType) {
    const charmSku = COMPONENT_SKUS.charms[configuration.accessory.charmType as keyof typeof COMPONENT_SKUS.charms]
    if (charmSku) {
      items.push({
        type: 'charm',
        sku: charmSku,
        quantity: 1,
      })
    }
  }

  // Reserve bottle
  const bottleSku = COMPONENT_SKUS.bottles[configuration.bottleSize]
  if (bottleSku) {
    items.push({
      type: 'bottle',
      sku: bottleSku,
      quantity: 1,
    })
  }

  const reservation: InventoryReservation = {
    orderId,
    items,
    reservedAt: new Date(),
    expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
    status: 'pending',
  }

  reservations.set(orderId, reservation)

  // In production, also update Shopify inventory levels
  await adjustInventoryLevels(items, 'reserve')
}

/**
 * Confirm a reservation (when order is paid)
 */
export async function confirmReservation(orderId: string): Promise<void> {
  const reservation = reservations.get(orderId)
  
  if (!reservation) {
    console.warn(`No reservation found for order: ${orderId}`)
    return
  }

  reservation.status = 'confirmed'
  reservations.set(orderId, reservation)

  // In production, permanently deduct from inventory
  console.log(`Reservation confirmed for order: ${orderId}`)
}

/**
 * Release a reservation (when order is cancelled or expires)
 */
export async function releaseComponentReservation(orderId: string): Promise<void> {
  const reservation = reservations.get(orderId)
  
  if (!reservation) {
    return
  }

  // Return inventory to available pool
  await adjustInventoryLevels(reservation.items, 'release')

  reservation.status = 'released'
  reservations.delete(orderId)

  console.log(`Reservation released for order: ${orderId}`)
}

/**
 * Adjust inventory levels in Shopify
 */
async function adjustInventoryLevels(
  items: InventoryReservation['items'],
  action: 'reserve' | 'release'
): Promise<void> {
  const adjustment = action === 'reserve' ? -1 : 1

  for (const item of items) {
    try {
      // Get inventory item ID from SKU
      const inventoryItemId = await getInventoryItemId(item.sku)
      
      if (!inventoryItemId) {
        console.warn(`Inventory item not found for SKU: ${item.sku}`)
        continue
      }

      // Adjust inventory quantity
      await adjustInventoryItemQuantity(
        inventoryItemId,
        item.quantity * adjustment
      )
    } catch (error) {
      console.error(`Failed to adjust inventory for ${item.sku}:`, error)
    }
  }
}

/**
 * Get inventory item ID from SKU
 */
async function getInventoryItemId(sku: string): Promise<string | null> {
  const query = `
    query GetInventoryItem($sku: String!) {
      productVariants(first: 1, query: $sku) {
        edges {
          node {
            inventoryItem {
              id
            }
          }
        }
      }
    }
  `

  const response = await fetch(
    `https://${adminClient.storeDomain}/admin/api/${adminClient.apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminClient.accessToken,
      },
      body: JSON.stringify({
        query,
        variables: { sku: `sku:${sku}` },
      }),
    }
  )

  const data = await response.json()
  return data.data?.productVariants?.edges?.[0]?.node?.inventoryItem?.id || null
}

/**
 * Adjust inventory item quantity
 */
async function adjustInventoryItemQuantity(
  inventoryItemId: string,
  adjustment: number
): Promise<void> {
  // Get location ID
  const locationId = process.env.SHOPIFY_LOCATION_ID
  
  if (!locationId) {
    console.warn('SHOPIFY_LOCATION_ID not set, skipping inventory adjustment')
    return
  }

  const query = `
    mutation InventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
      inventoryAdjustQuantities(input: $input) {
        inventoryAdjustmentGroup {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const response = await fetch(
    `https://${adminClient.storeDomain}/admin/api/${adminClient.apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminClient.accessToken,
      },
      body: JSON.stringify({
        query,
        variables: {
          input: {
            reason: 'correction',
            changes: [
              {
                inventoryItemId,
                locationId: `gid://shopify/Location/${locationId}`,
                delta: adjustment,
              },
            ],
          },
        },
      }),
    }
  )

  const data = await response.json()

  if (data.data?.inventoryAdjustQuantities?.userErrors?.length > 0) {
    console.error(
      'Inventory adjustment errors:',
      data.data.inventoryAdjustQuantities.userErrors
    )
  }
}

// ========================================
// Inventory Management Functions
// ========================================

/**
 * Get current inventory levels for all components
 */
export async function getFullInventory(): Promise<ComponentInventory> {
  const inventory: ComponentInventory = {
    crystals: {},
    cords: {},
    charms: {},
    bottles: {},
  }

  // Get crystal inventory
  for (const [slug, sku] of Object.entries(COMPONENT_SKUS.crystals)) {
    inventory.crystals[slug] = await getInventoryQuantity(sku)
  }

  // Get cord inventory
  for (const [slug, sku] of Object.entries(COMPONENT_SKUS.cords)) {
    inventory.cords[slug] = await getInventoryQuantity(sku)
  }

  // Get charm inventory
  for (const [slug, sku] of Object.entries(COMPONENT_SKUS.charms)) {
    inventory.charms[slug] = await getInventoryQuantity(sku)
  }

  // Get bottle inventory
  for (const [size, sku] of Object.entries(COMPONENT_SKUS.bottles)) {
    inventory.bottles[size] = await getInventoryQuantity(sku)
  }

  return inventory
}

/**
 * Check for low inventory alerts
 */
export async function checkLowInventory(
  thresholds: {
    crystals: number
    cords: number
    charms: number
    bottles: number
  } = {
    crystals: 50,
    cords: 20,
    charms: 15,
    bottles: 30,
  }
): Promise<Array<{
  sku: string
  type: string
  currentQuantity: number
  threshold: number
}>> {
  const lowInventory: Array<{
    sku: string
    type: string
    currentQuantity: number
    threshold: number
  }> = []

  const fullInventory = await getFullInventory()

  // Check crystals
  for (const [slug, qty] of Object.entries(fullInventory.crystals)) {
    if (qty < thresholds.crystals) {
      lowInventory.push({
        sku: COMPONENT_SKUS.crystals[slug as keyof typeof COMPONENT_SKUS.crystals],
        type: 'crystal',
        currentQuantity: qty,
        threshold: thresholds.crystals,
      })
    }
  }

  // Check cords
  for (const [slug, qty] of Object.entries(fullInventory.cords)) {
    if (qty < thresholds.cords) {
      lowInventory.push({
        sku: COMPONENT_SKUS.cords[slug as keyof typeof COMPONENT_SKUS.cords],
        type: 'cord',
        currentQuantity: qty,
        threshold: thresholds.cords,
      })
    }
  }

  // Check charms
  for (const [slug, qty] of Object.entries(fullInventory.charms)) {
    if (qty < thresholds.charms) {
      lowInventory.push({
        sku: COMPONENT_SKUS.charms[slug as keyof typeof COMPONENT_SKUS.charms],
        type: 'charm',
        currentQuantity: qty,
        threshold: thresholds.charms,
      })
    }
  }

  // Check bottles
  for (const [size, qty] of Object.entries(fullInventory.bottles)) {
    if (qty < thresholds.bottles) {
      lowInventory.push({
        sku: COMPONENT_SKUS.bottles[size as keyof typeof COMPONENT_SKUS.bottles],
        type: 'bottle',
        currentQuantity: qty,
        threshold: thresholds.bottles,
      })
    }
  }

  return lowInventory
}

/**
 * Clean up expired reservations
 * Should be called periodically (e.g., via cron job)
 */
export function cleanupExpiredReservations(): string[] {
  const now = new Date()
  const cleanedUp: string[] = []

  for (const [orderId, reservation] of reservations.entries()) {
    if (reservation.status === 'pending' && reservation.expiresAt < now) {
      // Release the reservation
      releaseComponentReservation(orderId)
      cleanedUp.push(orderId)
    }
  }

  return cleanedUp
}

/**
 * Get active reservations
 */
export function getActiveReservations(): InventoryReservation[] {
  return Array.from(reservations.values()).filter(
    r => r.status === 'pending' || r.status === 'confirmed'
  )
}

/**
 * Bulk update inventory levels
 * Useful for syncing with external inventory management system
 */
export async function bulkUpdateInventory(
  updates: Array<{
    sku: string
    newQuantity: number
  }>
): Promise<void> {
  for (const update of updates) {
    const inventoryItemId = await getInventoryItemId(update.sku)
    
    if (!inventoryItemId) {
      console.warn(`Inventory item not found for SKU: ${update.sku}`)
      continue
    }

    // Get current quantity
    const currentQty = await getInventoryQuantity(update.sku)
    const adjustment = update.newQuantity - currentQty

    if (adjustment !== 0) {
      await adjustInventoryItemQuantity(inventoryItemId, adjustment)
    }
  }
}
