#!/usr/bin/env ts-node
/**
 * Oil Amor - Synergy Content Seeding Script
 * 
 * This script populates Sanity CMS with:
 * - 12 Essential Oils
 * - 12 Crystals
 * - 144 Oil-Crystal Synergy Combinations
 * 
 * Usage:
 *   npx ts-node scripts/seed-synergy-content.ts
 * 
 * Requirements:
 *   - SANITY_TOKEN environment variable with write permissions
 *   - SANITY_PROJECT_ID and SANITY_DATASET configured
 */

import { createClient } from '@sanity/client'
import { v4 as uuidv4 } from 'uuid'

// ========================================
// Configuration
// ========================================

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_TOKEN || ''

if (!PROJECT_ID || !TOKEN) {
  console.error('Error: SANITY_TOKEN and SANITY_PROJECT_ID must be set')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2024-03-21',
  useCdn: false,
})

// ========================================
// Data Definitions
// ========================================

const OILS = [
  {
    name: 'Lavender',
    slug: 'lavender',
    botanicalName: 'Lavandula angustifolia',
    commonName: 'True Lavender',
    origin: 'Bulgaria',
    category: 'floral',
    description: 'The quintessential oil of tranquility, Lavender has been cherished for centuries as nature\'s balm for the restless soul.',
    benefits: ['Relaxation', 'Sleep', 'Skin soothing', 'Stress relief'],
    properties: ['Calming', 'Balancing', 'Soothing'],
    extractionMethod: 'steam-distillation',
    plantPart: 'flowers',
  },
  {
    name: 'Rose Otto',
    slug: 'rose-otto',
    botanicalName: 'Rosa damascena',
    commonName: 'Damask Rose',
    origin: 'Turkey',
    category: 'floral',
    description: 'The queen of essential oils, Rose Otto carries the heart-opening essence of thousands of hand-picked petals.',
    benefits: ['Emotional healing', 'Skin rejuvenation', 'Heart opening', 'Hormonal balance'],
    properties: ['Uplifting', 'Nurturing', 'Heart-centered'],
    extractionMethod: 'steam-distillation',
    plantPart: 'flowers',
  },
  {
    name: 'Eucalyptus',
    slug: 'eucalyptus',
    botanicalName: 'Eucalyptus globulus',
    commonName: 'Blue Gum Eucalyptus',
    origin: 'Australia',
    category: 'herbal',
    description: 'The breath of the Australian wilderness, Eucalyptus clears the mind and opens the respiratory system.',
    benefits: ['Respiratory support', 'Mental clarity', 'Immune support', 'Cooling'],
    properties: ['Clarifying', 'Energizing', 'Purifying'],
    extractionMethod: 'steam-distillation',
    plantPart: 'leaves',
  },
  {
    name: 'Tea Tree',
    slug: 'tea-tree',
    botanicalName: 'Melaleuca alternifolia',
    commonName: 'Tea Tree',
    origin: 'Australia',
    category: 'herbal',
    description: 'Nature\'s first aid kit in a bottle, Tea Tree has been used by Indigenous Australians for millennia.',
    benefits: ['Purifying', 'Skin health', 'Immune support', 'Cleansing'],
    properties: ['Purifying', 'Protective', 'Cleansing'],
    extractionMethod: 'steam-distillation',
    plantPart: 'leaves',
  },
  {
    name: 'Frankincense',
    slug: 'frankincense',
    botanicalName: 'Boswellia carterii',
    commonName: 'Olibanum',
    origin: 'Somalia',
    category: 'resinous',
    description: 'Sacred frankincense has been treasured since ancient times for its meditative and spiritual properties.',
    benefits: ['Meditation', 'Skin rejuvenation', 'Spiritual connection', 'Grounding'],
    properties: ['Grounding', 'Spiritual', 'Centering'],
    extractionMethod: 'steam-distillation',
    plantPart: 'resin',
  },
  {
    name: 'Peppermint',
    slug: 'peppermint',
    botanicalName: 'Mentha piperita',
    commonName: 'Peppermint',
    origin: 'USA',
    category: 'minty',
    description: 'Cool, crisp, and invigorating, Peppermint awakens the senses and sharpens the mind.',
    benefits: ['Digestive support', 'Mental clarity', 'Cooling', 'Energizing'],
    properties: ['Cooling', 'Energizing', 'Clarifying'],
    extractionMethod: 'steam-distillation',
    plantPart: 'leaves',
  },
  {
    name: 'Sandalwood',
    slug: 'sandalwood',
    botanicalName: 'Santalum album',
    commonName: 'East Indian Sandalwood',
    origin: 'India',
    category: 'woody',
    description: 'Deep, warm, and meditative, Sandalwood has been used in spiritual practices for over 4,000 years.',
    benefits: ['Meditation', 'Skin care', 'Grounding', 'Emotional balance'],
    properties: ['Grounding', 'Calming', 'Spiritual'],
    extractionMethod: 'steam-distillation',
    plantPart: 'wood',
  },
  {
    name: 'Lemon',
    slug: 'lemon',
    botanicalName: 'Citrus limon',
    commonName: 'Italian Lemon',
    origin: 'Italy',
    category: 'citrus',
    description: 'Sunshine captured in oil, Lemon brings clarity, joy, and a burst of fresh energy to any space.',
    benefits: ['Uplifting', 'Cleansing', 'Focus', 'Immune support'],
    properties: ['Uplifting', 'Clarifying', 'Purifying'],
    extractionMethod: 'cold-press',
    plantPart: 'peel',
  },
  {
    name: 'Ylang Ylang',
    slug: 'ylang-ylang',
    botanicalName: 'Cananga odorata',
    commonName: 'Ylang Ylang',
    origin: 'Madagascar',
    category: 'floral',
    description: 'The flower of flowers, Ylang Ylang opens the heart and awakens sensuality with its exotic aroma.',
    benefits: ['Aphrodisiac', 'Stress relief', 'Heart opening', 'Balancing'],
    properties: ['Uplifting', 'Sensual', 'Balancing'],
    extractionMethod: 'steam-distillation',
    plantPart: 'flowers',
  },
  {
    name: 'Cedarwood',
    slug: 'cedarwood',
    botanicalName: 'Cedrus atlantica',
    commonName: 'Atlas Cedarwood',
    origin: 'Morocco',
    category: 'woody',
    description: 'Ancient cedar forests distilled into grounding wisdom, Cedarwood anchors the spirit to earth.',
    benefits: ['Grounding', 'Confidence', 'Skin support', 'Focus'],
    properties: ['Grounding', 'Strengthening', 'Centering'],
    extractionMethod: 'steam-distillation',
    plantPart: 'wood',
  },
  {
    name: 'Bergamot',
    slug: 'bergamot',
    botanicalName: 'Citrus bergamia',
    commonName: 'Bergamot Orange',
    origin: 'Italy',
    category: 'citrus',
    description: 'The sophisticated citrus, Bergamot bridges the gap between bright energy and calm composure.',
    benefits: ['Mood balancing', 'Stress relief', 'Uplifting', 'Skin care'],
    properties: ['Balancing', 'Uplifting', 'Calming'],
    extractionMethod: 'cold-press',
    plantPart: 'peel',
  },
  {
    name: 'Clary Sage',
    slug: 'clary-sage',
    botanicalName: 'Salvia sclarea',
    commonName: 'Clary Sage',
    origin: 'France',
    category: 'herbal',
    description: 'The clear eye of intuition, Clary Sage opens the inner vision and soothes the feminine soul.',
    benefits: ['Hormonal balance', 'Dream work', 'Relaxation', 'Intuition'],
    properties: ['Clarifying', 'Balancing', 'Euphoric'],
    extractionMethod: 'steam-distillation',
    plantPart: 'flowers',
  },
]

