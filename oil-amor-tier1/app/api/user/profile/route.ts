/**
 * User Profile API Route
 * Get and update user profile information
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema-refill'
import { eq } from 'drizzle-orm'

// ============================================================================
// GET /api/user/profile - Get current user profile
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
    
    // Fetch customer from database
    const customer = await db.query.customers.findFirst({
      where: eq(customers.id, customerId),
    })
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }
    
    // Calculate collector level based on orders
    const orders = await db.query.orders.findMany({
      where: eq(customers.id, customerId),
    })
    
    const unlockedOils = await db.query.unlockedOils.findMany({
      where: eq(customers.id, customerId),
    })
    
    // Calculate stats
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const uniqueOils = new Set(unlockedOils.map(u => u.oilId)).size
    
    // Calculate collector level (1-7)
    const collectorLevel = Math.min(7, Math.floor(uniqueOils / 5) + 1)
    
    // Calculate XP
    const totalXP = (uniqueOils * 50) + (totalOrders * 25)
    const nextLevelXP = collectorLevel * 500
    
    // Calculate streak (simplified)
    const streakDays = customer.metadata?.firstPurchaseDate 
      ? Math.floor((Date.now() - new Date(customer.metadata.firstPurchaseDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0
    
    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      name: customer.firstName || customer.email.split('@')[0],
      memberSince: customer.createdAt.toISOString(),
      collectorLevel,
      totalXP,
      nextLevelXP,
      streakDays: Math.min(streakDays, 30),
      stats: {
        totalOrders,
        totalSpent,
        uniqueOils,
      }
    })
    
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================================================================
// PUT /api/user/profile - Update user profile
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    const customerId = request.headers.get('x-customer-id')
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { firstName, lastName, phone } = body
    
    // Update customer in database
    const updated = await db.update(customers)
      .set({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerId))
      .returning()
    
    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      customer: updated[0],
    })
    
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
