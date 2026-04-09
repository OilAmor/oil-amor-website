// =============================================================================
// Prometheus-Compatible Metrics Endpoint
// =============================================================================
// Returns metrics for request counts, error rates, cache hit rates
// Compatible with Prometheus scraping and Grafana dashboards
// =============================================================================

import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Metric types
interface CounterMetric {
  type: "counter";
  name: string;
  help: string;
  value: number;
  labels?: Record<string, string>;
}

interface GaugeMetric {
  type: "gauge";
  name: string;
  help: string;
  value: number;
  labels?: Record<string, string>;
}

interface HistogramMetric {
  type: "histogram";
  name: string;
  help: string;
  buckets: Record<string, number>;
  sum: number;
  count: number;
  labels?: Record<string, string>;
}

type Metric = CounterMetric | GaugeMetric | HistogramMetric;

// Prometheus metric names
const METRIC_NAMES = {
  // Request metrics
  httpRequestsTotal: "http_requests_total",
  httpRequestDuration: "http_request_duration_seconds",
  
  // Error metrics
  httpErrorsTotal: "http_errors_total",
  apiErrorsTotal: "api_errors_total",
  
  // Cache metrics
  cacheHitsTotal: "cache_hits_total",
  cacheMissesTotal: "cache_misses_total",
  cacheHitRatio: "cache_hit_ratio",
  
  // Business metrics
  ordersTotal: "orders_total",
  orderValueTotal: "order_value_total",
  cartAbandonmentTotal: "cart_abandonment_total",
  
  // Configurator metrics
  configuratorStartsTotal: "configurator_starts_total",
  configuratorCompletionsTotal: "configurator_completions_total",
  
  // Refill metrics
  refillCreditsUsedTotal: "refill_credits_used_total",
  refillOrdersTotal: "refill_orders_total",
  
  // System metrics
  memoryUsageBytes: "memory_usage_bytes",
  cpuUsagePercent: "cpu_usage_percent",
} as const;

// Fetch metrics from Redis
async function fetchRedisMetrics(): Promise<{
  cacheHits: number;
  cacheMisses: number;
}> {
  try {
    const [hits, misses] = await Promise.all([
      redis.get<number>("metrics:cache:hits") || 0,
      redis.get<number>("metrics:cache:misses") || 0,
    ]);
    
    return {
      cacheHits: hits || 0,
      cacheMisses: misses || 0,
    };
  } catch {
    return {
      cacheHits: 0,
      cacheMisses: 0,
    };
  }
}

// Fetch request metrics from Redis
async function fetchRequestMetrics(): Promise<{
  totalRequests: number;
  errorRequests: number;
  durationBuckets: Record<string, number>;
}> {
  try {
    const [total, errors, durationData] = await Promise.all([
      redis.get<number>("metrics:requests:total") || 0,
      redis.get<number>("metrics:requests:errors") || 0,
      redis.hgetall<Record<string, string>>("metrics:requests:durations"),
    ]);
    
    const durationBuckets: Record<string, number> = {};
    if (durationData) {
      Object.entries(durationData).forEach(([key, value]) => {
        durationBuckets[key] = parseInt(value, 10) || 0;
      });
    }
    
    return {
      totalRequests: total || 0,
      errorRequests: errors || 0,
      durationBuckets,
    };
  } catch {
    return {
      totalRequests: 0,
      errorRequests: 0,
      durationBuckets: {},
    };
  }
}

// Fetch business metrics from Redis
async function fetchBusinessMetrics(): Promise<{
  orders: number;
  orderValue: number;
  configuratorStarts: number;
  configuratorCompletions: number;
}> {
  try {
    const [orders, orderValue, starts, completions] = await Promise.all([
      redis.get<number>("metrics:business:orders") || 0,
      redis.get<number>("metrics:business:order_value") || 0,
      redis.get<number>("metrics:configurator:starts") || 0,
      redis.get<number>("metrics:configurator:completions") || 0,
    ]);
    
    return {
      orders: orders || 0,
      orderValue: orderValue || 0,
      configuratorStarts: starts || 0,
      configuratorCompletions: completions || 0,
    };
  } catch {
    return {
      orders: 0,
      orderValue: 0,
      configuratorStarts: 0,
      configuratorCompletions: 0,
    };
  }
}

// Format metrics in Prometheus exposition format
function formatPrometheusMetrics(metrics: Metric[]): string {
  const lines: string[] = [];
  
  // Add timestamp
  lines.push(`# Timestamp: ${Date.now()}`);
  lines.push("");
  
  for (const metric of metrics) {
    // Add help text
    lines.push(`# HELP ${metric.name} ${metric.help}`);
    lines.push(`# TYPE ${metric.name} ${metric.type}`);
    
    if (metric.type === "histogram") {
      // Format histogram
      const labels = formatLabels(metric.labels);
      
      // Output buckets
      const sortedBuckets = Object.entries(metric.buckets)
        .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
      
      for (const [bucket, count] of sortedBuckets) {
        const bucketLabels = { ...metric.labels, le: bucket };
        lines.push(`${metric.name}_bucket${formatLabels(bucketLabels)} ${count}`);
      }
      
      // +Inf bucket
      const infLabels = { ...metric.labels, le: "+Inf" };
      lines.push(`${metric.name}_bucket${formatLabels(infLabels)} ${metric.count}`);
      
      // Sum and count
      lines.push(`${metric.name}_sum${labels} ${metric.sum}`);
      lines.push(`${metric.name}_count${labels} ${metric.count}`);
    } else {
      // Format counter or gauge
      const labels = formatLabels(metric.labels);
      lines.push(`${metric.name}${labels} ${metric.value}`);
    }
    
    lines.push("");
  }
  
  return lines.join("\n");
}

