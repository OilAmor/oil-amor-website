// =============================================================================
// Vercel Analytics Integration for Oil Amor
// =============================================================================
// Core Web Vitals tracking and custom event analytics
// =============================================================================

import { Analytics } from "@vercel/analytics/react";
import { track } from "@vercel/analytics";
import { useReportWebVitals } from "next/web-vitals";
import { useEffect } from "react";

// Re-export Analytics component for easy import
export { Analytics };

// Re-export track function
export { track };

// =============================================================================
// Core Web Vitals Monitoring
// =============================================================================

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  navigationType?: string;
}

export function useAnalytics() {
  useReportWebVitals((metric: WebVitalsMetric) => {
    // Send to analytics endpoint for custom tracking
    const body = JSON.stringify({
      ...metric,
      url: window.location.href,
      timestamp: Date.now(),
    });
    
    // Use sendBeacon for reliable delivery
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/web-vitals", body);
    } else {
      fetch("/api/analytics/web-vitals", {
        body,
        method: "POST",
        keepalive: true,
      }).catch(() => {
        // Silently fail - analytics shouldn't break the app
      });
    }
    
    // Log in development
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(`[Web Vitals] ${metric.name}: ${metric.value}`, metric);
    }
  });
}

// =============================================================================
// Custom Event Tracking
// =============================================================================

export type AnalyticsEvent =
  // E-commerce events
  | "product_viewed"
  | "product_added_to_cart"
  | "product_removed_from_cart"
  | "cart_viewed"
  | "checkout_started"
  | "checkout_completed"
  | "checkout_failed"
  | "purchase_complete"
  
  // Configurator events
  | "configurator_started"
  | "step_completed"
  | "oils_selected"
  | "crystal_selected"
  | "bottle_size_selected"
  | "accessories_added"
  | "blend_saved"
  | "blend_shared"
  
  // Refill events
  | "refill_requested"
  | "credit_applied"
  | "refill_order_placed"
  
  // Navigation events
  | "page_view"
  | "search_performed"
  | "filter_applied"
  | "sort_changed"
  
  // User events
  | "account_created"
  | "login"
  | "logout"
  | "wishlist_added"
  | "wishlist_removed"
  
  // Content events
  | "synergy_viewed"
  | "journal_article_read"
  | "video_played";

interface EventProperties {
  // Product properties
  product_id?: string;
  product_name?: string;
  product_price?: number;
  product_category?: string;
  
  // Cart properties
  cart_id?: string;
  cart_value?: number;
  cart_items_count?: number;
  
  // Configurator properties
  step_number?: number;
  total_steps?: number;
  oil_selections?: string[];
  crystal_selection?: string;
  bottle_size?: string;
  
  // Refill properties
  bottle_id?: string;
  credits_used?: number;
  credits_remaining?: number;
  
  // Order properties
  order_id?: string;
  order_value?: number;
  shipping_method?: string;
  payment_method?: string;
  
  // General properties
  path?: string;
  referrer?: string;
  search_query?: string;
  filter_type?: string;
  filter_value?: string;
  
  // Custom properties
  [key: string]: unknown;
}

export function trackEvent(
  event: AnalyticsEvent,
  properties?: EventProperties
) {
  // Send to Vercel Analytics
  track(event, properties);
  
  // Log in development
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`[Analytics] ${event}`, properties);
  }
}

// =============================================================================
// E-commerce Tracking Helpers
// =============================================================================

export function trackProductView(product: {
  id: string;
  name: string;
  price: number;
  category: string;
}) {
  trackEvent("product_viewed", {
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    product_category: product.category,
  });
}

export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}, cart: { id: string; itemsCount: number; total: number }) {
  trackEvent("product_added_to_cart", {
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    cart_id: cart.id,
    cart_items_count: cart.itemsCount,
    cart_value: cart.total,
  });
}

export function trackCheckoutStarted(cart: {
  id: string;
  itemsCount: number;
  total: number;
}) {
  trackEvent("checkout_started", {
    cart_id: cart.id,
    cart_items_count: cart.itemsCount,
    cart_value: cart.total,
  });
}

export function trackPurchase(order: {
  id: string;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
}) {
  trackEvent("purchase_complete", {
    order_id: order.id,
    order_value: order.total,
    shipping_method: order.shippingMethod,
    payment_method: order.paymentMethod,
  });
}

// =============================================================================
// Configurator Tracking Helpers
// =============================================================================

export function trackConfiguratorStart() {
  trackEvent("configurator_started");
}

export function trackStepComplete(stepNumber: number, totalSteps: number) {
  trackEvent("step_completed", {
    step_number: stepNumber,
    total_steps: totalSteps,
  });
}

export function trackOilSelection(oils: string[]) {
  trackEvent("oils_selected", {
    oil_selections: oils,
  });
}

export function trackCrystalSelection(crystal: string) {
  trackEvent("crystal_selected", {
    crystal_selection: crystal,
  });
}

export function trackBottleSizeSelection(size: string) {
  trackEvent("bottle_size_selected", {
    bottle_size: size,
  });
}

export function trackBlendSave() {
  trackEvent("blend_saved");
}

// =============================================================================
// Refill Tracking Helpers
// =============================================================================

export function trackRefillRequest(bottleId: string, creditsUsed: number) {
  trackEvent("refill_requested", {
    bottle_id: bottleId,
    credits_used: creditsUsed,
  });
}

export function trackCreditApplied(
  bottleId: string,
  creditsUsed: number,
  creditsRemaining: number
) {
  trackEvent("credit_applied", {
    bottle_id: bottleId,
    credits_used: creditsUsed,
    credits_remaining: creditsRemaining,
  });
}

// =============================================================================
// Page View Tracking
// =============================================================================

export function usePageView() {
  useEffect(() => {
    trackEvent("page_view", {
      path: window.location.pathname,
      referrer: document.referrer,
    });
  }, []);
}

// =============================================================================
// Search Tracking
// =============================================================================

export function trackSearch(query: string, resultsCount: number) {
  trackEvent("search_performed", {
    search_query: query,
    results_count: resultsCount,
  });
}

// =============================================================================
// Filter & Sort Tracking
// =============================================================================

export function trackFilterApplied(type: string, value: string) {
  trackEvent("filter_applied", {
    filter_type: type,
    filter_value: value,
  });
}

export function trackSortChanged(sortBy: string) {
  trackEvent("sort_changed", {
    sort_by: sortBy,
  });
}
