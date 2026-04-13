/**
 * API Utilities
 * Real API functions for fetching synergy content and customer data
 * Connected to Sanity backend via lib/content modules
 */

import { SynergyContent, Crystal, RitualStep } from '../types'
import { getSynergyContent as getContentFromCMS } from '../../lib/content/synergy'
import { getAllCrystals, getAvailableCrystals } from '../../lib/content/crystals'
import { getCustomerTier } from '../../lib/rewards/tiers'
import { SynergyContent as CMSSynergyContent, Crystal as CMSCrystal, Chakra as CMSChakra } from '../../lib/content/types'

// ============================================================================
// SYNERGY CONTENT API
// ============================================================================

/**
 * Fetch synergy content for an oil-crystal combination
 * Uses real CMS data with fallback logic
 */
export async function fetchSynergyContent(
  oilSlug: string,
  crystalSlug: string
): Promise<SynergyContent | null> {
  try {
    const response = await getContentFromCMS(oilSlug, crystalSlug)
    
    if (!response) {
      console.warn(`No synergy content found for ${oilSlug} + ${crystalSlug}`)
      return null
    }
    
    // Transform CMS response to SynergyContent type
    return transformSynergyResponse(response) as unknown as SynergyContent
  } catch (error) {
    console.error('Error fetching synergy content:', error)
    return null
  }
}

/**
 * Fetch all available crystals
 */
export async function fetchCrystalsForOil(
  oilSlug?: string
): Promise<Crystal[]> {
  try {
    // If oilSlug is provided, we could filter by compatible crystals
    // For now, return all available crystals
    // Note: getAvailableCrystals already returns Crystal[] in the expected format
    return await getAvailableCrystals('seed')
  } catch (error) {
    console.error('Error fetching crystals:', error)
    return []
  }
}

/**
 * Fetch customer tier based on purchase history
 */
export async function fetchCustomerTier(
  customerId: string
): Promise<{ tier: string; history: unknown }> {
  try {
    const tierInfo = await getCustomerTier(customerId)
    
    return {
      tier: tierInfo.tier,
      history: {
        totalSpend: tierInfo.spend,
        // These would come from a more detailed API in production
        totalOrders: 0,
        totalBottles: 0,
        uniqueOils: [],
        uniqueCrystals: [],
      },
    }
  } catch (error) {
    console.error('Error fetching customer tier:', error)
    // Return default tier on error
    return {
      tier: 'seed',
      history: {
        totalOrders: 0,
        totalBottles: 0,
        totalSpend: 0,
        uniqueOils: [],
        uniqueCrystals: [],
      },
    }
  }
}

// ============================================================================
// DATA TRANSFORMERS
// ============================================================================

/**
 * Transform CMS synergy response to SynergyContent type
 */
function transformSynergyResponse(response: CMSSynergyContent): SynergyContent {
  // Extract slugs from nested objects
  const oilSlug = response.oil?.slug?.current || response.oil?._ref || ''
  const crystalSlug = response.crystal?.slug?.current || response.crystal?._ref || ''
  
  // Convert Portable Text story to string
  const storyText = typeof response.story === 'string' 
    ? response.story 
    : extractTextFromPortableText(response.story)
  
  // Convert ritual steps to RitualStep array
  const ritualInstructions: RitualStep[] = Array.isArray(response.ritualInstructions)
    ? response.ritualInstructions.map((r: { title: string; instruction: string }, i: number) => ({
        step: i + 1,
        title: r.title,
        description: r.instruction,
      }))
    : []
  
  return {
    id: response._id,
    oilSlug,
    crystalSlug,
    headline: response.headline,
    story: storyText,
    scientificNote: response.scientificNote,
    ritualInstructions,
    frequency: response.frequencyName || String(response.frequency || ''),
    chakra: (response.chakraAlignment === 'all' ? 'heart' : response.chakraAlignment) as SynergyContent['chakra'],
    element: response.element as SynergyContent['element'],
    zodiac: response.zodiacAffinity || [],
  }
}

/**
 * Helper to extract text from Sanity Portable Text
 */
function extractTextFromPortableText(blocks: any[]): string {
  if (!Array.isArray(blocks)) return ''
  
  return blocks
    .map((block: any) => {
      if (typeof block === 'string') return block
      if (block._type === 'block' && Array.isArray(block.children)) {
        return block.children.map((child: any) => child.text || '').join('')
      }
      return ''
    })
    .join('\n')
}

/**
 * Transform CMS crystal response to Crystal type
 */
function transformCrystalResponse(response: CMSCrystal): Crystal {
  const images = response.images || []
  const imageUrl = images.length > 0 ? images[0].asset?.url : undefined
  
  // Map CMS Chakra to app Chakra (excluding 'all')
  const chakra = (response.properties?.chakra === 'all' 
    ? 'heart' 
    : (response.properties?.chakra || 'heart')) as Crystal['chakra']
  
  return {
    id: response._id,
    slug: response.slug?.current || '',
    name: response.name,
    description: response.properties?.meaning || '',
    image: imageUrl || '/images/crystals/placeholder.jpg',
    chakra,
    element: (response.properties?.element || 'earth') as Crystal['element'],
    zodiac: (response.properties?.zodiac || ['All Signs']) as string[],
    meaning: response.properties?.meaning || '',
  }
}

/**
 * Map availability to rarity
 */
function getRarityFromAvailability(availability?: string): 'common' | 'uncommon' | 'rare' | 'legendary' {
  switch (availability) {
    case 'out-of-stock':
    case 'discontinued':
      return 'legendary'
    case 'low-stock':
      return 'rare'
    case 'in-stock':
    default:
      return 'common'
  }
}
