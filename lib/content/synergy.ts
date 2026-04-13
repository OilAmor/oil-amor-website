import { SynergyContent } from '../../app/types'

// Stub for CMS integration - returns mock data
export async function getSynergyContent(
  oilSlug: string,
  crystalSlug: string
): Promise<SynergyContent | null> {
  // Mock synergy content
  return {
    id: `${oilSlug}-${crystalSlug}`,
    oilSlug,
    crystalSlug,
    headline: `The Sacred Union of ${oilSlug} & ${crystalSlug}`,
    story: `When ${oilSlug} meets ${crystalSlug}, a profound energetic resonance emerges. This pairing has been used in sacred rituals for centuries.`,
    scientificNote: 'The molecular structure of this oil resonates at frequencies that complement the crystalline lattice of this stone.',
    ritualInstructions: [
      { step: 1, title: 'Preparation', description: 'Find a quiet space and center yourself', duration: '2 minutes' },
      { step: 2, title: 'Application', description: 'Apply the oil to your pulse points while holding the crystal', duration: '1 minute' },
      { step: 3, title: 'Meditation', description: 'Close your eyes and feel the synergy', duration: '5-10 minutes' },
    ],
    chakra: 'heart',
    element: 'water',
    zodiac: ['cancer', 'scorpio', 'pisces'],
  }
}
