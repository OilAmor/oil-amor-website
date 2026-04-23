/**
 * Shopify Customer Created Webhook Handler
 * 
 * Initializes new customer metafields:
 * 1. Sets tier to 'new'
 * 2. Initializes Crystal Circle profile
 * 3. Sends welcome email with Crystal Circle intro
 * 
 * POST /api/webhooks/shopify/customer-created
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { 
  updateCustomerMetafields,
  CustomerMetafields 
} from '@/lib/shopify/metafields'
import { TierLevel } from '@/lib/rewards/tiers'

export const runtime = 'nodejs'

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET

interface ShopifyCustomer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  accepts_marketing: boolean
  created_at: string
  default_address?: {
    address1: string
    city: string
    province: string
    country: string
    zip: string
  }
}

/**
 * POST handler - Process customer creation webhook
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Read body text first (can only read request body once)
    const bodyText = await request.text()
    
    // Verify webhook signature
    const hmac = request.headers.get('x-shopify-hmac-sha256')
    if (!verifyWebhook(bodyText, hmac)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check for replay attacks (webhook must be within last 5 minutes)
    const timestamp = request.headers.get('x-shopify-webhook-timestamp')
    if (!verifyTimestamp(timestamp)) {
      return NextResponse.json(
        { error: 'Webhook expired' },
        { status: 401 }
      )
    }

    // Parse body from the already-read text
    const body = JSON.parse(bodyText)
    const customer: ShopifyCustomer = body

    console.log(`Processing new customer: ${customer.email} (${customer.id})`)

    // Initialize customer
    const result = await initializeNewCustomer(customer)

    const duration = Date.now() - startTime
    console.log(`Customer ${customer.email} initialized in ${duration}ms`)

    return NextResponse.json({
      success: true,
      customerId: customer.id,
      processingTime: duration,
      ...result,
    })
  } catch (error) {
    console.error('Customer initialization error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        requiresReview: true,
      },
      { status: 500 }
    )
  }
}

/**
 * Verify Shopify webhook timestamp to prevent replay attacks
 */
function verifyTimestamp(timestamp: string | null): boolean {
  if (!timestamp) {
    // Never bypass timestamp verification based on environment
    console.error('Shopify webhook missing timestamp')
    return false
  }

  const webhookTime = parseInt(timestamp) * 1000 // Convert to milliseconds
  const now = Date.now()
  const maxAge = 5 * 60 * 1000 // 5 minutes

  // Webhook must be within last 5 minutes and not in the future
  return (now - webhookTime) <= maxAge && webhookTime <= now
}

/**
 * Verify Shopify webhook HMAC signature
 */
function verifyWebhook(body: string, hmac: string | null): boolean {
  if (!SHOPIFY_WEBHOOK_SECRET || !hmac) {
    // Never bypass HMAC verification based on environment
    console.error('Shopify webhook verification failed: missing secret or HMAC')
    return false
  }

  try {
    // Calculate expected HMAC
    const calculated = crypto
      .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
      .update(body, 'utf8')
      .digest('base64')

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(calculated),
      Buffer.from(hmac)
    )
  } catch (error) {
    console.error('Webhook verification error:', error)
    return false
  }
}

/**
 * Initialize a new customer with Oil Amor defaults
 */
async function initializeNewCustomer(customer: ShopifyCustomer) {
  const results: {
    metafieldsInitialized: boolean
    welcomeEmailSent: boolean
    welcomeGiftAssigned: boolean
    starterPackEligible: boolean
  } = {
    metafieldsInitialized: false,
    welcomeEmailSent: false,
    welcomeGiftAssigned: false,
    starterPackEligible: false,
  }

  // 1. Initialize customer metafields with default values
  const initialMetafields: Partial<CustomerMetafields> = {
    crystal_circle_tier: 'seed',
    total_spend: 0,
    purchase_count: 0,
    account_credit: 0,
    unlocked_chains: [], // Default: no chains unlocked at seed tier
    collected_charms: [],
    forever_bottles: [],
    refill_unlocked: false,
    refill_count: 0,
    preferred_crystals: [],
  }

  const customerId = `gid://shopify/Customer/${customer.id}`
  
  await updateCustomerMetafields(customerId, initialMetafields)
  results.metafieldsInitialized = true

  // 2. Assign welcome gift (starter charm or credit)
  const welcomeGift = await assignWelcomeGift(customerId)
  results.welcomeGiftAssigned = true

  // 3. Check starter pack eligibility
  results.starterPackEligible = await checkStarterPackEligibility(customer)

  // 4. Send welcome email
  try {
    await sendWelcomeEmail(customer, welcomeGift)
    results.welcomeEmailSent = true
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    // Don't fail the whole process for email error
  }

  // 5. Subscribe to newsletter if accepted marketing
  if (customer.accepts_marketing) {
    await subscribeToNewsletter(customer.email, customer.first_name)
  }

  return results
}

