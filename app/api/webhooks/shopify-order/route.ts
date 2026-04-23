/**
 * Shopify Order Webhook Handler
 * Processes new orders to unlock refill program and register Forever Bottles
 */

import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';
import { db } from '@/lib/db';
import { customers, orders } from '@/lib/db/schema-refill';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { registerForeverBottle } from '@/lib/refill/forever-bottle';
import { unlockRefillForCustomer } from '@/lib/refill/eligibility';

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ============================================================================
// WEBHOOK HANDLER
// ============================================================================

/**
 * POST /api/webhooks/shopify-order
 * Handles order creation webhooks from Shopify
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Verify webhook signature
    const hmac = request.headers.get('X-Shopify-Hmac-Sha256');
    
    if (!hmac) {
      return NextResponse.json(
        { error: 'Missing HMAC header' },
        { status: 401 }
      );
    }

    const rawBody = await request.text();
    
    if (!verifyShopifyWebhook(rawBody, hmac)) {
      console.error('Invalid Shopify webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 2. Parse order data
    const order = JSON.parse(rawBody);
    
    console.log(`[Shopify Webhook] Processing order ${order.name || order.id}`, {
      orderId: order.id,
      customerId: order.customer?.id,
      lineItems: order.line_items?.length,
    });

    // 3. Process the order
    const results = await processOrder(order);

    console.log(`[Shopify Webhook] Order processed successfully`, results);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      ...results,
    });

  } catch (error) {
    console.error('[Shopify Webhook] Error processing order:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/shopify-order
 * Health check endpoint
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ 
    status: 'ok',
    service: 'Oil Amor Shopify Order Webhook',
  });
}

// ============================================================================
// ORDER PROCESSING
// ============================================================================

interface ProcessOrderResult {
  customerId: string;
  refillUnlocked: boolean;
  foreverBottlesRegistered: number;
  unlockReason?: string;
}

async function processOrder(order: ShopifyOrder): Promise<ProcessOrderResult> {
  const result: ProcessOrderResult = {
    customerId: order.customer?.id?.toString() || '',
    refillUnlocked: false,
    foreverBottlesRegistered: 0,
  };

  if (!order.customer) {
    throw new Error('Order has no customer');
  }

  const customerId = order.customer.id.toString();
  result.customerId = customerId;

  // 1. Sync customer and order to local DB
  try {
    await syncOrderToLocalDb(order, customerId);
  } catch (syncErr) {
    console.error('[Shopify Webhook] Failed to sync order to local DB:', syncErr);
    // Don't fail the webhook — continue with other processing
  }

  // Check line items for relevant products
  let has30mlBottle = false;
  let hasForeverBottle = false;

  for (const item of order.line_items || []) {
    const variantTitle = item.variant_title?.toLowerCase() || '';
    const productTitle = item.title?.toLowerCase() || '';
    const grams = item.grams || 0;

    // Check for 30ml bottles
    if (
      variantTitle.includes('30ml') ||
      variantTitle.includes('30 ml') ||
      productTitle.includes('30ml') ||
      (grams >= 30 && grams < 100 && !productTitle.includes('forever'))
    ) {
      has30mlBottle = true;
    }

    // Check for Forever Bottles (100ml refillables)
    if (
      productTitle.includes('forever') ||
      variantTitle.includes('forever') ||
      variantTitle.includes('100ml') ||
      variantTitle.includes('100 ml') ||
      item.sku?.startsWith('FA-') ||
      item.tags?.includes('forever-bottle')
    ) {
      hasForeverBottle = true;

      // Register the Forever Bottle
      try {
        const oilType = extractOilType(item);
        
        const bottle = await registerForeverBottle({
          customerId,
          oilType,
          orderId: order.id.toString(),
          productVariantId: item.variant_id?.toString() || '',
          purchasePrice: parseFloat(item.price || '0'),
        });

        result.foreverBottlesRegistered++;
        
        console.log(`[Shopify Webhook] Registered Forever Bottle`, {
          bottleId: bottle.id,
          serialNumber: bottle.serialNumber,
          oilType,
        });
      } catch (error) {
        console.error('[Shopify Webhook] Failed to register Forever Bottle:', error);
        // Continue processing other items
      }
    }
  }

  // Unlock refill program if customer purchased 30ml bottle
  if (has30mlBottle) {
    try {
      await unlockRefillForCustomer(customerId);
      result.refillUnlocked = true;
      result.unlockReason = 'Purchased 30ml essential oil';
      
      console.log(`[Shopify Webhook] Unlocked refill program for customer ${customerId}`);
    } catch (error) {
      console.error('[Shopify Webhook] Failed to unlock refill program:', error);
    }
  }

  // Update order metadata to track 30ml purchase
  if (has30mlBottle) {
    try {
      await updateOrderMetadata(order.id.toString(), {
        has30mlBottle: 'true',
        processedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[Shopify Webhook] Failed to update order metadata:', error);
    }
  }

  return result;
}

/**
 * Sync a Shopify order to the local database
 * This ensures the admin dashboard has a local cache of the order
 */
