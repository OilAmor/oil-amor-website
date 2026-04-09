# Operations Runbook

This runbook contains step-by-step procedures for common operational tasks and incident response for the Oil Amor platform.

---

## Table of Contents

1. [Deploying Changes](#1-deploying-changes)
2. [Handling Incidents](#2-handling-incidents)
3. [Monitoring Dashboards](#3-monitoring-dashboards)
4. [Customer Support Guide](#4-customer-support-guide)
5. [Emergency Procedures](#5-emergency-procedures)

---

## 1. Deploying Changes

### 1.1 Standard Deployment

**When to use:** Regular feature releases, bug fixes, content updates

```bash
# 1. Ensure you're on the latest main
git checkout main
git pull origin main

# 2. Run the deployment script
./scripts/deploy.sh

# 3. Or deploy via GitHub Actions
# Push to main branch triggers automatic deployment
```

**Verification steps:**
1. Check health endpoint: `curl https://oilamor.com/api/health`
2. Verify homepage loads without errors
3. Test product configurator
4. Check Shopify product sync

### 1.2 Hotfix Deployment

**When to use:** Critical bug fixes that can't wait for normal deployment cycle

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# 2. Make fix, commit, and push
git add .
git commit -m "HOTFIX: [description]"
git push origin hotfix/critical-fix

# 3. Create PR and get emergency review (at least 1 approval)

# 4. Merge and deploy immediately
```

### 1.3 Database Migration Deployment

**When to use:** Schema changes requiring database migration

```bash
# 1. Backup database first
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# 2. Run migrations
pnpm migrate up

# 3. Verify migration status
pnpm migrate status

# 4. Deploy application
pnpm deploy

# 5. If rollback needed:
pnpm migrate down
# Or restore from backup
```

---

## 2. Handling Incidents

### 2.1 Incident Response Process

1. **Detect**: Monitor alerts from Sentry, Vercel, or health checks
2. **Assess**: Determine severity (P1 Critical, P2 High, P3 Medium, P4 Low)
3. **Communicate**: Notify team in #incidents Slack channel
4. **Mitigate**: Apply temporary fix or rollback
5. **Resolve**: Implement permanent fix
6. **Post-mortem**: Document within 24 hours for P1/P2 incidents

### 2.2 Common Issues & Resolutions

#### Issue: Site is down (503 errors)

**Severity:** P1 Critical

**Checklist:**
- [ ] Check Vercel status page: https://www.vercel-status.com
- [ ] Run health check: `curl https://oilamor.com/api/health`
- [ ] Check error logs in Vercel dashboard
- [ ] Verify database connections
- [ ] Check Redis connectivity

**Resolution:**
```bash
# If database issue, check connection
psql $DATABASE_URL -c "SELECT 1"

# If Redis issue, check Upstash dashboard
# Consider failover to backup region

# If application error, rollback immediately:
vercel --prod --version <last-known-good>
```

#### Issue: Checkout not working

**Severity:** P1 Critical (revenue impact)

**Checklist:**
- [ ] Test checkout flow on staging
- [ ] Check Shopify API status
- [ ] Verify payment gateway (Stripe/PayPal)
- [ ] Check cart API endpoint

**Resolution:**
```bash
# Test cart creation
curl -X POST https://oilamor.com/api/cart \
  -H "Content-Type: application/json" \
  -d '{"items":[]}'

# Check Shopify rate limits
# If rate limited, wait or contact Shopify support
```

#### Issue: Refill credits not applying

**Severity:** P2 High

**Checklist:**
- [ ] Check bottle registration in database
- [ ] Verify credit balance
- [ ] Check order webhook processing
- [ ] Test credit API manually

**Resolution:**
```bash
# Check bottle status
psql $DATABASE_URL -c "SELECT * FROM forever_bottles WHERE customer_email = 'user@example.com'"

# Check credits
psql $DATABASE_URL -c "SELECT * FROM refill_credits WHERE bottle_id = '...'"

# If webhook missed, manually process:
psql $DATABASE_URL -c "UPDATE refill_credits SET status = 'used', used_at = NOW() WHERE id = '...'"
```

#### Issue: Slow page loads

**Severity:** P3 Medium

**Checklist:**
- [ ] Check Vercel Analytics for Core Web Vitals
- [ ] Review Redis cache hit rate
- [ ] Check for N+1 queries
- [ ] Verify image optimization

**Resolution:**
```bash
# Clear Redis cache
redis-cli -u $REDIS_URL FLUSHDB

# Check cache hit rate
pnpm ops:cache-stats

# If image issue, purge CDN
curl -X POST "https://api.vercel.com/v1/integrations/deploy/..."
```

### 2.3 Escalation Contacts

| Issue Type | Primary | Escalation |
|------------|---------|------------|
| Infrastructure | DevOps Lead | CTO |
| Checkout/Payments | Backend Lead | CTO |
| Shopify Integration | Commerce Lead | CTO |
| Data/Database | Database Admin | CTO |

---

## 3. Monitoring Dashboards

### 3.1 Primary Dashboards

| Dashboard | URL | Check Frequency |
|-----------|-----|-----------------|
| Vercel | https://vercel.com/oil-amor | Daily |
| Sentry | https://sentry.io/oil-amor | Daily |
| Analytics | https://vercel.com/analytics | Weekly |
| Shopify | https://admin.shopify.com | Daily |
| Upstash | https://console.upstash.com | Weekly |

### 3.2 Key Metrics to Monitor

**Performance Metrics:**
- Page load time < 2 seconds
- Time to First Byte (TTFB) < 600ms
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s

**Business Metrics:**
- Conversion rate > 2%
- Cart abandonment < 70%
- Checkout completion > 80%
- Refill credit utilization > 60%

**Error Metrics:**
- 5xx errors < 0.1%
- 4xx errors < 1%
- JavaScript errors < 100/day
- API error rate < 1%

### 3.3 Alert Configuration

**Sentry Alerts:**
- New error types: Immediate
- Error volume spike: > 100% increase in 1 hour
- Performance regression: P95 latency > 2s

**Vercel Alerts:**
- Deployment failures: Immediate
- Function errors: Immediate
- Build warnings: Daily digest

**Custom Alerts:**
- Checkout failure rate > 5%: Immediate
- Refill system errors: Immediate
- Inventory sync failures: Within 1 hour

---

## 4. Customer Support Guide

### 4.1 Common Customer Issues

#### Issue: "I can't find my Forever Bottle"

**Diagnosis:**
1. Ask for order email
2. Check forever_bottles table
3. Verify bottle status

**Resolution:**
```sql
-- Find bottle by email
SELECT * FROM forever_bottles 
WHERE customer_email ILIKE '%customer@email.com%'
ORDER BY created_at DESC;
```

**Customer communication:**
> "I found your Forever Bottle! It was registered under order #1234. You have X credits remaining."

#### Issue: "My refill credits aren't working"

**Diagnosis:**
1. Check bottle status is 'active'
2. Verify credits remaining > 0
3. Check for pending/locked credits

**Resolution:**
```sql
-- Check credits status
SELECT 
  fb.id, 
  fb.status,
  fb.credits_remaining,
  COUNT(rc.id) FILTER (WHERE rc.status = 'available') as available_credits
FROM forever_bottles fb
LEFT JOIN refill_credits rc ON fb.id = rc.bottle_id
WHERE fb.customer_email = 'customer@email.com'
GROUP BY fb.id;
```

#### Issue: "I haven't received my order"

**Diagnosis:**
1. Check order status in Shopify
2. Verify shipment tracking
3. Check Australia Post status

**Resolution:**
```sql
-- Find shipment
SELECT * FROM shipments 
WHERE customer_email = 'customer@email.com' 
ORDER BY created_at DESC LIMIT 5;
```

**Customer communication:**
> "Your order shipped on [date] via Australia Post. Tracking: [number]. Current status: [status]."

#### Issue: "The configurator is stuck"

**Diagnosis:**
1. Check browser console for errors
2. Verify Redis session exists
3. Test in incognito mode

**Resolution:**
```bash
# Check session
redis-cli -u $REDIS_URL GET "session:<session_id>"

# Clear session if needed
redis-cli -u $REDIS_URL DEL "session:<session_id>"
```

**Customer communication:**
> "Please try refreshing the page or clearing your browser cache. If the issue persists, I can help you complete your order manually."

### 4.2 Refund Policy

**Eligible for refund:**
- Unused Forever Bottles within 30 days
- Damaged/defective products
- Wrong item shipped

**Not eligible:**
- Used refill credits
- Opened essential oils (hygiene)
- Custom blends (made to order)

**Process:**
1. Verify eligibility
2. Create refund in Shopify
3. Update bottle status to 'cancelled' if Forever Bottle
4. Notify customer

### 4.3 Escalation to Technical Team

Escalate when:
- Issue affects multiple customers
- Potential bug identified
- Data inconsistency suspected
- System error visible in logs

**Escalation template:**
```
Customer: [email]
Issue: [description]
Steps taken: [actions]
Error details: [logs/screenshots]
Urgency: [Low/Medium/High]
```

---

## 5. Emergency Procedures

### 5.1 Complete Site Outage

1. **Immediate (0-5 min):**
   - Acknowledge in #incidents channel
   - Check Vercel status page
   - Run health check script

2. **Short-term (5-30 min):**
   - Identify root cause
   - Implement fix or rollback
   - Update status page

3. **Communication:**
   - Post on social media if > 30 min
   - Email newsletter subscribers if > 1 hour
   - Update status page hourly

### 5.2 Data Breach Response

1. **Immediate:**
   - Isolate affected systems
   - Notify security team
   - Document timeline

2. **Within 24 hours:**
   - Assess scope
   - Notify affected customers
   - Report to authorities if required

3. **Post-incident:**
   - Security audit
   - Policy updates
   - Team training

### 5.3 Payment Processing Failure

1. **Check:**
   - Stripe/PayPal status pages
   - API credentials validity
   - Webhook endpoint health

2. **Temporary fix:**
   - Enable backup payment method
   - Enable manual order entry
   - Update checkout messaging

3. **Resolution:**
   - Restore primary gateway
   - Reprocess failed transactions
   - Verify all payments captured

---

## Appendix: Quick Commands

```bash
# Health check
curl https://oilamor.com/api/health | jq

# View logs
vercel logs oil-amor --production

# Database connection
psql $DATABASE_URL

# Redis CLI
redis-cli -u $REDIS_URL

# Clear cache
redis-cli -u $REDIS_URL FLUSHDB

# Backup database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Check metrics
curl https://oilamor.com/api/metrics
```
