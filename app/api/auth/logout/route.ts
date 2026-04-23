import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    session.destroy()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
