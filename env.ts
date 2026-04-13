/**
 * Environment Variable Validation
 * 
 * Uses t3-env to validate environment variables at runtime and build time.
 * This ensures all required variables are present and correctly typed.
 */

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Database
    DATABASE_URL: z.string().url(),
    
    // Shopify
    SHOPIFY_STORE_DOMAIN: z.string().min(1),
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string().min(1),
    SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().min(1),
    SHOPIFY_WEBHOOK_SECRET: z.string().min(1),
    
    // Sanity CMS
    SANITY_PROJECT_ID: z.string().min(1),
    SANITY_DATASET: z.string().default('production'),
    SANITY_API_TOKEN: z.string().min(1),
    
    // Redis (Upstash) - Optional
    REDIS_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    
    // Australia Post
    AUSPOST_API_KEY: z.string().optional(),
    AUSPOST_API_SECRET: z.string().optional(),
    AUSPOST_WEBHOOK_SECRET: z.string().optional(),
    
    // Optional/Development only
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    SHOPIFY_ADMIN_API_VERSION: z.string().default('2024-01'),
  },
  
  client: {
    // Shopify (public)
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string().min(1),
    
    // Sanity (public)
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    
    // App URL
    NEXT_PUBLIC_APP_URL: z.string().url().default('https://oilamor.com'),
  },
  
  runtimeEnv: {
    // Server
    DATABASE_URL: process.env.DATABASE_URL,
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    SHOPIFY_ADMIN_ACCESS_TOKEN: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    SHOPIFY_WEBHOOK_SECRET: process.env.SHOPIFY_WEBHOOK_SECRET,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    REDIS_URL: process.env.REDIS_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    AUSPOST_API_KEY: process.env.AUSPOST_API_KEY,
    AUSPOST_API_SECRET: process.env.AUSPOST_API_SECRET,
    AUSPOST_WEBHOOK_SECRET: process.env.AUSPOST_WEBHOOK_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    SHOPIFY_ADMIN_API_VERSION: process.env.SHOPIFY_ADMIN_API_VERSION,
    
    // Client
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  
  skipValidation: process.env.SKIP_ENV_VALIDATION === 'true',
})
