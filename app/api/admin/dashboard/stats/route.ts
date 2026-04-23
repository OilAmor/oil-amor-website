/**
 * Admin Dashboard Stats API
 * Returns key metrics from Shopify Admin API (primary) with local DB fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { db } from '@/lib/db';
import { refillOrders, foreverBottles, customerCredits, inventoryItems } from '@/lib/db/schema-refill';
import { sql } from 'drizzle-orm';
import { fetchShopifyOrderStats } from '@/lib/shopify/admin-orders';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    // PRIMARY: Fetch stats from Shopify Admin API
    let shopifyStats: Awaited<ReturnType<typeof fetchShopifyOrderStats>> | null = null;
    try {
      shopifyStats = await fetchShopifyOrderStats(30);
    } catch (shopifyErr: any) {
      console.error('[Dashboard Stats] Shopify stats fetch failed:', shopifyErr.message);
    }

    // FALLBACK / SUPPLEMENT: Local DB stats for refill program
    let localStats = {
      totalOrders: 0,
      pendingBlending: 0,
      pendingRefills: 0,
      todayRevenue: 0,
      weekRevenue: 0,
      monthRevenue: 0,
      activeCustomers: 0,
      totalBottles: 0,
      completedRefills: 0,
      orderBreakdown: {} as Record<string, number>,
    };

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      // Refill order statistics
      const orderStats = await db.select({
        status: refillOrders.status,
        count: sql<number>`count(*)`,
      })
      .from(refillOrders)
      .groupBy(refillOrders.status);

      const totalRefillOrders = orderStats.reduce((sum, stat) => sum + Number(stat.count), 0);
      const pendingRefills = orderStats.find(s => s.status === 'pending-return')?.count || 0;
      const inTransit = orderStats.find(s => s.status === 'in-transit')?.count || 0;
      const completedRefills = orderStats.find(s => s.status === 'completed')?.count || 0;

      // Bottle statistics
      const bottleStats = await db.select({
        status: foreverBottles.status,
        count: sql<number>`count(*)`,
      })
      .from(foreverBottles)
      .groupBy(foreverBottles.status);

      const totalBottles = bottleStats.reduce((sum, stat) => sum + Number(stat.count), 0);

      // Customer statistics
      const customerStats = await db.select({
        count: sql<number>`count(*)`,
      })
      .from(customerCredits);

      const activeCustomers = Number(customerStats[0]?.count || 0);

      // Revenue from refill orders
      const revenueResult = await db.execute(sql`
        SELECT COALESCE(SUM((pricing->>'finalPrice')::int), 0) as total
        FROM ${refillOrders}
        WHERE created_at >= ${monthAgo.toISOString()}
      `);
      const monthRevenueCents = Number(revenueResult.rows[0]?.total || 0);

      const todayRevenueResult = await db.execute(sql`
        SELECT COALESCE(SUM((pricing->>'finalPrice')::int), 0) as total
        FROM ${refillOrders}
        WHERE created_at >= ${today.toISOString()}
      `);
      const todayRevenueCents = Number(todayRevenueResult.rows[0]?.total || 0);

      const weekRevenueResult = await db.execute(sql`
        SELECT COALESCE(SUM((pricing->>'finalPrice')::int), 0) as total
        FROM ${refillOrders}
        WHERE created_at >= ${weekAgo.toISOString()}
      `);
      const weekRevenueCents = Number(weekRevenueResult.rows[0]?.total || 0);

      const pendingBlending = orderStats
        .filter(s => ['received', 'inspecting', 'refilling'].includes(s.status))
        .reduce((sum, s) => sum + Number(s.count), 0);

      localStats = {
        totalOrders: totalRefillOrders,
        pendingBlending,
        pendingRefills: Number(pendingRefills) + Number(inTransit),
        todayRevenue: todayRevenueCents / 100,
        weekRevenue: weekRevenueCents / 100,
        monthRevenue: monthRevenueCents / 100,
        activeCustomers,
        totalBottles,
        completedRefills: Number(completedRefills),
        orderBreakdown: orderStats.reduce((acc, curr) => {
          acc[curr.status] = Number(curr.count);
          return acc;
        }, {} as Record<string, number>),
      };
    } catch (localErr: any) {
      if (localErr?.message?.includes('does not exist') || localErr?.code === '42P01') {
        console.warn('Dashboard stats: local refill tables not found');
      } else {
        console.error('Dashboard stats: local DB error:', localErr);
      }
    }

    // Low stock check
    let lowStockOils: string[] = [];
    try {
      const lowStock = await db.select()
        .from(inventoryItems)
        .where(sql`${inventoryItems.quantity} <= ${inventoryItems.reorderPoint}`);
      lowStockOils = lowStock.map(item => item.name);
    } catch {
      // Inventory table may not exist
    }

    // MERGE: Prefer Shopify for order/revenue stats, supplement with local refill data
    if (shopifyStats) {
      return NextResponse.json({
        totalOrders: shopifyStats.totalOrders + localStats.totalOrders,
        pendingBlending: shopifyStats.pendingBlending + localStats.pendingBlending,
        pendingRefills: shopifyStats.pendingFulfillment + localStats.pendingRefills,
        todayRevenue: (shopifyStats.todayRevenue / 100) + localStats.todayRevenue,
        weekRevenue: (shopifyStats.weekRevenue / 100) + localStats.weekRevenue,
        monthRevenue: (shopifyStats.monthRevenue / 100) + localStats.monthRevenue,
        activeCustomers: Math.max(shopifyStats.totalOrders > 0 ? Math.round(shopifyStats.totalOrders * 0.7) : 0, localStats.activeCustomers),
        totalBottles: localStats.totalBottles,
        completedRefills: shopifyStats.shippedOrders + localStats.completedRefills,
        lowStockOils,
        orderBreakdown: {
          ...shopifyStats.ordersByStatus,
          ...localStats.orderBreakdown,
        },
        source: 'shopify',
        averageOrderValue: shopifyStats.averageOrderValue / 100,
      });
    }

    // Pure local fallback
    return NextResponse.json({
      ...localStats,
      lowStockOils,
      source: 'local',
    });
  } catch (error: any) {
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
      orderBreakdown: {},
      error: 'Failed to fetch stats',
      details: error.message,
    });
  }
}
