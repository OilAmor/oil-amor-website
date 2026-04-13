import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema-refill'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email/resend'

// POST /api/auth/forgot-password
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return Response.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find customer
    const customer = await db.query.customers.findFirst({
      where: eq(customers.email, email.toLowerCase()),
    })

    // Always return success to prevent email enumeration
    // But only send email if customer exists
    if (customer) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex')
      const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

      // Store token in customer metadata
      await db
        .update(customers)
        .set({
          metadata: {
            ...(customer.metadata || {}),
            resetToken,
            resetTokenExpiry: resetTokenExpiry.toISOString(),
          },
          updatedAt: new Date(),
        })
        .where(eq(customers.id, customer.id))

      // Send reset email
      const resetUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
      
      try {
        await sendPasswordResetEmail({
          to: customer.email,
          resetUrl,
          firstName: customer.firstName,
        })
      } catch (emailError) {
        console.error('Failed to send reset email:', emailError)
        // Still return success to prevent email enumeration
      }
    }

    return Response.json({
      success: true,
      message: 'If an account exists, a reset link has been sent',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
