import crypto from 'crypto'

// ========================================
// Security Constants
// ========================================

export const SECURITY_CONSTANTS = {
  // Rate Limiting
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  
  // Auth
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes
  
  // Session
  SESSION_DURATION_MS: 24 * 60 * 60 * 1000, // 24 hours
  SESSION_REFRESH_THRESHOLD_MS: 60 * 60 * 1000, // 1 hour
  
  // Passwords
  MIN_PASSWORD_LENGTH: 12,
  MAX_PASSWORD_LENGTH: 128,
  
  // Tokens
  TOKEN_ENTROPY_BYTES: 32,
  
  // Input
  MAX_BODY_SIZE: 1024 * 1024, // 1MB
  MAX_STRING_LENGTH: 10000,
}

// ========================================
// CSP Directives
// ========================================

export const CONTENT_SECURITY_POLICY = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://vercel.live'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': ["'self'", 'https:', 'data:', 'blob:'],
  'connect-src': ["'self'", 'https://*.sanity.io'],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'upgrade-insecure-requests': [],
}

// ========================================
// Security Headers
// ========================================

export const SECURITY_HEADERS = {
  'Content-Security-Policy': buildCSP(CONTENT_SECURITY_POLICY),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'cross-origin',
}

function buildCSP(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}

// ========================================
// Encryption Helpers
// ========================================

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

export function encryptSensitiveData(data: string, key: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag()
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted
}

export function decryptSensitiveData(encryptedData: string, key: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':')
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'hex'),
    Buffer.from(ivHex, 'hex')
  )
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// ========================================
// Request Validation
// ========================================

export function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}$/
  return domainRegex.test(domain)
}

export function sanitizeId(id: string): string | null {
  const match = id.match(/^\d+$/)
  return match ? id : null
}

// ========================================
// Timing Attack Prevention
// ========================================

export async function constantTimeCompare(a: string, b: string): Promise<boolean> {
  if (a.length !== b.length) {
    // Still do comparison to prevent timing attacks
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a))
    return false
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}
