/**
 * Redis Session Management
 * Enterprise-grade session handling with security features
 */

import { redis, createSessionKey } from './client'
import { logger } from '@/lib/logging/logger'
import { generateSecureToken } from '@/lib/security/security-utils'

// ============================================================================
// SESSION TYPES
// ============================================================================

export interface SessionData {
  userId?: string
  email?: string
  cartId?: string
  tier?: string
  preferences?: {
    currency?: string
    language?: string
    theme?: 'light' | 'dark'
  }
  metadata?: Record<string, unknown>
}

export interface Session {
  id: string
  data: SessionData
  createdAt: number
  expiresAt: number
  lastAccessedAt: number
  ipAddress?: string
  userAgent?: string
}

export interface SessionConfig {
  ttl: number // Session lifetime in seconds
  extendOnAccess: boolean // Whether to extend TTL on access
  maxAge: number // Maximum session age regardless of activity
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_SESSION_CONFIG: SessionConfig = {
  ttl: 24 * 60 * 60, // 24 hours
  extendOnAccess: true,
  maxAge: 7 * 24 * 60 * 60, // 7 days
}

// ============================================================================
// SESSION MANAGER
// ============================================================================

class SessionManager {
  private config: SessionConfig
  
  constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_SESSION_CONFIG, ...config }
  }
  
  // ========================================================================
  // SESSION CREATION
  // ========================================================================
  
  async create(
    data: SessionData = {},
    metadata?: { ipAddress?: string; userAgent?: string }
  ): Promise<Session> {
    const sessionId = generateSecureToken(32)
    const now = Date.now()
    
    const session: Session = {
      id: sessionId,
      data,
      createdAt: now,
      expiresAt: now + this.config.ttl * 1000,
      lastAccessedAt: now,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    }
    
    try {
      const key = createSessionKey(sessionId)
      const success = await redis.set(
        key,
        session,
        { ex: this.config.ttl }
      )
      
      if (!success) {
        throw new Error('Failed to store session in Redis')
      }
      
      logger.info('Session created', { sessionId: sessionId.slice(0, 8) + '...' })
      return session
    } catch (error) {
      logger.error('Session creation error', error as Error)
      throw error
    }
  }
  
  // ========================================================================
  // SESSION RETRIEVAL
  // ========================================================================
  
  async get(sessionId: string): Promise<Session | null> {
    try {
      const key = createSessionKey(sessionId)
      const session = await redis.get<Session>(key)
      
      if (!session) {
        return null
      }
      
      // Check max age
      const now = Date.now()
      const age = now - session.createdAt
      
      if (age > this.config.maxAge * 1000) {
        logger.info('Session expired (max age)', { sessionId: sessionId.slice(0, 8) + '...' })
        await this.destroy(sessionId)
        return null
      }
      
      // Extend session if configured
      if (this.config.extendOnAccess) {
        session.lastAccessedAt = now
        session.expiresAt = now + this.config.ttl * 1000
        
        await redis.set(key, session, { ex: this.config.ttl })
      }
      
      return session
    } catch (error) {
      logger.error('Session retrieval error', error as Error, { sessionId: sessionId.slice(0, 8) + '...' })
      return null
    }
  }
  
  // ========================================================================
  // SESSION UPDATES
  // ========================================================================
  
  async update(sessionId: string, updates: Partial<SessionData>): Promise<boolean> {
    try {
      const session = await this.get(sessionId)
      
      if (!session) {
        return false
      }
      
      session.data = { ...session.data, ...updates }
      session.lastAccessedAt = Date.now()
      
      const key = createSessionKey(sessionId)
      const ttl = Math.ceil((session.expiresAt - Date.now()) / 1000)
      
      return await redis.set(key, session, { ex: ttl })
    } catch (error) {
      logger.error('Session update error', error as Error, { sessionId: sessionId.slice(0, 8) + '...' })
      return false
    }
  }
  
  async setCart(sessionId: string, cartId: string): Promise<boolean> {
    return this.update(sessionId, { cartId })
  }
  
  async setUser(sessionId: string, userId: string, email?: string): Promise<boolean> {
    return this.update(sessionId, { userId, email })
  }
  
  async setTier(sessionId: string, tier: string): Promise<boolean> {
    return this.update(sessionId, { tier })
  }
  
  // ========================================================================
  // SESSION DESTRUCTION
  // ========================================================================
  
  async destroy(sessionId: string): Promise<boolean> {
    try {
      const key = createSessionKey(sessionId)
      const success = await redis.del(key)
      
      if (success) {
        logger.info('Session destroyed', { sessionId: sessionId.slice(0, 8) + '...' })
      }
      
      return success
    } catch (error) {
      logger.error('Session destruction error', error as Error, { sessionId: sessionId.slice(0, 8) + '...' })
      return false
    }
  }
  
  async destroyUserSessions(userId: string): Promise<number> {
    try {
      // Find all sessions for user
      const pattern = 'oilamor:session:*'
      const keys = await redis.keys(pattern)
      
      let destroyed = 0
      
      for (const key of keys) {
        const session = await redis.get<Session>(key)
        if (session?.data?.userId === userId) {
          await redis.del(key)
          destroyed++
        }
      }
      
      logger.info('User sessions destroyed', { userId, count: destroyed })
      return destroyed
    } catch (error) {
      logger.error('User sessions destruction error', error as Error, { userId })
      return 0
    }
  }
  
  // ========================================================================
  // SESSION VALIDATION
  // ========================================================================
  
  async validate(
    sessionId: string,
    validation?: { ipAddress?: string; userAgent?: string }
  ): Promise<{ valid: boolean; session?: Session; reason?: string }> {
    const session = await this.get(sessionId)
    
    if (!session) {
      return { valid: false, reason: 'Session not found or expired' }
    }
    
    // Validate IP address if provided
    if (validation?.ipAddress && session.ipAddress) {
      if (session.ipAddress !== validation.ipAddress) {
        logger.warn('Session IP mismatch', {
          sessionId: sessionId.slice(0, 8) + '...',
          expected: session.ipAddress,
          received: validation.ipAddress,
        })
        return { valid: false, reason: 'IP address mismatch' }
      }
    }
    
    // Note: User agent validation can be too strict due to browser updates
    // Consider only validating major browser/version
    
    return { valid: true, session }
  }
  
  // ========================================================================
  // SESSION CLEANUP
  // ========================================================================
  
  async cleanup(): Promise<number> {
    try {
      // Redis TTL handles most cleanup automatically
      // This method can be used for additional cleanup tasks
      
      const pattern = 'oilamor:session:*'
      const keys = await redis.keys(pattern)
      
      let cleaned = 0
      const now = Date.now()
      
      for (const key of keys) {
        const session = await redis.get<Session>(key)
        
        if (session) {
          const age = now - session.createdAt
          
          if (age > this.config.maxAge * 1000) {
            await redis.del(key)
            cleaned++
          }
        }
      }
      
      logger.info('Session cleanup completed', { cleaned })
      return cleaned
    } catch (error) {
      logger.error('Session cleanup error', error as Error)
      return 0
    }
  }
  
  // ========================================================================
  // SESSION STATS
  // ========================================================================
  
  async getStats(): Promise<{
    total: number
    authenticated: number
    withCart: number
  }> {
    try {
      const pattern = 'oilamor:session:*'
      const keys = await redis.keys(pattern)
      
      let authenticated = 0
      let withCart = 0
      
      for (const key of keys) {
        const session = await redis.get<Session>(key)
        
        if (session) {
          if (session.data?.userId) authenticated++
          if (session.data?.cartId) withCart++
        }
      }
      
      return {
        total: keys.length,
        authenticated,
        withCart,
      }
    } catch (error) {
      logger.error('Session stats error', error as Error)
      return { total: 0, authenticated: 0, withCart: 0 }
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const sessionManager = new SessionManager()

// ============================================================================
// COOKIE HELPERS
// ============================================================================

export const SESSION_COOKIE = {
  name: 'oilamor_session',
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  },
}

export function parseSessionCookie(cookieHeader?: string | null): string | null {
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';')
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    
    if (name === SESSION_COOKIE.name && value) {
      return decodeURIComponent(value)
    }
  }
  
  return null
}

export function createSessionCookie(sessionId: string): string {
  const { name, options } = SESSION_COOKIE
  
  let cookie = `${name}=${encodeURIComponent(sessionId)}; Path=${options.path}; Max-Age=${options.maxAge}`
  
  if (options.httpOnly) cookie += '; HttpOnly'
  if (options.secure) cookie += '; Secure'
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`
  
  return cookie
}

export function clearSessionCookie(): string {
  const { name } = SESSION_COOKIE
  return `${name}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`
}
