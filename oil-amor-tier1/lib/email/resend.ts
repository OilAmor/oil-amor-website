import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || process.env.EMAIL_FROM_DOMAIN 
  ? `noreply@${process.env.EMAIL_FROM_DOMAIN}` 
  : 'noreply@oilamor.com'
const APP_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

interface PasswordResetEmailProps {
  to: string
  resetUrl: string
  firstName?: string
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
  firstName,
}: PasswordResetEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, logging email instead')
    console.log(`[EMAIL] Password reset for ${to}: ${resetUrl}`)
    return { success: true, id: 'logged-only' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `Oil Amor <${FROM_EMAIL}>`,
      to,
      subject: 'Reset your Oil Amor password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Georgia, serif; background-color: #0a080c;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a080c;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #111; border-radius: 16px; border: 1px solid rgba(245, 243, 239, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <div style="width: 64px; height: 64px; background: rgba(201, 162, 39, 0.1); border: 1px solid rgba(201, 162, 39, 0.3); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                        <span style="font-size: 32px;">👑</span>
                      </div>
                      <h1 style="color: #f5f3ef; font-size: 28px; margin: 0 0 10px; font-weight: normal;">Oil Amor</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <h2 style="color: #f5f3ef; font-size: 24px; margin: 0 0 20px; font-weight: normal;">Reset Your Password</h2>
                      <p style="color: #a69b8a; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                        Hi ${firstName || 'there'},
                      </p>
                      <p style="color: #a69b8a; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                        We received a request to reset your password. Click the button below to create a new password. This link will expire in 1 hour.
                      </p>
                      
                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${resetUrl}" style="display: inline-block; background-color: #c9a227; color: #0a080c; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 500;">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #a69b8a; font-size: 14px; line-height: 1.6; margin: 30px 0 20px;">
                        Or copy and paste this link into your browser:
                      </p>
                      <p style="color: #f5f3ef; font-size: 14px; word-break: break-all; margin: 0 0 30px;">
                        <a href="${resetUrl}" style="color: #c9a227; text-decoration: underline;">${resetUrl}</a>
                      </p>
                      
                      <p style="color: #a69b8a; font-size: 14px; line-height: 1.6; margin: 0;">
                        If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px 40px; text-align: center; border-top: 1px solid rgba(245, 243, 239, 0.1);">
                      <p style="color: #6b655a; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} Oil Amor. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `Oil Amor - Reset Your Password

Hi ${firstName || 'there'},

We received a request to reset your password. Visit this link to create a new password:

${resetUrl}

This link will expire in 1 hour.

If you didn't request this password reset, you can safely ignore this email.

© ${new Date().getFullYear()} Oil Amor`,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error('Failed to send email')
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    throw error
  }
}

interface OrderConfirmationEmailProps {
  to: string
  orderId: string
  orderNumber: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  firstName?: string
}

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  items,
  total,
  firstName,
}: OrderConfirmationEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, logging email instead')
    console.log(`[EMAIL] Order confirmation for ${to}: Order #${orderNumber}`)
    return { success: true, id: 'logged-only' }
  }

  const itemsList = items
    .map((item) => `• ${item.name} x${item.quantity} - $${(item.price / 100).toFixed(2)}`)
    .join('\n')

  try {
    const { data, error } = await resend.emails.send({
      from: `Oil Amor <${FROM_EMAIL}>`,
      to,
      subject: `Order Confirmation #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Georgia, serif; background-color: #0a080c;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a080c;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #111; border-radius: 16px; border: 1px solid rgba(245, 243, 239, 0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <h1 style="color: #f5f3ef; font-size: 28px; margin: 0;">Order Confirmed</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 40px;">
                      <p style="color: #a69b8a; font-size: 16px;">Thank you for your order, ${firstName || 'valued customer'}!</p>
                      <p style="color: #c9a227; font-size: 20px; margin: 20px 0;">Order #${orderNumber}</p>
                      <div style="color: #f5f3ef; font-size: 14px; line-height: 2;">
                        ${items.map(item => `
                          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(245, 243, 239, 0.1);">
                            <span>${item.name} x${item.quantity}</span>
                            <span>$${(item.price / 100).toFixed(2)}</span>
                          </div>
                        `).join('')}
                      </div>
                      <p style="color: #c9a227; font-size: 18px; text-align: right; margin-top: 20px;">
                        Total: $${(total / 100).toFixed(2)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `Oil Amor - Order Confirmation

Thank you for your order, ${firstName || 'valued customer'}!

Order #${orderNumber}

${itemsList}

Total: $${(total / 100).toFixed(2)}

© ${new Date().getFullYear()} Oil Amor`,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error('Failed to send email')
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Failed to send order confirmation:', error)
    throw error
  }
}
