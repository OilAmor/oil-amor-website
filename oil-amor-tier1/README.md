# Oil Amor — Tier 1 Foundation

> A production-grade Next.js 14 e-commerce platform for luxury essential oils.

## 🏛️ Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | SSR, edge functions, image optimization |
| **Styling** | Tailwind CSS | Utility-first styling with custom design system |
| **Animation** | Framer Motion | Smooth, physics-based interactions |
| **E-commerce** | Shopify Storefront API | Products, inventory, checkout |
| **CMS** | Sanity | Content management for oils, pages, blog |
| **State** | Zustand | Cart state management with persistence |
| **Deployment** | Vercel | Global CDN, edge network, serverless functions |

## 📁 Project Structure

```
oil-amor-tier1/
├── app/                          # Next.js App Router
│   ├── (shop)/                   # Route group for shop pages
│   │   ├── page.tsx              # Homepage
│   │   ├── oils/                 # Oil collection pages
│   │   └── oil/[slug]/           # Individual oil pages
│   ├── api/                      # API routes
│   │   └── cart/                 # Cart API endpoints
│   ├── components/               # React components
│   │   ├── hero-section.tsx
│   │   ├── atelier-section.tsx
│   │   ├── cart-sidebar.tsx
│   │   └── ...
│   ├── hooks/                    # Custom React hooks
│   │   └── use-cart.ts
│   ├── lib/                      # Utility functions
│   │   ├── shopify.ts           # Shopify client
│   │   ├── sanity.ts            # Sanity client
│   │   └── utils.ts
│   ├── types/                    # TypeScript types
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── sanity/                       # Sanity CMS schemas
│   └── schemas/
│       ├── oil.ts
│       └── page.ts
├── public/                       # Static assets
├── .env.local.example            # Environment variables template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd oil-amor-tier1
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Deploy to Vercel

```bash
vercel --prod
```

## 🎨 Design System

### Colors
- **Miron Violet**: `#0a0612` (void) → `#5a3d8c` (glow)
- **Gold**: `#9a7b1a` (dark) → `#e8d5a3` (light)
- **Cream**: `#f8f6f3` (base) → `#e8e4de` (cool)

### Typography
- **Display**: Cormorant Garamond (300, 400, 500, 600)
- **Body**: Inter (300, 400, 500, 600)

### Animations
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo)
- **Scroll reveals**: 0.8s duration, staggered
- **Micro-interactions**: 0.3s, magnetic cursor

## 🛒 Shopify Setup

### 1. Create Store
- Sign up at [Shopify](https://shopify.com)
- Enable Shopify Payments

### 2. Create Storefront API Access Token
- Settings → Apps and sales channels → Develop apps
- Create app → Configuration
- Enable `Storefront API access scopes`:
  - `unauthenticated_read_product_listings`
  - `unauthenticated_read_product_inventory`
  - `unauthenticated_read_product_pickup_locations`
  - `unauthenticated_read_checkouts`
  - `unauthenticated_write_checkouts`
  - `unauthenticated_read_metaobjects`
- Install app → Reveal Storefront access token

### 3. Add Metafields
Products need these metafields:
- `custom.crystal_name` (single line text)
- `custom.crystal_property` (single line text)
- `custom.origin` (single line text)
- `custom.botanical_name` (single line text)

## 📝 Sanity Setup

### 1. Create Project
```bash
npm create sanity@latest -- --template clean --create-project oil-amor --dataset production
```

### 2. Deploy Schema
```bash
npm run sanity:deploy
```

### 3. Add Content
- Go to [Sanity Studio](https://www.sanity.io/manage)
- Add oils with all fields
- Upload images

## 🛍️ Features

### Implemented (Tier 1)
- ✅ Custom cursor with magnetic buttons
- ✅ Animated grain overlay
- ✅ Hero section with cinematic animations
- ✅ Philosophy section with sticky scroll
- ✅ Atelier (horizontal product gallery)
- ✅ Cart functionality (add, update, remove)
- ✅ Shopify checkout integration
- ✅ Mobile-responsive design
- ✅ SEO metadata
- ✅ Performance optimized (image optimization, code splitting)

### Coming (Tier 2)
- Customer accounts
- Subscription management
- Email capture (Klaviyo)
- Multi-currency
- Advanced analytics

### Coming (Tier 3)
- 3D product viewer
- AR try-on
- AI scent quiz
- Gift card system
- B2B wholesale portal

## 📊 Performance

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |

## 🔒 Security

- Environment variables never exposed to client
- Shopify Storefront API uses public token (read-only)
- Sanity uses CDN token for images
- No sensitive data in localStorage (cart ID only)

## 📄 License

Proprietary — Oil Amor 2026

---

Built with ♥ for transcendent experiences.
