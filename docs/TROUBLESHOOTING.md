# Troubleshooting Guide

Comprehensive troubleshooting guide for common issues in the Oil Amor platform.

---

## Table of Contents

1. [Application Issues](#application-issues)
2. [Shopify Integration](#shopify-integration)
3. [Database Issues](#database-issues)
4. [Redis/Cache Issues](#rediscache-issues)
5. [Shipping Issues](#shipping-issues)
6. [Payment Issues](#payment-issues)
7. [Build & Deployment Issues](#build--deployment-issues)

---

## Application Issues

### Configurator not loading

**Symptoms:**
- White screen on /configure page
- Loading spinner never completes
- JavaScript errors in console

**Diagnosis:**

```bash
# Check if configurator API is responding
curl https://oilamor.com/api/synergies | head

# Check Redis session storage
redis-cli -u $REDIS_URL KEYS "session:*" | wc -l

# Check for JavaScript errors
# Open browser dev tools > Console
```

**Common Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Missing oils/crystals in database | Run `pnpm seed` to populate data |
| Redis connection failed | Check Upstash credentials, verify firewall rules |
| Session expired | Clear cookies, refresh page |
| API timeout | Check server load, increase timeout in vercel.json |

**Quick Fix:**
```bash
# Clear all sessions
redis-cli -u $REDIS_URL KEYS "session:*" | xargs redis-cli -u $REDIS_URL DEL

# Restart configurator
# Customer: Clear browser cache and cookies
```

### Cart not updating

**Symptoms:**
- Add to cart does nothing
- Cart count not updating
- Items disappearing from cart

**Diagnosis:**

```bash
# Test cart API directly
curl -X POST https://oilamor.com/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "lines": [{
      "merchandiseId": "gid://shopify/ProductVariant/123",
      "quantity": 1
    }]
  }'

# Check cart in Redis
redis-cli -u $REDIS_URL GET "cart:<cart_id>"
```

**Common Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Shopify Storefront API token invalid | Regenerate token in Shopify Admin |
| Product variant ID changed | Sync products with `pnpm seed:shopify` |
| Cart ID mismatch | Clear session storage in browser |
| Inventory out of stock | Check Shopify inventory levels |

### Slow page loads

**Symptoms:**
- LCP > 2.5s
- Time to Interactive > 3.5s
- High bounce rate

**Diagnosis:**

```bash
# Check Vercel Analytics
open https://vercel.com/oil-amor/analytics

# Test Core Web Vitals
npx lighthouse https://oilamor.com --chrome-flags="--headless"

# Check Redis cache hit rate
redis-cli -u $REDIS_URL INFO stats | grep keyspace
```

**Common Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Unoptimized images | Enable Next.js Image optimization, use WebP |
| Large JavaScript bundles | Enable code splitting, lazy load components |
| Missing caching headers | Add cache headers in next.config.js |
| Slow API responses | Add Redis caching, optimize queries |

---

## Shopify Integration

### Shopify sync failures

**Symptoms:**
- Products not updating
- Inventory discrepancies
- Order webhooks not received

**Diagnosis:**

```bash
# Test Shopify API connection
curl -X POST \
  "https://$SHOPIFY_STORE_DOMAIN/api/2024-10/graphql.json" \
  -H "X-Shopify-Storefront-Access-Token: $SHOPIFY_STOREFRONT_ACCESS_TOKEN" \
  -d '{"query": "{ shop { name } }"}'

# Check webhook deliveries in Shopify Admin
# Settings > Notifications > Webhooks

# Verify webhook signature
# Check SHOPIFY_WEBHOOK_SECRET is correct
```

**Common Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| API token expired | Regenerate in Shopify Admin > Apps > Develop apps |
| Rate limiting | Implement exponential backoff, cache responses |
| Webhook URL changed | Update webhook URLs in Shopify Admin |
| Missing scopes | Add required scopes to Shopify app |

### Product not found

**Symptoms:**
- 404 on product pages
- "Product not available" errors
- Configurator shows no oils

**Diagnosis:**

```bash
# Check if product exists in Shopify
curl -X POST \
  "https://$SHOPIFY_STORE_DOMAIN/api/2024-10/graphql.json" \
  -H "X-Shopify-Storefront-Access-Token: $SHOPIFY_STOREFRONT_ACCESS_TOKEN" \
  -d '{"query": "{ product(handle: \"product-handle\") { id title } }"}'

# Check if product is published
# Shopify Admin > Products > [Product] > Publishing
```

**Fix:**
```bash
# Resync products
pnpm seed:shopify

# Or manually publish product in Shopify Admin
```

---

## Database Issues

### Connection errors

**Symptoms:**
- "Database connection failed" errors
- Timeout errors
- Intermittent failures

**Diagnosis:**

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1"

# Check connection pool status
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"

# Check database size
psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size(current_database()));"
```

**Common Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Max connections reached | Increase pool size or close idle connections |
| Wrong credentials | Verify DATABASE_URL in environment |
| Database server down | Check provider status page |
| Firewall blocking | Whitelist Vercel IP ranges |

### Missing data

**Symptoms:**
- Empty product lists
- Missing customer records
- Credit history incomplete

**Diagnosis:**

```bash
# Check row counts
psql $DATABASE_URL -c "SELECT COUNT(*) FROM forever_bottles;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM refill_credits;"

# Check recent records
psql $DATABASE_URL -c "SELECT * FROM forever_bottles ORDER BY created_at DESC LIMIT 10;"
```

**Fix:**
```bash
# Restore from backup (if available)
psql $DATABASE_URL < backup-YYYYMMDD.sql

# Or reseed if development
pnpm seed
```

---

## Redis/Cache Issues

### Cache not working

**Symptoms:**
- Same API calls taking long time
- Redis memory usage flat
- No cache hits in metrics

**Diagnosis:**

```bash
# Test Redis connection
redis-cli -u $REDIS_URL PING

# Check memory usage
redis-cli -u $REDIS_URL INFO memory

# Check hit rate
redis-cli -u $REDIS_URL INFO stats | grep keyspace

# List keys
redis-cli -u $REDIS_URL KEYS "*" | head -20
```

**Common Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Wrong Redis URL | Check UPSTASH_REDIS_REST_URL format |
| Invalid token | Verify UPSTASH_REDIS_REST_TOKEN |
| Cache TTL too short | Increase CACHE_TTL_SECONDS in env |
| Memory full (eviction) | Upgrade plan or reduce cache size |

### Session data lost

**Symptoms:**
- Cart emptied unexpectedly
- Configurator progress lost
- Users logged out

**Diagnosis:**

```bash
# Check session TTL
redis-cli -u $REDIS_URL TTL "session:<session_id>"

# Check session data
redis-cli -u $REDIS_URL GET "session:<session_id>"

# Check for expired keys
redis-cli -u $REDIS_URL INFO keyspace
```

**Fix:**
```bash
# Increase session timeout (default 24h)
# Update SESSION_TIMEOUT_HOURS in .env.local

# Clear corrupted sessions
redis-cli -u $REDIS_URL KEYS "session:*" | xargs redis-cli -u $REDIS_URL DEL
```

---

## Shipping Issues

### Shipping rates not calculating

**Symptoms:**
- "Unable to calculate shipping" error
- No shipping options shown
- Incorrect rates displayed

**Diagnosis:**

```bash
# Test Australia Post API
curl -X POST "https://digitalapi.auspost.com.au/test/shipping/v1/prices/items" \
  -H "AUTH-KEY: $AUSPOST_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "weight": 0.5,
      "length": 15,
      "width": 10,
      "height": 5
    }],
    "to_postcode": "2000",
    "from_postcode": "3000"
  }'

# Check API credentials
echo $AUSPOST_API_KEY | wc -c  # Should be > 0
```

**Common Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Invalid API key | Verify Australia Post developer portal credentials |
| Rate limiting | Implement caching for shipping rates |
| Invalid postcode | Validate Australian postcode format |
| Weight/dimensions missing | Check product weight data in Shopify |

### Tracking not updating

**Symptoms:**
- Stuck on "Shipped" status
- No tracking events visible
- Customers asking about orders

**Diagnosis:**

```bash
# Check shipment status in database
psql $DATABASE_URL -c "
  SELECT id, status, auspost_tracking_number, last_tracking_event 
  FROM shipments 
  WHERE order_id = 'order_123';
"

# Test tracking API manually
curl "https://digitalapi.auspost.com.au/shipping/v1/tracking/$TRACKING_NUMBER" \
  -H "AUTH-KEY: $AUSPOST_API_KEY"
```

**Fix:**
```bash
# Manually trigger tracking update
# Or run sync script
pnpm sync:tracking
```

---

## Payment Issues

### Checkout failing

**Symptoms:**
- "Payment failed" errors
- Orders not completing
- Stripe/PayPal errors

**Diagnosis:**

```bash
# Check Stripe webhook deliveries
# Stripe Dashboard > Developers > Webhooks

# Test Stripe connection
stripe get /v1/account

# Check for failed payments in Stripe Dashboard
# Payments > Filter by "Failed"
```

**Common Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Webhook misconfigured | Verify webhook URL and events in Stripe Dashboard |
| API keys wrong | Check STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY |
| 3D Secure failing | Enable test mode or contact customer bank |
| Fraud rules blocking | Review Stripe Radar rules |

### Duplicate charges

**Symptoms:**
- Customer charged twice
- Multiple orders created
- Webhook received multiple times

**Diagnosis:**

```bash
# Check for duplicate webhooks
psql $DATABASE_URL -c "
  SELECT event_id, COUNT(*) 
  FROM webhook_events 
  WHERE source = 'stripe' 
  GROUP BY event_id 
  HAVING COUNT(*) > 1;
"
```

**Fix:**
```bash
# Implement idempotency key in checkout
# Or refund duplicate charge via Stripe Dashboard
```

---

## Build & Deployment Issues

### Build failing

**Symptoms:**
- Vercel build errors
- "Command failed with exit code 1"
- TypeScript errors

**Diagnosis:**

```bash
# Run build locally
pnpm build

# Check for TypeScript errors
pnpm type-check

# Check for lint errors
pnpm lint
```

**Common Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| TypeScript errors | Run `pnpm type-check` and fix errors |
| Missing dependencies | Run `pnpm install` |
| Out of memory | Increase Node memory: `NODE_OPTIONS="--max-old-space-size=4096"` |
| Environment variables missing | Check .env.template matches Vercel env vars |

### Deployment stuck

**Symptoms:**
- Deployment pending for long time
- Build step hanging
- Timeout errors

**Diagnosis:**

```bash
# Check Vercel deployment logs
vercel logs

# Check for infinite loops in build
# Look for recursive API calls

# Monitor build size
du -sh .next/
```

**Fix:**
```bash
# Cancel and retry
vercel --prod --force

# Or clear cache
rm -rf .next node_modules
pnpm install
pnpm build
```

---

## Getting Help

### Internal Resources

- **Tech Lead**: tech@oilamor.com
- **DevOps**: devops@oilamor.com
- **Slack**: #tech-support channel

### External Resources

- **Vercel Support**: https://vercel.com/help
- **Shopify Partners**: https://partners.shopify.com
- **Stripe Support**: https://support.stripe.com
- **Sanity Support**: https://www.sanity.io/help

### Debug Mode

Enable debug logging:

```bash
# Application
DEBUG=* pnpm dev

# Shopify API
DEBUG=shopify:* pnpm dev

# Database
DEBUG=drizzle:* pnpm dev
```

---

## Appendix: Error Code Reference

| Code | Meaning | Action |
|------|---------|--------|
| `SHOPIFY_001` | Product not found | Resync products |
| `SHOPIFY_002` | Inventory unavailable | Check stock levels |
| `REDIS_001` | Connection failed | Verify credentials |
| `REDIS_002` | Key not found | Check cache TTL |
| `DB_001` | Connection timeout | Check pool settings |
| `DB_002` | Unique constraint | Check for duplicates |
| `AUSPOST_001` | Rate calculation failed | Verify API key |
| `AUSPOST_002` | Invalid postcode | Validate input |
| `PAYMENT_001` | Card declined | Customer to contact bank |
| `PAYMENT_002` | 3D Secure failed | Retry or use alternative |
