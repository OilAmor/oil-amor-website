/**
 * Checkout Customization API Route
 * Returns applied discounts, credit usage, and tier status for checkout
 * 
 * GET /api/checkout/customize?checkoutId=xxx&customerId=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { customizeCheckout, applyCreditToCheckout } from '@/lib/shopify/checkout-extensions'
import { getCustomerMetafields } from '@/lib/shopify/metafields'
import { getCustomerIdFromCookie } from '@/lib/shopify/customer-auth'

export const runtime = 'nodejs'

/**
 * GET handler - Fetch checkout customization data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const checkoutId = searchParams.get('checkoutId')
    const customerId = searchParams.get('customerId') || await getCustomerIdFromCookie()

    if (!checkoutId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'checkoutId is required' },
        { status: 400 }
      )
    }

    // If no customer ID, return basic checkout data (guest checkout)
    if (!customerId) {
      return NextResponse.json({
        isGuest: true,
        tierDiscount: null,
        creditApplication: null,
        customerStatus: null,
        refillNotice: {
          unlocked: false,
          eligibleBottles: 0,
          message: 'Create an account to unlock Crystal Circle benefits',
        },
      })
    }

    // Get full checkout customization
    const customization = await customizeCheckout(checkoutId, customerId)

    return NextResponse.json({
      isGuest: false,
      ...customization,
    })
  } catch (error) {
    console.error('Checkout customization error:', error)
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: error instanceof Error ? error.message : 'Failed to customize checkout' 
      },
      { status: 500 }
    )
  }
}

/**
 * POST handler - Apply credit to checkout
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { checkoutId, creditAmount } = body
    const customerId = body.customerId || await getCustomerIdFromCookie()

    if (!checkoutId || !customerId || typeof creditAmount !== 'number') {
      return NextResponse.json(
        { error: 'Bad Request', message: 'checkoutId, customerId, and creditAmount are required' },
        { status: 400 }
      )
    }

    // Verify customer has sufficient credit
    const customerData = await getCustomerMetafields(customerId)
    const availableCredit = customerData.account_credit || 0

    if (creditAmount > availableCredit) {
      return NextResponse.json(
        { 
          error: 'Insufficient Credit', 
          message: `Requested ${creditAmount} but only ${availableCredit} available` 
        },
        { status: 400 }
      )
    }

    // Apply credit to checkout
    const result = await applyCreditToCheckout(customerId, creditAmount)

    return NextResponse.json({
      success: true,
      discountCode: result.discountCode,
      reservationId: result.reservationId,
      appliedAmount: creditAmount,
      expiresAt: result.expiresAt,
    })
  } catch (error) {
    console.error('Apply credit error:', error)
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: error instanceof Error ? error.message : 'Failed to apply credit' 
      },
      { status: 500 }
    )
  }
}