async function syncOrderToLocalDb(order: ShopifyOrder, customerId: string): Promise<void> {
  const customerEmail = order.customer?.email || order.email || '';
  const customerFirstName = order.customer?.first_name || '';
  const customerLastName = order.customer?.last_name || '';

  // Upsert customer
  const existingCustomer = await db.query.customers.findFirst({
    where: eq(customers.id, customerId),
  });

  if (!existingCustomer) {
    await db.insert(customers).values({
      id: customerId,
      email: customerEmail,
      firstName: customerFirstName,
      lastName: customerLastName,
      phone: order.customer?.phone || null,
      metadata: {
        shopifyCustomerId: customerId,
        source: 'shopify-webhook',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    await db.update(customers)
      .set({
        email: customerEmail,
        firstName: customerFirstName,
        lastName: customerLastName,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerId));
  }

  // Check if order already exists
  const orderId = order.name || `SHOPIFY-${order.id}`;
  const existingOrder = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  // Extract line items with custom mix data
  const lineItems = (order.line_items || []).map(item => {
    const properties = Object.fromEntries(
      (item.properties || []).map(p => [p.name, p.value])
    );

    let customMix = null;
    if (properties._mix_recipe_name || properties._mix_oils) {
      try {
        let oils: Array<{ oilId: string; oilName: string; ml: number; percentage: number }> = [];
        if (properties._mix_oils) {
          const parsed = JSON.parse(properties._mix_oils);
          oils = Array.isArray(parsed) ? parsed.map((o: any) => ({
            oilId: o.id || o.oilId || String(o.name).toLowerCase().replace(/\s+/g, '-'),
            oilName: o.name || o.oilName || 'Unknown Oil',
            ml: typeof o.ml === 'number' ? o.ml : parseFloat(o.ml) || 0,
            percentage: typeof o.percentage === 'number' ? o.percentage : parseFloat(o.percentage) || 0,
          })) : [];
        }

        const totalMl = oils.reduce((sum: number, o: any) => sum + (o.ml || 0), 0);
        if (totalMl > 0) {
          oils = oils.map((o: any) => ({
            ...o,
            percentage: o.percentage > 0 ? o.percentage : Math.round((o.ml / totalMl) * 1000) / 10,
          }));
        }

        customMix = {
          recipeName: properties._mix_recipe_name || item.title,
          mode: (properties._mix_mode as 'pure' | 'carrier') || 'pure',
          oils,
          carrierRatio: properties._mix_carrier_ratio ? parseFloat(properties._mix_carrier_ratio) : undefined,
          totalVolume: parseInt(properties._mix_total_volume || '30') as 5 | 10 | 15 | 20 | 30 | 50 | 100,
          crystalId: properties._mix_crystal_id || undefined,
          cordId: properties._mix_cord_id || undefined,
          safetyScore: properties._mix_safety_score ? parseInt(properties._mix_safety_score) : 95,
          safetyRating: properties._mix_safety_rating || 'safe',
          safetyWarnings: properties._mix_safety_warnings ? JSON.parse(properties._mix_safety_warnings) : [],
          labCertified: true,
        };
      } catch {
        // Invalid custom mix data, skip
      }
    }

    const unitPrice = Math.round(parseFloat(item.price || '0') * 100);
    const quantity = item.quantity || 1;

    return {
      id: String(item.id),
      type: customMix ? 'custom-mix' : (item.title.toLowerCase().includes('refill') ? 'refill-oil' : 'standard-oil'),
      productId: item.product_id ? String(item.product_id) : undefined,
      variantId: item.variant_id ? String(item.variant_id) : undefined,
      sku: item.sku || undefined,
      name: item.title,
      description: item.variant_title || undefined,
      unitPrice,
      quantity,
      subtotal: unitPrice * quantity,
      taxAmount: Math.round(unitPrice * quantity * 0.1),
      total: Math.round(unitPrice * quantity * 1.1),
      customMix: customMix || undefined,
      isRefill: item.title.toLowerCase().includes('refill'),
      properties,
    };
  });

  const subtotal = Math.round(parseFloat(order.subtotal_price || '0') * 100);
  const taxTotal = Math.round(parseFloat(order.total_tax || '0') * 100);
  const shippingTotal = Math.round(parseFloat(order.shipping_lines?.[0]?.price || '0') * 100);
  const discountTotal = Math.round(parseFloat(order.total_discounts || '0') * 100);
  const total = Math.round(parseFloat(order.total_price || '0') * 100);

  const shippingAddress = order.shipping_address ? {
    firstName: order.shipping_address.first_name || '',
    lastName: order.shipping_address.last_name || '',
    company: order.shipping_address.company || undefined,
    address1: order.shipping_address.address1 || '',
    address2: order.shipping_address.address2 || undefined,
    city: order.shipping_address.city || '',
    province: order.shipping_address.province || '',
    country: order.shipping_address.country || 'AU',
    zip: order.shipping_address.zip || '',
    phone: order.shipping_address.phone || undefined,
  } : undefined;

  const hasCustomMix = lineItems.some(item => item.customMix);

  // Map Shopify status to local status
  let status = 'pending';
  if (order.cancelled_at) status = 'cancelled';
  else if (order.financial_status === 'refunded') status = 'refunded';
  else if (order.fulfillment_status === 'fulfilled') status = 'shipped';
  else if (order.financial_status === 'paid') status = hasCustomMix ? 'blending' : 'processing';
  else if (order.financial_status === 'authorized') status = 'confirmed';

  const orderData = {
    id: orderId,
    customerId,
    customerEmail,
    customerName: `${customerFirstName} ${customerLastName}`.trim() || 'Guest',
    isGuest: !order.customer,
    status: status as any,
    statusHistory: [{
      status,
      timestamp: order.created_at || new Date().toISOString(),
      note: `Synced from Shopify webhook (financial: ${order.financial_status}, fulfillment: ${order.fulfillment_status || 'none'})`,
    }],
    items: lineItems,
    subtotal,
    taxTotal,
    shippingTotal,
    discountTotal,
    storeCreditUsed: 0,
    giftCardUsed: 0,
    total,
    currency: order.currency || 'AUD',
    payment: {
      method: 'credit-card',
      status: (order.financial_status === 'paid' ? 'captured' : order.financial_status) || 'pending',
      paidAt: order.financial_status === 'paid' ? (order.processed_at || order.created_at) : undefined,
    },
    shippingAddress,
    shipping: {
      carrier: 'auspost',
      service: order.shipping_lines?.[0]?.title || 'Standard',
      cost: shippingTotal,
    },
    isGift: (order.tags || '').includes('gift'),
    giftMessage: order.note || undefined,
    giftReceipt: false,
    requiresBlending: hasCustomMix && status !== 'shipped' && status !== 'cancelled',
    eligibleForReturns: (order.line_items || []).some((item: any) => {
      const title = (item.title || '').toLowerCase();
      return title.includes('30ml') && !title.includes('forever');
    }),
    returnCreditsEarned: 0,
    returnCreditsUsed: 0,
    metadata: {
      shopifyOrderId: String(order.id),
      shopifyFinancialStatus: order.financial_status,
      shopifyFulfillmentStatus: order.fulfillment_status,
      syncedAt: new Date().toISOString(),
    },
    createdAt: new Date(order.created_at || Date.now()),
    updatedAt: new Date(order.updated_at || Date.now()),
  };

  if (existingOrder) {
    await db.update(orders)
      .set({
        status: orderData.status,
        items: orderData.items,
        subtotal: orderData.subtotal,
        taxTotal: orderData.taxTotal,
        shippingTotal: orderData.shippingTotal,
        discountTotal: orderData.discountTotal,
        total: orderData.total,
        payment: orderData.payment,
        shippingAddress: orderData.shippingAddress,
        shipping: orderData.shipping,
        requiresBlending: orderData.requiresBlending,
        metadata: {
          ...existingOrder.metadata,
          ...orderData.metadata,
          lastSyncedAt: new Date().toISOString(),
        },
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));
  } else {
    await db.insert(orders).values(orderData);
  }

  console.log(`[Shopify Webhook] Synced order ${orderId} to local DB`);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Verify Shopify webhook signature
 */
function verifyShopifyWebhook(rawBody: string, hmac: string): boolean {
  const crypto = require('crypto');
  
  const generatedHmac = crypto
    .createHmac('sha256', env.SHOPIFY_WEBHOOK_SECRET || '')
    .update(rawBody, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(generatedHmac),
    Buffer.from(hmac)
  );
}

/**
 * Extract oil type from line item
 */
function extractOilType(item: ShopifyLineItem): string {
  const title = item.title?.toLowerCase() || '';
  const variantTitle = item.variant_title?.toLowerCase() || '';
  
  // Common oil types
  const oilTypes = [
    'lavender',
    'eucalyptus',
    'peppermint',
    'tea-tree',
    'tea tree',
    'lemon',
    'frankincense',
    'rosemary',
    'orange',
    'bergamot',
    'cedarwood',
    'chamomile',
    'cinnamon',
    'clary-sage',
    'clove',
    'geranium',
    'ginger',
    'grapefruit',
    'jasmine',
    'juniper',
    'lemongrass',
    'lime',
    'myrrh',
    'neroli',
    'patchouli',
    'pine',
    'rose',
    'sandalwood',
    'thyme',
    'ylang-ylang',
  ];

  for (const oil of oilTypes) {
    if (title.includes(oil) || variantTitle.includes(oil)) {
      return oil.replace(/-/g, ' ');
    }
  }

  // Default to generic if not found
  return 'custom-blend';
}

/**
 * Update order metadata in database
 */
async function updateOrderMetadata(orderId: string, metadata: Record<string, string>): Promise<void> {
  const { db } = await import('@/lib/db');
  const { orders } = await import('@/lib/db/schema-refill');
  const { eq, sql } = await import('drizzle-orm');

  await db
    .update(orders)
    .set({
      metadata: sql`jsonb_set(
        coalesce(metadata, '{}'::jsonb),
        '{webhook}',
        ${JSON.stringify(metadata)}::jsonb
      )`,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));
}

// ============================================================================
// TYPES
// ============================================================================

interface ShopifyOrder {
  id: number | string;
  name?: string;
  email?: string;
  customer?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string | null;
  };
  line_items?: ShopifyLineItem[];
  created_at?: string;
  updated_at?: string;
  processed_at?: string | null;
  cancelled_at?: string | null;
  closed_at?: string | null;
  financial_status?: string;
  fulfillment_status?: string | null;
  total_price?: string;
  subtotal_price?: string;
  total_tax?: string;
  total_discounts?: string;
  currency?: string;
  note?: string | null;
  tags?: string;
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    company?: string | null;
    address1?: string;
    address2?: string | null;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string | null;
  };
  shipping_lines?: Array<{
    title?: string;
    price?: string;
  }>;
}

interface ShopifyLineItem {
  id: number;
  product_id?: number | null;
  variant_id?: number;
  title: string;
  variant_title?: string;
  quantity: number;
  price: string;
  sku?: string | null;
  grams?: number;
  properties?: { name: string; value: string }[];
  requires_shipping?: boolean;
  tags?: string[];
  fulfillment_status?: string | null;
}
