/**
 * Sentry Edge Configuration
 * Error tracking for Next.js Edge Runtime
 */

import * as Sentry from '@sentry/nextjs'

// ============================================================================
// SENTRY EDGE INITIALIZATION
// ============================================================================

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  
  release: process.env.SENTRY_RELEASE || process.env.npm_package_version,
  
  // Lower sample rate for edge due to performance constraints
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.5'),
  
  // Debug mode
  debug: process.env.NODE_ENV === 'development',
  
  enabled: process.env.NODE_ENV === 'production' || process.env.SENTRY_ENABLED === 'true',
  
  initialScope: {
    tags: {
      runtime: 'edge',
      app: 'oil-amor',
    },
  },
})
