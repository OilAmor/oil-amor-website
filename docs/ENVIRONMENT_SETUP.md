# Environment Setup Guide

Complete step-by-step guide for setting up all external services for Oil Amor.

---

## Table of Contents

1. [Shopify Setup](#1-shopify-setup)
2. [Sanity Setup](#2-sanity-setup)
3. [Redis (Upstash) Setup](#3-redis-upstash-setup)
4. [Australia Post Setup](#4-australia-post-setup)
5. [Payment Provider Setup](#5-payment-provider-setup)
6. [Monitoring Setup](#6-monitoring-setup)
7. [Verification](#7-verification)

---

## 1. Shopify Setup

### 1.1 Create Shopify Store

1. Go to [shopify.com](https://shopify.com)
2. Sign up for a new account
3. Choose a store name (e.g., `oil-amor`)
4. Complete the onboarding process

### 1.2 Create Storefront API Access Token

1. In Shopify Admin, go to **Settings** → **Apps and sales channels**
2. Click **Develop apps**
3. Click **Create an app**
4. Name it "Oil Amor Storefront"
5. Click **Configure Storefront API scopes**
6. Enable the following permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_selling_plans`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_customers` (optional, for customer accounts)
   - `unauthenticated_write_customers` (optional)
7. Click **Save**
8. Click **Install app**
9. Copy the **Storefront access token**

### 1.3 Create Admin API Access Token

1. In the same app, click **Configure Admin API scopes**
2. Enable:
   - `read_products`
   - `write_products`
   - `read_orders`
   - `write_orders`
   - `read_inventory`
   - `write_inventory`
   - `read_shipping`
   - `read_analytics`
3. Click **Save**
4. Go to **API credentials** tab
5. Click **Install app** (if not already installed)
6. Click **Reveal token once** under Admin API access token
7. Copy the token immediately (it won't be shown again)

### 1.4 Configure Webhooks

1. In Shopify Admin, go to **Settings** → **Notifications**
2. Scroll to **Webhooks**
3. Add the following webhooks pointing to `https://yoursite.com/api/webhooks/shopify`:
   - Order creation
   - Order update
   - Product update
   - Inventory levels update
   - App uninstall (for cleanup)

### 1.5 Set Up Products

Create the following product structure:

```
Products/
├── Essential Oils/
│   ├── Lavender Essential Oil
│   ├── Tea Tree Essential Oil
│   ├── Eucalyptus Essential Oil
│   ├── Peppermint Essential Oil
│   ├── Lemon Essential Oil
│   ├── Frankincense Essential Oil
│   ├── Bergamot Essential Oil
│   ├── Ylang Ylang Essential Oil
│   ├── Chamomile Essential Oil
│   ├── Rosemary Essential Oil
│   ├── Sandalwood Essential Oil
│   └── Orange Sweet Essential Oil
├── Forever Bottles/
│   ├── 10ml Forever Bottle (Glass)
│   ├── 30ml Forever Bottle (Glass)
│   └── 50ml Forever Bottle (Glass)
├── Refills/
│   └── Essential Oil Refill Credit
├── Accessories/
│   ├── Crystal Cords
│   ├── Decorative Charms
│   └── Labels & Tags
└── Crystal Vials/
    ├── Amethyst Vial
    ├── Rose Quartz Vial
    ├── Citrine Vial
    └── Clear Quartz Vial
```

For each Forever Bottle product:
- Add variants for different sizes (10ml, 30ml, 50ml)
- Set metafields for `included_refills` (number)
- Set metafields for `bottle_material` (Glass/Sapphire)

---

## 2. Sanity Setup

### 2.1 Create Sanity Project

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Click **Create new project**
3. Name it "Oil Amor"
4. Choose the closest region (Sydney for Australia)
5. Click **Create project**

### 2.2 Create Dataset

Create three datasets:

```bash
# Development
sanity dataset create development

# Staging
sanity dataset create staging

# Production
sanity dataset create production
```

### 2.3 Generate API Token

1. In your project dashboard, go to **API** tab
2. Click **Add API token**
3. Name: "Oil Amor Website"
4. Permissions: **Editor** (read + write)
5. Copy the token

### 2.4 Deploy Studio (Optional)

```bash
# Initialize Sanity Studio
sanity init

# Deploy to production
sanity deploy
```

### 2.5 Import Schemas

Run the schema deployment:

```bash
pnpm sanity:deploy-schemas
```

---

## 3. Redis (Upstash) Setup

### 3.1 Create Upstash Account

1. Go to [console.upstash.com](https://console.upstash.com)
2. Sign up with your email or GitHub
3. Verify your email

### 3.2 Create Redis Database

1. Click **Create database**
2. Name: "oil-amor-cache"
3. Region: Choose closest to your users (Sydney for Australia)
4. Type: **Regional** (for low latency)
5. Click **Create**

### 3.3 Get Connection Details

1. In your database dashboard, go to **Details**
2. Copy the **REST URL** (looks like `https://your-redis.upstash.io`)
3. Copy the **REST Token**
4. Note the **PORT** (usually 6379)

### 3.4 Configure Eviction Policy

1. Go to **Configuration** tab
2. Set **Max memory policy** to `allkeys-lru`
3. This ensures old data is evicted when memory is full

---

## 4. Australia Post Setup

### 4.1 Register Developer Account

1. Go to [developers.auspost.com.au](https://developers.auspost.com.au)
2. Click **Register**
3. Complete the registration form
4. Verify your email

### 4.2 Create API Credentials

1. Log in to the Developer Portal
2. Go to **My Account** → **API Keys**
3. Click **Create new API key**
4. Name: "Oil Amor Shipping"
5. Select APIs:
   - Shipping & Tracking
   - Postcode Search
6. Copy the **API Key** and **API Secret**

### 4.3 (Optional) Negotiated Rates

If you have a business account with Australia Post:

1. Contact your Australia Post account manager
2. Request API access for your account
3. Provide them with your API key
4. They will link your account for negotiated rates

---

## 5. Payment Provider Setup

### 5.1 Stripe Setup

1. Go to [stripe.com](https://stripe.com)
2. Create an account
3. Complete verification
4. Go to **Developers** → **API keys**
5. Copy **Publishable key** (starts with `pk_live_` or `pk_test_`)
6. Copy **Secret key** (starts with `sk_live_` or `sk_test_`)
7. Go to **Webhooks** → **Add endpoint**
   - URL: `https://yoursite.com/api/webhooks/stripe`
   - Events to listen to:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `checkout.session.completed`
     - `invoice.payment_succeeded` (for refills)
8. Copy the **Webhook signing secret**

### 5.2 PayPal Setup (Optional)

1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Log in with your PayPal business account
3. Go to **Dashboard** → **My Apps & Credentials**
4. Click **Create App**
5. Name: "Oil Amor"
6. Copy **Client ID** and **Secret**

---

## 6. Monitoring Setup

### 6.1 Sentry Setup

1. Go to [sentry.io](https://sentry.io)
2. Create an account or log in
3. Click **Create project**
4. Platform: **Next.js**
5. Name: "oil-amor"
6. Copy the **DSN** URL

### 6.2 Vercel Analytics

Vercel Analytics is automatically enabled when deployed to Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Analytics** tab
4. Click **Enable**

---

## 7. Verification

### 7.1 Test Environment Variables

Create a `.env.local` file and run the verification script:

```bash
# Copy the template
cp .env.template .env.local

# Fill in all values
nano .env.local

# Run verification
pnpm verify:env
```

### 7.2 Test Service Connections

```bash
# Test Shopify connection
pnpm verify:shopify

# Test Sanity connection
pnpm verify:sanity

# Test Redis connection
pnpm verify:redis

# Test Australia Post
pnpm verify:auspost

# Test all services
pnpm verify:all
```

### 7.3 Expected Output

```
✓ Environment variables loaded
✓ Shopify API connection successful
✓ Sanity API connection successful
✓ Redis connection successful
✓ Australia Post API connection successful
✓ All verifications passed!
```

---

## Troubleshooting

### Shopify Connection Fails

- Verify store domain format (no https://)
- Check token permissions include required scopes
- Ensure store is not in development mode

### Sanity Connection Fails

- Verify project ID is correct
- Check dataset name exists
- Ensure API token has correct permissions

### Redis Connection Fails

- Verify REST URL format
- Check token is complete (not truncated)
- Ensure database is in "Active" state

### Australia Post Connection Fails

- Verify API key is activated (may take 24 hours)
- Check account is verified
- Ensure you're using the correct endpoint (test vs production)

---

## Next Steps

Once all services are configured:

1. Run database migrations: `pnpm migrate`
2. Seed initial data: `pnpm seed`
3. Start development server: `pnpm dev`
4. Verify at http://localhost:3000

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment steps.
