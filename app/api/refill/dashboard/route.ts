// =============================================================================
// Refill Dashboard API
// =============================================================================
// Returns customer refill dashboard data
// =============================================================================

import { NextResponse } from 'next/server'
import { getCustomerForeverBottles } from '@/lib/refill/forever-bottle'
import { getCustomerRewardsProfile } from '@/lib/rewards/customer-rewards'
import { getCreditHistory } from '@/lib/refill/credits'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId')
  
  if (!customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
  }
  
  try {
    const [bottles, profile, creditHistory] = await Promise.all([
      getCustomerForeverBottles(customerId),
      getCustomerRewardsProfile(customerId),
      getCreditHistory(customerId)
    ])
    
    return NextResponse.json({
      bottles,
      creditBalance: profile.accountCredit,
      creditHistory,
      refillUnlocked: profile.refillUnlocked,
      tier: profile.currentTier,
      tierProgress: {
        totalSpent: profile.totalSpent,
        totalPurchases: profile.totalPurchases,
      }
    })
  } catch (error) {
    console.error('Dashboard fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
