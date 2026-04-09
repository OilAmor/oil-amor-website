// =============================================================================
// Australia Post Shipping Integration
// =============================================================================
// Production-ready integration with Australia Post API
// NO simulated fallbacks - throws errors if credentials are missing
// =============================================================================

// =============================================================================
// CONFIGURATION
// =============================================================================

const AUSPOST_API_KEY = process.env.AUSPOST_API_KEY
const AUSPOST_API_SECRET = process.env.AUSPOST_API_SECRET
const AUSPOST_API_BASE = process.env.AUSPOST_API_BASE || 'https://digitalapi.auspost.com.au/test/shipping/v1'

// =============================================================================
// TYPES
// =============================================================================

export interface CustomerAddress {
  name: string
  address1: string
  address2?: string
  city: string
  state: string
  postcode: string
  country: string
  phone?: string
  email?: string
}

export interface ReturnLabel {
  trackingNumber: string
  labelUrl: string
  consignmentId: string
  createdAt: string
  expiryDate?: string
}

export interface TrackingEvent {
  timestamp: string
  status: string
  description: string
  location?: string
}

export interface TrackingInfo {
  trackingNumber: string
  status: string
  estimatedDelivery?: string
  events: TrackingEvent[]
}

// =============================================================================
// AUTHENTICATION
// =============================================================================

/**
 * Get Australia Post API access token
 */
async function getAccessToken(): Promise<string> {
  if (!AUSPOST_API_KEY || !AUSPOST_API_SECRET) {
    throw new Error('Australia Post API credentials not configured')
  }

  const credentials = Buffer.from(`${AUSPOST_API_KEY}:${AUSPOST_API_SECRET}`).toString('base64')
  
  const response = await fetch(`${AUSPOST_API_BASE}/oauth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get AusPost access token: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

// =============================================================================
// RETURN LABEL GENERATION
// =============================================================================

/**
 * Generate a return label for a Forever Bottle refill
 * 
 * IMPORTANT: This function throws an error if AusPost credentials are not configured.
 * There are NO simulated fallbacks in production.
 */
export async function generateReturnLabel(
  customerAddress: CustomerAddress,
  bottleId?: string
): Promise<ReturnLabel> {
  // Validate credentials - NO SIMULATED FALLBACKS
  if (!AUSPOST_API_KEY || !AUSPOST_API_SECRET) {
    throw new Error('Australia Post API credentials not configured')
  }

  const token = await getAccessToken()

  // Build the consignment request
  const consignmentRequest = {
    consignment: {
      consignment_id: `RETURN-${Date.now()}-${bottleId || 'UNKNOWN'}`,
      customer_reference_1: bottleId || 'Forever Bottle Return',
      customer_reference_2: customerAddress.email || '',
      from: {
        name: customerAddress.name,
        lines: [
          customerAddress.address1,
          customerAddress.address2,
        ].filter(Boolean),
        suburb: customerAddress.city,
        state: customerAddress.state,
        postcode: customerAddress.postcode,
        country: customerAddress.country || 'AU',
        phone: customerAddress.phone,
        email: customerAddress.email,
      },
      to: {
        name: 'Oil Amor Returns',
        lines: ['123 Essential Lane'],
        suburb: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        country: 'AU',
      },
      items: [
        {
          item_reference: bottleId || 'FOREVER-BOTTLE',
          product_id: 'T25S', // 25kg satchel for returns
          authority_to_leave: false,
          allow_partial_delivery: false,
          item_description: 'Forever Bottle Return',
          weight: 0.5,
          dimensions: {
            length: 15,
            width: 10,
            height: 8,
          },
        },
      ],
    },
  }

  const response = await fetch(`${AUSPOST_API_BASE}/consignments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(consignmentRequest),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create AusPost consignment: ${error}`)
  }

  const data = await response.json()

  // Extract label URL and tracking number
  const consignment = data.consignment || data.consignment_summaries?.[0]
  
  if (!consignment) {
    throw new Error('Invalid response from Australia Post API')
  }

  return {
    trackingNumber: consignment.tracking_number || consignment.consignment_id,
    labelUrl: consignment.label_url || consignment.labels?.[0]?.url,
    consignmentId: consignment.consignment_id,
    createdAt: new Date().toISOString(),
    expiryDate: consignment.expiry_date,
  }
}

// =============================================================================
// TRACKING
// =============================================================================

/**
 * Track a return shipment
 * 
 * IMPORTANT: This function throws an error if AusPost credentials are not configured.
 * There are NO simulated fallbacks in production.
 */
export async function trackReturn(trackingNumber: string): Promise<TrackingInfo> {
  // Validate credentials - NO SIMULATED FALLBACKS
  if (!AUSPOST_API_KEY || !AUSPOST_API_SECRET) {
    throw new Error('Australia Post API credentials not configured')
  }

  const token = await getAccessToken()

  const response = await fetch(
    `${AUSPOST_API_BASE}/tracking?q=${encodeURIComponent(trackingNumber)}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to fetch tracking: ${error}`)
  }

  const data = await response.json()

  // Parse tracking response
  const trackingResult = data.tracking_results?.[0]
  
  if (!trackingResult) {
    throw new Error(`No tracking found for ${trackingNumber}`)
  }

  const events: TrackingEvent[] = (trackingResult.tracking_events || [])
    .sort((a: any, b: any) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
    .map((event: any) => ({
      timestamp: event.date_time,
      status: event.status,
      description: event.description,
      location: event.location,
    }))

  return {
    trackingNumber,
    status: trackingResult.status || 'unknown',
    estimatedDelivery: trackingResult.estimated_delivery_date,
    events,
  }
}

// =============================================================================
// WEBHOOK HANDLING
// =============================================================================

/**
 * Process Australia Post tracking webhook
 */
export async function processTrackingWebhook(payload: unknown): Promise<{
  trackingNumber: string
  status: string
  event: TrackingEvent
}> {
  // Validate webhook payload structure
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid webhook payload')
  }

  const webhook = payload as Record<string, unknown>
  
  if (!webhook.tracking_number || !webhook.status) {
    throw new Error('Missing required webhook fields')
  }

  const trackingNumber = String(webhook.tracking_number)
  const status = String(webhook.status)
  
  const event: TrackingEvent = {
    timestamp: webhook.timestamp 
      ? String(webhook.timestamp) 
      : new Date().toISOString(),
    status,
    description: webhook.description 
      ? String(webhook.description) 
      : status,
    location: webhook.location 
      ? String(webhook.location) 
      : undefined,
  }

  return {
    trackingNumber,
    status,
    event,
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Validate an Australian postcode
 */
export function isValidAustralianPostcode(postcode: string): boolean {
  return /^[0-9]{4}$/.test(postcode)
}

/**
 * Format address for Australia Post API
 */
export function formatAddress(address: CustomerAddress): CustomerAddress {
  return {
    ...address,
    state: address.state.toUpperCase(),
    postcode: address.postcode.trim(),
    country: address.country || 'AU',
  }
}

/**
 * Check if Australia Post integration is configured
 */
export function isAusPostConfigured(): boolean {
  return !!(AUSPOST_API_KEY && AUSPOST_API_SECRET)
}
