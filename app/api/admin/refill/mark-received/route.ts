// =============================================================================
// Admin: Mark Refill Received API
// =============================================================================
// Marks a refill order as received at the warehouse
// =============================================================================

import { NextResponse } from 'next/server'
import { markOrderReceived } from '@/lib/refill/return-workflow'

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      )
    }
    
    await markOrderReceived(orderId)
    
    return NextResponse.json({
      success: true,
      message: 'Order marked as received',
      orderId,
    })
  } catch (error) {
    console.error('Mark received error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to mark order as received'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