const CRYSTALS = [
  {
    name: 'Amethyst',
    slug: 'amethyst',
    chakra: 'crown',
    element: 'air',
    zodiac: ['aquarius', 'capricorn', 'pisces'],
    origin: 'Brazil',
    meaning: 'Spiritual awareness and intuition',
    hardness: 7,
    colorVariants: ['Light Violet', 'Deep Purple', 'Chevron'],
  },
  {
    name: 'Rose Quartz',
    slug: 'rose-quartz',
    chakra: 'heart',
    element: 'water',
    zodiac: ['taurus', 'libra'],
    origin: 'Madagascar',
    meaning: 'Unconditional love and compassion',
    hardness: 7,
    colorVariants: ['Pale Pink', 'Rose', 'Strawberry'],
  },
  {
    name: 'Citrine',
    slug: 'citrine',
    chakra: 'solar-plexus',
    element: 'fire',
    zodiac: ['gemini', 'aries', 'leo'],
    origin: 'Brazil',
    meaning: 'Abundance and personal power',
    hardness: 7,
    colorVariants: ['Pale Yellow', 'Golden', 'Smoky'],
  },
  {
    name: 'Clear Quartz',
    slug: 'clear-quartz',
    chakra: 'all',
    element: 'ether',
    zodiac: ['all'],
    origin: 'Arkansas, USA',
    meaning: 'Clarity and amplification',
    hardness: 7,
    colorVariants: ['Clear', 'Milky', 'Phantom'],
  },
  {
    name: 'Black Tourmaline',
    slug: 'black-tourmaline',
    chakra: 'root',
    element: 'earth',
    zodiac: ['capricorn', 'scorpio'],
    origin: 'Brazil',
    meaning: 'Protection and grounding',
    hardness: 7,
    colorVariants: ['Jet Black', 'With Mica'],
  },
  {
    name: 'Carnelian',
    slug: 'carnelian',
    chakra: 'sacral',
    element: 'fire',
    zodiac: ['aries', 'leo', 'virgo'],
    origin: 'India',
    meaning: 'Creativity and courage',
    hardness: 7,
    colorVariants: ['Orange-Red', 'Red', 'Carnelian'],
  },
  {
    name: 'Lapis Lazuli',
    slug: 'lapis-lazuli',
    chakra: 'throat',
    element: 'water',
    zodiac: ['sagittarius', 'libra'],
    origin: 'Afghanistan',
    meaning: 'Wisdom and truth',
    hardness: 5,
    colorVariants: ['Deep Blue', 'With Pyrite'],
  },
  {
    name: 'Moonstone',
    slug: 'moonstone',
    chakra: 'third-eye',
    element: 'water',
    zodiac: ['cancer', 'libra', 'scorpio'],
    origin: 'Sri Lanka',
    meaning: 'Intuition and feminine energy',
    hardness: 6,
    colorVariants: ['White', 'Peach', 'Rainbow'],
  },
  {
    name: 'Garnet',
    slug: 'garnet',
    chakra: 'root',
    element: 'fire',
    zodiac: ['aquarius', 'leo', 'capricorn'],
    origin: 'India',
    meaning: 'Passion and vitality',
    hardness: 7,
    colorVariants: ['Deep Red', 'Rhodolite', 'Spessartine'],
  },
  {
    name: 'Labradorite',
    slug: 'labradorite',
    chakra: 'third-eye',
    element: 'water',
    zodiac: ['leo', 'scorpio', 'sagittarius'],
    origin: 'Canada',
    meaning: 'Transformation and magic',
    hardness: 6,
    colorVariants: ['Blue Flash', 'Gold Flash', 'Purple'],
  },
  {
    name: 'Aventurine',
    slug: 'aventurine',
    chakra: 'heart',
    element: 'earth',
    zodiac: ['aries', 'taurus'],
    origin: 'India',
    meaning: 'Prosperity and well-being',
    hardness: 7,
    colorVariants: ['Green', 'Peach', 'Blue'],
  },
  {
    name: 'Selenite',
    slug: 'selenite',
    chakra: 'crown',
    element: 'ether',
    zodiac: ['taurus', 'cancer'],
    origin: 'Mexico',
    meaning: 'Cleansing and divine connection',
    hardness: 2,
    colorVariants: ['White', 'Satin Spar', 'Orange'],
  },
]

