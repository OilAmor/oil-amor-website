/**
 * Oil Archetype Data - For Blend Revelation Engine
 * 
 * This extends the base oil data with energetic/archetype properties
 * used by the AI revelation system.
 */

import { OilArchetype } from './blend-revelation-engine';
import { OIL_WISDOM } from './oil-wisdom';

export const OIL_ARCHETYPES: Record<string, OilArchetype> = {
  // Common Oils
  'lemon': {
    id: 'lemon',
    name: 'Lemon',
    element: 'air',
    chakra: 'solar-plexus',
    energetic: 'uplifting',
    notes: 'top',
    intensity: 7,
    personality: ['messenger', 'purifier', 'awakening']
  },
  'lemongrass': {
    id: 'lemongrass',
    name: 'Lemongrass',
    element: 'air',
    chakra: 'solar-plexus',
    energetic: 'cooling',
    notes: 'top',
    intensity: 6,
    personality: ['purifier', 'activator', 'clarifier']
  },
  'lavender': {
    id: 'lavender',
    name: 'Lavender',
    element: 'air',
    chakra: 'heart',
    energetic: 'balancing',
    notes: 'middle',
    intensity: 5,
    personality: ['healer', 'nurturer', 'harmonizer']
  },
  'peppermint': {
    id: 'peppermint',
    name: 'Peppermint',
    element: 'air',
    chakra: 'throat',
    energetic: 'cooling',
    notes: 'top',
    intensity: 8,
    personality: ['awakener', 'clarifier', 'invigorator']
  },
  'tea-tree': {
    id: 'tea-tree',
    name: 'Tea Tree',
    element: 'air',
    chakra: 'throat',
    energetic: 'cooling',
    notes: 'middle',
    intensity: 7,
    personality: ['purifier', 'protector', 'warrior']
  },
  'sweet-orange': {
    id: 'sweet-orange',
    name: 'Sweet Orange',
    element: 'fire',
    chakra: 'sacral',
    energetic: 'uplifting',
    notes: 'top',
    intensity: 6,
    personality: ['joy-bringer', 'childlike', 'sun-bearer']
  },
  'eucalyptus': {
    id: 'eucalyptus',
    name: 'Eucalyptus',
    element: 'air',
    chakra: 'throat',
    energetic: 'cooling',
    notes: 'top',
    intensity: 7,
    personality: ['healer', 'opener', 'purifier']
  },
  'rosemary': {
    id: 'rosemary',
    name: 'Rosemary',
    element: 'fire',
    chakra: 'third-eye',
    energetic: 'warming',
    notes: 'middle',
    intensity: 6,
    personality: ['rememberer', 'clarifier', 'scholar']
  },
  'frankincense': {
    id: 'frankincense',
    name: 'Frankincense',
    element: 'ether',
    chakra: 'crown',
    energetic: 'grounding',
    notes: 'base',
    intensity: 4,
    personality: ['mystic', 'ancient', 'sacred']
  },
  
  // Uncommon Oils
  'bergamot': {
    id: 'bergamot',
    name: 'Bergamot',
    element: 'air',
    chakra: 'heart',
    energetic: 'uplifting',
    notes: 'top',
    intensity: 5,
    personality: ['joy-bringer', 'harmonizer', 'sun-moon']
  },
  'ylang-ylang': {
    id: 'ylang-ylang',
    name: 'Ylang Ylang',
    element: 'water',
    chakra: 'heart',
    energetic: 'calming',
    notes: 'base',
    intensity: 6,
    personality: ['seductress', 'feminine', 'flow']
  },
  'clary-sage': {
    id: 'clary-sage',
    name: 'Clary Sage',
    element: 'ether',
    chakra: 'third-eye',
    energetic: 'balancing',
    notes: 'middle',
    intensity: 5,
    personality: ['visionary', 'dreamer', 'seer']
  },
  'cedarwood': {
    id: 'cedarwood',
    name: 'Cedarwood',
    element: 'earth',
    chakra: 'root',
    energetic: 'grounding',
    notes: 'base',
    intensity: 4,
    personality: ['elder', 'ancient', 'groundskeeper']
  },
  'geranium': {
    id: 'geranium',
    name: 'Geranium',
    element: 'water',
    chakra: 'heart',
    energetic: 'balancing',
    notes: 'middle',
    intensity: 5,
    personality: ['harmonizer', 'mother', 'balancer']
  },
  'patchouli': {
    id: 'patchouli',
    name: 'Patchouli',
    element: 'earth',
    chakra: 'root',
    energetic: 'grounding',
    notes: 'base',
    intensity: 7,
    personality: ['hippie', 'earthy', 'sensual']
  },
  'juniper-berry': {
    id: 'juniper-berry',
    name: 'Juniper Berry',
    element: 'water',
    chakra: 'throat',
    energetic: 'cooling',
    notes: 'middle',
    intensity: 5,
    personality: ['purifier', 'protector', 'forest']
  },
  'ginger': {
    id: 'ginger',
    name: 'Ginger',
    element: 'fire',
    chakra: 'solar-plexus',
    energetic: 'warming',
    notes: 'middle',
    intensity: 8,
    personality: ['warrior', 'activator', 'fire-starter']
  },
  'cinnamon-bark': {
    id: 'cinnamon-bark',
    name: 'Cinnamon Bark',
    element: 'fire',
    chakra: 'solar-plexus',
    energetic: 'warming',
    notes: 'middle',
    intensity: 9,
    personality: ['fire-keeper', 'passionate', 'abundance']
  },
  
  // Rare Oils
  'rose-otto': {
    id: 'rose-otto',
    name: 'Rose Otto',
    element: 'water',
    chakra: 'heart',
    energetic: 'calming',
    notes: 'middle',
    intensity: 3,
    personality: ['queen', 'divine-feminine', 'unconditional-love']
  },
  'neroli': {
    id: 'neroli',
    name: 'Neroli',
    element: 'fire',
    chakra: 'heart',
    energetic: 'calming',
    notes: 'middle',
    intensity: 4,
    personality: ['light-bringer', 'hope', 'pure-heart']
  },
  'sandalwood': {
    id: 'sandalwood',
    name: 'Sandalwood',
    element: 'earth',
    chakra: 'root',
    energetic: 'grounding',
    notes: 'base',
    intensity: 3,
    personality: ['monk', 'meditator', 'ancient-wisdom']
  },
  'vetiver': {
    id: 'vetiver',
    name: 'Vetiver',
    element: 'earth',
    chakra: 'root',
    energetic: 'grounding',
    notes: 'base',
    intensity: 6,
    personality: ['anchor', 'deep-roots', 'steadfast']
  },
  'helichrysum': {
    id: 'helichrysum',
    name: 'Helichrysum',
    element: 'ether',
    chakra: 'heart',
    energetic: 'balancing',
    notes: 'middle',
    intensity: 4,
    personality: ['immortal', 'sun-catcher', 'wound-healer']
  },
  'myrrh': {
    id: 'myrrh',
    name: 'Myrrh',
    element: 'earth',
    chakra: 'root',
    energetic: 'grounding',
    notes: 'base',
    intensity: 4,
    personality: ['mystic', 'ancient', 'sacred-mourning']
  },
  'jasmine': {
    id: 'jasmine',
    name: 'Jasmine',
    element: 'water',
    chakra: 'sacral',
    energetic: 'uplifting',
    notes: 'base',
    intensity: 5,
    personality: ['night-queen', 'seductress', 'intoxicating']
  },
  'chamomile-roman': {
    id: 'chamomile-roman',
    name: 'Chamomile Roman',
    element: 'water',
    chakra: 'solar-plexus',
    energetic: 'calming',
    notes: 'middle',
    intensity: 3,
    personality: ['gentle-mother', 'soother', 'child-protector']
  },
  
  // Mystical/Dangerous Oils
  'hyssop': {
    id: 'hyssop',
    name: 'Hyssop',
    element: 'air',
    chakra: 'throat',
    energetic: 'cooling',
    notes: 'middle',
    intensity: 6,
    personality: ['purifier', 'sacred', 'boundary-keeper']
  },
  'clove-bud': {
    id: 'clove-bud',
    name: 'Clove Bud',
    element: 'fire',
    chakra: 'solar-plexus',
    energetic: 'warming',
    notes: 'middle',
    intensity: 9,
    personality: ['protector', 'warrior', 'numbing']
  },
  'wormwood': {
    id: 'wormwood',
    name: 'Wormwood',
    element: 'ether',
    chakra: 'third-eye',
    energetic: 'cooling',
    notes: 'middle',
    intensity: 8,
    personality: ['shaman', 'visionary', 'dangerous-mystic']
  },
  'sage': {
    id: 'sage',
    name: 'Sage',
    element: 'air',
    chakra: 'third-eye',
    energetic: 'cooling',
    notes: 'middle',
    intensity: 6,
    personality: ['wise-woman', 'cleanser', 'ancestral']
  },
  // Additional Collection Oils
  'cinnamon-leaf': {
    id: 'cinnamon-leaf',
    name: 'Cinnamon Leaf',
    element: 'fire',
    chakra: 'solar-plexus',
    energetic: 'warming',
    notes: 'middle',
    intensity: 7,
    personality: ['warmer', 'activator', 'protector']
  },
  'may-chang': {
    id: 'may-chang',
    name: 'May Chang',
    element: 'air',
    chakra: 'solar-plexus',
    energetic: 'uplifting',
    notes: 'top',
    intensity: 6,
    personality: ['refresher', 'clarifier', 'brightener']
  },
  'carrot-seed': {
    id: 'carrot-seed',
    name: 'Carrot Seed',
    element: 'earth',
    chakra: 'root',
    energetic: 'grounding',
    notes: 'middle',
    intensity: 4,
    personality: ['restorer', 'regenerator', 'elder']
  },
  'lemon-myrtle': {
    id: 'lemon-myrtle',
    name: 'Lemon Myrtle',
    element: 'air',
    chakra: 'throat',
    energetic: 'cooling',
    notes: 'top',
    intensity: 8,
    personality: ['purifier', 'awakener', 'invigorator']
  },
  'geranium-bourbon': {
    id: 'geranium-bourbon',
    name: 'Geranium Bourbon',
    element: 'water',
    chakra: 'heart',
    energetic: 'balancing',
    notes: 'middle',
    intensity: 5,
    personality: ['harmonizer', 'feminine', 'balancer']
  },
  'patchouli-dark': {
    id: 'patchouli-dark',
    name: 'Patchouli Dark',
    element: 'earth',
    chakra: 'root',
    energetic: 'grounding',
    notes: 'base',
    intensity: 6,
    personality: ['earthy', 'mysterious', 'sensual']
  },
  'bergamot-fcf': {
    id: 'bergamot-fcf',
    name: 'Bergamot FCF',
    element: 'air',
    chakra: 'heart',
    energetic: 'uplifting',
    notes: 'top',
    intensity: 5,
    personality: ['joy-bringer', 'sun-moon', 'harmonizer']
  },
  'grapefruit': {
    id: 'grapefruit',
    name: 'Pink Grapefruit',
    element: 'fire',
    chakra: 'solar-plexus',
    energetic: 'uplifting',
    notes: 'top',
    intensity: 6,
    personality: ['cheerful', 'energizer', 'bright-spirit']
  }
};

export function getOilArchetype(id: string): OilArchetype | undefined {
  const archetype = OIL_ARCHETYPES[id];
  if (!archetype) return undefined;
  
  // ENHANCED: Enrich with wisdom data
  const wisdom = OIL_WISDOM[id as keyof typeof OIL_WISDOM];
  if (!wisdom) return archetype;
  
  return {
    ...archetype,
    // Add wisdom-enhanced fields
    wisdom,
    frequency: wisdom.frequency,
    affirmation: wisdom.metaphysical?.affirmation,
    tarotCard: wisdom.metaphysical?.tarotCorrespondence,
    latinName: wisdom.latinName,
    spiritualDescription: wisdom.description?.spiritual,
    culturalContext: wisdom.traditionalUses?.cultures
  };
}

export function getAllOilArchetypes(): OilArchetype[] {
  return Object.values(OIL_ARCHETYPES);
}

// Default archetype for unknown oils
export const DEFAULT_OIL_ARCHETYPE: OilArchetype = {
  id: 'unknown',
  name: 'Unknown Oil',
  element: 'earth',
  chakra: 'heart',
  energetic: 'balancing',
  notes: 'middle',
  intensity: 5,
  personality: ['mystic']
};
