import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { db } from '@/lib/db';
import { refillOrders } from '@/lib/db/schema-refill';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  try {
    const { orderId } = await request.json();
    await db
      .update(refillOrders)
      .set({ status: 'received', updatedAt: new Date() })
      .where(eq(refillOrders.id, orderId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark received error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