// ========================================
// Synergy Content Generator
// ========================================

interface SynergyTemplate {
  headline: string
  story: string
  scientificNote: string
  ritual: { title: string; instruction: string; duration: string }[]
  intention: string
  frequency?: number
  frequencyName?: string
  collectionTheme?: string
}

function generateSynergyContent(
  oil: typeof OILS[0],
  crystal: typeof CRYSTALS[0]
): SynergyTemplate {
  // Define archetypal combinations with rich content
  const archetypes: Record<string, Partial<SynergyTemplate>> = {
    // Lavender combinations
    'lavender-amethyst': {
      headline: 'The Sleep Sanctuary',
      intention: 'sleep',
      frequency: 528,
      frequencyName: '528Hz - Love Frequency',
      collectionTheme: 'Evening Ritual',
    },
    'lavender-rose-quartz': {
      headline: 'Heart\'s Embrace',
      intention: 'love',
      collectionTheme: 'Self-Care',
    },
    'lavender-citrine': {
      headline: 'Golden Dreams',
      intention: 'abundance',
      collectionTheme: 'Manifestation',
    },
    // Rose Otto combinations
    'rose-otto-rose-quartz': {
      headline: 'The Lovers\' Alchemy',
      intention: 'love',
      frequency: 639,
      frequencyName: '639Hz - Heart Connection',
      collectionTheme: 'Sacred Union',
    },
    'rose-otto-moonstone': {
      headline: 'Divine Feminine',
      intention: 'spiritual',
      collectionTheme: 'Goddess Energy',
    },
    // Eucalyptus combinations
    'eucalyptus-clear-quartz': {
      headline: 'Crystal Clarity',
      intention: 'clarity',
      collectionTheme: 'Morning Awakening',
    },
    'eucalyptus-amethyst': {
      headline: 'Breathe Deep',
      intention: 'healing',
      collectionTheme: 'Wellness Ritual',
    },
    // Frankincense combinations
    'frankincense-amethyst': {
      headline: 'Temple of the Soul',
      intention: 'spiritual',
      frequency: 963,
      frequencyName: '963Hz - Crown Activation',
      collectionTheme: 'Meditation',
    },
    'frankincense-selenite': {
      headline: 'Celestial Gateway',
      intention: 'spiritual',
      collectionTheme: 'Sacred Space',
    },
    // Peppermint combinations
    'peppermint-citrine': {
      headline: 'Morning Fire',
      intention: 'energy',
      collectionTheme: 'Rise & Shine',
    },
    'peppermint-clear-quartz': {
      headline: 'Mental Laser',
      intention: 'clarity',
      collectionTheme: 'Focus & Flow',
    },
    // Sandalwood combinations
    'sandalwood-garnet': {
      headline: 'Rooted Passion',
      intention: 'grounding',
      collectionTheme: 'Earth Wisdom',
    },
    'sandalwood-cedarwood': {
      headline: 'Ancient Forest',
      intention: 'spiritual',
      collectionTheme: 'Tree Wisdom',
    },
    // Default archetype
    default: {
      headline: 'Harmonic Convergence',
      intention: 'balance',
      collectionTheme: 'Daily Ritual',
    },
  }

  const key = `${oil.slug}-${crystal.slug}`
  const archetype = archetypes[key] || archetypes.default

  // Generate story based on oil and crystal properties
  const story = generateStory(oil, crystal)
  const scientificNote = generateScientificNote(oil, crystal)
  const ritual = generateRitual(oil, crystal)

  return {
    headline: archetype.headline || 'Harmonic Convergence',
    story,
    scientificNote,
    ritual,
    intention: archetype.intention || 'balance',
    frequency: archetype.frequency,
    frequencyName: archetype.frequencyName,
    collectionTheme: archetype.collectionTheme || 'Daily Ritual',
  }
}

