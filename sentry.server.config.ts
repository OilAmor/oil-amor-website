/**
 * Sentry Server Configuration
 * Error tracking and performance monitoring for the server
 */

import * as Sentry from '@sentry/nextjs'

// ============================================================================
// SENTRY SERVER INITIALIZATION
// ============================================================================

Sentry.init({
  // DSN from environment
  dsn: process.env.SENTRY_DSN,
  
  // Environment
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.SENTRY_RELEASE || process.env.npm_package_version,
  
  // ==========================================================================
  // ERROR TRACKING
  // ==========================================================================
  
  beforeSend(event) {
    // Filter out specific errors
    if (event.exception?.values?.[0]) {
      const errorMessage = event.exception.values[0].value || ''
      
      // Ignore specific non-actionable errors
      const ignoredErrors = [
        'Network Error',
        'ECONNRESET',
        'ETIMEDOUT',
        'ENOTFOUND',
        'EAI_AGAIN',
      ]
      
      if (ignoredErrors.some(msg => errorMessage.includes(msg))) {
        return null
      }
    }
    
    // Sanitize sensitive data
    if (event.request) {
      if (event.request.headers) {
        delete event.request.headers['Authorization']
        delete event.request.headers['Cookie']
        delete event.request.headers['X-API-Key']
        delete event.request.headers['X-Shopify-Access-Token']
      }
      
      // Mask sensitive query params
      if (event.request.query_string) {
        if (typeof event.request.query_string === 'string') {
          event.request.query_string = event.request.query_string.replace(
            /(token|password|secret|key)=([^&]+)/gi,
            '$1=[REDACTED]'
          )
        }
      }
    }
    
    // Add server context
    event.tags = {
      ...event.tags,
      runtime: 'server',
    }
    
    return event
  },
  
  // ==========================================================================
  // PERFORMANCE MONITORING
  // ==========================================================================
  
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '1.0'),
  
  profilesSampleRate: parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || '1.0'),
  
  // ==========================================================================
  // INTEGRATIONS
  // ==========================================================================
  
  integrations: [
    // Prisma integration if using Prisma
    // Sentry.prismaIntegration(),
    
    // Console integration for server logs
    Sentry.captureConsoleIntegration({
      levels: ['error', 'warn'],
    }),
  ],
  
  // ==========================================================================
  // DEBUG & DEVELOPMENT
  // ==========================================================================
  
  debug: process.env.NODE_ENV === 'development',
  enabled: process.env.NODE_ENV === 'production' || process.env.SENTRY_ENABLED === 'true',
  
  // ==========================================================================
  // CONTEXT
  // ==========================================================================
  
  initialScope: {
    tags: {
      app: 'oil-amor',
      tier: 'tier-1',
    },
  },
})

// ============================================================================
// CUSTOM SERVER ERROR HANDLING
// ============================================================================

// Capture unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  Sentry.captureException(reason, {
    contexts: {
      promise: {
        reason: reason instanceof Error ? reason.message : String(reason),
      },
    },
    tags: {
      error_type: 'unhandled_rejection',
    },
  })
})

// Capture uncaught exceptions
process.on('uncaughtException', (error) => {
  Sentry.captureException(error, {
    tags: {
      error_type: 'uncaught_exception',
    },
  })
  
  // Give Sentry time to send the error before exiting
  Sentry.close(2000).then(() => {
    process.exit(1)
  })
})

// Log initialization
if (process.env.NODE_ENV === 'development') {
  console.log('[Sentry] Server SDK initialized')
}
