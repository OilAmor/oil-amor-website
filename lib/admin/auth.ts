import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/env'
import { getAdminSession } from '@/lib/auth/admin-session'

export async function requireAdminAuth(request: NextRequest) {
  const adminKey = env.ADMIN_API_KEY

  if (!adminKey) {
    return NextResponse.json(
      { error: 'Server misconfiguration: ADMIN_API_KEY not set' },
      { status: 500 }
    )
  }

  // Allow Bearer token for API/script access
  const authHeader = request.headers.get('authorization')
  if (authHeader === `Bearer ${adminKey}`) {
    return null
  }

  // Allow admin session cookie for browser access
  const session = await getAdminSession()
  if (session.isAdmin) {
    return null
  }

  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
}