function generateStory(oil: typeof OILS[0], crystal: typeof CRYSTALS[0]): string {
  const stories: Record<string, string> = {
    lavender: `In the purple fields where ${oil.name} blooms under the sun's gentle warmth, a secret partnership emerges with ${crystal.name}. This ancient alliance weaves together ${oil.botanicalName}'s calming molecules with ${crystal.meaning.toLowerCase()}. As you anoint your skin, imagine the essence traveling through your being, meeting the crystalline frequency of ${crystal.name} that has formed deep within the earth over millennia. Together, they create a sanctuary within you—a place where the mind quiets, the heart opens, and the spirit remembers its natural state of peace.`,
    
    'rose-otto': `From the dawn-kissed gardens where ${oil.name} blossoms, comes an elixir of the heart. When paired with ${crystal.name}, the essence of ${oil.botanicalName} creates a portal to profound emotional healing. The ${crystal.meaning.toLowerCase()} of ${crystal.name} amplifies the heart-centered properties of this precious oil. Together, they guide you through layers of protection you've built around your heart, gently dissolving what no longer serves you. This is alchemy of the highest order—transmuting pain into compassion, fear into love, separation into unity.`,
    
    eucalyptus: `From the ancient forests of ${oil.origin}, ${oil.name} carries the wisdom of the wild. United with ${crystal.name}, this pairing becomes a breath of fresh clarity for body and mind. The ${crystal.meaning.toLowerCase()} merges with ${oil.botanicalName}'s clarifying vapors, creating an atmosphere where inspiration flows freely. As you inhale this sacred combination, visualize your respiratory system expanding, your mind clearing like fog lifting from a mountain valley. This is the breath of transformation.`,
    
    frankincense: `Sacred ${oil.name}, treasured by priests and mystics since the dawn of civilization, finds its perfect companion in ${crystal.name}. The resin tears of ${oil.botanicalName}, harvested under the desert moon, resonate with ${crystal.name}'s ${crystal.meaning.toLowerCase()}. Together, they form a bridge between worlds—the earthly and the divine, the known and the mysterious. In meditation, this pairing becomes your anchor to the infinite, opening channels of perception that transcend ordinary consciousness.`,
    
    default: `The meeting of ${oil.name} and ${crystal.name} is no coincidence—it is a reunion of ancient allies. ${oil.botanicalName}, with its ${oil.properties.join(', ').toLowerCase()} essence, dances in harmony with ${crystal.name}, bearer of ${crystal.meaning.toLowerCase()}. This synergy creates a unique vibrational signature that supports your journey toward ${crystal.chakra} chakra balance. Together, they remind you that healing happens when we align with nature's intelligence, honoring both the botanical wisdom of the plant kingdom and the crystalline consciousness born in earth's heart.`,
  }

  return stories[oil.slug] || stories.default
}

