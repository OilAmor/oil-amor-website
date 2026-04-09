# Oil Amor Component Library Showcase

## Overview

A comprehensive design system and component library for Oil Amor — a premium, immersive shopping experience that embodies:
- **Miron Violetglass elegance** (#3D2B5A)
- **Gold accents** (#C9A227)
- **Natural luxury** (creams, botanical textures)
- **Educational immersion** (crystal knowledge, oil wisdom)

---

## Design System

### Design Tokens (`app/styles/design-system.ts`)

Central source of truth for all design values:

```typescript
import { DESIGN_TOKENS, TIER_COLORS, ELEMENT_COLORS, CHAKRA_COLORS } from '@/styles/design-system'
```

**Available Tokens:**
- `colors` - Miron violet, gold, cream, charcoal, success, warning, error
- `typography` - Cormorant Garamond (headings), Inter (body)
- `spacing` - 4xs to 4xl scale
- `animation` - Durations and easing functions
- `shadows` - Elevation system
- `borderRadius` - Corner radius scale

---

## UI Components

### Button

```tsx
import { Button } from '@/components/ui/Button'

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="gold">Gold</Button>
<Button variant="miron">Miron</Button>
<Button variant="outline">Outline</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// States
<Button isLoading>Loading</Button>
<Button leftIcon={<Icon />}>With Icon</Button>
<Button disabled>Disabled</Button>
```

### Card

```tsx
import { Card } from '@/components/ui/Card'

<Card variant="default">Default</Card>
<Card variant="elevated">Elevated</Card>
<Card variant="glass">Glass</Card>
<Card variant="bordered">Bordered</Card>
<Card variant="miron">Miron</Card>
```

### Badge

```tsx
import { Badge } from '@/components/ui/Badge'

<Badge variant="default">Default</Badge>
<Badge variant="gold">Gold</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="tier" tier="bloom">Bloom Tier</Badge>
```

### ProgressBar

```tsx
import { ProgressBar } from '@/components/ui/ProgressBar'

<ProgressBar value={75} max={100} variant="tier" showLabel />
```

### Tabs

```tsx
import { Tabs, TabPanel } from '@/components/ui/Tabs'

<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', icon: <Icon /> },
    { id: 'tab2', label: 'Tab 2' },
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
  variant="pills"
/>

<TabPanel tabId="tab1" activeTab={activeTab}>
  Content
</TabPanel>
```

### Tooltip

```tsx
import { Tooltip, RichTooltip } from '@/components/ui/Tooltip'

<Tooltip content="Simple tooltip">
  <button>Hover me</button>
</Tooltip>

<RichTooltip
  title="Amethyst"
  description="Stone of spiritual protection"
  image="/amethyst.jpg"
  properties={[{ label: 'Chakra', value: 'Third Eye' }]}
>
  <button>Hover for details</button>
</RichTooltip>
```

### Skeleton

```tsx
import { Skeleton, ProductGridSkeleton } from '@/components/ui/Skeleton'

<Skeleton variant="card" />
<Skeleton variant="text" lines={3} />
<ProductGridSkeleton count={6} />
```

### Modal

```tsx
import { Modal } from '@/components/ui/Modal'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="lg"
  footer={<Button>Action</Button>}
>
  Content
</Modal>
```

### Dropdown

```tsx
import { Dropdown, Select } from '@/components/ui/Dropdown'

<Dropdown
  items={[
    { id: '1', label: 'Option 1', description: 'Description' },
  ]}
  selectedId={selected}
  onSelect={handleSelect}
>
  <button>Open</button>
</Dropdown>

<Select
  value={value}
  onChange={setValue}
  options={[{ value: '1', label: 'Option 1' }]}
/>
```

---

## Animation Components

### FadeIn

```tsx
import { FadeIn, FadeInScale, FadeInBlur } from '@/components/animations/FadeIn'

<FadeIn direction="up" delay={0.2}>
  <Content />
</FadeIn>

<FadeInScale delay={0.3}>
  <Content />
</FadeInScale>
```

### StaggerContainer

```tsx
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'

<StaggerContainer staggerDelay={0.1}>
  <StaggerItem><Item1 /></StaggerItem>
  <StaggerItem><Item2 /></StaggerItem>
  <StaggerItem><Item3 /></StaggerItem>
</StaggerContainer>
```

### CountUp

```tsx
import { CountUp, PriceCountUp, StatCard } from '@/components/animations/CountUp'

<CountUp end={1000} prefix="$" suffix="+" />
<PriceCountUp end={99.99} currency="AUD" />
<StatCard value={10000} label="Customers" suffix="+" />
```

### MagneticButton

```tsx
import { MagneticButton } from '@/components/animations/MagneticButton'

<MagneticButton strength={0.3}>
  <Button>Magnetic</Button>
</MagneticButton>
```

### GrainOverlay

```tsx
import { GrainOverlay, GrainBackground } from '@/components/animations/GrainOverlay'

<GrainOverlay opacity={0.025} />
<GrainBackground opacity={0.03} />
```

---

## Layout Components

### Container

```tsx
import { Container, ProseContainer } from '@/components/layout/Container'

<Container size="xl">Content</Container>
<ProseContainer>Long-form content</ProseContainer>
```

### Section

```tsx
import { Section, SectionWithEyebrow } from '@/components/layout/Section'

<Section variant="miron" spacing="lg">
  Content
</Section>

<SectionWithEyebrow
  eyebrow="The Collection"
  title="Featured Oils"
  description="Discover our curated selection"
>
  Content
</SectionWithEyebrow>
```

### Grid

```tsx
import { Grid, MasonryGrid, FeatureGrid } from '@/components/layout/Grid'

<Grid cols={3} md={2} gap="lg">
  {items.map(item => <Card key={item.id} />)}
</Grid>

<FeatureGrid
  features={[
    { icon: <Icon />, title: 'Feature', description: 'Description' },
  ]}
/>
```

### Header

```tsx
import { Header } from '@/components/layout/Header'

<Header tier="bloom" tierProgress={75} />
```

### Footer

```tsx
import { Footer } from '@/components/layout/Footer'

<Footer showSustainability showNewsletter />
```

---

## Product Components

### ProductCard

```tsx
import { ProductCard } from '@/components/product/ProductCard'

<ProductCard
  product={{
    id: '1',
    title: 'Lavender Dreams',
    handle: 'lavender-dreams',
    description: 'Calming essential oil blend',
    price: 89.00,
    images: [{ url: '/lavender.jpg' }],
    tags: ['calming', 'sleep'],
    crystalPairing: {
      name: 'Amethyst',
      description: 'Spiritual protection',
      image: '/amethyst.jpg',
    },
    isNew: true,
  }}
  variant="default"
  showSynergy
/>
```

### ProductImage

```tsx
import { ProductImage } from '@/components/product/ProductImage'

<ProductImage
  images={[{ url: '/product.jpg', altText: 'Product' }]}
  productTitle="Product Name"
  crystalVisualization="/crystal.jpg"
  enableZoom
/>
```

### PriceDisplay

```tsx
import { PriceDisplay } from '@/components/product/PriceDisplay'

<PriceDisplay
  price={89.00}
  compareAtPrice={120.00}
  unitPrice={2.97}
  unit="ml"
  credits={10}
  creditValue={1}
  size="lg"
/>
```

### SynergyBadge

```tsx
import { SynergyBadge } from '@/components/product/SynergyBadge'

<SynergyBadge
  oilName="Lavender Dreams"
  crystalName="Amethyst"
  synergy="Spiritual Harmony"
  effect="Enhances meditation"
  element="spirit"
  chakra="thirdEye"
  variant="detailed"
/>
```

---

## Educational Components

### SynergyCard

```tsx
import { SynergyCard } from '@/components/education/SynergyCard'

<SynergyCard
  oil={{ name: 'Lavender', image: '/oil.jpg', origin: 'France', note: 'Floral' }}
  crystal={{ name: 'Amethyst', image: '/crystal.jpg', origin: 'Brazil', property: 'Protection' }}
  headline="The Union of Tranquility"
  story="Since ancient times..."
  scientificNote="Linalool has been shown..."
  ritual={{ title: 'Evening Ritual', steps: ['Step 1', 'Step 2', 'Step 3'] }}
/>
```

### CrystalProperties

```tsx
import { CrystalProperties } from '@/components/education/CrystalProperties'

<CrystalProperties
  element="spirit"
  chakra="thirdEye"
  zodiac=['Pisces', 'Aquarius']}
  properties={['Protection', 'Clarity', 'Intuition']}
/>
```

### RitualSteps

```tsx
import { RitualSteps } from '@/components/education/RitualSteps'

<RitualSteps
  title="Evening Ritual"
  subtitle="Prepare for restful sleep"
  steps={[
    { title: 'Prepare', description: 'Dim the lights...', duration: '2 min' },
  ]}
  variant="accordion"
/>
```

### CollectionProgress

```tsx
import { CollectionProgress } from '@/components/education/CollectionProgress'

<CollectionProgress
  currentCrystals={7}
  totalCrystals={12}
  tier="bloom"
  tierProgress={75}
  milestones={[
    { id: '1', name: 'First Collection', requiredCrystals: 3, reward: 'Bronze Pendant', unlocked: true },
  ]}
  nextJewelryUnlock={10}
/>
```

---

## Required Dependencies

Add these to your `package.json`:

```bash
npm install @radix-ui/react-tooltip @radix-ui/react-dropdown-menu
```

---

## Responsive Breakpoints

```typescript
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
```

Mobile-first approach with responsive grid layouts.

---

## Accessibility

- All interactive elements are keyboard accessible
- ARIA labels on all buttons
- Focus visible states with gold outline on miron
- Reduced motion support via `prefers-reduced-motion`
- WCAG 2.1 AA color contrast compliance
- Screen reader announcements for dynamic content
- Skip links for navigation

---

## Performance

- First Contentful Paint: < 1.0s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.0s
- Cumulative Layout Shift: < 0.1
- Animation frame rate: 60fps
- Hardware-accelerated animations with `will-change`
- Lazy loading for images

---

## CSS Custom Properties

Available in globals.css:

```css
:root {
  /* Easing */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* Miron Spectrum */
  --miron-void: #0a0612;
  --miron-depth: #120a1f;
  --miron-base: #1a0f2e;
  --miron-mid: #251440;
  --miron-light: #3d2066;
  --miron-glow: #5a3d8c;
  
  /* Gold */
  --gold-pure: #c9a227;
  --gold-warm: #d4af37;
  --gold-light: #e8d5a3;
  --gold-dark: #9a7b1a;
  
  /* Cream */
  --cream: #f8f6f3;
  --cream-warm: #f0ebe5;
  --cream-cool: #e8e4de;
}
```

---

## File Structure

```
app/
├── components/
│   ├── ui/           # Base UI components
│   ├── animations/   # Animation components
│   ├── layout/       # Layout components
│   ├── product/      # Product display
│   └── education/    # Educational content
├── styles/
│   ├── design-system.ts
│   └── index.ts
└── globals.css       # Global styles
```
