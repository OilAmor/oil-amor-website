/**
 * Production Queue API
 * Returns orders that need blending/mixing atelier preparation
 * 
 * PRIMARY SOURCE: Shopify Admin API (orders with custom mix line items)
 * FALLBACK: Local refill orders
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { db } from '@/lib/db';
import { refillOrders, customers } from '@/lib/db/schema-refill';
import { desc, eq, inArray } from 'drizzle-orm';
import { fetchAtelierOrders, fetchRecentShopifyOrders } from '@/lib/shopify/admin-orders';
import type { Order, OrderCustomMix } from '@/lib/db/schema/orders';

export const dynamic = 'force-dynamic';

interface ProductionQueueItem {
  orderId: string;
  shopifyOrderId?: string;
  customerName: string;
  customerEmail: string;
  item: {
    id: string;
    type: string;
    name: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    taxAmount: number;
    total: number;
  };
  customMix: OrderCustomMix;
  priority: 'normal' | 'rush';
  queuedAt: string;
  status: string;
  shippingAddress?: Order['shippingAddress'];
}

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '90');

  const items: ProductionQueueItem[] = [];

  // PRIMARY: Fetch atelier orders from Shopify
  try {
    const shopifyOrders = await fetchRecentShopifyOrders(days, 250);
    
    for (const order of shopifyOrders) {
      // Skip cancelled/refunded orders
      if (order.status === 'cancelled' || order.status === 'refunded') continue;
      
      // Find line items with custom mixes
      for (const item of order.items || []) {
        if (!item.customMix) continue;

        items.push({
          orderId: order.id,
          shopifyOrderId: order.shopifyOrderId,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          item: {
            id: item.id,
            type: item.type,
            name: item.name,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.subtotal,
            taxAmount: item.taxAmount,
            total: item.total,
          },
          customMix: item.customMix,
          priority: order.blendingPriority || 'normal',
          queuedAt: order.createdAt,
          status: order.status,
          shippingAddress: order.shippingAddress,
        });
      }
    }
  } catch (shopifyErr: any) {
    console.error('[Production Queue] Shopify fetch failed:', shopifyErr.message);
  }

  // FALLBACK: Local refill orders that need production
  if (items.length === 0) {
    try {
      const ordersNeedingProduction = await db.query.refillOrders.findMany({
        where: inArray(refillOrders.status, ['received', 'inspecting', 'refilling']),
        orderBy: [desc(refillOrders.createdAt)],
        limit: 100,
      });

      for (const order of ordersNeedingProduction) {
        const customer = await db.query.customers.findFirst({
          where: eq(customers.id, order.customerId),
        });

        const pricing = order.pricing || { standardPrice: 0, creditApplied: 0, finalPrice: 0 };
        const finalPrice = pricing.finalPrice || 0;

        items.push({
          orderId: order.id,
          customerName: customer ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown' : 'Unknown',
          customerEmail: customer?.email || '',
          item: {
            id: `item-${order.id}`,
            type: 'refill-oil',
            name: `${order.oilType} Refill`,
            unitPrice: finalPrice / 100,
            quantity: 1,
            subtotal: finalPrice / 100,
            taxAmount: (finalPrice / 100) * 0.1,
            total: (finalPrice / 100) * 1.1,
          },
          customMix: {
            recipeName: `${order.oilType} Refill`,
            mode: 'carrier',
            oils: [{
              oilId: order.oilType,
              oilName: order.oilType,
              ml: 100,
              percentage: 100,
            }],
            totalVolume: 100,
            safetyScore: 95,
            safetyRating: 'safe',
            safetyWarnings: [],
            labCertified: true,
          },
          priority: 'normal',
          queuedAt: order.createdAt.toISOString(),
          status: order.status,
        });
      }
    } catch (localErr: any) {
      if (localErr?.message?.includes('does not exist')) {
        console.warn('Production queue: local tables not found');
      } else {
        console.error('Production queue local fallback error:', localErr);
      }
    }
  }

  return NextResponse.json({ 
    items,
    count: items.length,
    source: items.length > 0 && items[0].shopifyOrderId ? 'shopify' : 'local',
  });
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { orderId, action, shopifyOrderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // If Shopify order, update tags to track production status
    if (shopifyOrderId) {
      try {
        const { updateShopifyOrderTags } = await import('@/lib/shopify/admin-orders');
        
        if (action === 'start') {
          await updateShopifyOrderTags(parseInt(shopifyOrderId), ['blending-started']);
        } else if (action === 'complete') {
          await updateShopifyOrderTags(parseInt(shopifyOrderId), ['blending-completed', 'ready-to-ship']);
        }
      } catch (err) {
        console.warn('[Production Queue] Failed to update Shopify tags:', err);
      }
    }

    // Also update local DB if this is a refill order
    try {
      if (action === 'start') {
        await db.update(refillOrders)
          .set({ status: 'refilling', updatedAt: new Date() })
          .where(eq(refillOrders.id, orderId));
      } else if (action === 'complete') {
        await db.update(refillOrders)
          .set({ status: 'completed', updatedAt: new Date(), completedAt: new Date() })
          .where(eq(refillOrders.id, orderId));
      }
    } catch (localErr) {
      // Local order may not exist, that's ok
    }

    return NextResponse.json({ success: true, action, orderId });
  } catch (error) {
    console.error('Production queue POST error:', error);
    return NextResponse.json({ error: 'Failed to update production queue' }, { status: 500 });
  }
}
