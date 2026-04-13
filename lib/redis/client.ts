/**
 * Redis Client Configuration
 * Enterprise-grade Redis client with connection pooling and error handling
 */

import { Redis } from '@upstash/redis'
import { logger } from '@/lib/logging/logger'

// ============================================================================
// REDIS CONFIGURATION
// ============================================================================

interface RedisConfig {
  url: string
  token: string
  retryDelay: number
  maxRetries: number
}

const getRedisConfig = (): RedisConfig | null => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    logger.warn('Redis configuration missing', {
      hasUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      hasToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    return null
  }

  return {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    retryDelay: 100,
    maxRetries: 3,
  }
}

// ============================================================================
// REDIS CLIENT CLASS
// ============================================================================

class RedisClient {
  private client: Redis | null = null
  private config: RedisConfig | null = null
  private isConnected = false
  private connectionAttempts = 0

  constructor() {
    this.config = getRedisConfig()
    if (this.config) {
      this.initializeClient()
    }
  }

  private initializeClient(): void {
    if (!this.config) return

    try {
      this.client = new Redis({
        url: this.config.url,
        token: this.config.token,
        retry: {
          retries: this.config.maxRetries,
          backoff: (retryCount) => {
            const delay = this.config!.retryDelay * Math.pow(2, retryCount)
            logger.warn('Redis retry attempt', { retryCount, delay })
            return delay
          },
        },
      })

      this.isConnected = true
      this.connectionAttempts = 0
      logger.info('Redis client initialized')
    } catch (error) {
      logger.error('Failed to initialize Redis client', error as Error)
      this.isConnected = false
    }
  }

  // ========================================================================
  // CONNECTION HEALTH
  // ========================================================================

  async ping(): Promise<boolean> {
    if (!this.client) return false

    try {
      const result = await this.client.ping()
      return result === 'PONG'
    } catch (error) {
      logger.error('Redis ping failed', error as Error)
      return false
    }
  }

  isHealthy(): boolean {
    return this.isConnected && this.client !== null
  }

  getClient(): Redis | null {
    return this.client
  }

  // ========================================================================
  // SAFE OPERATIONS (with fallback)
  // ========================================================================

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null

