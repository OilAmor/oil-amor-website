/**
 * Admin Orders API
 * Returns orders from Shopify Admin API (primary) with local DB fallback/cache
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { Order, OrderStatus } from '@/lib/db/schema/orders';
import { db } from '@/lib/db';
import { refillOrders, foreverBottles, customers, orders, auditLogs } from '@/lib/db/schema-refill';
import { desc, eq, or, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { 
  fetchShopifyOrders, 
  fetchShopifyOrderById,
  fetchRecentShopifyOrders,
  createShopifyFulfillment,
  addShopifyOrderNote 
} from '@/lib/shopify/admin-orders';

export const dynamic = 'force-dynamic';

// ============================================================================
// LOCAL DB FALLBACK HELPERS
// ============================================================================

async function convertRefillToOrder(refillOrder: typeof refillOrders.$inferSelect): Promise<Order> {
  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, refillOrder.customerId),
  });

  const bottle = await db.query.foreverBottles.findFirst({
    where: eq(foreverBottles.id, refillOrder.bottleId),
  });

  const pricing = refillOrder.pricing || { standardPrice: 0, creditApplied: 0, finalPrice: 0 };
  const finalPrice = pricing.finalPrice || 0;
  const creditApplied = pricing.creditApplied || 0;
  const returnLabel = refillOrder.returnLabel || {};

  return {
    id: refillOrder.id,
    customerId: refillOrder.customerId,
    customerEmail: customer?.email || '',
    customerName: customer ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown' : 'Unknown',
    isGuest: false,
    status: mapRefillStatusToOrderStatus(refillOrder.status),
    statusHistory: [{
      status: mapRefillStatusToOrderStatus(refillOrder.status),
      timestamp: refillOrder.createdAt.toISOString(),
    }],
    items: [{
      id: `item-${refillOrder.id}`,
      type: 'refill-oil',
      name: `${refillOrder.oilType} Refill`,
      unitPrice: finalPrice / 100,
      quantity: 1,
      subtotal: finalPrice / 100,
      taxAmount: (finalPrice / 100) * 0.1,
      total: (finalPrice / 100) * 1.1,
      isRefill: true,
      originalBottleSerial: bottle?.serialNumber,
    }],
    subtotal: finalPrice / 100,
    taxTotal: (finalPrice / 100) * 0.1,
    shippingTotal: 0,
    discountTotal: creditApplied / 100,
    storeCreditUsed: creditApplied / 100,
    giftCardUsed: 0,
    total: finalPrice / 100,
    currency: 'AUD',
    payment: {
      method: 'credit-card' as const,
      status: 'captured' as const,
    },
    shippingAddress: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      address1: '',
      city: '',
      province: '',
      country: 'AU',
      zip: '',
    },
    shipping: {
      carrier: 'auspost' as const,
      service: 'Standard',
      cost: 0,
      trackingNumber: returnLabel?.trackingNumber,
    },
    isGift: false,
    giftReceipt: false,
    requiresBlending: ['received', 'inspecting', 'refilling'].includes(refillOrder.status),
    eligibleForReturns: true,
    returnCreditsEarned: 0,
    returnCreditsUsed: creditApplied / 100,
    createdAt: refillOrder.createdAt.toISOString(),
    updatedAt: refillOrder.updatedAt.toISOString(),
  };
}

function mapRefillStatusToOrderStatus(status: string): OrderStatus {
  const statusMap: Record<string, OrderStatus> = {
    'pending-return': 'pending',
    'in-transit': 'processing',
    'received': 'blending',
    'inspecting': 'blending',
    'refilling': 'blending',
    'completed': 'shipped',
    'cancelled': 'cancelled',
    'rejected': 'cancelled',
  };
  return statusMap[status] || 'pending';
}

function mapDbOrderToOrder(dbOrder: typeof orders.$inferSelect): Order {
  const items = (dbOrder.items || []).map((item: any) => ({
    id: item.id,
    type: item.type as any,
    productId: item.productId,
    variantId: item.variantId,
    sku: item.sku,
    name: item.name,
    description: item.description,
    image: item.image,
    unitPrice: item.unitPrice / 100,
    quantity: item.quantity,
    subtotal: item.subtotal / 100,
    taxAmount: item.taxAmount / 100,
    total: item.total / 100,
    attachment: item.attachment,
    customMix: item.customMix,
    isRefill: item.isRefill,
    originalBottleSerial: item.originalBottleSerial,
    unlocksOilId: item.unlocksOilId,
    properties: item.properties,
  }));

  return {
    id: dbOrder.id,
    customerId: dbOrder.customerId,
    customerEmail: dbOrder.customerEmail,
    customerName: dbOrder.customerName,
    isGuest: dbOrder.isGuest,
    status: dbOrder.status as OrderStatus,
    statusHistory: (dbOrder.statusHistory || []) as Order['statusHistory'],
    items,
    subtotal: dbOrder.subtotal / 100,
    taxTotal: dbOrder.taxTotal / 100,
    shippingTotal: dbOrder.shippingTotal / 100,
    discountTotal: dbOrder.discountTotal / 100,
    storeCreditUsed: dbOrder.storeCreditUsed / 100,
    giftCardUsed: dbOrder.giftCardUsed / 100,
    total: dbOrder.total / 100,
    currency: dbOrder.currency,
    payment: (dbOrder.payment || { method: 'credit-card' as const, status: 'pending' as const }) as Order['payment'],
    shippingAddress: (dbOrder.shippingAddress || {
      firstName: '',
      lastName: '',
      address1: '',
      city: '',
      province: '',
      country: 'AU',
      zip: '',
    }) as Order['shippingAddress'],
    shipping: (dbOrder.shipping || { carrier: 'auspost' as const, service: 'Standard', cost: 0 }) as Order['shipping'],
    isGift: false,
    giftReceipt: false,
    requiresBlending: items.some((i: any) => i.customMix),
    eligibleForReturns: false,
    returnCreditsEarned: 0,
    returnCreditsUsed: 0,
    createdAt: dbOrder.createdAt.toISOString(),
    updatedAt: dbOrder.updatedAt.toISOString(),
  };
}

// ============================================================================
// GET — List Orders
// ============================================================================

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';
  const limit = parseInt(searchParams.get('limit') || '100');
  const days = parseInt(searchParams.get('days') || '90');

  try {
    // PRIMARY: Fetch from Shopify Admin API
    let shopifyOrders: Order[] = [];
    try {
      const allOrders = await fetchRecentShopifyOrders(days, limit);
      
      // Apply filters
      if (filter === 'pending') {
        shopifyOrders = allOrders.filter(o => ['pending', 'confirmed'].includes(o.status));
      } else if (filter === 'blending') {
        shopifyOrders = allOrders.filter(o => ['blending', 'quality-check', 'processing'].includes(o.status));
      } else if (filter === 'ready') {
        shopifyOrders = allOrders.filter(o => o.status === 'ready-to-ship');
      } else if (filter === 'shipped') {
        shopifyOrders = allOrders.filter(o => ['shipped', 'delivered'].includes(o.status));
      } else {
        shopifyOrders = allOrders;
      }
    } catch (shopifyErr: any) {
      console.error('[Admin Orders] Shopify fetch failed, falling back to local DB:', shopifyErr.message);
    }

    // FALLBACK: Fetch from local DB if Shopify fails or returns empty
    let localOrders: Order[] = [];
    if (shopifyOrders.length === 0) {
      try {
        let refillStatusFilter: string[] | undefined;
        let orderStatusFilter: string[] | undefined;
        
        if (filter === 'blending') {
          refillStatusFilter = ['received', 'inspecting', 'refilling'];
          orderStatusFilter = ['blending', 'quality-check'];
        } else if (filter === 'pending') {
          refillStatusFilter = ['pending-return'];
          orderStatusFilter = ['pending', 'confirmed'];
        } else if (filter === 'ready') {
          refillStatusFilter = ['refilling'];
          orderStatusFilter = ['ready-to-ship'];
        } else if (filter === 'shipped') {
          refillStatusFilter = ['completed'];
          orderStatusFilter = ['shipped', 'delivered'];
        }

        let refillOrdersList: typeof refillOrders.$inferSelect[] = [];
        try {
          if (!orderStatusFilter || orderStatusFilter.length > 0) {
            if (refillStatusFilter && refillStatusFilter.length > 0) {
              const statusConditions = refillStatusFilter.map(s => eq(refillOrders.status, s as any));
              refillOrdersList = await db.select().from(refillOrders)
                .where(or(...statusConditions))
                .orderBy(desc(refillOrders.createdAt))
                .limit(limit);
            } else {
              refillOrdersList = await db.select().from(refillOrders)
                .orderBy(desc(refillOrders.createdAt))
                .limit(limit);
            }
          }
        } catch (refillErr: any) {
          if (refillErr?.message?.includes('does not exist')) {
            console.warn('Admin orders: refillOrders table not found');
          } else {
            throw refillErr;
          }
        }

        let regularOrdersList: typeof orders.$inferSelect[] = [];
        try {
          if (!refillStatusFilter || refillStatusFilter.length > 0) {
            if (orderStatusFilter && orderStatusFilter.length > 0) {
              const statusConditions = orderStatusFilter.map(s => eq(orders.status, s as any));
              regularOrdersList = await db.select().from(orders)
                .where(or(...statusConditions))
                .orderBy(desc(orders.createdAt))
                .limit(limit);
            } else {
              regularOrdersList = await db.select().from(orders)
                .orderBy(desc(orders.createdAt))
                .limit(limit);
            }
          }
        } catch (ordersErr: any) {
          if (ordersErr?.message?.includes('does not exist')) {
            console.warn('Admin orders: orders table not found');
          } else {
            throw ordersErr;
          }
        }

        const convertedRefills = await Promise.all(refillOrdersList.map(convertRefillToOrder));
        const convertedRegulars = regularOrdersList.map(mapDbOrderToOrder);
        localOrders = [...convertedRefills, ...convertedRegulars];
      } catch (localErr: any) {
        console.error('[Admin Orders] Local DB fallback also failed:', localErr.message);
      }
    }

    // Combine and deduplicate (prefer Shopify data)
    const combinedOrders = [...shopifyOrders];
    const seenIds = new Set(combinedOrders.map(o => o.id));
    
    for (const localOrder of localOrders) {
      if (!seenIds.has(localOrder.id)) {
        combinedOrders.push(localOrder);
        seenIds.add(localOrder.id);
      }
    }

    // Sort by createdAt desc
    combinedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ 
      orders: combinedOrders.slice(0, limit),
      source: shopifyOrders.length > 0 ? 'shopify' : 'local',
      count: combinedOrders.length,
    });
  } catch (error: any) {
    console.error('Orders API error:', error);
    return NextResponse.json({
      orders: [],
      error: 'Failed to fetch orders',
      details: error.message,
    }, { status: 500 });
  }
}

// ============================================================================
// POST — Update Order
// ============================================================================

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { orderId, status, trackingNumber, carrier, shopifyOrderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // If we have a Shopify order ID, update Shopify first
    if (shopifyOrderId) {
      const numericOrderId = parseInt(shopifyOrderId);
      
      // Add tracking / create fulfillment if shipped
      if (status === 'shipped' && trackingNumber) {
        const success = await createShopifyFulfillment({
          orderId: numericOrderId,
          trackingNumber,
          trackingCompany: carrier || 'Australia Post',
          notifyCustomer: true,
        });
        
        if (!success) {
          console.warn(`[Admin Orders] Failed to create Shopify fulfillment for ${shopifyOrderId}`);
        }
      }

      // Add note about status change
      await addShopifyOrderNote(numericOrderId, `Admin status updated to: ${status}${trackingNumber ? ` (tracking: ${trackingNumber})` : ''}`);
    }

    // Try local DB update for non-Shopify orders
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (existingOrder) {
      const now = new Date().toISOString();
      const newHistory = [
        ...(existingOrder.statusHistory || []),
        { status, timestamp: now },
      ];
      const updatedShipping = {
        ...(existingOrder.shipping || { carrier: 'auspost', service: 'Standard', cost: 0 }),
        ...(trackingNumber ? { trackingNumber, carrier: carrier || 'auspost' } : {}),
      };

      const [updated] = await db.update(orders)
        .set({
          status,
          statusHistory: newHistory,
          shipping: updatedShipping,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))
        .returning();

      await db.insert(auditLogs).values({
        id: `audit_${nanoid(8)}`,
        adminId: 'admin-api',
        action: 'update_order_status',
        entityType: 'order',
        entityId: orderId,
        before: { status: existingOrder.status, shipping: existingOrder.shipping },
        after: { status, shipping: updatedShipping },
      });

      return NextResponse.json({ success: true, order: updated });
    }

    // Fallback to refill orders
    const existingRefill = await db.query.refillOrders.findFirst({
      where: eq(refillOrders.id, orderId),
    });

    if (existingRefill) {
      const reverseMap: Record<string, string> = {
        pending: 'pending-return',
        blending: 'refilling',
        'quality-check': 'inspecting',
        ready: 'refilling',
        shipped: 'completed',
        cancelled: 'cancelled',
      };
      const refillStatus = reverseMap[status] || status;

      const [updated] = await db.update(refillOrders)
        .set({
          status: refillStatus as any,
          updatedAt: new Date(),
        })
        .where(eq(refillOrders.id, orderId))
        .returning();

      await db.insert(auditLogs).values({
        id: `audit_${nanoid(8)}`,
        adminId: 'admin-api',
        action: 'update_refill_status',
        entityType: 'refillOrder',
        entityId: orderId,
        before: { status: existingRefill.status },
        after: { status: refillStatus },
      });

      const converted = await convertRefillToOrder(updated);
      return NextResponse.json({ success: true, order: converted });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Shopify order updated (no local record found)' 
    });
  } catch (error) {
    console.error('Orders API POST error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
