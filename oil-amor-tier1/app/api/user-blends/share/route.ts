/**
 * Record Blend Share API
 * POST /api/user-blends/share
 */

import { NextRequest, NextResponse } from 'next/server'
import { recordBlendShare } from '@/lib/brand-ambassador'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blendId } = body

    if (!blendId) {
      return NextResponse.json(
        { error: 'Blend ID is required' },
        { status: 400 }
      )
    }

    await recordBlendShare(blendId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording blend share:', error)
    return NextResponse.json(
      { error: 'Failed to record share' },
      { status: 500 }
    )
  }
}
