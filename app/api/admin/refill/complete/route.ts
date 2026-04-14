import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { refillOrders, foreverBottles } from '@/lib/db/schema-refill';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    const order = await db.query.refillOrders.findFirst({
      where: eq(refillOrders.id, orderId),
    });

    if (order) {
      await db
        .update(refillOrders)
        .set({ status: 'completed', updatedAt: new Date(), completedAt: new Date() })
        .where(eq(refillOrders.id, orderId));

      const bottle = await db.query.foreverBottles.findFirst({
        where: eq(foreverBottles.id, order.bottleId),
      });
      if (bottle) {
        await db
          .update(foreverBottles)
          .set({
            refillCount: bottle.refillCount + 1,
            lastRefillDate: new Date(),
            status: 'refilled',
            updatedAt: new Date(),
          })
          .where(eq(foreverBottles.id, order.bottleId));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Complete error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
