/**
 * Production Queue API
 * Returns orders that need blending/mixing atelier preparation
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { db } from '@/lib/db';
import { refillOrders, customers } from '@/lib/db/schema-refill';
import { desc, eq, inArray } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  try {
    // Get orders that need production (received, inspecting, refilling status)
    const ordersNeedingProduction = await db.query.refillOrders.findMany({
      where: inArray(refillOrders.status, ['received', 'inspecting', 'refilling']),
      orderBy: [desc(refillOrders.createdAt)],
      limit: 100,
    });

    // Transform to production queue items
    const items = await Promise.all(
      ordersNeedingProduction.map(async (order) => {
        // Get customer info
        const customer = await db.query.customers.findFirst({
          where: eq(customers.id, order.customerId),
        });

        const pricing = order.pricing || { standardPrice: 0, creditApplied: 0, finalPrice: 0 };
        const finalPrice = pricing.finalPrice || 0;

        return {
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
            mode: 'carrier' as const,
            oils: [{
              oilId: order.oilType,
              oilName: order.oilType,
              ml: 100, // Forever Bottle capacity
              percentage: 100,
            }],
            totalVolume: 100,
            safetyScore: 95,
            safetyRating: 'safe',
            safetyWarnings: [],
            labCertified: true,
          },
          priority: 'normal' as const,
          queuedAt: order.createdAt.toISOString(),
        };
      })
    );

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Production queue error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch production queue', items: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  try {
    const { orderId, action } = await request.json();

    if (action === 'start') {
      await db.update(refillOrders)
        .set({ status: 'refilling', updatedAt: new Date() })
        .where(eq(refillOrders.id, orderId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Production queue POST error:', error);
    return NextResponse.json({ error: 'Failed to update production queue' }, { status: 500 });
  }
}
