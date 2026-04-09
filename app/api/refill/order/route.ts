// =============================================================================
// Refill Order API
// =============================================================================
// Creates new refill orders
// =============================================================================

import { NextResponse } from 'next/server'
import { initiateRefillOrder } from '@/lib/refill/return-workflow'
import { checkRefillEligibility } from '@/lib/refill/eligibility'

export async function POST(request: Request) {
  try {
    const { customerId, bottleId, oilType } = await request.json()
    
    // Validate required fields
    if (!customerId || !bottleId) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, bottleId' },
        { status: 400 }
      )
    }
    
    // Check eligibility if oilType provided
    if (oilType) {
      const eligibility = await checkRefillEligibility(customerId, oilType)
      if (!eligibility.canRefill) {
        return NextResponse.json(
          { error: eligibility.reason || 'Not eligible for refill' },
          { status: 403 }
        )
      }
    }
    
    // Create order
    const result = await initiateRefillOrder(customerId, bottleId)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Refill order error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create refill order'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
