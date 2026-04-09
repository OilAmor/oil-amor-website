// =============================================================================
// Admin: Record Inspection API
// =============================================================================
// Records inspection results for a received refill order
// =============================================================================

import { NextResponse } from 'next/server'
import { recordInspection } from '@/lib/refill/return-workflow'

export async function POST(request: Request) {
  try {
    const { orderId, result, notes } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      )
    }
    
    if (!result || !['passed', 'failed'].includes(result)) {
      return NextResponse.json(
        { error: 'Invalid result. Must be "passed" or "failed"' },
        { status: 400 }
      )
    }
    
    await recordInspection(orderId, result, notes)
    
    return NextResponse.json({
      success: true,
      message: `Inspection recorded: ${result}`,
      orderId,
      result,
      notes,
    })
  } catch (error) {
    console.error('Inspection error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to record inspection'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
