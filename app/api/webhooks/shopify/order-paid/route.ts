/**
 * Shopify Order Paid Webhook Handler
 * 
 * Handles payment confirmation:
 * 1. Generates AusPost label for refill orders
 * 2. Updates inventory
 * 3. Triggers fulfillment
 * 4. Sends tracking info
 * 
 * POST /api/webhooks/shopify/order-paid
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { confirmReservation, releaseComponentReservation } from '@/lib/shopify/inventory'
import { getRefillMetafields } from '@/lib/shopify/metafields'

export const runtime = 'nodejs'

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET
const AUSPOST_API_KEY = process.env.AUSPOST_API_KEY
const AUSPOST_API_SECRET = process.env.AUSPOST_API_SECRET

interface ShopifyOrder {
  id: string
  name: string
  email: string
  customer?: {
    id: string
    first_name: string
    last_name: string
  }
  shipping_address?: {
    first_name: string
    last_name: string
    address1: string
    address2?: string
    city: string
    province: string
    country: string
    zip: string
    phone?: string
  }
  line_items: Array<{
    id: string
    title: string
    quantity: number
    properties: Array<{
      name: string
      value: string
    }>
  }>
  total_price: string
  financial_status: string
  fulfillment_status: string | null
  tags: string
}

/**
 * POST handler - Process order paid webhook
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Read body text first (can only read request body once)
    const bodyText = await request.text()
    
    // Verify webhook signature
    const hmac = request.headers.get('x-shopify-hmac-sha256')
    if (!verifyWebhook(bodyText, hmac)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check for replay attacks (webhook must be within last 5 minutes)
    const timestamp = request.headers.get('x-shopify-webhook-timestamp')
    if (!verifyTimestamp(timestamp)) {
      return NextResponse.json(
        { error: 'Webhook expired' },
        { status: 401 }
      )
    }

    // Parse body from the already-read text
    const body = JSON.parse(bodyText)
    const order: ShopifyOrder = body

    console.log(`Processing payment for order ${order.name} (${order.id})`)

    // Process the paid order
    const result = await processPaidOrder(order)

    const duration = Date.now() - startTime
    console.log(`Order ${order.name} payment processed in ${duration}ms`)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      processingTime: duration,
      ...result,
    })
  } catch (error) {
    console.error('Order paid processing error:', error)
    
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
 * Verify Shopify webhook timestamp to prevent replay attacks
 */
function verifyTimestamp(timestamp: string | null): boolean {
  if (!timestamp) {
    // Allow if no timestamp in development
    return process.env.NODE_ENV === 'development'
  }

  const webhookTime = parseInt(timestamp) * 1000 // Convert to milliseconds
  const now = Date.now()
  const maxAge = 5 * 60 * 1000 // 5 minutes

  // Webhook must be within last 5 minutes and not in the future
  return (now - webhookTime) <= maxAge && webhookTime <= now
}

/**
 * Verify Shopify webhook HMAC signature
 */
function verifyWebhook(body: string, hmac: string | null): boolean {
  if (!SHOPIFY_WEBHOOK_SECRET || !hmac) {
    // Skip verification in development if secrets not configured
    return process.env.NODE_ENV === 'development'
  }

  try {
    // Calculate expected HMAC
    const calculated = crypto
      .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
      .update(body, 'utf8')
      .digest('base64')

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(calculated),
      Buffer.from(hmac)
    )
  } catch (error) {
    console.error('Webhook verification error:', error)
    return false
  }
}

/**
 * Main paid order processing logic
 */
