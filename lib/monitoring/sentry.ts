// =============================================================================
// Sentry Configuration for Oil Amor
// =============================================================================
// Error tracking, performance monitoring, and user feedback integration
// =============================================================================

import * as Sentry from "@sentry/nextjs";

// Initialize Sentry with Next.js specific configuration
export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_APP_ENV || "development",
      release: process.env.NEXT_PUBLIC_APP_VERSION || "dev",
      
      // Performance monitoring
      tracesSampleRate: process.env.NEXT_PUBLIC_APP_ENV === "production" ? 0.1 : 1.0,
      
      // Session replay for debugging (limited sampling in production)
      replaysSessionSampleRate: 0.01,
      replaysOnErrorSampleRate: 1.0,
      
      // Enable debug mode in development
      debug: process.env.NEXT_PUBLIC_APP_ENV === "development",
      
      // Filter out common non-actionable errors
      ignoreErrors: [
        // Browser extensions
        /chrome-extension/i,
        /moz-extension/i,
        /safari-extension/i,
        
        // Common network errors
        "Network Error",
        "Failed to fetch",
        "Network request failed",
        
        // Shopify checkout redirects
        /shopify/i,
        
        // Analytics blockers
        /gtag/i,
        /ga-disable/i,
      ],
      
      // Deny URLs that are known to cause issues
      denyUrls: [
        /extensions\//i,
        /^chrome:\/\//i,
        /^chrome-extension:\/\//i,
      ],
      
      // Before send hook for additional filtering
      beforeSend(event) {
        // Don't send events in development unless explicitly enabled
        if (process.env.NEXT_PUBLIC_APP_ENV === "development" && !process.env.SEND_DEV_ERRORS) {
          return null;
        }
        
        // Sanitize sensitive data
        if (event.request) {
          delete event.request.cookies;
          delete event.request.headers?.["Authorization"];
          delete event.request.headers?.["authorization"];
          
          if (event.request.data) {
            try {
              const data = typeof event.request.data === "string" 
                ? JSON.parse(event.request.data) 
                : event.request.data;
              
              // Mask sensitive fields
              const sensitiveFields = ["password", "token", "creditCard", "cvv", "cardNumber"];
              sensitiveFields.forEach(field => {
                if (data[field]) data[field] = "[REDACTED]";
              });
              
              event.request.data = JSON.stringify(data);
            } catch {
              // If we can't parse, leave as is
            }
          }
        }
        
        return event;
      },
      
      // Tags for better filtering
      initialScope: {
        tags: {
          site: "oil-amor",
          platform: "nextjs",
        },
      },
    });
  }
}

// Custom error capture with context
export function captureError(
  error: Error | string,
  context?: {
    tags?: Record<string, string>;
    extras?: Record<string, unknown>;
    user?: { id: string; email?: string };
  }
) {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    
    if (context?.extras) {
      Object.entries(context.extras).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    
    if (context?.user) {
      scope.setUser({
        id: context.user.id,
        email: context.user.email,
      });
    }
    
    if (typeof error === "string") {
      Sentry.captureMessage(error, "error");
    } else {
      Sentry.captureException(error);
    }
  });
}

// Capture API errors with request context
export function captureApiError(
  error: Error,
  request: Request,
  context: {
    route: string;
    method: string;
    statusCode?: number;
  }
) {
  captureError(error, {
    tags: {
      "error.type": "api_error",
      "api.route": context.route,
      "api.method": context.method,
      "api.status": String(context.statusCode || "unknown"),
    },
    extras: {
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    },
  });
}

// Capture Shopify API errors
export function captureShopifyError(
  error: Error,
  operation: string,
  variables?: Record<string, unknown>
) {
  captureError(error, {
    tags: {
      "error.type": "shopify_error",
      "shopify.operation": operation,
    },
    extras: {
      variables,
    },
  });
}

// Capture checkout errors
export function captureCheckoutError(
  error: Error,
  step: string,
  cartId?: string
) {
  captureError(error, {
    tags: {
      "error.type": "checkout_error",
      "checkout.step": step,
    },
    extras: {
      cartId,
    },
  });
}

// Performance monitoring helpers
export function startTransaction(
  name: string,
  op: string,
  data?: Record<string, unknown>
) {
  return Sentry.startTransaction({
    name,
    op,
    data,
  });
}

export function startSpan(
  transaction: ReturnType<typeof startTransaction>,
  op: string,
  description: string
) {
  return transaction.startChild({
    op,
    description,
  });
}

// User feedback integration
export function showFeedbackDialog() {
  Sentry.showReportDialog({
    title: "We'd love to hear from you",
    subtitle: "Let us know what went wrong or how we can improve.",
    subtitle2: "Our team will look into this right away.",
    labelName: "Your Name",
    labelEmail: "Your Email",
    labelComments: "What happened?",
    labelClose: "Close",
    labelSubmit: "Send Feedback",
    successMessage: "Thank you! Your feedback has been sent.",
  });
}

// Breadcrumb tracking for better error context
export function addBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = "info",
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

// Set user context for all future events
export function setUser(user: { id: string; email?: string; name?: string } | null) {
  Sentry.setUser(user);
}

// Export Sentry for direct access if needed
export { Sentry };
