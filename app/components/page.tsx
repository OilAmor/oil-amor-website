'use client'

import { useState } from 'react'
import { 
  Sparkles, 
  ShoppingBag, 
  Search, 
  Heart,
  Leaf,
  Droplets,
  Moon,
  Sun
} from 'lucide-react'

// UI Components
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { ProgressBar } from './ui/ProgressBar'
import { Tabs, TabPanel } from './ui/Tabs'
import { Tooltip } from './ui/Tooltip'
import { Skeleton } from './ui/Skeleton'
import { Modal } from './ui/Modal'
import { Select } from './ui/Dropdown'

// Animation Components
import { FadeIn, FadeInScale } from './animations/FadeIn'
import { StaggerContainer, StaggerItem } from './animations/StaggerContainer'
import { CountUp, StatCard } from './animations/CountUp'
import { MagneticButton } from './animations/MagneticButton'

// Layout Components
import { Container } from './layout/Container'
import { Section, SectionWithEyebrow } from './layout/Section'
import { Grid } from './layout/Grid'

// Product Components
import { PriceDisplay, SynergyBadge } from './product'

// Educational Components
import { CrystalProperties } from './education/CrystalProperties'
import { RitualSteps } from './education/RitualSteps'
import { CollectionProgress } from './education/CollectionProgress'