    try {
      return await this.client.get(key) as T
    } catch (error) {
      logger.error('Redis GET failed', error as Error, { key })
      return null
    }
  }

  async set<T>(
    key: string,
    value: T,
    options?: { ex?: number; px?: number; nx?: boolean; xx?: boolean }
  ): Promise<boolean> {
    if (!this.client) return false

    try {
      await this.client.set(key, value as unknown as string, options)
      return true
    } catch (error) {
      logger.error('Redis SET failed', error as Error, { key })
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.client) return false

    try {
      await this.client.del(key)
      return true
    } catch (error) {
      logger.error('Redis DEL failed', error as Error, { key })
      return false
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.client) return false

    try {
      await this.client.expire(key, seconds)
      return true
    } catch (error) {
      logger.error('Redis EXPIRE failed', error as Error, { key, seconds })
      return false
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.client) return -2

    try {
      return await this.client.ttl(key)
    } catch (error) {
      logger.error('Redis TTL failed', error as Error, { key })
      return -2
    }
  }

  // ========================================================================
  // HASH OPERATIONS
  // ========================================================================

  async hget<T>(key: string, field: string): Promise<T | null> {
    if (!this.client) return null

    try {
      return await this.client.hget(key, field) as T
    } catch (error) {
      logger.error('Redis HGET failed', error as Error, { key, field })
      return null
    }
  }

  async hset<T>(key: string, field: string, value: T): Promise<boolean> {
    if (!this.client) return false

    try {
      await this.client.hset(key, { [field]: value as unknown as string })
      return true
    } catch (error) {
      logger.error('Redis HSET failed', error as Error, { key, field })
      return false
    }
  }

  async hgetall<T>(key: string): Promise<Record<string, T> | null> {
    if (!this.client) return null

    try {
      return await this.client.hgetall(key) as Record<string, T>
    } catch (error) {
      logger.error('Redis HGETALL failed', error as Error, { key })
      return null
    }
  }

  async hdel(key: string, field: string): Promise<boolean> {
    if (!this.client) return false

    try {
      await this.client.hdel(key, field)
      return true
    } catch (error) {
      logger.error('Redis HDEL failed', error as Error, { key, field })
      return false
    }
  }

  // ========================================================================
  // LIST OPERATIONS
  // ========================================================================

  async lpush<T>(key: string, value: T): Promise<number> {
    if (!this.client) return 0

    try {
      return await this.client.lpush(key, value)
    } catch (error) {
      logger.error('Redis LPUSH failed', error as Error, { key })
      return 0
    }
  }

  async rpop<T>(key: string): Promise<T | null> {
    if (!this.client) return null

    try {
      return await this.client.rpop(key) as T
    } catch (error) {
      logger.error('Redis RPOP failed', error as Error, { key })
      return null
    }
  }

  async llen(key: string): Promise<number> {
    if (!this.client) return 0

    try {
      return await this.client.llen(key)
    } catch (error) {
      logger.error('Redis LLEN failed', error as Error, { key })
      return 0
    }
  }

  async lrange<T>(key: string, start: number, stop: number): Promise<T[]> {
    if (!this.client) return []

    try {
      return (await this.client.lrange(key, start, stop)) as T[]
    } catch (error) {
      logger.error('Redis LRANGE failed', error as Error, { key, start, stop })
      return []
    }
  }

  // ========================================================================
  // SET OPERATIONS
  // ========================================================================

  async sadd<T>(key: string, member: T): Promise<number> {
    if (!this.client) return 0

    try {
      return await this.client.sadd(key, member)
    } catch (error) {
      logger.error('Redis SADD failed', error as Error, { key })
      return 0
    }
  }

  async srem<T>(key: string, member: T): Promise<number> {
    if (!this.client) return 0

    try {
      return await this.client.srem(key, member)
    } catch (error) {
      logger.error('Redis SREM failed', error as Error, { key })
      return 0
    }
  }

  async smembers<T>(key: string): Promise<T[]> {
    if (!this.client) return []

    try {
      return (await this.client.smembers(key)) as T[]
    } catch (error) {
      logger.error('Redis SMEMBERS failed', error as Error, { key })
      return []
    }
  }

  async sismember<T>(key: string, member: T): Promise<boolean> {
    if (!this.client) return false

    try {
      return (await this.client.sismember(key, member)) === 1
    } catch (error) {
      logger.error('Redis SISMEMBER failed', error as Error, { key })
      return false
    }
  }

  // ========================================================================
  // SORTED SET OPERATIONS
  // ========================================================================

  async zadd(key: string, score: number, member: string): Promise<number> {
    if (!this.client) return 0

    try {
      return await this.client.zadd(key, { score, member })
    } catch (error) {
      logger.error('Redis ZADD failed', error as Error, { key, score, member })
      return 0
    }
  }

  async zrem(key: string, member: string): Promise<number> {
    if (!this.client) return 0

    try {
      return await this.client.zrem(key, member)
    } catch (error) {
      logger.error('Redis ZREM failed', error as Error, { key, member })
      return 0
    }
  }

  async zrangebyscore<T>(
    key: string,
    min: number | string,
    max: number | string
  ): Promise<T[]> {
    if (!this.client) return []

    try {
      return (await this.client.zrangebyscore(key, min, max)) as T[]
    } catch (error) {
      logger.error('Redis ZRANGEBYSCORE failed', error as Error, { key, min, max })
      return []
    }
  }

  async zremrangebyscore(
    key: string,
    min: number | string,
    max: number | string
  ): Promise<number> {
    if (!this.client) return 0

    try {
      return await this.client.zremrangebyscore(key, min, max)
    } catch (error) {
      logger.error('Redis ZREMRANGEBYSCORE failed', error as Error, { key, min, max })
      return 0
    }
  }

  async zcard(key: string): Promise<number> {
    if (!this.client) return 0

    try {
      return await this.client.zcard(key)
    } catch (error) {
      logger.error('Redis ZCARD failed', error as Error, { key })
      return 0
    }
  }

  // ========================================================================
  // PIPELINE OPERATIONS
  // ========================================================================

  pipeline(): ReturnType<Redis['pipeline']> | null {
    if (!this.client) return null
    return this.client.pipeline()
  }

  // ========================================================================
  // UTILITY
  // ========================================================================

  async keys(pattern: string): Promise<string[]> {
    if (!this.client) return []

    try {
      return await this.client.keys(pattern)
    } catch (error) {
      logger.error('Redis KEYS failed', error as Error, { pattern })
      return []
    }
  }

  async flushdb(): Promise<boolean> {
    if (!this.client) return false

    try {
      await this.client.flushdb()
      logger.warn('Redis database flushed')
      return true
    } catch (error) {
      logger.error('Redis FLUSHDB failed', error as Error)
      return false
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const redis = new RedisClient()

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a namespaced key
 */
export function createKey(...parts: (string | number)[]): string {
  return `oilamor:${parts.join(':')}`
}

/**
 * Create a cache key for a specific entity
 */
export function createCacheKey(
  entity: string,
  identifier: string,
  version?: string
): string {
  const parts = ['cache', entity, identifier]
  if (version) parts.push(`v${version}`)
  return createKey(...parts)
}

/**
 * Create a session key
 */
export function createSessionKey(sessionId: string): string {
  return createKey('session', sessionId)
}

/**
 * Create a rate limit key
 */
export function createRateLimitKey(
  identifier: string,
  action: string
): string {
  return createKey('ratelimit', action, identifier)
}

/**
 * Create a cart key
 */
export function createCartKey(cartId: string): string {
  return createKey('cart', cartId)
}
