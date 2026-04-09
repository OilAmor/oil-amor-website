# Oil Amor — Complete System Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Quick Start](#quick-start)
3. [Component Reference](#component-reference)
4. [API Reference](#api-reference)
5. [Deployment Guide](#deployment-guide)
6. [Operations](#operations)

---

## Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE LAYER                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         Next.js 15 App Router                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   Config-   │  │   Cart &    │  │   Content   │  │    Admin    │  │  │
│  │  │   urator    │  │  Checkout   │  │   Pages     │  │   Portal    │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │  │
│  └─────────┼────────────────┼────────────────┼────────────────┼─────────┘  │
│            │                │                │                │            │
└────────────┼────────────────┼────────────────┼────────────────┼────────────┘
             │                │                │                │
             ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER (Edge)                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   /api/     │  │   /api/     │  │   /api/     │  │   /api/     │        │
│  │  products   │  │   orders    │  │  shipping   │  │   health    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   /api/     │  │   /api/     │  │   /api/     │  │   /api/     │        │
│  │   credits   │  │  webhooks   │  │  synergies  │  │  metrics    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
             │                │                │                │
             ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA & SERVICE LAYER                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │     Shopify     │  │     Sanity      │  │  Upstash Redis  │              │
│  │     Store       │  │    Headless     │  │      Cache      │              │
│  │  ┌───────────┐  │  │  ┌───────────┐  │  │  ┌───────────┐  │              │
│  │  │ Products  │  │  │  │  Schema   │  │  │  │ Sessions  │  │              │
│  │  │  Orders   │  │  │  │ Content   │  │  │  │   Cart    │  │              │
│  │  │ Inventory │  │  │  │  Media    │  │  │  │   Rates   │  │              │
│  │  └───────────┘  │  │  └───────────┘  │  │  └───────────┘  │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│  ┌─────────────────┐  ┌─────────────────┐                                    │
│  │  Australia Post │  │  Stripe/PayPal  │                                    │
│  │  Shipping API   │  │  Payment GW     │                                    │
│  └─────────────────┘  └─────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Interactions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW: User Journey                              │
└─────────────────────────────────────────────────────────────────────────────┘

1. DISCOVERY
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  Browse  │────▶│  Sanity  │────▶│  Return  │
   │  Content │     │  Content │     │  Pages   │
   └──────────┘     └──────────┘     └──────────┘

2. CONFIGURATION
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Configure│────▶│  Redis   │────▶│  Shopify │
   │  Blend   │     │ Session  │     │ Products │
   └──────────┘     └──────────┘     └──────────┘

3. CHECKOUT
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │   Add    │────▶│  Cart    │────▶│ Checkout │
   │ to Cart  │     │  Update  │     │ Process  │
   └──────────┘     └──────────┘     └──────────┘

4. FULFILLMENT
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  Order   │────▶│ Shipping │────▶│ Tracking │
   │  Create  │     │  Rate    │     │ Update   │
   └──────────┘     └──────────┘     └──────────┘

5. RETENTION
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  Refill  │────▶│ Credits  │────▶│  Ship    │
   │ Request  │     │ Apply    │     │ Refill   │
   └──────────┘     └──────────┘     └──────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 15 (App Router) | React framework with SSR/SSG |
| **Language** | TypeScript 5.x | Type-safe development |
| **Styling** | Tailwind CSS 4.x | Utility-first CSS |
| **Components** | shadcn/ui | Accessible UI components |
| **Animations** | Framer Motion | Smooth interactions |
| **Database** | Sanity | Headless CMS |
| **Cache** | Upstash Redis | Edge caching |
| **Commerce** | Shopify | E-commerce backend |
| **Shipping** | Australia Post | Domestic shipping |
| **Hosting** | Vercel | Edge deployment |
| **Monitoring** | Sentry + Vercel Analytics | Error & performance |

---

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- pnpm (recommended) or npm
- Git
- A Vercel account
- A Shopify store
- A Sanity project
- An Upstash Redis database

### 5-Minute Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/oil-amor.git
cd oil-amor

# 2. Install dependencies
pnpm install

# 3. Copy environment template
cp .env.template .env.local

# 4. Fill in environment variables (see ENVIRONMENT_SETUP.md)
# Edit .env.local with your credentials

# 5. Run database migrations
pnpm migrate

# 6. Seed the database
pnpm seed

# 7. Start development server
pnpm dev

# 8. Open browser
open http://localhost:3000
```

### Environment Validation

```bash
# Check all required variables are set
pnpm verify:env

# Test all service connections
pnpm verify:services

# Run health check
pnpm health
```

---

## Component Reference

### Core Components

| Component | Path | Description |
|-----------|------|-------------|
| **Product Configurator** | `/app/(shop)/configure/page.tsx` | 3-step blend creation |
| **Shopping Cart** | `/app/(shop)/cart/page.tsx` | Cart with real-time updates |
| **Checkout** | `/app/(shop)/checkout/page.tsx` | Stripe + PayPal integration |
| **Forever Bottle Portal** | `/app/(shop)/account/refills/page.tsx` | Refill credit management |
| **Synergy Guide** | `/app/(shop)/synergies/page.tsx` | Crystal-oil matching |
| **Content Pages** | `/app/(content)/*` | Landing pages, About, etc. |

### API Routes

| Endpoint | Description | Cache |
|----------|-------------|-------|
| `GET /api/products` | List all products | 5 min |
| `GET /api/products/[handle]` | Single product | 5 min |
| `POST /api/cart` | Create/update cart | No cache |
| `GET /api/shipping/rates` | Calculate shipping | 1 min |
| `POST /api/orders` | Create order | No cache |
| `GET /api/synergies` | Crystal-oil pairs | 1 hour |
| `GET /api/credits/[userId]` | User credits | 5 min |
| `POST /api/webhooks/shopify` | Shopify events | No cache |
| `GET /api/health` | Health status | No cache |

### Library Modules

| Module | Path | Purpose |
|--------|------|---------|
| `shopify-client` | `/lib/shopify/` | Storefront & Admin API |
| `sanity-client` | `/lib/sanity/` | Content fetching |
| `redis-client` | `/lib/redis/` | Session & cache |
| `auspost-client` | `/lib/shipping/` | Shipping calculations |
| `synergy-engine` | `/lib/synergy/` | Crystal matching logic |
| `credit-manager` | `/lib/credits/` | Refill credit system |

---

## API Reference

### Products API

#### List Products
```http
GET /api/products?category=essential-oils&limit=20
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category |
| `limit` | number | Max results (default: 20) |
| `cursor` | string | Pagination cursor |

**Response:**
```json
{
  "products": [
    {
      "id": "gid://shopify/Product/123",
      "title": "Lavender Essential Oil",
      "handle": "lavender-oil",
      "price": 24.99,
      "images": [...],
      "variants": [...]
    }
  ],
  "pageInfo": {
    "hasNextPage": true,
    "endCursor": "eyJsYXN0X2lk..."
  }
}
```

### Cart API

#### Create Cart
```http
POST /api/cart
Content-Type: application/json

{
  "lines": [
    {
      "merchandiseId": "gid://shopify/ProductVariant/456",
      "quantity": 1,
      "attributes": [
        {"key": "BottleSize", "value": "10ml"},
        {"key": "OilSelections", "value": "Lavender,Tea Tree"}
      ]
    }
  ]
}
```

### Shipping API

#### Calculate Rates
```http
POST /api/shipping/rates
Content-Type: application/json

{
  "postcode": "2000",
  "weight": 0.5,
  "dimensions": {
    "length": 15,
    "width": 10,
    "height": 5
  }
}
```

**Response:**
```json
{
  "rates": [
    {
      "service": "Express Post",
      "code": "AUS_PARCEL_EXPRESS",
      "price": 12.95,
      "estimatedDays": 1
    },
    {
      "service": "Standard Post",
      "code": "AUS_PARCEL_STANDARD",
      "price": 9.95,
      "estimatedDays": 3
    }
  ]
}
```

### Credits API

#### Get User Credits
```http
GET /api/credits/user_123
```

**Response:**
```json
{
  "userId": "user_123",
  "foreverBottles": [
    {
      "bottleId": "fb_001",
      "size": "30ml",
      "creditsRemaining": 5,
      "totalCredits": 6
    }
  ],
  "totalCredits": 5,
  "history": [...]
}
```

#### Apply Credit
```http
POST /api/credits/apply
Content-Type: application/json

{
  "userId": "user_123",
  "bottleId": "fb_001",
  "orderId": "order_456"
}
```

---

## Deployment Guide

### Production Deployment Checklist

- [ ] All environment variables configured in Vercel
- [ ] Shopify webhook URLs updated
- [ ] Database migrations run
- [ ] Sanity schemas deployed
- [ ] Redis indexes created
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Sentry DSN configured
- [ ] Analytics enabled

### Step-by-Step Production Deploy

```bash
# 1. Ensure you're on main branch
git checkout main
git pull origin main

# 2. Run pre-deployment checks
pnpm verify:all

# 3. Deploy to Vercel
vercel --prod

# 4. Run post-deployment smoke tests
pnpm test:smoke

# 5. Verify health endpoint
curl https://oilamor.com/api/health

# 6. Check monitoring dashboards
open https://sentry.io/oil-amor
open https://vercel.com/oil-amor/analytics
```

### Environment-Specific Configurations

#### Development
```bash
NEXT_PUBLIC_APP_ENV=development
SANITY_DATASET=development
SHOPIFY_STORE_DOMAIN=oil-amor-dev.myshopify.com
```

#### Staging
```bash
NEXT_PUBLIC_APP_ENV=staging
SANITY_DATASET=staging
SHOPIFY_STORE_DOMAIN=oil-amor-staging.myshopify.com
```

#### Production
```bash
NEXT_PUBLIC_APP_ENV=production
SANITY_DATASET=production
SHOPIFY_STORE_DOMAIN=oil-amor.myshopify.com
```

---

## Operations

### Monitoring Dashboards

| Service | URL | Purpose |
|---------|-----|---------|
| Vercel Dashboard | https://vercel.com/oil-amor | Deployments, logs |
| Sentry | https://sentry.io/oil-amor | Error tracking |
| Analytics | https://vercel.com/analytics | Performance metrics |
| Shopify Admin | https://admin.shopify.com | Store management |
| Sanity Studio | https://oil-amor.sanity.studio | Content management |
| Upstash Console | https://console.upstash.com | Redis monitoring |

### Daily Operations

```bash
# Check system health
pnpm ops:health

# View recent errors
pnpm ops:errors

# Check cache hit rates
pnpm ops:cache-stats

# Review order metrics
pnpm ops:orders
```

### Backup Procedures

```bash
# Export Sanity content
pnpm sanity export production.tar.gz

# Backup Redis data
pnpm redis:backup

# Export Shopify data
pnpm shopify:export
```

---

## Support & Resources

### Documentation Links

- [Component Documentation](./docs/COMPONENTS.md)
- [Environment Setup](./docs/ENVIRONMENT_SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Operations Runbook](./docs/RUNBOOK.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [API Reference](./docs/API_REFERENCE.md)

### Team Contacts

| Role | Contact | Responsibilities |
|------|---------|------------------|
| Tech Lead | tech@oilamor.com | Architecture decisions |
| DevOps | devops@oilamor.com | Infrastructure, deployments |
| Support | support@oilamor.com | Customer issues |

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Shopify API Reference](https://shopify.dev/api)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## License

Copyright © 2026 Oil Amor. All rights reserved.