export default function ComponentShowcase() {
  const [activeTab, setActiveTab] = useState('buttons')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState('')

  const tabs = [
    { id: 'buttons', label: 'Buttons' },
    { id: 'cards', label: 'Cards' },
    { id: 'badges', label: 'Badges' },
    { id: 'progress', label: 'Progress' },
    { id: 'animations', label: 'Animations' },
    { id: 'product', label: 'Product' },
    { id: 'education', label: 'Education' },
  ]

  return (
    <div className="min-h-screen bg-cream-pure">
      {/* Hero */}
      <Section variant="miron" spacing="xl" className="text-center">
        <FadeIn>
          <span className="section-eyebrow justify-center">Design System</span>
          <h1 className="font-display text-5xl lg:text-7xl text-white mb-6">
            Oil Amor Components
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            A comprehensive library of premium UI components crafted for the Oil Amor experience.
          </p>
        </FadeIn>
      </Section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-50 bg-cream-pure/95 backdrop-blur border-b border-miron-dark/10 py-4">
        <Container>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="pills"
          />
        </Container>
      </div>

      {/* Content */}
      <Section spacing="xl">
        <Container>
          {/* Buttons */}
          <TabPanel tabId="buttons" activeTab={activeTab}>
            <FadeIn>
              <h2 className="font-display text-3xl text-miron-dark mb-8">Button Variants</h2>
              <div className="flex flex-wrap gap-4 mb-12">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="gold">Gold</Button>
                <Button variant="miron">Miron</Button>
                <Button variant="outline">Outline</Button>
              </div>

              <h2 className="font-display text-3xl text-miron-dark mb-8">Button Sizes</h2>
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>

              <h2 className="font-display text-3xl text-miron-dark mb-8">Button States</h2>
              <div className="flex flex-wrap gap-4 mb-12">
                <Button isLoading>Loading</Button>
                <Button leftIcon={<Heart className="w-4 h-4" />}>With Icon</Button>
                <Button disabled>Disabled</Button>
              </div>

              <h2 className="font-display text-3xl text-miron-dark mb-8">Magnetic Button</h2>
              <MagneticButton>
                <Button>Hover Me</Button>
              </MagneticButton>
            </FadeIn>
          </TabPanel>

          {/* Cards */}
          <TabPanel tabId="cards" activeTab={activeTab}>
            <FadeIn>
              <h2 className="font-display text-3xl text-miron-dark mb-8">Card Variants</h2>
              <Grid cols={2} lg={4} gap="md" className="mb-12">
                <Card variant="default">
                  <h3 className="font-display text-lg text-miron-dark mb-2">Default</h3>
                  <p className="text-sm text-miron-dark/60">Standard card with subtle shadow</p>
                </Card>
                <Card variant="elevated">
                  <h3 className="font-display text-lg text-miron-dark mb-2">Elevated</h3>
                  <p className="text-sm text-miron-dark/60">Card with stronger elevation</p>
                </Card>
                <Card variant="glass">
                  <h3 className="font-display text-lg text-miron-dark mb-2">Glass</h3>
                  <p className="text-sm text-miron-dark/60">Frosted glass effect</p>
                </Card>
                <Card variant="miron">
                  <h3 className="font-display text-lg text-white mb-2">Miron</h3>
                  <p className="text-sm text-white/60">Dark theme card</p>
                </Card>
              </Grid>
            </FadeIn>
          </TabPanel>

          {/* Badges */}
          <TabPanel tabId="badges" activeTab={activeTab}>
            <FadeIn>
              <h2 className="font-display text-3xl text-miron-dark mb-8">Badge Variants</h2>
              <div className="flex flex-wrap gap-4 mb-12">
                <Badge variant="default">Default</Badge>
                <Badge variant="gold">Gold</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
              </div>

              <h2 className="font-display text-3xl text-miron-dark mb-8">Tier Badges</h2>
              <div className="flex flex-wrap gap-4 mb-12">
                <Badge variant="tier" tier="seed">Seed</Badge>
                <Badge variant="tier" tier="sprout">Sprout</Badge>
                <Badge variant="tier" tier="bloom">Bloom</Badge>
                <Badge variant="tier" tier="harvest">Harvest</Badge>
                <Badge variant="tier" tier="crystal">Crystal</Badge>
              </div>
            </FadeIn>
          </TabPanel>

          {/* Progress */}
          <TabPanel tabId="progress" activeTab={activeTab}>
            <FadeIn>
              <h2 className="font-display text-3xl text-miron-dark mb-8">Progress Bars</h2>
              <div className="space-y-8 max-w-2xl">
                <ProgressBar value={75} max={100} variant="default" showLabel />
                <ProgressBar value={60} max={100} variant="tier" showLabel />
                <ProgressBar value={85} max={100} variant="crystal" showLabel />
              </div>

              <h2 className="font-display text-3xl text-miron-dark mb-8 mt-12">Select Dropdown</h2>
              <div className="max-w-sm">
                <Select
                  value={selectedValue}
                  onChange={setSelectedValue}
                  options={[
                    { value: '1', label: 'Option 1' },
                    { value: '2', label: 'Option 2' },
                    { value: '3', label: 'Option 3' },
                  ]}
                  placeholder="Choose an option..."
                />
              </div>

              <h2 className="font-display text-3xl text-miron-dark mb-8 mt-12">Modal</h2>
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Example Modal"
                description="This is a demonstration of the modal component"
                footer={
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
                  </div>
                }
              >
                <p className="text-miron-dark/70 p-6">
                  This modal demonstrates the Oil Amor design system with proper styling,
                  animations, and accessibility features.
                </p>
              </Modal>
            </FadeIn>
          </TabPanel>

          {/* Animations */}
          <TabPanel tabId="animations" activeTab={activeTab}>
            <FadeIn>
              <h2 className="font-display text-3xl text-miron-dark mb-8">Stagger Animation</h2>
              <StaggerContainer staggerDelay={0.1} className="grid grid-cols-3 gap-4 mb-12">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <StaggerItem key={i}>
                    <Card className="h-32 flex items-center justify-center">
                      <span className="font-display text-2xl text-miron-dark">{i}</span>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <h2 className="font-display text-3xl text-miron-dark mb-8">Count Up Animation</h2>
              <Grid cols={3} gap="lg" className="mb-12">
                <StatCard value={12500} label="Happy Customers" suffix="+" />
                <StatCard value={48} label="Oil Varieties" />
                <StatCard value={99} label="Satisfaction" suffix="%" />
              </Grid>

              <h2 className="font-display text-3xl text-miron-dark mb-8">Skeleton Loading</h2>
              <div className="grid grid-cols-3 gap-4 max-w-2xl">
                <Skeleton variant="image" aspectRatio="3/4" />
                <div className="space-y-2">
                  <Skeleton variant="text" />
                  <Skeleton variant="text" className="w-2/3" />
                </div>
              </div>
            </FadeIn>
          </TabPanel>

          {/* Product */}
          <TabPanel tabId="product" activeTab={activeTab}>
            <FadeIn>
              <h2 className="font-display text-3xl text-miron-dark mb-8">Price Display</h2>
              <Grid cols={2} gap="lg" className="mb-12">
                <Card>
                  <h3 className="text-sm uppercase tracking-wider text-miron-dark/50 mb-4">Standard</h3>
                  <PriceDisplay price={89.00} compareAtPrice={120.00} />
                </Card>
                <Card>
                  <h3 className="text-sm uppercase tracking-wider text-miron-dark/50 mb-4">With Credits</h3>
                  <PriceDisplay price={89.00} credits={15} creditValue={1} />
                </Card>
              </Grid>

              <h2 className="font-display text-3xl text-miron-dark mb-8">Synergy Badge</h2>
              <div className="space-y-4 mb-12">
                <SynergyBadge
                  oilName="Lavender Dreams"
                  crystalName="Amethyst"
                  synergy="Spiritual Harmony"
                  effect="Enhances meditation"
                  variant="compact"
                />
                <SynergyBadge
                  oilName="Lavender Dreams"
                  crystalName="Amethyst"
                  synergy="Spiritual Harmony"
                  effect="Enhances meditation and deepens relaxation practices"
                  element="spirit"
                  chakra="thirdEye"
                  variant="detailed"
                />
              </div>
            </FadeIn>
          </TabPanel>

          {/* Education */}
          <TabPanel tabId="education" activeTab={activeTab}>
            <FadeIn>
              <h2 className="font-display text-3xl text-miron-dark mb-8">Crystal Properties</h2>
              <Card className="mb-12">
                <CrystalProperties
                  element="spirit"
                  chakra="thirdEye"
                  zodiac={['Pisces', 'Aquarius']}
                  properties={['Protection', 'Clarity', 'Intuition', 'Spiritual Growth']}
                />
              </Card>

              <h2 className="font-display text-3xl text-miron-dark mb-8">Ritual Steps</h2>
              <div className="mb-12">
                <RitualSteps
                  title="Evening Ritual"
                  subtitle="Prepare for restful sleep"
                  steps={[
                    {
                      title: 'Prepare Your Space',
                      description: 'Dim the lights and create a calm environment. Light a candle if desired.',
                      duration: '2 min',
                      tip: 'Use a dimmer switch for best results',
                    },
                    {
                      title: 'Apply the Oil',
                      description: 'Place 3-4 drops in your diffuser or mix with carrier oil for topical application.',
                      duration: '1 min',
                    },
                    {
                      title: 'Hold Your Crystal',
                      description: 'Hold the paired crystal in your receiving hand and take three deep breaths.',
                      duration: '3 min',
                    },
                    {
                      title: 'Meditate',
                      description: 'Close your eyes and visualize peaceful lavender fields. Let the aroma wash over you.',
                      duration: '5-10 min',
                    },
                  ]}
                  variant="accordion"
                />
              </div>

              <h2 className="font-display text-3xl text-miron-dark mb-8">Collection Progress</h2>
              <Card>
                <CollectionProgress
                  currentCrystals={7}
                  totalCrystals={12}
                  tier="bloom"
                  tierProgress={75}
                  milestones={[
                    {
                      id: '1',
                      name: 'First Steps',
                      description: 'Collect your first crystal',
                      requiredCrystals: 1,
                      reward: 'Welcome Gift',
                      unlocked: true,
                    },
                    {
                      id: '2',
                      name: 'Bronze Pendant',
                      description: 'Unlock your first jewelry piece',
                      requiredCrystals: 5,
                      reward: 'Bronze Amethyst Pendant',
                      unlocked: true,
                    },
                    {
                      id: '3',
                      name: 'Silver Collection',
                      description: 'Expand your crystal collection',
                      requiredCrystals: 10,
                      reward: 'Silver Bracelet',
                      unlocked: false,
                    },
                    {
                      id: '4',
                      name: 'Gold Masterpiece',
                      description: 'Complete your crystal journey',
                      requiredCrystals: 12,
                      reward: 'Gold Crystal Necklace',
                      unlocked: false,
                    },
                  ]}
                  nextJewelryUnlock={10}
                />
              </Card>
            </FadeIn>
          </TabPanel>
        </Container>
      </Section>

      {/* Footer */}
      <Section variant="miron" spacing="md">
        <Container className="text-center">
          <p className="text-white/40 text-sm">
            Oil Amor Design System — Built with precision and care
          </p>
        </Container>
      </Section>
    </div>
  )
}