// Format labels for Prometheus
function formatLabels(labels?: Record<string, string>): string {
  if (!labels || Object.keys(labels).length === 0) {
    return "";
  }
  
  const formatted = Object.entries(labels)
    .map(([key, value]) => `${key}="${escapeLabelValue(value)}"`)
    .join(",");
  
  return `{${formatted}}`;
}

// Escape special characters in label values
function escapeLabelValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

// Main metrics handler
export async function GET(request: Request) {
  try {
    // Check authentication for metrics endpoint
    const authHeader = request.headers.get("Authorization");
    const expectedToken = process.env.METRICS_API_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Fetch all metrics
    const [
      cacheMetrics,
      requestMetrics,
      businessMetrics,
    ] = await Promise.all([
      fetchRedisMetrics(),
      fetchRequestMetrics(),
      fetchBusinessMetrics(),
    ]);
    
    // Build metrics
    const metrics: Metric[] = [];
    
    // HTTP request metrics
    metrics.push({
      type: "counter",
      name: METRIC_NAMES.httpRequestsTotal,
      help: "Total number of HTTP requests",
      value: requestMetrics.totalRequests,
      labels: { method: "all", status: "all" },
    });
    
    metrics.push({
      type: "counter",
      name: METRIC_NAMES.httpErrorsTotal,
      help: "Total number of HTTP error responses",
      value: requestMetrics.errorRequests,
    });
    
    // Cache metrics
    metrics.push({
      type: "counter",
      name: METRIC_NAMES.cacheHitsTotal,
      help: "Total number of cache hits",
      value: cacheMetrics.cacheHits,
    });
    
    metrics.push({
      type: "counter",
      name: METRIC_NAMES.cacheMissesTotal,
      help: "Total number of cache misses",
      value: cacheMetrics.cacheMisses,
    });
    
    const cacheHitRatio = cacheMetrics.cacheHits + cacheMetrics.cacheMisses > 0
      ? cacheMetrics.cacheHits / (cacheMetrics.cacheHits + cacheMetrics.cacheMisses)
      : 0;
    
    metrics.push({
      type: "gauge",
      name: METRIC_NAMES.cacheHitRatio,
      help: "Cache hit ratio (0-1)",
      value: Math.round(cacheHitRatio * 100) / 100,
    });
    
    // Business metrics
    metrics.push({
      type: "counter",
      name: METRIC_NAMES.ordersTotal,
      help: "Total number of orders",
      value: businessMetrics.orders,
    });
    
    metrics.push({
      type: "counter",
      name: METRIC_NAMES.orderValueTotal,
      help: "Total order value in dollars",
      value: businessMetrics.orderValue,
    });
    
    metrics.push({
      type: "counter",
      name: METRIC_NAMES.configuratorStartsTotal,
      help: "Total number of configurator sessions started",
      value: businessMetrics.configuratorStarts,
    });
    
    metrics.push({
      type: "counter",
      name: METRIC_NAMES.configuratorCompletionsTotal,
      help: "Total number of configurator sessions completed",
      value: businessMetrics.configuratorCompletions,
    });
    
    // Configurator conversion rate
    const configuratorConversion = businessMetrics.configuratorStarts > 0
      ? businessMetrics.configuratorCompletions / businessMetrics.configuratorStarts
      : 0;
    
    metrics.push({
      type: "gauge",
      name: "configurator_conversion_rate",
      help: "Configurator completion conversion rate",
      value: Math.round(configuratorConversion * 100) / 100,
    });
    
    // System metrics (if available)
    if (process.memoryUsage) {
      const memUsage = process.memoryUsage();
      metrics.push({
        type: "gauge",
        name: METRIC_NAMES.memoryUsageBytes,
        help: "Memory usage in bytes",
        value: memUsage.heapUsed,
        labels: { type: "heap" },
      });
    }
    
    // Format as Prometheus exposition format
    const prometheusOutput = formatPrometheusMetrics(metrics);
    
    return new Response(prometheusOutput, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; version=0.0.4",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Metrics endpoint error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}

// Simple JSON endpoint for easier integration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Record a metric
    if (body.type && body.name && body.value !== undefined) {
      const { type, name, value, labels } = body;
      
      const key = `metrics:${type}:${name}${labels ? `:${JSON.stringify(labels)}` : ""}`;
      
      if (type === "counter") {
        await redis.incrby(key, value);
      } else if (type === "gauge") {
        await redis.set(key, value);
      }
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: "Invalid metric format" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
