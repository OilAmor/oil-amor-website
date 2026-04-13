/**
 * Admin Orders API
 * Returns orders with filtering and search from REAL database data
 */

import { NextRequest, NextResponse } from 'next/server';
import { Order, OrderStatus } from '@/lib/db/schema/orders';
import { db } from '@/lib/db';
import { refillOrders, foreverBottles, customers } from '@/lib/db/schema-refill';
import { desc, eq, or, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// Helper to convert refill order to Order format
async function convertRefillToOrder(refillOrder: typeof refillOrders.$inferSelect): Promise<Order> {
  // Get customer info
  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, refillOrder.customerId),
  });

  // Get bottle info
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
      unitPrice: finalPrice / 100, // Convert cents to dollars
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
      method: 'credit-card',
      status: 'captured',
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
      carrier: 'auspost',
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const limit = parseInt(searchParams.get('limit') || '100');

    // Build status filter
    let statusFilter: string[] | undefined;
    if (filter === 'blending') {
      statusFilter = ['received', 'inspecting', 'refilling'];
    } else if (filter === 'pending') {
      statusFilter = ['pending-return'];
    } else if (filter === 'ready') {
      statusFilter = ['refilling'];
    } else if (filter === 'shipped') {
      statusFilter = ['completed'];
    }

    // Fetch real refill orders from database
    let refillOrdersList: typeof refillOrders.$inferSelect[];
    
    if (statusFilter && statusFilter.length > 0) {
      // Build OR conditions for status filter
      const statusConditions = statusFilter.map(s => eq(refillOrders.status, s as any));
      refillOrdersList = await db.query.refillOrders.findMany({
        where: or(...statusConditions),
        orderBy: [desc(refillOrders.createdAt)],
        limit,
      });
    } else {
      refillOrdersList = await db.query.refillOrders.findMany({
        orderBy: [desc(refillOrders.createdAt)],
        limit,
      });
    }

    // Convert to Order format
    const orders: Order[] = await Promise.all(
      refillOrdersList.map(convertRefillToOrder)
    );

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', orders: [] },
      { status: 500 }
    );
  }
}