function generateScientificNote(oil: typeof OILS[0], crystal: typeof CRYSTALS[0]): string {
  const notes: Record<string, string> = {
    lavender: `Linalool and linalyl acetate in ${oil.name} oil demonstrate anxiolytic effects by modulating GABA receptors, while ${crystal.name}'s piezoelectric properties may influence subtle electromagnetic fields.`,
    
    'rose-otto': `Beta-damascenone and citronellol in ${oil.name} have shown mood-elevating effects in clinical studies, potentially synergizing with the heart rate variability improvements associated with ${crystal.name} exposure.`,
    
    eucalyptus: `Eucalyptol (1,8-cineole) comprises 70-90% of ${oil.name} oil and demonstrates bronchodilator and mucolytic properties, while ${crystal.name} has been used in traditional systems for energetic clearing.`,
    
    'tea-tree': `Terpinen-4-ol, the primary active compound in ${oil.name}, exhibits broad-spectrum antimicrobial activity, complementing ${crystal.name}'s historical use for purification practices.`,
    
    default: `The terpenoid compounds in ${oil.name} interact with olfactory receptors to trigger limbic system responses, while ${crystal.name}'s unique mineral structure creates subtle energetic resonance patterns.`,
  }

  return notes[oil.slug] || notes.default
}

function generateRitual(
  oil: typeof OILS[0],
  crystal: typeof CRYSTALS[0]
): { title: string; instruction: string; duration: string }[] {
  return [
    {
      title: 'Preparation',
      instruction: `Find a quiet space. Hold your ${crystal.name} in your receptive hand (left if right-handed, right if left-handed). Take three deep breaths.`,
      duration: '1 minute',
    },
    {
      title: 'Anointing',
      instruction: `Place 1-2 drops of ${oil.name} oil in your palm. Roll the ${crystal.name} through the oil, coating it gently while setting your intention.`,
      duration: '2 minutes',
    },
    {
      title: 'Connection',
      instruction: `Bring the anointed ${crystal.name} to your ${crystal.chakra === 'all' ? 'heart' : crystal.chakra} chakra. Close your eyes and feel the resonance between crystal and oil.`,
      duration: '5 minutes',
    },
    {
      title: 'Integration',
      instruction: `Place the ${crystal.name} where you can see it throughout your day. The oil will continue to work with the crystal's energy.`,
      duration: 'Ongoing',
    },
  ]
}

