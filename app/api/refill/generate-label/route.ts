// =============================================================================
// Generate Return Label API
// =============================================================================
// Generates Australia Post return labels for refill orders
// =============================================================================

import { NextResponse } from 'next/server'
import { generateOrderReturnLabel } from '@/lib/refill/return-workflow'
import { CustomerAddress } from '@/lib/shipping/auspost'

export async function POST(request: Request) {
  try {
    const { orderId, customerAddress, bottleId } = await request.json()
    
    if (!orderId || !customerAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, customerAddress' },
        { status: 400 }
      )
    }
    
    // Validate address
    const address: CustomerAddress = {
      name: customerAddress.name,
      address1: customerAddress.address1,
      address2: customerAddress.address2,
      city: customerAddress.city,
      state: customerAddress.state,
      postcode: customerAddress.postcode,
      country: customerAddress.country || 'AU',
      phone: customerAddress.phone,
      email: customerAddress.email,
    }
    
    if (!address.name || !address.address1 || !address.city || !address.state || !address.postcode) {
      return NextResponse.json(
        { error: 'Incomplete address. Required: name, address1, city, state, postcode' },
        { status: 400 }
      )
    }
    
    const label = await generateOrderReturnLabel(orderId, address)
    
    return NextResponse.json(label)
  } catch (error) {
    console.error('Label generation error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate label'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
