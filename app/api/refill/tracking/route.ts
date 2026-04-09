// =============================================================================
// Tracking API
// =============================================================================
// Fetches tracking information for return shipments
// =============================================================================

import { NextResponse } from 'next/server'
import { trackReturn } from '@/lib/shipping/auspost'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const trackingNumber = searchParams.get('trackingNumber')
  
  if (!trackingNumber) {
    return NextResponse.json(
      { error: 'Missing trackingNumber parameter' },
      { status: 400 }
    )
  }
  
  try {
    const tracking = await trackReturn(trackingNumber)
    return NextResponse.json(tracking)
  } catch (error) {
    console.error('Tracking error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tracking'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
