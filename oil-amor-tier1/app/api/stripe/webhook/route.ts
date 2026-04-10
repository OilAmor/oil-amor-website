/**
 * Stripe Webhook Handler
 * Processes Stripe events for order fulfillment
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/config'
import { db } from '@/lib/db'
import { orders, unlockedOils, customers } from '@/lib/db/schema-refill'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

// Stripe webhook secret
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

// ============================================================================
// POST /api/stripe/webhook - Handle Stripe events
// ============================================================================

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const signature = request.headers.get('stripe-signature')
  
  if (!signature || !endpointSecret) {
    console.error('Missing Stripe signature or webhook secret')
    return NextResponse.json(
      { error: 'Webhook configuration error' },
      { status: 500 }
    )
  }
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }
  
  console.log(`Processing Stripe event: ${event.type}`)
  
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session)
        break
        
      case 'checkout.session.async_payment_succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.Checkout.Session)
        break
        
      case 'checkout.session.async_payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.Checkout.Session)
        break
        
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break
        
      case 'invoice.payment_succeeded':
        // Handle subscription invoices if needed
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// ============================================================================
// Event Handlers
// ============================================================================

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { orderId, customerId, subtotal, shipping, tax, itemCount } = session.metadata || {}
  
  if (!orderId) {
    console.error('No orderId in session metadata')
    return
  }
  
  console.log(`Processing completed checkout for order: ${orderId}`)
  
  // Check if order already exists
  const existingOrder = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  })
  
  if (existingOrder) {
    console.log(`Order ${orderId} already exists, updating status`)
    
    // Update order status
    const currentPayment = (existingOrder.payment as any) || {}
    await db.update(orders)
      .set({
        status: 'confirmed',
        statusHistory: [
          ...(existingOrder.statusHistory || []),
          {
            status: 'confirmed',
            timestamp: new Date().toISOString(),
            note: 'Payment confirmed via Stripe',
          },
        ],
        payment: {
          ...currentPayment,
          status: 'captured',
          paidAt: new Date().toISOString(),
          transactionId: session.payment_intent as string,
        },
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
    
    return
  }
  
  // Order doesn't exist - create it (shouldn't happen normally)
  console.warn(`Order ${orderId} not found in database, creating from webhook`)
  
  // Extract items from session
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
  
  const orderItems = lineItems.data
    .filter(item => item.description !== 'Shipping' && item.description !== 'GST (10%)')
    .map(item => ({
      id: `line_${nanoid(8)}`,
      type: 'standard-oil' as const,
      name: item.description || 'Unknown Item',
      unitPrice: item.amount_total || 0,
      quantity: item.quantity || 1,
      subtotal: item.amount_subtotal || 0,
      taxAmount: 0,
      total: item.amount_total || 0,
    }))
  
  const now = new Date()
  
  // Create order
  await db.insert(orders).values({
    id: orderId,
    customerId: customerId || 'guest',
    customerEmail: session.customer_email || 'guest@oilamor.com',
    customerName: session.customer_details?.name || 'Guest',
    isGuest: customerId === 'guest' || !customerId,
    
    status: 'confirmed',
    statusHistory: [{
      status: 'confirmed',
      timestamp: now.toISOString(),
      note: 'Payment confirmed via Stripe webhook',
    }],
    
    items: orderItems,
    
    subtotal: parseInt(subtotal || '0'),
    taxTotal: parseInt(tax || '0'),
    shippingTotal: parseInt(shipping || '0'),
    discountTotal: 0,
    total: session.amount_total || 0,
    
    currency: 'AUD',
    
    payment: {
      method: 'credit-card',
      status: 'captured',
      paidAt: now.toISOString(),
      transactionId: session.payment_intent as string,
    },
    
    shippingAddress: {
      firstName: (session as any).shipping_details?.name?.split(' ')[0] || '',
      lastName: (session as any).shipping_details?.name?.split(' ').slice(1).join(' ') || '',
      address1: (session as any).shipping_details?.address?.line1 || '',
      address2: (session as any).shipping_details?.address?.line2 || undefined,
      city: (session as any).shipping_details?.address?.city || '',
      province: (session as any).shipping_details?.address?.state || '',
      country: (session as any).shipping_details?.address?.country || 'AU',
      zip: (session as any).shipping_details?.address?.postal_code || '',
      phone: session.customer_details?.phone || undefined,
    },
    
    shipping: {
      carrier: 'auspost',
      service: 'standard',
      cost: parseInt(shipping || '0') / 100,
    },
    
    isGift: session.metadata?.isGift === 'true',
    giftMessage: session.metadata?.giftMessage,
    
    requiresBlending: false,
    eligibleForReturns: parseInt(itemCount || '0') >= 1,
    
    createdAt: now,
    updatedAt: now,
  })
  
  // Unlock oils for registered customers
  if (customerId && customerId !== 'guest') {
    for (const item of orderItems) {
      // Extract oilId from metadata if available
      const oilId = (item as any).metadata?.oilId
      if (oilId) {
        const existing = await db.query.unlockedOils.findFirst({
          where: eq(unlockedOils.oilId, oilId),
        })
        
        if (!existing) {
          await db.insert(unlockedOils).values({
            id: `unlock_${nanoid(8)}`,
            customerId,
            oilId,
            unlockedAt: now,
            unlockedBy: orderId,
            type: 'pure',
            createdAt: now,
          })
        }
      }
    }
    
    // Update customer metadata
    const customer = await db.query.customers.findFirst({
      where: eq(customers.id, customerId),
    })
    
    if (customer && !customer.metadata?.firstPurchaseDate) {
      await db.update(customers)
        .set({
          metadata: {
            ...customer.metadata,
            firstPurchaseDate: now.toISOString(),
          },
          updatedAt: now,
        })
        .where(eq(customers.id, customerId))
    }
  }
  
  // Send confirmation email (would integrate with email service)
  console.log(`Order ${orderId} confirmed and saved`)
}

async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  console.log(`Payment succeeded for session: ${session.id}`)
  // Additional success handling if needed
}

async function handlePaymentFailure(session: Stripe.Checkout.Session) {
  const { orderId } = session.metadata || {}
  
  if (!orderId) {
    console.error('No orderId in session metadata for failed payment')
    return
  }
  
  console.log(`Payment failed for order: ${orderId}`)
  
  // Update order status to cancelled or pending
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  })
  
  if (order) {
    await db.update(orders)
      .set({
        status: 'cancelled',
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: 'cancelled',
            timestamp: new Date().toISOString(),
            note: 'Payment failed',
          },
        ],
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment intent failed: ${paymentIntent.id}`)
  // Handle failed payment intent if needed
}

// ============================================================================
// Route Configuration
// ============================================================================

export const dynamic = 'force-dynamic'  // Disable static generation for webhook
export const runtime = 'nodejs'         // Use Node.js runtime
