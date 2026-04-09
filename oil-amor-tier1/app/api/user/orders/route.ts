/**
 * User Orders API Route
 * Get orders for the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders, unlockedOils } from '@/lib/db/schema-refill'
import { eq, desc } from 'drizzle-orm'

// ============================================================================
// GET /api/user/orders - Get current user's orders
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Get customer ID from session/token (simplified for now)
    const customerId = request.headers.get('x-customer-id')
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Parse query params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Fetch orders from database
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.customerId, customerId),
      orderBy: desc(orders.createdAt),
      limit,
      offset,
    })
    
    // Fetch unlocked oils for this customer
    const userUnlockedOils = await db.query.unlockedOils.findMany({
      where: eq(unlockedOils.customerId, customerId),
    })
    
    // Transform orders for the frontend
    const transformedOrders = userOrders.map(order => ({
      id: order.id,
      date: order.createdAt.toISOString(),
      status: order.status,
      total: order.total / 100, // Convert cents to dollars
      items: (order.items || []).map((item: any) => ({
        oilId: item.unlocksOilId || item.productId,
        name: item.name,
        size: item.customMix?.totalVolume 
          ? `${item.customMix.totalVolume}ml` 
          : '30ml',
        type: item.customMix?.mode === 'carrier' ? 'enhanced' : 'pure',
        ratio: item.customMix?.carrierRatio,
        price: item.total / 100,
        quantity: item.quantity,
      })),
    }))
    
    // Transform unlocked oils
    const transformedUnlockedOils = userUnlockedOils.map(uo => ({
      oilId: uo.oilId,
      unlockedAt: uo.unlockedAt.toISOString(),
      unlockedBy: uo.unlockedBy,
      type: uo.type as 'pure' | 'enhanced',
    }))
    
    return NextResponse.json({
      orders: transformedOrders,
      unlockedOils: transformedUnlockedOils,
      total: userOrders.length,
    })
    
  } catch (error) {
    console.error('User orders GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
