/**
 * Redis Cache Manager
 * Enterprise caching with TTL, versioning, and cache warming
 */

import { redis, createCacheKey } from './client'
import { logger } from '@/lib/logging/logger'

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

interface CacheConfig {
  ttl: number // Time to live in seconds
  version?: string // Cache version for invalidation
  tags?: string[] // Cache tags for grouped invalidation
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  version: string
  tags: string[]
}

// ============================================================================
// DEFAULT TTLs
// ============================================================================

export const CACHE_TTLS = {
  // API responses
  api: {
    products: 300, // 5 minutes
    product: 300,
    collections: 600, // 10 minutes
    cart: 60, // 1 minute
    search: 60,
  },
  
  // CMS content
  cms: {
    oils: 3600, // 1 hour
    crystals: 3600,
    synergies: 3600,
    pages: 1800, // 30 minutes
  },
  
  // User data
  user: {
    profile: 300,
    tier: 300,
    preferences: 600,
  },
  
  // Computed data
  computed: {
    recommendations: 1800, // 30 minutes
    pricing: 60,
    inventory: 30, // 30 seconds
  },
} as const

// ============================================================================
// CACHE MANAGER
// ============================================================================

class CacheManager {
  private defaultVersion = '1'
  
  // ========================================================================
  // BASIC OPERATIONS
  // ========================================================================
  
  async get<T>(
    entity: string,
    identifier: string,
    config: Partial<CacheConfig> = {}
  ): Promise<T | null> {
    const key = createCacheKey(entity, identifier, config.version || this.defaultVersion)
    
    try {
      const entry = await redis.get<CacheEntry<T>>(key)
      
      if (!entry) return null
      
      // Check if entry is expired (Redis TTL should handle this, but double-check)
      const now = Date.now()
      const age = (now - entry.timestamp) / 1000
      const ttl = config.ttl || CACHE_TTLS.api.products
      
      if (age > ttl) {
        await this.del(entity, identifier, config)
        return null
      }
      
      // Check version
      if (entry.version !== (config.version || this.defaultVersion)) {
        await this.del(entity, identifier, config)
        return null
      }
      
      return entry.data
    } catch (error) {
      logger.error('Cache get error', error as Error, { entity, identifier })
      return null
    }
  }
  
  async set<T>(
    entity: string,
    identifier: string,
    data: T,
    config: CacheConfig
  ): Promise<boolean> {
    const key = createCacheKey(entity, identifier, config.version || this.defaultVersion)
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: config.version || this.defaultVersion,
      tags: config.tags || [],
    }
    
