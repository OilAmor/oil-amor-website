// =============================================================================
// Admin: Complete Refill Order API
// =============================================================================
// Completes a refill order that has passed inspection
// =============================================================================

import { NextResponse } from 'next/server'
import { completeRefillOrder } from '@/lib/refill/return-workflow'

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      )
    }
    
    await completeRefillOrder(orderId)
    
    return NextResponse.json({
      success: true,
      message: 'Refill order completed successfully',
      orderId,
    })
  } catch (error) {
    console.error('Complete order error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to complete order'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
