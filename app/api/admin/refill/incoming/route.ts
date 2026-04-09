// =============================================================================
// Admin: Incoming Refills API
// =============================================================================
// Lists all refill orders currently in transit
// =============================================================================

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { refillOrders } from '@/lib/db/schema-refill'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  // TODO: Add admin authentication (handled by middleware)
  
  try {
    const incoming = await db.query.refillOrders.findMany({
      where: eq(refillOrders.status, 'in_transit'),
      orderBy: [desc(refillOrders.createdAt)],
      limit: 100,
    })
    
    return NextResponse.json({
      count: incoming.length,
      orders: incoming,
    })
  } catch (error) {
    console.error('Admin fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incoming orders' },
      { status: 500 }
    )
  }
}
