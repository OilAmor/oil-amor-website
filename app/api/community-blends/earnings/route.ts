/**
 * GET /api/community-blends/earnings?creatorId=xxx
 * 
 * Returns creator earnings and commission history.
 * Requires authentication (creator can only view their own earnings).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCreatorEarnings, getCreatorCommissionHistory } from '@/lib/community-blends/commissions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    if (!creatorId) {
      return NextResponse.json(
        { error: 'Missing required parameter: creatorId' },
        { status: 400 }
      );
    }

    // Authentication check
    const requestingUserId = request.headers.get('x-customer-id')
    const isAdmin = request.headers.get('x-admin-key') === process.env.ADMIN_API_KEY
    
    if (!requestingUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    if (requestingUserId !== creatorId && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: You can only view your own earnings' },
        { status: 403 }
      )
    }

    const [earnings, history] = await Promise.all([
      getCreatorEarnings(creatorId),
      getCreatorCommissionHistory(creatorId, { limit }),
    ]);

    return NextResponse.json({
      creatorId,
      earnings: {
        totalEarned: earnings.totalEarned,
        pendingAmount: earnings.pendingAmount,
        totalSales: earnings.totalSales,
        blendCount: earnings.blendCount,
        // Format for display (convert cents to dollars)
        formatted: {
          totalEarned: `$${(earnings.totalEarned / 100).toFixed(2)}`,
          pendingAmount: `$${(earnings.pendingAmount / 100).toFixed(2)}`,
        },
      },
      history: history.map(h => ({
        ...h,
        formatted: {
          saleAmount: `$${(h.saleAmount / 100).toFixed(2)}`,
          commissionAmount: `$${(h.commissionAmount / 100).toFixed(2)}`,
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching creator earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}
