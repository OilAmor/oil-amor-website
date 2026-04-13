/**
 * Login API
 * Authenticates user and returns customer data
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema-refill'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Find customer by email
    const customer = await db.query.customers.findFirst({
      where: eq(customers.email, email.toLowerCase()),
    })
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Verify password (stored in metadata)
    const metadata = customer.metadata || {}
    const storedPassword = metadata.passwordHash
    
    // In production, use bcrypt.compare
    // For now, plain text comparison (MVP only!)
    if (password !== storedPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Return customer data (exclude password)
    return NextResponse.json({
      success: true,
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        name: customer.firstName || customer.email.split('@')[0],
        memberSince: customer.createdAt.toISOString(),
      },
    })
    
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