/**
 * Assign welcome gift to new customer
 */
async function assignWelcomeGift(customerId: string): Promise<{
  type: 'credit' | 'charm'
  value: string | number
}> {
  // Randomly assign either a small credit or a welcome charm
  const giftType = Math.random() > 0.5 ? 'credit' : 'charm'

  if (giftType === 'credit') {
    const creditAmount = 5 // $5 welcome credit
    
    await updateCustomerMetafields(customerId, {
      account_credit: creditAmount,
    })

    return { type: 'credit', value: creditAmount }
  } else {
    const welcomeCharm = 'welcome-star'
    
    await updateCustomerMetafields(customerId, {
      collected_charms: [welcomeCharm],
    })

    return { type: 'charm', value: welcomeCharm }
  }
}

/**
 * Check if customer is eligible for starter pack
 */
async function checkStarterPackEligibility(customer: ShopifyCustomer): Promise<boolean> {
  // Starter pack available for first 100 customers in a month
  // or based on referral source, etc.
  
  // For now, all new customers are eligible
  return true
}

/**
 * Send welcome email with Crystal Circle intro
 */
async function sendWelcomeEmail(
  customer: ShopifyCustomer,
  welcomeGift: { type: string; value: string | number }
) {
  const emailPayload = {
    to: customer.email,
    template: 'welcome-crystal-circle',
    data: {
      firstName: customer.first_name,
      welcomeGift,
      tier: 'seed',
      tierBenefits: [
        'Standard shipping',
        'Access to member pricing',
        'Crystal Circle community access',
      ],
      nextTier: 'sprout',
      spendToNextTier: 150,
      gettingStartedGuide: {
        url: 'https://oilamor.com/guides/getting-started',
        title: 'Your First Oil & Crystal Pairing',
      },
      quizUrl: 'https://oilamor.com/quiz/find-your-oil',
      shopUrl: 'https://oilamor.com/shop',
    },
  }

  console.log(`Sending welcome email to ${customer.email}:`, emailPayload)

  // In production, integrate with your email service
  // await sendEmail(emailPayload)

  // Also trigger any marketing automation (Klaviyo, etc.)
  await triggerMarketingAutomation(customer, 'customer_created')
}

/**
 * Subscribe customer to newsletter
 */
async function subscribeToNewsletter(email: string, firstName: string): Promise<void> {
  // Integrate with your email marketing platform
  // Klaviyo, Mailchimp, etc.

  console.log(`Subscribing ${email} to newsletter`)

  // Example Klaviyo integration:
  // await fetch('https://a.klaviyo.com/api/v2/list/XXXX/members', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     api_key: process.env.KLAVIYO_API_KEY,
  //     profiles: [{
  //       email,
  //       first_name: firstName,
  //     }],
  //   }),
  // })
}

/**
 * Trigger marketing automation workflow
 */
async function triggerMarketingAutomation(
  customer: ShopifyCustomer,
  event: string
): Promise<void> {
  // Trigger welcome series, onboarding flow, etc.
  
  console.log(`Triggering marketing automation: ${event} for ${customer.email}`)

  // Example: Trigger Klaviyo event
  // await fetch('https://a.klaviyo.com/api/track', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     token: process.env.KLAVIYO_PUBLIC_API_KEY,
  //     event,
  //     customer_properties: {
  //       $email: customer.email,
  //       $first_name: customer.first_name,
  //       $last_name: customer.last_name,
  //     },
  //   }),
  // })
}