    try {
      const success = await redis.set(key, entry, { ex: config.ttl })
      
      if (success && config.tags) {
        // Add to tag indexes
        for (const tag of config.tags) {
          await redis.sadd(`oilamor:cache:tags:${tag}`, key)
        }
      }
      
      return success
    } catch (error) {
      logger.error('Cache set error', error as Error, { entity, identifier })
      return false
    }
  }
  
  async del(
    entity: string,
    identifier: string,
    config: Partial<CacheConfig> = {}
  ): Promise<boolean> {
    const key = createCacheKey(entity, identifier, config.version || this.defaultVersion)
    
    try {
      // Remove from tag indexes
      if (config.tags) {
        for (const tag of config.tags) {
          await redis.srem(`oilamor:cache:tags:${tag}`, key)
        }
      }
      
      return await redis.del(key)
    } catch (error) {
      logger.error('Cache delete error', error as Error, { entity, identifier })
      return false
    }
  }
  
  // ========================================================================
  // CACHE-ASIDE PATTERN (GET OR SET)
  // ========================================================================
  
  async getOrSet<T>(
    entity: string,
    identifier: string,
    factory: () => Promise<T>,
    config: CacheConfig
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(entity, identifier, config)
    
    if (cached !== null) {
      logger.debug('Cache hit', { entity, identifier })
      return cached
    }
    
    logger.debug('Cache miss', { entity, identifier })
    
    // Generate data
    const data = await factory()
    
    // Store in cache (don't await - fire and forget)
    this.set(entity, identifier, data, config)
    
    return data
  }
  
  // ========================================================================
  // TAG-BASED INVALIDATION
  // ========================================================================
  
  async invalidateByTag(tag: string): Promise<number> {
    try {
      const keys = await redis.smembers<string>(`oilamor:cache:tags:${tag}`)
      
      let deleted = 0
      for (const key of keys) {
        if (await redis.del(key)) {
          deleted++
        }
      }
      
      // Clean up tag index
      await redis.del(`oilamor:cache:tags:${tag}`)
      
      logger.info('Cache invalidated by tag', { tag, keysDeleted: deleted })
      return deleted
    } catch (error) {
      logger.error('Cache invalidation error', error as Error, { tag })
      return 0
    }
  }
  
  async invalidateByTags(tags: string[]): Promise<number> {
    let totalDeleted = 0
    
    for (const tag of tags) {
      totalDeleted += await this.invalidateByTag(tag)
    }
    
    return totalDeleted
  }
  
  // ========================================================================
  // ENTITY-BASED INVALIDATION
  // ========================================================================
  
  async invalidateEntity(entity: string): Promise<number> {
    try {
      const pattern = `oilamor:cache:${entity}:*`
      const keys = await redis.keys(pattern)
      
      let deleted = 0
      for (const key of keys) {
        if (await redis.del(key)) {
          deleted++
        }
      }
      
      logger.info('Cache invalidated by entity', { entity, keysDeleted: deleted })
      return deleted
    } catch (error) {
      logger.error('Entity cache invalidation error', error as Error, { entity })
      return 0
    }
  }
  
  // ========================================================================
  // GLOBAL INVALIDATION
  // ========================================================================
  
  async flush(): Promise<boolean> {
    try {
      const keys = await redis.keys('oilamor:cache:*')
      
      for (const key of keys) {
        await redis.del(key)
      }
      
      logger.warn('Cache flushed', { keysDeleted: keys.length })
      return true
    } catch (error) {
      logger.error('Cache flush error', error as Error)
      return false
    }
  }
  
  // ========================================================================
  // CACHE WARMING
  // ========================================================================
  
  async warm<T>(
    entity: string,
    identifiers: string[],
    factory: (id: string) => Promise<T>,
    config: CacheConfig
  ): Promise<{ warmed: number; failed: number }> {
    let warmed = 0
    let failed = 0
    
    for (const identifier of identifiers) {
      try {
        const data = await factory(identifier)
        if (await this.set(entity, identifier, data, config)) {
          warmed++
        } else {
          failed++
        }
      } catch (error) {
        logger.error('Cache warming error', error as Error, { entity, identifier })
        failed++
      }
    }
    
    logger.info('Cache warming completed', { entity, warmed, failed })
    return { warmed, failed }
  }
  
  // ========================================================================
  // CACHE STATS
  // ========================================================================
  
  async getStats(): Promise<{
    totalKeys: number
    byEntity: Record<string, number>
  }> {
    try {
      const keys = await redis.keys('oilamor:cache:*')
      
      const byEntity: Record<string, number> = {}
      
      for (const key of keys) {
        const parts = key.split(':')
        const entity = parts[2] || 'unknown'
        byEntity[entity] = (byEntity[entity] || 0) + 1
      }
      
      return {
        totalKeys: keys.length,
        byEntity,
      }
    } catch (error) {
      logger.error('Cache stats error', error as Error)
      return { totalKeys: 0, byEntity: {} }
    }
  }
  
  // ========================================================================
  // CONDITIONAL CACHING
  // ========================================================================
  
  async getStaleWhileRevalidate<T>(
    entity: string,
    identifier: string,
    factory: () => Promise<T>,
    config: CacheConfig & { staleTtl: number }
  ): Promise<T> {
    const key = createCacheKey(entity, identifier, config.version || this.defaultVersion)
    
    try {
      const entry = await redis.get<CacheEntry<T>>(key)
      
      if (!entry) {
        // No cache, fetch and store
        const data = await factory()
        await this.set(entity, identifier, data, config)
        return data
      }
      
      const now = Date.now()
      const age = (now - entry.timestamp) / 1000
      
      if (age < config.ttl) {
        // Cache is fresh
        return entry.data
      }
      
      if (age < config.staleTtl) {
        // Cache is stale but usable, return stale and revalidate in background
        logger.debug('Serving stale cache', { entity, identifier, age })
        
        // Revalidate in background
        factory().then((data) => {
          this.set(entity, identifier, data, config)
        }).catch((error) => {
          logger.error('Background revalidation error', error, { entity, identifier })
        })
        
        return entry.data
      }
      
      // Cache is too stale, fetch new data
      const data = await factory()
      await this.set(entity, identifier, data, config)
      return data
      
    } catch (error) {
      logger.error('Stale-while-revalidate error', error as Error, { entity, identifier })
      // Fallback to factory
      return factory()
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const cache = new CacheManager()

// ============================================================================
// DECORATOR HELPER
// ============================================================================

export function withCache<T extends (...args: any[]) => Promise<any>>(
  entity: string,
  getIdentifier: (...args: Parameters<T>) => string,
  config: CacheConfig
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    
    descriptor.value = async function (...args: Parameters<T>): Promise<ReturnType<T>> {
      const identifier = getIdentifier(...args)
      
      return cache.getOrSet(
        entity,
        identifier,
        () => originalMethod.apply(this, args),
        config
      )
    }
    
    return descriptor
  }
}
