// =============================================================================
// Health Check Endpoint
// =============================================================================
// Returns status of all critical services: database, Redis, Shopify API
// Used by monitoring tools and load balancers
// =============================================================================

import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Health check configuration
const HEALTH_CONFIG = {
  // Timeout for external service checks (ms)
  timeout: 5000,
  
  // Services to check
  services: [
    "redis",
    "shopify",
    "sanity",
  ] as const,
};

type ServiceStatus = "healthy" | "degraded" | "unhealthy";

interface ServiceHealth {
  status: ServiceStatus;
  responseTime: number;
  error?: string;
  details?: Record<string, unknown>;
}

interface HealthCheckResponse {
  status: ServiceStatus;
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  services: Record<string, ServiceHealth>;
  checks: {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
  };
}

// Redis client initialization
const redis = Redis.fromEnv();

// Check Redis health
async function checkRedisHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    // Test Redis connection with a ping
    const pingResult = await Promise.race([
      redis.ping(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Redis timeout")), HEALTH_CONFIG.timeout)
      ),
    ]);
    
    const responseTime = Date.now() - startTime;
    
    if (pingResult !== "PONG") {
      return {
        status: "unhealthy",
        responseTime,
        error: "Unexpected Redis response",
      };
    }
    
    // Get Redis info for additional details
    const info = await redis.info("server");
    
    return {
      status: responseTime > 1000 ? "degraded" : "healthy",
      responseTime,
      details: {
        version: info?.redis_version,
        mode: info?.redis_mode || "standalone",
      },
    };
  } catch (error) {
    return {
      status: "unhealthy",
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Check Shopify API health
async function checkShopifyHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    if (!storeDomain || !accessToken) {
      return {
        status: "unhealthy",
        responseTime: 0,
        error: "Missing Shopify credentials",
      };
    }
    
    // Simple GraphQL query to test connection
    const response = await Promise.race([
      fetch(`https://${storeDomain}/api/2024-10/graphql.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: `
            query {
              shop {
                name
                primaryDomain {
                  url
                }
              }
            }
          `,
        }),
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Shopify timeout")), HEALTH_CONFIG.timeout)
      ),
    ]);
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        status: "unhealthy",
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
    
    const data = await response.json();
    
    if (data.errors) {
      return {
        status: "degraded",
        responseTime,
        error: data.errors[0]?.message || "GraphQL error",
        details: { shopName: data.data?.shop?.name },
      };
    }
    
    return {
      status: responseTime > 2000 ? "degraded" : "healthy",
      responseTime,
      details: {
        shopName: data.data?.shop?.name,
        domain: data.data?.shop?.primaryDomain?.url,
      },
    };
  } catch (error) {
    return {
      status: "unhealthy",
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Check Sanity API health
async function checkSanityHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    const token = process.env.SANITY_API_TOKEN;
    
    if (!projectId) {
      return {
        status: "unhealthy",
        responseTime: 0,
        error: "Missing Sanity project ID",
      };
    }
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await Promise.race([
      fetch(
        `https://${projectId}.api.sanity.io/v2024-10-28/data/query/${dataset}?query=*[_type == "siteSettings"][0]{_id}`,
        { headers }
      ),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Sanity timeout")), HEALTH_CONFIG.timeout)
      ),
    ]);
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        status: "unhealthy",
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
    
    return {
      status: responseTime > 2000 ? "degraded" : "healthy",
      responseTime,
      details: {
        projectId,
        dataset,
      },
    };
  } catch (error) {
    return {
      status: "unhealthy",
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Calculate overall status based on individual service statuses
function calculateOverallStatus(services: Record<string, ServiceHealth>): ServiceStatus {
  const statuses = Object.values(services).map(s => s.status);
  
  if (statuses.every(s => s === "healthy")) {
    return "healthy";
  }
  
  if (statuses.some(s => s === "unhealthy")) {
    return "unhealthy";
  }
  
  return "degraded";
}

// Main health check handler
export async function GET() {
  // Record start time for total response time
  const requestStartTime = Date.now();
  
  // Run all health checks in parallel
  const [redisHealth, shopifyHealth, sanityHealth] = await Promise.all([
    checkRedisHealth(),
    checkShopifyHealth(),
    checkSanityHealth(),
  ]);
  
  const services: Record<string, ServiceHealth> = {
    redis: redisHealth,
    shopify: shopifyHealth,
    sanity: sanityHealth,
  };
  
  const overallStatus = calculateOverallStatus(services);
  
  // Count statuses
  const statuses = Object.values(services).map(s => s.status);
  const checks = {
    total: statuses.length,
    healthy: statuses.filter(s => s === "healthy").length,
    degraded: statuses.filter(s => s === "degraded").length,
    unhealthy: statuses.filter(s => s === "unhealthy").length,
  };
  
  const response: HealthCheckResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
    environment: process.env.NEXT_PUBLIC_APP_ENV || "unknown",
    uptime: process.uptime(),
    services,
    checks,
  };
  
  // Determine HTTP status code
  const statusCode = overallStatus === "healthy" ? 200 : 
                     overallStatus === "degraded" ? 200 : 503;
  
  // Add cache headers to prevent caching of health checks
  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "X-Response-Time": `${Date.now() - requestStartTime}ms`,
    },
  });
}

// HEAD request for simple health checks (load balancers)
export async function HEAD() {
  const redisHealth = await checkRedisHealth();
  
  const isHealthy = redisHealth.status === "healthy";
  
  return new Response(null, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

// CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
