/**
 * Admin Dashboard Stats API
 * Returns key metrics for the admin dashboard from REAL database data
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { refillOrders, foreverBottles, customerCredits } from '@/lib/db/schema-refill';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Get order statistics from refill orders (real data)
    const orderStats = await db.select({
      status: refillOrders.status,
      count: sql<number>`count(*)`,
    })
    .from(refillOrders)
    .groupBy(refillOrders.status);

    // Calculate totals
    const totalOrders = orderStats.reduce((sum, stat) => sum + Number(stat.count), 0);
    const pendingRefills = orderStats.find(s => s.status === 'pending-return')?.count || 0;
    const inTransit = orderStats.find(s => s.status === 'in-transit')?.count || 0;
    const completedRefills = orderStats.find(s => s.status === 'completed')?.count || 0;

    // Get bottle statistics
    const bottleStats = await db.select({
      status: foreverBottles.status,
      count: sql<number>`count(*)`,
    })
    .from(foreverBottles)
    .groupBy(foreverBottles.status);

    const totalBottles = bottleStats.reduce((sum, stat) => sum + Number(stat.count), 0);

    // Get customer statistics (from customer credits table)
    const customerStats = await db.select({
      count: sql<number>`count(*)`,
    })
    .from(customerCredits);

    const activeCustomers = Number(customerStats[0]?.count || 0);

    // Get revenue from refill orders (sum of finalPrice from pricing JSON for completed orders this month)
    // Note: finalPrice is stored in cents in the pricing JSON
    const revenueResult = await db.execute(sql`
      SELECT COALESCE(SUM((pricing->>'finalPrice')::int), 0) as total
      FROM ${refillOrders}
      WHERE created_at >= ${monthAgo.toISOString()}
    `);

    const monthRevenueCents = Number(revenueResult.rows[0]?.total || 0);
    const monthRevenue = monthRevenueCents / 100;

    // Get today's revenue
    const todayRevenueResult = await db.execute(sql`
      SELECT COALESCE(SUM((pricing->>'finalPrice')::int), 0) as total
      FROM ${refillOrders}
      WHERE created_at >= ${today.toISOString()}
    `);

    const todayRevenueCents = Number(todayRevenueResult.rows[0]?.total || 0);
    const todayRevenue = todayRevenueCents / 100;

    // Get week's revenue
    const weekRevenueResult = await db.execute(sql`
      SELECT COALESCE(SUM((pricing->>'finalPrice')::int), 0) as total
      FROM ${refillOrders}
      WHERE created_at >= ${weekAgo.toISOString()}
    `);

    const weekRevenueCents = Number(weekRevenueResult.rows[0]?.total || 0);
    const weekRevenue = weekRevenueCents / 100;

    // Get pending blending count (orders that need atelier preparation)
    // Orders that are received, inspecting, or refilling need production work
    const pendingBlending = orderStats
      .filter(s => ['received', 'inspecting', 'refilling'].includes(s.status))
      .reduce((sum, s) => sum + Number(s.count), 0);

    // Get low stock oils (this would typically query your inventory system)
    const lowStockOils: string[] = [];

    return NextResponse.json({
      totalOrders,
      pendingBlending,
      pendingRefills: Number(pendingRefills) + Number(inTransit),
      todayRevenue,
      weekRevenue,
      monthRevenue,
      activeCustomers,
      totalBottles,
      completedRefills: Number(completedRefills),
      lowStockOils,
      orderBreakdown: orderStats.reduce((acc, curr) => {
        acc[curr.status] = Number(curr.count);
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    
    return NextResponse.json({
      totalOrders: 0,
      pendingBlending: 0,
      pendingRefills: 0,
      todayRevenue: 0,
      weekRevenue: 0,
      monthRevenue: 0,
      activeCustomers: 0,
      totalBottles: 0,
      completedRefills: 0,
      lowStockOils: [],
      error: 'Failed to fetch stats',
    }, { status: 500 });
  }
}
