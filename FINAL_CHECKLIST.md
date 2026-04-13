# ✅ FINAL DEPLOYMENT CHECKLIST

## Pre-Deployment

### Environment Variables
```bash
# Create .env.local
cp .env.local.example .env.local

# Fill in ALL these values:
```

#### Required
- [ ] `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` — your-store.myshopify.com
- [ ] `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` — Storefront API token
- [ ] `SHOPIFY_STOREFRONT_API_VERSION` — 2024-01
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID
- [ ] `NEXT_PUBLIC_SANITY_DATASET` — production
- [ ] `NEXT_PUBLIC_SANITY_API_VERSION` — 2024-01-01
- [ ] `SANITY_API_TOKEN` — Sanity read token

#### Optional
- [ ] `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` — Vercel Analytics
- [ ] `NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID` — Speed Insights
- [ ] `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` — Google Analytics 4

### Shopify Setup
- [ ] Store created and products added
- [ ] Products have metafields (crystal_name, origin, botanical_name)
- [ ] Products published to Online Store channel
- [ ] Storefront API access token created
- [ ] Scopes enabled: read_products, read_product_listings, read_checkouts, write_checkouts
- [ ] Checkout settings configured
- [ ] Payment provider connected (Stripe/PayPal)
- [ ] Shipping rates configured
- [ ] Taxes configured

### Sanity Setup
- [ ] Project created
- [ ] Schemas deployed
- [ ] Oils added to CMS
- [ ] Images uploaded
- [ ] API token generated
- [ ] CORS origins configured

### Code Quality
- [ ] `npm install` completed
- [ ] `npm run build` successful
- [ ] TypeScript errors: 0
- [ ] ESLint errors: 0
- [ ] No console errors in development

---

## Build & Test

### Local Build
```bash
npm run build
```
- [ ] No build errors
- [ ] Static files generated
- [ ] Image optimization working

### Local Preview
```bash
npm start
```
Test these flows:
- [ ] Homepage loads
- [ ] Hero animations play
- [ ] Navigation works (desktop + mobile)
- [ ] Search opens with ⌘K
- [ ] Products display
- [ ] Add to cart works
- [ ] Cart sidebar opens
- [ ] Quantity updates
- [ ] Remove from cart works
- [ ] Checkout redirects to Shopify
- [ ] Quick view modal opens
- [ ] Product pages load
- [ ] Breadcrumbs work
- [ ] Footer links work

### Mobile Testing
- [ ] iPhone 14 Pro (iOS 17)
- [ ] iPhone SE (iOS 17)
- [ ] Samsung Galaxy S23 (Android 14)
- [ ] iPad Pro (iPadOS 17)

### Desktop Testing
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

---

## Performance

### Lighthouse Audits
Run on these pages:
- [ ] Homepage — Target: 95+ Performance
- [ ] Product listing — Target: 95+ Performance
- [ ] Product detail — Target: 95+ Performance

Check these metrics:
- [ ] First Contentful Paint < 1.0s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Total Blocking Time < 200ms
- [ ] Cumulative Layout Shift < 0.05

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

---

## SEO

### Meta Tags
- [ ] Title tags unique per page
- [ ] Meta descriptions unique per page
- [ ] Open Graph images present
- [ ] Twitter Cards configured
- [ ] Canonical URLs set

### Structured Data
- [ ] Organization schema
- [ ] WebSite schema with search
- [ ] Product schema on product pages
- [ ] Breadcrumb schema

### Technical SEO
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] 404 page exists
- [ ] Redirects configured (if needed)

---

## Accessibility

### Automated Testing
- [ ] axe DevTools: 0 violations
- [ ] Lighthouse Accessibility: 100

### Manual Testing
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Screen reader tested (NVDA/VoiceOver)
- [ ] Color contrast AA compliant
- [ ] Alt text on all images

---

## Security

### Headers
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin

### Data
- [ ] No secrets in client-side code
- [ ] API keys properly scoped
- [ ] Environment variables in Vercel (not repo)

---

## Deployment

### Vercel
```bash
vercel --prod
```

#### Configuration
- [ ] Project linked to repo
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Node.js version: 18.x
- [ ] Environment variables added

#### Domain
- [ ] Custom domain added
- [ ] SSL certificate auto-generated
- [ ] www redirect configured (if needed)
- [ ] DNS records verified

---

## Post-Deployment

### Verification
- [ ] Site loads on custom domain
- [ ] HTTPS working
- [ ] All pages accessible
- [ ] Cart functional
- [ ] Checkout completes

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] Speed Insights enabled
- [ ] Error tracking (Sentry) configured
- [ ] Uptime monitoring setup

### Marketing
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] Google Analytics connected
- [ ] Meta Pixel installed (if using)
- [ ] Social share images tested

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Creative Director | | | ✓ |
| Technical Lead | | | ✓ |
| QA Engineer | | | ✓ |
| Client | | | ✓ |

---

## Launch Day Tasks

### Pre-Launch (T-2 hours)
- [ ] Final build deployed to production
- [ ] All tests passing
- [ ] Monitoring dashboards open
- [ ] Rollback plan ready

### Launch (T-0)
- [ ] DNS switched (if new domain)
- [ ] CDN cache cleared
- [ ] Smoke tests passed
- [ ] Team on standby

### Post-Launch (T+2 hours)
- [ ] Error logs checked
- [ ] Performance verified
- [ ] Conversion tracking working
- [ ] No critical issues

---

## 🚀 READY TO LAUNCH

When all checkboxes are marked:

1. Run final build: `npm run build`
2. Deploy: `vercel --prod`
3. Celebrate! 🎉

**Status: ☐ Ready for Launch**

---

"Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away."
— Antoine de Saint-Exupéry
