import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema-refill'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'

// POST /api/auth/reset-password
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return Response.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return Response.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Find customer with matching reset token (secure JSONB query)
    const customer = await db.query.customers.findFirst({
      where: (customers, { sql }) => sql`${customers.metadata}->>'resetToken' = ${token}`,
    })

    if (!customer) {
      return Response.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Check token expiry
    const tokenExpiry = customer.metadata?.resetTokenExpiry
    if (!tokenExpiry || new Date(tokenExpiry) < new Date()) {
      return Response.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      )
    }

    // Hash new password and clear token
    const passwordHash = await bcrypt.hash(password, 10)
    await db
      .update(customers)
      .set({
        metadata: {
          ...(customer.metadata || {}),
          passwordHash,
          resetToken: null,
          resetTokenExpiry: null,
        },
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customer.id))

    return Response.json({
      success: true,
      message: 'Password has been reset successfully',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return Response.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}