// ========================================
// Seeding Functions
// ========================================

async function createCrystals(): Promise<Record<string, string>> {
  console.log('Creating crystals...')
  const crystalIds: Record<string, string> = {}

  for (const crystal of CRYSTALS) {
    const doc = {
      _type: 'crystal',
      _id: `crystal-${crystal.slug}`,
      name: crystal.name,
      slug: { current: crystal.slug, _type: 'slug' as const },
      properties: {
        chakra: crystal.chakra,
        element: crystal.element,
        zodiac: crystal.zodiac,
        origin: crystal.origin,
        meaning: crystal.meaning,
      },
      availability: 'in-stock' as const,
      hardness: crystal.hardness,
      colorVariants: crystal.colorVariants,
      featured: ['amethyst', 'rose-quartz', 'clear-quartz'].includes(crystal.slug),
      educationalContent: [
        {
          _key: uuidv4(),
          _type: 'contentBlock' as const,
          title: 'Formation & Origins',
          type: 'formation' as const,
          content: [
            {
              _type: 'block' as const,
              _key: uuidv4(),
              style: 'normal' as const,
              children: [
                {
                  _type: 'span' as const,
                  _key: uuidv4(),
                  text: `${crystal.name} forms deep within the earth under specific geological conditions. Mined from ${crystal.origin}, each piece carries the energetic signature of its birthplace.`,
                  marks: [],
                },
              ],
              markDefs: [],
            },
          ],
        },
        {
          _key: uuidv4(),
          _type: 'contentBlock' as const,
          title: 'Metaphysical Properties',
          type: 'healing' as const,
          content: [
            {
              _type: 'block' as const,
              _key: uuidv4(),
              style: 'normal' as const,
              children: [
                {
                  _type: 'span' as const,
                  _key: uuidv4(),
                  text: `${crystal.name} resonates with the ${crystal.chakra} chakra, bringing ${crystal.meaning.toLowerCase()}. It connects with the element of ${crystal.element} and harmonizes particularly well with ${crystal.zodiac.slice(0, 3).join(', ')} energies.`,
                  marks: [],
                },
              ],
              markDefs: [],
            },
          ],
        },
      ],
    }

    try {
      const result = await client.createOrReplace(doc)
      crystalIds[crystal.slug] = result._id
      console.log(`  ✓ Created: ${crystal.name}`)
    } catch (error) {
      console.error(`  ✗ Failed: ${crystal.name}`, error)
    }
  }

  return crystalIds
}

