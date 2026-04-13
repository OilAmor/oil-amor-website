import { Resend } from 'resend'
import {
  passwordResetEmail,
  welcomeEmail,
  orderConfirmationEmail,
  shippingConfirmationEmail,
  abandonedCartEmail,
  rewardsUpdateEmail,
} from './templates'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || process.env.EMAIL_FROM_DOMAIN
  ? `noreply@${process.env.EMAIL_FROM_DOMAIN}`
  : 'noreply@oilamor.com'

// ============================================================================
// SEND EMAIL WRAPPER
// ============================================================================
async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text: string
}) {
  // If no Resend API key, log to console (development mode)
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not set - logging email instead of sending')
    console.log('='.repeat(60))
    console.log(`TO: ${to}`)
    console.log(`SUBJECT: ${subject}`)
    console.log('='.repeat(60))
    return { success: true, id: 'dev-mode-logged', logged: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `Oil Amor <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('❌ Resend API error:', error)
      throw new Error(error.message || 'Failed to send email')
    }

    console.log(`✅ Email sent to ${to} (ID: ${data?.id})`)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    throw error
  }
}

// ============================================================================
// PASSWORD RESET
// ============================================================================
export async function sendPasswordResetEmail({
  to,
  resetUrl,
  firstName,
}: {
  to: string
  resetUrl: string
  firstName?: string
}) {
  const html = passwordResetEmail({ firstName, resetUrl })
  
  return sendEmail({
    to,
    subject: 'Reset your Oil Amor password',
    html,
    text: `Oil Amor - Reset Your Password

Hi ${firstName || 'there'},

We received a request to reset your password. Visit this link:
${resetUrl}

This link expires in 1 hour.

If you didn't request this, ignore this email.

Oil Amor`,
  })
}

// ============================================================================
// WELCOME EMAIL
// ============================================================================
export async function sendWelcomeEmail({
  to,
  firstName,
}: {
  to: string
  firstName: string
}) {
  const html = welcomeEmail({ firstName })
  
  return sendEmail({
    to,
    subject: `Welcome to Oil Amor, ${firstName}!`,
    html,
    text: `Welcome to Oil Amor, ${firstName}!

Your account has been created. Start exploring our collection of luxury essential oils.

Visit: ${process.env.NEXT_PUBLIC_URL}/collections

With love,
The Oil Amor Team`,
  })
}

// ============================================================================
// ORDER CONFIRMATION
// ============================================================================
export async function sendOrderConfirmationEmail({
  to,
  firstName,
  orderNumber,
  orderDate,
  items,
  subtotal,
  shipping,
  total,
  shippingAddress,
  trackingUrl,
}: {
  to: string
  firstName: string
  orderNumber: string
  orderDate: string
  items: Array<{
    name: string
    variant?: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  total: number
  shippingAddress: {
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  trackingUrl?: string
}) {
  const html = orderConfirmationEmail({
    firstName,
    orderNumber,
    orderDate,
    items,
    subtotal,
    shipping,
    total,
    shippingAddress,
    trackingUrl,
  })
  
  const itemsText = items
    .map(i => `- ${i.name}${i.variant ? ` (${i.variant})` : ''} x${i.quantity} - $${(i.price / 100).toFixed(2)}`)
    .join('\n')
  
  return sendEmail({
    to,
    subject: `Order Confirmed #${orderNumber}`,
    html,
    text: `Order Confirmed #${orderNumber}

Thank you ${firstName}!

${itemsText}

Subtotal: $${(subtotal / 100).toFixed(2)}
Shipping: ${shipping === 0 ? 'FREE' : '$' + (shipping / 100).toFixed(2)}
Total: $${(total / 100).toFixed(2)}

Shipping to:
${shippingAddress.name}
${shippingAddress.line1}
${shippingAddress.line2 ? shippingAddress.line2 + '\n' : ''}${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}

Track: ${trackingUrl || 'Coming soon'}

Oil Amor`,
  })
}

// ============================================================================
// SHIPPING CONFIRMATION
// ============================================================================
export async function sendShippingConfirmationEmail({
  to,
  firstName,
  orderNumber,
  trackingNumber,
  trackingUrl,
  carrier,
  estimatedDelivery,
}: {
  to: string
  firstName: string
  orderNumber: string
  trackingNumber: string
  trackingUrl: string
  carrier: string
  estimatedDelivery?: string
}) {
  const html = shippingConfirmationEmail({
    firstName,
    orderNumber,
    trackingNumber,
    trackingUrl,
    carrier,
    estimatedDelivery,
  })
  
  return sendEmail({
    to,
    subject: `Your order #${orderNumber} has shipped!`,
    html,
    text: `Your Oil Amor order has shipped!

Order #${orderNumber}
${carrier}: ${trackingNumber}
${estimatedDelivery ? `Est. delivery: ${estimatedDelivery}\n` : ''}
Track: ${trackingUrl}

Oil Amor`,
  })
}

// ============================================================================
// ABANDONED CART
// ============================================================================
export async function sendAbandonedCartEmail({
  to,
  firstName,
  items,
  cartUrl,
}: {
  to: string
  firstName?: string
  items: Array<{ name: string; price: number }>
  cartUrl: string
}) {
  const html = abandonedCartEmail({ firstName, items, cartUrl })
  
  const itemsText = items.map(i => `- ${i.name} - $${(i.price / 100).toFixed(2)}`).join('\n')
  
  return sendEmail({
    to,
    subject: 'Your cart is waiting at Oil Amor',
    html,
    text: `You left something behind at Oil Amor

${itemsText}

Complete your order: ${cartUrl}

Oil Amor`,
  })
}

// ============================================================================
// REWARDS UPDATE
// ============================================================================
export async function sendRewardsUpdateEmail({
  to,
  firstName,
  pointsBalance,
  pointsEarned,
  tier,
  nextReward,
}: {
  to: string
  firstName: string
  pointsBalance: number
  pointsEarned?: number
  tier: string
  nextReward?: string
}) {
  const html = rewardsUpdateEmail({
    firstName,
    pointsBalance,
    pointsEarned,
    tier,
    nextReward,
  })
  
  return sendEmail({
    to,
    subject: `You have ${pointsBalance.toLocaleString()} Crystal Points!`,
    html,
    text: `Crystal Circle Rewards Update

Hi ${firstName},

You now have ${pointsBalance.toLocaleString()} points as a ${tier} member!
${pointsEarned ? `You just earned ${pointsEarned.toLocaleString()} points.` : ''}
${nextReward ? `Unlock ${nextReward} with your next purchase!` : ''}

View rewards: ${process.env.NEXT_PUBLIC_URL}/account/rewards

Oil Amor`,
  })
}

// Export all functions
export {
  passwordResetEmail,
  welcomeEmail,
  orderConfirmationEmail,
  shippingConfirmationEmail,
  abandonedCartEmail,
  rewardsUpdateEmail,
}
