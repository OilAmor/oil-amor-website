/**
 * Shopify Order Webhook Handler
 * Processes new orders to unlock refill program and register Forever Bottles
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { env } from '@/env';

import { registerForeverBottle } from '@/lib/refill/forever-bottle';
import { unlockRefillForCustomer } from '@/lib/refill/eligibility';

export const runtime = 'nodejs'

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
    const headersList = headers();
    const hmac = headersList.get('X-Shopify-Hmac-Sha256');
    
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
  customer?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  line_items?: ShopifyLineItem[];
  created_at?: string;
  updated_at?: string;
}

interface ShopifyLineItem {
  id: number;
  variant_id?: number;
  title: string;
  variant_title?: string;
  quantity: number;
  price: string;
  grams?: number;
  sku?: string;
  tags?: string[];
}
