import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/env'
import { getAdminSession } from '@/lib/auth/admin-session'
import bcrypt from 'bcrypt'

export const dynamic = 'force-dynamic'

// In-memory rate limiter for admin login (per IP)
const loginAttempts = new Map<string, { count: number; resetTime: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return false
  }

  if (record.count >= MAX_ATTEMPTS) {
    return true
  }

  record.count++
  return false
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    let valid = false

    if (env.ADMIN_PASSWORD_HASH) {
      // Secure: bcrypt comparison against hashed password
      valid = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH)
    } else {
      // Deprecated: direct comparison (migrate to ADMIN_PASSWORD_HASH immediately)
      console.error(
        '[SECURITY] ADMIN_PASSWORD_HASH is not set. ' +
        'Admin login is using plaintext comparison. ' +
        "Run: node -e \"require('bcrypt').hash('your-password', 10).then(console.log)\" " +
        'and set ADMIN_PASSWORD_HASH in your environment.'
      )
      valid = password === env.ADMIN_API_KEY
    }

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const session = await getAdminSession()
    session.isAdmin = true
    session.loggedInAt = new Date().toISOString()
    await session.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