async function createOils(crystalIds: Record<string, string>): Promise<Record<string, string>> {
  console.log('Creating oils...')
  const oilIds: Record<string, string> = {}

  // Map default crystals for each oil
  const oilCrystalMap: Record<string, string> = {
    lavender: 'amethyst',
    'rose-otto': 'rose-quartz',
    eucalyptus: 'clear-quartz',
    'tea-tree': 'black-tourmaline',
    frankincense: 'selenite',
    peppermint: 'citrine',
    sandalwood: 'garnet',
    lemon: 'citrine',
    'ylang-ylang': 'rose-quartz',
    cedarwood: 'black-tourmaline',
    bergamot: 'aventurine',
    'clary-sage': 'moonstone',
  }

  for (const oil of OILS) {
    const defaultCrystalSlug = oilCrystalMap[oil.slug]
    const defaultCrystalId = crystalIds[defaultCrystalSlug]

    const doc = {
      _type: 'oil' as const,
      _id: `oil-${oil.slug}`,
      title: oil.name,
      slug: { current: oil.slug, _type: 'slug' as const },
      botanicalName: oil.botanicalName,
      commonName: oil.commonName,
      origin: oil.origin,
      description: oil.description,
      price: Math.floor(Math.random() * 40) + 20, // Random price between 20-60
      crystal: {
        name: CRYSTALS.find(c => c.slug === defaultCrystalSlug)?.name || 'Clear Quartz',
        property: CRYSTALS.find(c => c.slug === defaultCrystalSlug)?.meaning || 'Clarity',
        color: CRYSTALS.find(c => c.slug === defaultCrystalSlug)?.colorVariants[0] || 'Clear',
        reference: { _type: 'reference' as const, _ref: defaultCrystalId },
      },
      category: oil.category,
      benefits: oil.benefits,
      extractionMethod: {
        method: oil.extractionMethod,
        details: `Extracted from ${oil.plantPart} using ${oil.extractionMethod}`,
      },
      botanicalOrigin: {
        plantPart: oil.plantPart,
        harvestingInfo: `Sustainably harvested from ${oil.origin}`,
      },
      therapeuticProperties: {
        primary: oil.properties,
        emotional: oil.benefits.slice(0, 2),
        physical: oil.benefits.slice(2),
        spiritual: ['Grounding', 'Awareness'],
      },
      safetyNotes: {
        dilutionRequired: true,
        contraindications: oil.slug === 'clary-sage' ? ['pregnancy'] : [],
      },
      featured: ['lavender', 'rose-otto', 'frankincense'].includes(oil.slug),
    }

    try {
      const result = await client.createOrReplace(doc)
      oilIds[oil.slug] = result._id
      console.log(`  ✓ Created: ${oil.name}`)
    } catch (error) {
      console.error(`  ✗ Failed: ${oil.name}`, error)
    }
  }

  return oilIds
}

