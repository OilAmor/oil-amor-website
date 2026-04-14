import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { refillOrders, customerCredits, creditTransactions } from '@/lib/db/schema-refill';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { orderId, bottleId, inspectionData, result } = await request.json();

    const inspectionResult = {
      cracks: !!inspectionData.cracks,
      chips: !!inspectionData.chips,
      labelCondition: inspectionData.labelCondition,
      capCondition: inspectionData.capCondition,
      cleanliness: inspectionData.bottleClean ? 'clean' : 'needs-cleaning',
      canRefill: result.canRefill,
      cleaningRequired: result.cleaningRequired,
      notes: inspectionData.notes,
      inspectorId: 'admin',
      inspectedAt: new Date().toISOString(),
    };

    await db
      .update(refillOrders)
      .set({
        status: result.canRefill ? 'refilling' : 'rejected',
        inspectionResult,
        updatedAt: new Date(),
      })
      .where(eq(refillOrders.id, orderId));

    if (result.canRefill) {
      const order = await db.query.refillOrders.findFirst({
        where: eq(refillOrders.id, orderId),
      });
      if (order) {
        const customerId = order.customerId;
        const credit = await db.query.customerCredits.findFirst({
          where: eq(customerCredits.customerId, customerId),
        });

        if (credit) {
          const newBalance = credit.balance + 500;
          await db
            .update(customerCredits)
            .set({
              balance: newBalance,
              totalEarned: credit.totalEarned + 500,
              updatedAt: new Date(),
            })
            .where(eq(customerCredits.id, credit.id));

          await db.insert(creditTransactions).values({
            id: `ctx-${Date.now()}`,
            customerId,
            type: 'earned',
            amount: 500,
            balance: newBalance,
            description: 'Bottle return credit',
            metadata: { orderId, bottleId },
            createdAt: new Date(),
          });
        } else {
          await db.insert(customerCredits).values({
            id: `cc-${Date.now()}`,
            customerId,
            balance: 500,
            totalEarned: 500,
            totalUsed: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          await db.insert(creditTransactions).values({
            id: `ctx-${Date.now()}`,
            customerId,
            type: 'earned',
            amount: 500,
            balance: 500,
            description: 'Bottle return credit',
            metadata: { orderId, bottleId },
            createdAt: new Date(),
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Inspect error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
