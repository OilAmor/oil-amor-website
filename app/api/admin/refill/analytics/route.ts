// =============================================================================
// Admin: Refill Analytics API
// =============================================================================
// Returns analytics data for the refill system
// =============================================================================

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { refillOrders, foreverBottles, customerRewards } from '@/lib/db/schema-refill'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    // Get order statistics
    const orderStats = await db.select({
      status: refillOrders.status,
      count: sql<number>`count(*)`,
    })
    .from(refillOrders)
    .groupBy(refillOrders.status)
    
    // Get total bottles
    const bottleStats = await db.select({
      status: foreverBottles.status,
      count: sql<number>`count(*)`,
    })
    .from(foreverBottles)
    .groupBy(foreverBottles.status)
    
    // Get tier distribution
    const tierDistribution = await db.select({
      tier: customerRewards.currentTier,
      count: sql<number>`count(*)`,
    })
    .from(customerRewards)
    .groupBy(customerRewards.currentTier)
    
    // Get recent activity
    const recentOrders = await db.query.refillOrders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      limit: 10,
    })
    
    return NextResponse.json({
      orderStats: orderStats.reduce((acc, curr) => {
        acc[curr.status] = curr.count
        return acc
      }, {} as Record<string, number>),
      bottleStats: bottleStats.reduce((acc, curr) => {
        acc[curr.status] = curr.count
        return acc
      }, {} as Record<string, number>),
      tierDistribution: tierDistribution.reduce((acc, curr) => {
        acc[curr.tier] = curr.count
        return acc
      }, {} as Record<string, number>),
      recentOrders,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