async function createSynergyContent(
  oilIds: Record<string, string>,
  crystalIds: Record<string, string>
): Promise<void> {
  console.log('Creating synergy content (144 combinations)...')
  let count = 0

  for (const oil of OILS) {
    for (const crystal of CRYSTALS) {
      const content = generateSynergyContent(oil, crystal)
      
      const doc = {
        _type: 'synergyContent' as const,
        _id: `synergy-${oil.slug}-${crystal.slug}`,
        oil: { _type: 'reference' as const, _ref: oilIds[oil.slug] },
        crystal: { _type: 'reference' as const, _ref: crystalIds[crystal.slug] },
        headline: content.headline,
        story: [
          {
            _type: 'block' as const,
            _key: uuidv4(),
            style: 'normal' as const,
            children: [
              {
                _type: 'span' as const,
                _key: uuidv4(),
                text: content.story,
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
        scientificNote: content.scientificNote,
        ritualInstructions: content.ritual.map((step, i) => ({
          _type: 'ritualStep' as const,
          _key: uuidv4(),
          stepNumber: i + 1,
          title: step.title,
          instruction: step.instruction,
          duration: step.duration,
        })),
        frequency: content.frequency,
        frequencyName: content.frequencyName,
        collectionTheme: content.collectionTheme,
        chakraAlignment: crystal.chakra,
        element: crystal.element,
        zodiacAffinity: crystal.zodiac,
        bestTime: oil.category === 'citrus' ? 'morning' : oil.slug === 'lavender' ? 'night' : 'any',
        intention: content.intention,
        isFeatured: 
          (oil.slug === 'lavender' && crystal.slug === 'amethyst') ||
          (oil.slug === 'rose-otto' && crystal.slug === 'rose-quartz') ||
          (oil.slug === 'frankincense' && crystal.slug === 'selenite'),
        priority: oil.slug === 'lavender' && crystal.slug === 'amethyst' ? 100 : 0,
      }

      try {
        await client.createOrReplace(doc)
        count++
        if (count % 20 === 0) {
          process.stdout.write(`  ${count}/144...\r`)
        }
      } catch (error) {
        console.error(`  ✗ Failed: ${oil.name} + ${crystal.name}`, error)
      }
    }
  }

  console.log(`  ✓ Created: ${count} synergy content documents`)
}

async function createCordTypes(): Promise<void> {
  console.log('Creating cord types...')

  const cords = [
    // Cords
    { name: 'Natural Cotton Cord', type: 'cord' as const, tier: 'seed' as const, price: 0, material: 'Organic Cotton', color: 'Natural', isDefault: true },
    { name: 'Black Waxed Cord', type: 'cord' as const, tier: 'seed' as const, price: 0, material: 'Waxed Cotton', color: 'Black' },
    { name: 'Silk Cord', type: 'cord' as const, tier: 'sprout' as const, price: 5, material: 'Pure Silk', color: 'Ivory' },
    { name: 'Hemp Cord', type: 'cord' as const, tier: 'seed' as const, price: 0, material: 'Hemp', color: 'Natural' },
    // Charms
    { name: 'Lotus Charm', type: 'charm' as const, tier: 'seed' as const, price: 0, material: 'Brass', symbolism: 'Spiritual awakening and purity', purchaseCount: 0, isDefault: true },
    { name: 'Moon Charm', type: 'charm' as const, tier: 'sprout' as const, price: 8, material: 'Sterling Silver', symbolism: 'Intuition and cycles', purchaseCount: 2 },
    { name: 'Tree of Life', type: 'charm' as const, tier: 'bloom' as const, price: 12, material: 'Gold-plated', symbolism: 'Growth and connection', purchaseCount: 5 },
    { name: 'Evil Eye', type: 'charm' as const, tier: 'radiance' as const, price: 15, material: 'Enamel & Gold', symbolism: 'Protection and warding', purchaseCount: 10 },
    // Chains
    { name: 'Sterling Silver Chain', type: 'chain' as const, tier: 'bloom' as const, price: 18, material: 'Sterling Silver', color: 'Silver', length: '18"' },
    { name: 'Gold-Filled Chain', type: 'chain' as const, tier: 'radiance' as const, price: 25, material: '14k Gold-Filled', color: 'Gold', length: '18"' },
    { name: 'Rose Gold Chain', type: 'chain' as const, tier: 'luminary' as const, price: 30, material: 'Rose Gold Vermeil', color: 'Rose Gold', length: '20"' },
  ]

  for (const cord of cords) {
    const doc = {
      _type: 'cordType' as const,
      _id: `cord-${cord.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: cord.name,
      slug: { current: cord.name.toLowerCase().replace(/\s+/g, '-'), _type: 'slug' as const },
      type: cord.type,
      material: cord.material,
      tierRequirement: cord.tier,
      price: cord.price,
      color: cord.color,
      length: cord.length,
      symbolism: cord.symbolism,
      purchaseCountRequirement: cord.purchaseCount || 0,
      isDefault: cord.isDefault || false,
      availability: 'available' as const,
      shortDescription: cord.type === 'charm' 
        ? `${cord.symbolism?.split(' ')[0]} charm` 
        : `${cord.material} ${cord.type}`,
    }

    try {
      await client.createOrReplace(doc)
      console.log(`  ✓ Created: ${cord.name}`)
    } catch (error) {
      console.error(`  ✗ Failed: ${cord.name}`, error)
    }
  }
}

// ========================================
// Main Execution
// ========================================

async function seed(): Promise<void> {
  console.log('='.repeat(60))
  console.log('Oil Amor - Content Seeding')
  console.log('='.repeat(60))
  console.log(`Project: ${PROJECT_ID}`)
  console.log(`Dataset: ${DATASET}`)
  console.log('='.repeat(60))
  console.log()

  try {
    // Step 1: Create Crystals
    const crystalIds = await createCrystals()
    console.log(`\nCreated ${Object.keys(crystalIds).length} crystals\n`)

    // Step 2: Create Oils
    const oilIds = await createOils(crystalIds)
    console.log(`\nCreated ${Object.keys(oilIds).length} oils\n`)

    // Step 3: Create Synergy Content (144 combinations)
    await createSynergyContent(oilIds, crystalIds)
    console.log()

    // Step 4: Create Cord Types
    await createCordTypes()
    console.log()

    console.log('='.repeat(60))
    console.log('Seeding Complete!')
    console.log('='.repeat(60))
    console.log()
    console.log('Summary:')
    console.log(`  • ${Object.keys(crystalIds).length} Crystals`)
    console.log(`  • ${Object.keys(oilIds).length} Essential Oils`)
    console.log(`  • ${Object.keys(oilIds).length * Object.keys(crystalIds).length} Synergy Combinations`)
    console.log(`  • Cord/Charm/Chain catalog created`)
    console.log()

  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding
seed()
