// =============================================================================
// Refill Return Workflow
// =============================================================================
// Manages the complete refill process from order creation to completion
// =============================================================================

import { db } from '@/lib/db'
import { refillOrders, RefillOrder, NewRefillOrder } from '@/lib/db/schema-refill'
import { sql, eq, desc } from 'drizzle-orm'
import { generateReturnLabel, CustomerAddress } from '@/lib/shipping/auspost'
import { checkRefillEligibility, calculateRefillPrice } from '@/lib/refill/eligibility'
import { useCredit, getBottleById } from '@/lib/refill/forever-bottle'

// =============================================================================
// TYPES
// =============================================================================

export interface RefillOrderResult {
  orderId: string
  status: string
  returnLabel?: {
    trackingNumber: string
    labelUrl: string
  }
  pricing: {
    standardPrice: number
    discountedPrice: number
    creditApplied: number
    finalPrice: number
  }
}

export interface TrackingUpdate {
  status: string
  location?: string
  timestamp: string
  description: string
}

// =============================================================================
// ORDER CREATION
// =============================================================================

/**
 * Initiate a new refill order
 */
export async function initiateRefillOrder(
  customerId: string,
  bottleId: string,
  customerAddress?: CustomerAddress
): Promise<RefillOrderResult> {
  // Get bottle details
  const bottle = await getBottleById(bottleId)
  
  if (!bottle) {
    throw new Error('Bottle not found')
  }
  
  if (bottle.customerId !== customerId) {
    throw new Error('Bottle does not belong to customer')
  }
  
  // Check eligibility
  const eligibility = await checkRefillEligibility(customerId, bottle.oilType)
  
  if (!eligibility.canRefill) {
    throw new Error(eligibility.reason || 'Not eligible for refill')
  }
  
  // Calculate pricing
  const pricing = await calculateRefillPrice(customerId)
  
  // Create order record
  const orderData: NewRefillOrder = {
    customerId,
    bottleId,
    oilType: bottle.oilType,
    status: 'pending',
    customerAddress: customerAddress || {
      name: bottle.customerName || '',
      address1: '',
      city: '',
      state: '',
      postcode: '',
      country: 'AU',
    },
    standardPrice: pricing.standardPrice.toString(),
    discountedPrice: pricing.discountedPrice.toString(),
    creditApplied: pricing.creditApplied.toString(),
    finalPrice: pricing.finalPrice.toString(),
  }
  
  const [order] = await db.insert(refillOrders)
    .values(orderData)
    .returning()
  
  return {
    orderId: order.id,
    status: order.status,
    pricing: {
      standardPrice: pricing.standardPrice,
      discountedPrice: pricing.discountedPrice,
      creditApplied: pricing.creditApplied,
      finalPrice: pricing.finalPrice,
    },
  }
}

// =============================================================================
// LABEL GENERATION
// =============================================================================

/**
 * Generate return label for an order
 */