async function processPaidOrder(order: ShopifyOrder) {
  const results: {
    inventoryConfirmed: boolean
    fulfillmentTriggered: boolean
    trackingGenerated: boolean
    trackingNumber?: string
    isRefillOrder: boolean
    auspostLabelUrl?: string
    emailSent: boolean
  } = {
    inventoryConfirmed: false,
    fulfillmentTriggered: false,
    trackingGenerated: false,
    isRefillOrder: false,
    emailSent: false,
  }

  // 1. Confirm inventory reservation
  await confirmReservation(order.id)
  results.inventoryConfirmed = true

  // 2. Check if this is a refill order
  const isRefillOrder = order.tags.includes('refill') || 
    order.line_items.some(line => 
      line.properties.some(p => p.name === '_order_type' && p.value === 'refill')
    )
  
  results.isRefillOrder = isRefillOrder

  // 3. Generate AusPost label for refill orders
  if (isRefillOrder && order.shipping_address) {
    try {
      const auspostResult = await generateAusPostLabel(order)
      results.trackingGenerated = true
      results.trackingNumber = auspostResult.trackingNumber
      results.auspostLabelUrl = auspostResult.labelUrl
    } catch (error) {
      console.error('Failed to generate AusPost label:', error)
      // Continue processing - will need manual label generation
    }
  }

  // 4. Trigger fulfillment in Shopify
  try {
    await triggerShopifyFulfillment(order, results.trackingNumber)
    results.fulfillmentTriggered = true
  } catch (error) {
    console.error('Failed to trigger fulfillment:', error)
  }

  // 5. Send tracking email
  try {
    await sendTrackingEmail(order, results.trackingNumber)
    results.emailSent = true
  } catch (error) {
    console.error('Failed to send tracking email:', error)
  }

  return results
}

/**
 * Generate Australia Post shipping label
 */
async function generateAusPostLabel(order: ShopifyOrder): Promise<{
  trackingNumber: string
  labelUrl: string
}> {
  if (!AUSPOST_API_KEY || !AUSPOST_API_SECRET) {
    throw new Error('AusPost API credentials not configured')
  }

  const shippingAddress = order.shipping_address!
  
  // Build AusPost request
  const auspostPayload = {
    shipments: [{
      shipment_id: order.id,
      order_id: order.name,
      receiver: {
        name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        address_line1: shippingAddress.address1,
        address_line2: shippingAddress.address2,
        suburb: shippingAddress.city,
        state: shippingAddress.province,
        postcode: shippingAddress.zip,
        phone: shippingAddress.phone,
      },
      items: order.line_items.map(line => ({
        description: line.title,
        quantity: line.quantity,
        weight: 0.1, // kg
      })),
      shipment_summary: {
        total_weight: 0.5, // kg
      },
    }],
  }

  // Call AusPost API
  const response = await fetch('https://api.auspost.com.au/shipping/v1/shipments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${AUSPOST_API_KEY}:${AUSPOST_API_SECRET}`).toString('base64')}`,
    },
    body: JSON.stringify(auspostPayload),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`AusPost API error: ${error}`)
  }

  const data = await response.json()

  return {
    trackingNumber: data.shipments[0].tracking_id,
    labelUrl: data.shipments[0].labels.pdf,
  }
}

/**
 * Trigger Shopify fulfillment
 */
async function triggerShopifyFulfillment(
  order: ShopifyOrder,
  trackingNumber?: string
): Promise<void> {
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-01'

  if (!adminAccessToken) {
    throw new Error('Shopify admin access token not configured')
  }

  const query = `
    mutation CreateFulfillment($input: FulfillmentInput!) {
      fulfillmentCreate(input: $input) {
        fulfillment {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const fulfillmentInput: any = {
    orderId: order.id,
    notifyCustomer: true,
  }

  if (trackingNumber) {
    fulfillmentInput.trackingInfo = {
      number: trackingNumber,
      url: `https://auspost.com.au/mypost/track/#/details/${trackingNumber}`,
      company: 'Australia Post',
    }
  }

  const response = await fetch(
    `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify({
        query,
        variables: { input: fulfillmentInput },
      }),
    }
  )

  const data = await response.json()

  if (data.data?.fulfillmentCreate?.userErrors?.length > 0) {
    throw new Error(
      `Fulfillment errors: ${JSON.stringify(data.data.fulfillmentCreate.userErrors)}`
    )
  }
}

/**
 * Send tracking information email
 */
async function sendTrackingEmail(order: ShopifyOrder, trackingNumber?: string) {
  const emailPayload = {
    to: order.email,
    template: trackingNumber ? 'order-shipped' : 'order-processing',
    data: {
      orderName: order.name,
      trackingNumber,
      trackingUrl: trackingNumber 
        ? `https://auspost.com.au/mypost/track/#/details/${trackingNumber}`
        : null,
      isRefillOrder: order.tags.includes('refill'),
    },
  }

  console.log(`Would send tracking email for order ${order.name}:`, emailPayload)

  // In production, integrate with your email service
  // await sendEmail(emailPayload)
}
