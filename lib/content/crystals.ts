import { Crystal } from '../../app/types'

// Stub for CMS integration - returns mock data
const MOCK_CRYSTALS: Crystal[] = [
  {
    id: 'amethyst-001',
    name: 'Amethyst',
    slug: 'amethyst',
    description: 'Spiritual awareness, intuition, and calming energy',
    image: '/crystals/amethyst.png',
    chakra: 'crown',
    element: 'air',
    zodiac: ['aquarius', 'pisces'],
    meaning: 'Spiritual Growth',
  },
  {
    id: 'rose-quartz-001',
    name: 'Rose Quartz',
    slug: 'rose-quartz',
    description: 'Unconditional love, emotional healing',
    image: '/crystals/rose-quartz.png',
    chakra: 'heart',
    element: 'water',
    zodiac: ['taurus', 'libra'],
    meaning: 'Love & Harmony',
  },
]

export async function getAllCrystals(): Promise<Crystal[]> {
  return MOCK_CRYSTALS
}

export async function getAvailableCrystals(tier: string): Promise<Crystal[]> {
  // All crystals available for all tiers in demo
  return MOCK_CRYSTALS
}

export async function getCrystalBySlug(slug: string): Promise<Crystal | null> {
  return MOCK_CRYSTALS.find(c => c.slug === slug) || null
}