export async function generateOrderReturnLabel(
  orderId: string,
  customerAddress: CustomerAddress
): Promise<{ trackingNumber: string; labelUrl: string }> {
  // Get the order
  const order = await db.query.refillOrders.findFirst({
    where: eq(refillOrders.id, orderId),
  })
  
  if (!order) {
    throw new Error('Order not found')
  }
  
  if (order.status !== 'pending') {
    throw new Error('Label already generated or order not in pending status')
  }
  
  // Generate label via Australia Post
  const label = await generateReturnLabel(customerAddress, order.bottleId || undefined)
  
  // Update order with label information
  await db.update(refillOrders)
    .set({
      returnLabel: {
        trackingNumber: label.trackingNumber,
        labelUrl: label.labelUrl,
        consignmentId: label.consignmentId,
        createdAt: label.createdAt,
      },
      trackingNumber: label.trackingNumber,
      trackingStatus: 'label_created',
      status: 'label_generated',
      labelGeneratedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(refillOrders.id, orderId))
  
  return {
    trackingNumber: label.trackingNumber,
    labelUrl: label.labelUrl,
  }
}

// =============================================================================
// TRACKING UPDATES - FIXED QUERY
// =============================================================================

/**
 * Update order status from tracking webhook
 * 
 * FIXED: Uses correct JSON path syntax instead of object comparison
 */
export async function updateTrackingStatus(
  trackingNumber: string,
  update: TrackingUpdate
): Promise<void> {
  // FIXED QUERY: Use SQL JSON path operator instead of object comparison
  const order = await db.query.refillOrders.findFirst({
    where: sql`${refillOrders.returnLabel}->>'trackingNumber' = ${trackingNumber}`,
  })
  
  if (!order) {
    throw new Error(`Order not found for tracking number ${trackingNumber}`)
  }
  
  // Map tracking status to order status
  let newStatus = order.status
  let trackingStatus = update.status
  
  switch (update.status.toLowerCase()) {
    case 'picked_up':
    case 'in_transit':
      newStatus = 'in_transit'
      trackingStatus = 'in_transit'
      break
    case 'out_for_delivery':
    case 'with_delivery_courier':
      trackingStatus = 'out_for_delivery'
      break
    case 'delivered':
      newStatus = 'delivered'
      trackingStatus = 'delivered'
      break
    case 'failed':
    case 'returned':
      trackingStatus = update.status.toLowerCase()
      break
  }
  
  await db.update(refillOrders)
    .set({
      status: newStatus,
      trackingStatus,
      updatedAt: new Date(),
    })
    .where(eq(refillOrders.id, order.id))
}

/**
 * Find order by tracking number
 * 
 * FIXED: Uses correct JSON path syntax
 */
export async function findOrderByTrackingNumber(
  trackingNumber: string
): Promise<RefillOrder | null> {
  // FIXED QUERY: Use SQL JSON path operator
  const order = await db.query.refillOrders.findFirst({
    where: sql`${refillOrders.returnLabel}->>'trackingNumber' = ${trackingNumber}`,
  })
  
  return order || null
}

// =============================================================================
// ORDER COMPLETION WORKFLOW
// =============================================================================

/**
 * Mark order as received
 */
export async function markOrderReceived(orderId: string): Promise<void> {
  const order = await db.query.refillOrders.findFirst({
    where: eq(refillOrders.id, orderId),
  })
  
  if (!order) {
    throw new Error('Order not found')
  }
  
  if (order.status !== 'delivered' && order.status !== 'in_transit') {
    throw new Error('Order must be in transit or delivered to mark as received')
  }
  
  await db.update(refillOrders)
    .set({
      status: 'received',
      receivedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(refillOrders.id, orderId))
}

/**
 * Record inspection results
 */
export async function recordInspection(
  orderId: string,
  result: 'passed' | 'failed',
  notes?: string
): Promise<void> {
  const order = await db.query.refillOrders.findFirst({
    where: eq(refillOrders.id, orderId),
  })
  
  if (!order) {
    throw new Error('Order not found')
  }
  
  if (order.status !== 'received') {
    throw new Error('Order must be received before inspection')
  }
  
  await db.update(refillOrders)
    .set({
      status: result === 'passed' ? 'inspected_passed' : 'inspected_failed',
      inspectionResult: result,
      inspectionNotes: notes,
      inspectedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(refillOrders.id, orderId))
}

/**
 * Complete refill order and apply credit
 */
export async function completeRefillOrder(orderId: string): Promise<void> {
  const order = await db.query.refillOrders.findFirst({
    where: eq(refillOrders.id, orderId),
  })
  
  if (!order) {
    throw new Error('Order not found')
  }
  
  if (!order.inspectionResult || order.inspectionResult !== 'passed') {
    throw new Error('Order must pass inspection before completion')
  }
  
  // Use one credit from the bottle
  if (order.bottleId) {
    await useCredit(order.bottleId)
  }
  
  await db.update(refillOrders)
    .set({
      status: 'completed',
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(refillOrders.id, orderId))
}

// =============================================================================
// ORDER QUERIES
// =============================================================================

/**
 * Get customer refill orders
 */
export async function getCustomerRefillOrders(
  customerId: string,
  limit: number = 50
): Promise<RefillOrder[]> {
  const orders = await db.query.refillOrders.findMany({
    where: eq(refillOrders.customerId, customerId),
    orderBy: [desc(refillOrders.createdAt)],
    limit,
  })
  
  return orders
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<RefillOrder | null> {
  const order = await db.query.refillOrders.findFirst({
    where: eq(refillOrders.id, orderId),
  })
  
  return order || null
}

/**
 * Get orders by status
 */
export async function getOrdersByStatus(
  status: string,
  limit: number = 100
): Promise<RefillOrder[]> {
  const orders = await db.query.refillOrders.findMany({
    where: eq(refillOrders.status, status),
    orderBy: [desc(refillOrders.createdAt)],
    limit,
  })
  
  return orders
}
