// ========================================
// Redis Cache Utilities
// ========================================

import { Redis } from 'ioredis'
import { DEFAULT_CACHE_TTL } from './types'

// Redis client singleton
let redisClient: Redis | null = null

export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL
    
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set')
    }
    
    redisClient = new Redis(redisUrl, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      maxRetriesPerRequest: 3,
    })
    
    redisClient.on('error', (err) => {
      console.error('Redis error:', err)
    })
  }
  
  return redisClient
}

// Reset singleton for testing
export function __resetRedisClient(): void {
  redisClient = null
}

// Cache key generator
export function generateCacheKey(prefix: string, ...params: (string | number)[]): string {
  const sanitized = params.map(p => String(p).replace(/:/g, '-'))
  return `oil-amor:${prefix}:${sanitized.join(':')}`
}

// Generic cache get
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient()
    const cached = await client.get(key)
    
    if (cached) {
      return JSON.parse(cached) as T
    }
    
    return null
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

// Generic cache set
export async function setCache<T>(
  key: string,
  data: T,
  ttl: number = DEFAULT_CACHE_TTL.SYNERGY
): Promise<void> {
  try {
    const client = getRedisClient()
    await client.setex(key, ttl, JSON.stringify(data))
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

// Cache delete
export async function deleteCache(key: string): Promise<void> {
  try {
    const client = getRedisClient()
    await client.del(key)
  } catch (error) {
    console.error('Cache delete error:', error)
  }
}

// Cache delete by pattern
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const client = getRedisClient()
    const keys = await client.keys(pattern)
    
    if (keys.length > 0) {
      await client.del(...keys)
    }
  } catch (error) {
    console.error('Cache pattern delete error:', error)
  }
}

// Cache warming utility
export async function warmCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_CACHE_TTL.SYNERGY
): Promise<T> {
  try {
    // Try cache first
    const cached = await getFromCache<T>(key)
    
    if (cached) {
      return cached
    }
    
    // Fetch fresh data
    const data = await fetcher()
    
    // Store in cache
    await setCache(key, data, ttl)
    
    return data
  } catch (error) {
    console.error('Cache warming error:', error)
    
    // Fallback to fetcher on error
    return fetcher()
  }
}

// Conditional cache revalidation
export async function revalidateCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_CACHE_TTL.SYNERGY,
  force: boolean = false
): Promise<T> {
  if (force) {
    const data = await fetcher()
    await setCache(key, data, ttl)
    return data
  }
  
  return warmCache(key, fetcher, ttl)
}
