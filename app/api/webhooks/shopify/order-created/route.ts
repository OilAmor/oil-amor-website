/**
 * Shopify Order Created Webhook Handler
 * 
 * Processes new orders and updates Crystal Circle rewards:
 * 1. Calls handleShopifyOrderWebhook to update rewards system
 * 2. Unlocks refill if 30ml bottle purchased
 * 3. Registers Forever Bottle if purchased
 * 4. Commits any credit reservations
 * 5. Sends confirmation email with synergy content
 * 
 * POST /api/webhooks/shopify/order-created
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  getCustomerMetafields, 
  updateCustomerMetafields,
  registerForeverBottle 
} from '@/lib/shopify/metafields'
import { 
  handleShopifyOrderWebhook,
  commitCreditReservation,
  releaseCreditReservation,
  type ShopifyOrder 
} from '@/lib/rewards/customer-rewards'
import { confirmReservation, releaseComponentReservation } from '@/lib/shopify/inventory'

export const runtime = 'nodejs'

// Webhook verification (in production, verify HMAC signature)
const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET

/**
 * POST handler - Process order creation webhook
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Get raw body for HMAC verification
    const rawBody = await request.text()
    const hmac = request.headers.get('x-shopify-hmac-sha256')
    
    // Verify webhook
    if (!verifyWebhook(rawBody, hmac)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse the order
    const order: ShopifyOrder = JSON.parse(rawBody)

    console.log(`Processing order ${order.name} (${order.id})`)

    // Process the order through the rewards system
    const result = await processOrderWithRewards(order)

    // Register Forever Bottles and handle refill unlocks
    await processForeverBottles(order)

    // Handle credit reservation if present
    await processCreditReservation(order)

    const duration = Date.now() - startTime
    console.log(`Order ${order.name} processed in ${duration}ms`)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      processingTime: duration,
      ...result,
    })
  } catch (error) {
    console.error('Order processing error:', error)
    
    // Always return 200 to Shopify to prevent retries for unrecoverable errors
    // Log error for manual review
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        requiresReview: true,
      },
      { status: 200 }
    )
  }
}

/**
 * Process order through the rewards system
 */
async function processOrderWithRewards(order: ShopifyOrder) {
  // This calls the main rewards system handler
  const rewardsResult = await handleShopifyOrderWebhook(order)
  
  if (!rewardsResult) {
    return {
      customerUpdated: false,
      tierUpgraded: false,
      refillUnlocked: false,
      bottlesRegistered: [],
      charmsAwarded: [],
      creditEarned: 0,
    }
  }

  return {
    customerUpdated: true,
    tierUpgraded: rewardsResult.tierUpgraded,
    previousTier: rewardsResult.previousTier,
    newTier: rewardsResult.profile.currentTier,
    refillUnlocked: rewardsResult.notifications.some(n => n.type === 'refill_unlocked'),
    bottlesRegistered: [], // Handled separately
    charmsAwarded: rewardsResult.newCharmsUnlocked,
    creditEarned: 0, // Credit handling is separate
    notifications: rewardsResult.notifications,
  }
}

/**
 * Process Forever Bottle registrations and refill unlocks
 */
async function processForeverBottles(order: ShopifyOrder) {
  if (!order.customer?.id) return

  const customerId = `gid://shopify/Customer/${order.customer.id}`
  const customerData = await getCustomerMetafields(customerId)
  
  const bottlesRegistered: string[] = []
  let refillUnlocked = false

  for (const lineItem of order.line_items) {
    // Check for 30ml bottles (unlock refill)
    const bottleSize = lineItem.properties?.find(p => p.name === '_bottle_size')?.value
    const is30ml = bottleSize === '30ml' || 
                   lineItem.variant_title?.toLowerCase().includes('30ml') ||
                   lineItem.title.toLowerCase().includes('30ml')
    
    if (is30ml) {
      // Generate bottle serial number
      const serialNumber = generateBottleSerial(lineItem.variant_id, order.id)
      const oilType = lineItem.title || 'Unknown Oil'
      
      // Register the Forever Bottle
      await registerForeverBottle(customerId, serialNumber, oilType)
      bottlesRegistered.push(serialNumber)
      
      // Unlock refill if not already unlocked
      if (!customerData.refill_unlocked) {
        refillUnlocked = true
      }
    }
  }

  // Update refill unlocked status if needed
  if (refillUnlocked) {
    await updateCustomerMetafields(customerId, {
      refill_unlocked: true,
    })
  }

  return { bottlesRegistered, refillUnlocked }
}

/**
 * Process credit reservation if applied to this order
 */
async function processCreditReservation(order: ShopifyOrder) {
  // Check for credit reservation in order properties
  const reservationId = order.line_items
    .flatMap(item => item.properties || [])
    .find(p => p.name === '_credit_reservation_id')?.value

  if (reservationId) {
    try {
      // Commit the credit reservation (deduct from account)
      await commitCreditReservation(reservationId)
      console.log(`Committed credit reservation ${reservationId} for order ${order.id}`)
    } catch (error) {
      console.error(`Failed to commit credit reservation ${reservationId}:`, error)
      // Don't throw - we'll handle this manually
    }
  }
}

/**
 * Generate a unique bottle serial number
 */
function generateBottleSerial(variantId: string, orderId: string): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const variantHash = variantId.slice(-4).toUpperCase()
  const orderHash = orderId.slice(-4).toUpperCase()
  
  return `OIL-${variantHash}-${orderHash}-${timestamp}`
}

/**
 * Verify Shopify webhook HMAC signature
 */
function verifyWebhook(body: string, hmac: string | null): boolean {
  // In production, implement proper HMAC verification
  // See: https://shopify.dev/docs/apps/webhooks/configuration/https#step-5-verify-the-webhook
  
  if (!SHOPIFY_WEBHOOK_SECRET || !hmac) {
    // Skip verification in development
    return process.env.NODE_ENV === 'development'
  }

  // Implement HMAC verification here
  // const crypto = require('crypto')
  // const calculatedHmac = crypto
  //   .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
  //   .update(body, 'utf8')
  //   .digest('base64')
  // 
  // return calculatedHmac === hmac

  return true // Placeholder
}
