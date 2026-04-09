/**
 * Oil Interaction Database
 * 
 * Comprehensive data on how oils interact with each other:
 * - Incompatible combinations (cancel out, negative reactions)
 * - Scent conflicts (overpowering, clashing profiles)
 * - Synergistic combinations (work well together)
 */

export type InteractionType = 
  | 'cancels-out'      // Oils that neutralize each other's effects
  | 'negative-reaction' // Chemical/physical incompatibility
  | 'overpowering'     // One oil completely masks another
  | 'scent-clash'      // Unpleasant aroma combination
  | 'synergistic'      // Work well together (positive)

export interface OilInteraction {
  oilId1: string
  oilId2: string
  type: InteractionType
  severity: 'low' | 'moderate' | 'high' | 'critical'
  title: string
  description: string
  explanation: string
  recommendation: string
}

// ============================================================================
// SYNERGISTIC COMBINATIONS (GOOD TOGETHER)
// ============================================================================

export const SYNERGISTIC_COMBINATIONS: Array<{
  oils: string[]
  name: string
  description: string
  category: 'sleep' | 'energy' | 'immunity' | 'focus' | 'mood' | 'respiratory'
}> = [
  {
    oils: ['lavender', 'bergamot', 'cedarwood'],
    name: 'The Sleep Trinity',
    description: 'Classic combination for deep relaxation and restful sleep.',
    category: 'sleep',
  },
  {
    oils: ['lemon', 'rosemary', 'peppermint'],
    name: 'Morning Energizer',
    description: 'Uplifting and mentally stimulating—perfect for starting the day.',
    category: 'energy',
  },
  {
    oils: ['tea-tree', 'eucalyptus', 'lemon'],
    name: 'Immune Defense',
    description: 'Powerful antimicrobial combination for immune support.',
    category: 'immunity',
  },
  {
    oils: ['rosemary', 'basil', 'lemon'],
    name: 'Study Blend',
    description: 'Enhances memory retention and mental clarity.',
    category: 'focus',
  },
  {
    oils: ['ylang-ylang', 'bergamot', 'frankincense'],
    name: 'Joyful Heart',
    description: 'Uplifting yet grounding—perfect for emotional balance.',
    category: 'mood',
  },
  {
    oils: ['eucalyptus', 'peppermint', 'tea-tree'],
    name: 'Clear Breathing',
    description: 'Opens airways and supports respiratory health.',
    category: 'respiratory',
  },
  
  // New atelier synergies
  {
    oils: ['lemongrass', 'ginger', 'patchouli-dark'],
    name: 'Asian Spa',
    description: 'Earthy, grounding blend with invigorating citrus notes.',
    category: 'mood',
  },
  {
    oils: ['carrot-seed', 'geranium-bourbon', 'lavender'],
    name: 'Skin Nourishing',
    description: 'Gentle, restorative blend for skin health.',
    category: 'mood',
  },
  {
    oils: ['may-chang', 'ginger', 'clove-bud'],
    name: 'Warming Spice',
    description: 'Stimulating, warming blend for circulation and energy.',
    category: 'energy',
  },
  {
    oils: ['juniper-berry', 'lemon', 'rosemary'],
    name: 'Detox Support',
    description: 'Traditional blend for lymphatic support and cleansing.',
    category: 'energy',
  },
  {
    oils: ['myrrh', 'frankincense', 'cedarwood'],
    name: 'Sacred Wood',
    description: 'Ancient spiritual blend for meditation and grounding.',
    category: 'mood',
  },
]

// ============================================================================
// INCOMPATIBLE / PROBLEMATIC COMBINATIONS
// ============================================================================

export const OIL_INTERACTIONS: OilInteraction[] = [
  // CANCELLING OUT EFFECTS
  {
    oilId1: 'lavender',
    oilId2: 'rosemary',
    type: 'cancels-out',
    severity: 'moderate',
    title: 'Conflicting Effects',
    description: 'Lavender is calming while rosemary is stimulating—they may cancel each other out.',
    explanation: 'Lavender (linalool) promotes relaxation by affecting GABA receptors, while rosemary (1,8-cineole) increases alertness and mental stimulation through different neurological pathways.',
    recommendation: 'Use separately—lavender for evening relaxation, rosemary for morning focus. If combining, use very different ratios (80/20) rather than equal parts.',
  },
  {
    oilId1: 'chamomile',
    oilId2: 'peppermint',
    type: 'cancels-out',
    severity: 'moderate',
    title: 'Opposing Actions',
    description: 'Chamomile soothes while peppermint stimulates—the effects may counteract each other.',
    explanation: 'German chamomile contains chamazulene which is deeply calming, while peppermint\'s menthol triggers cold receptors and increases alertness.',
    recommendation: 'Choose one primary action for your blend. If using both, peppermint should be minimal (5-10%) to let chamomile dominate.',
  },
  {
    oilId1: 'ylang-ylang',
    oilId2: 'lemon',
    type: 'cancels-out',
    severity: 'low',
    title: 'Mood Conflict',
    description: 'Ylang-ylang sedates while lemon uplifts—the emotional effects may conflict.',
    explanation: 'Ylang-ylang is a powerful floral sedative, while lemon\'s limonene provides energizing, uplifting effects.',
    recommendation: 'This can work for mood stabilization, but test in small amounts first as the aroma profile can be polarizing.',
  },

  // NEGATIVE REACTIONS
  {
    oilId1: 'lemon',
    oilId2: 'lemon-myrtle',
    type: 'negative-reaction',
    severity: 'high',
    title: 'Phototoxicity Stacking',
    description: 'Combining two highly phototoxic citrus oils dramatically increases sun sensitivity risk.',
    explanation: 'Both oils contain high levels of furanocoumarins which react with UV light to cause severe skin reactions. The effect is multiplicative, not additive.',
    recommendation: 'Avoid combining multiple citrus oils. If using both, total blend should not exceed 0.5% concentration and avoid sun for 48 hours.',
  },
  {
    oilId1: 'bergamot',
    oilId2: 'lime',
    type: 'negative-reaction',
    severity: 'high',
    title: 'Extreme Phototoxic Risk',
    description: 'This combination creates severe phototoxicity—dangerous for skin exposed to sunlight.',
    explanation: 'Bergamot is one of the most phototoxic essential oils. Combined with lime, the furanocoumarin concentration becomes hazardous even in small amounts.',
    recommendation: 'Avoid this combination entirely for topical use. Consider bergamot FCF (furanocoumarin-free) if you need the scent profile.',
  },
  {
    oilId1: 'clove-bud',
    oilId2: 'cinnamon-bark',
    type: 'negative-reaction',
    severity: 'critical',
    title: 'Skin Sensitization Hazard',
    description: 'Both oils are extreme skin sensitizers—their combination exponentially increases irritation risk.',
    explanation: 'Clove bud contains 80%+ eugenol; cinnamon bark contains cinnamaldehyde. Both are known dermal irritants. Combined, they can cause chemical burns even at low dilutions.',
    recommendation: 'Never use these together topically. If both are desired, use cinnamon leaf (milder) instead of bark, and keep total concentration below 0.5%.',
  },
  {
    oilId1: 'oregano',
    oilId2: 'thyme',
    type: 'negative-reaction',
    severity: 'high',
    title: 'Phenol Overload',
    description: 'Both oils are extremely high in phenols—combining them creates overwhelming dermal toxicity.',
    explanation: 'Oregano (70%+ carvacrol) and thyme (40%+ thymol) are two of the most aggressive antimicrobial oils. Their phenolic compounds can severely irritate skin and mucous membranes.',
    recommendation: 'Use one or the other, never both. If blending for antimicrobial power, pair one phenol-rich oil with gentler oils like tea tree or lavender.',
  },
  {
    oilId1: 'wintergreen',
    oilId2: 'birch',
    type: 'negative-reaction',
    severity: 'critical',
    title: 'Methyl Salicylate Toxicity',
    description: 'Both oils are nearly pure methyl salicylate—combining them is dangerous.',
    explanation: 'Wintergreen and birch both contain 95%+ methyl salicylate. This compound is toxic in high amounts and can cause serious reactions, especially in children or those on blood thinners.',
    recommendation: 'Never combine these oils. Use maximum 2% dilution if using either one, and never on children or during pregnancy.',
  },

  // OVERPOWERING COMBINATIONS
  {
    oilId1: 'peppermint',
    oilId2: 'lavender',
    type: 'overpowering',
    severity: 'moderate',
    title: 'Aroma Dominance',
    description: 'Peppermint will completely overpower lavender—wasting the subtle floral notes.',
    explanation: 'Peppermint\'s menthol has an extremely high odor detection threshold and scent intensity. It can mask even strong floral oils like lavender.',
    recommendation: 'If using both, peppermint should be 10% or less of the blend. Consider spearmint (milder) for better balance with florals.',
  },
  {
    oilId1: 'eucalyptus',
    oilId2: 'geranium',
    type: 'overpowering',
    severity: 'moderate',
    title: 'Camphor Overwhelm',
    description: 'Eucalyptus\' camphoraceous intensity will dominate delicate geranium.',
    explanation: 'Eucalyptus radiata contains 65%+ 1,8-cineole which creates a powerful medicinal aroma that easily masks softer floral scents.',
    recommendation: 'Use eucalyptus sparingly (10-15%) when blending with geranium, or choose Eucalyptus citriodora (lemon eucalyptus) for better compatibility.',
  },
  {
    oilId1: 'clove-bud',
    oilId2: 'jasmine',
    type: 'overpowering',
    severity: 'high',
    title: 'Intense Spice Dominance',
    description: 'Clove\'s intense warmth will obliterate jasmine\'s delicate floral complexity.',
    explanation: 'Clove bud is one of the most aromatically potent oils. Even 1-2 drops can dominate a 30ml blend, rendering expensive jasmine invisible.',
    recommendation: 'Keep clove under 2% when working with precious florals. Consider clove leaf (milder scent) or cinnamon leaf as alternatives.',
  },
  {
    oilId1: 'tea-tree',
    oilId2: 'rose',
    type: 'overpowering',
    severity: 'moderate',
    title: 'Medicinal vs Floral',
    description: 'Tea tree\'s medicinal aroma clashes with and overpowers rose\'s sweetness.',
    explanation: 'Tea tree\'s terpinen-4-ol creates a sharp, medicinal scent profile that conflicts with rose\'s complex floral sweetness.',
    recommendation: 'These oils serve different purposes. If both are needed, use tea tree for therapeutic properties and rose for emotional benefits in separate applications.',
  },

  // SCENT CLASHES
  {
    oilId1: 'patchouli',
    oilId2: 'grapefruit',
    type: 'scent-clash',
    severity: 'low',
    title: 'Earthy vs Bright',
    description: 'Patchouli\'s deep earthiness can clash with grapefruit\'s sharp brightness.',
    explanation: 'Patchouli contains patchoulol which creates a heavy, musky base note. Grapefruit\'s limonene is light, sharp, and ephemeral.',
    recommendation: 'Can work with careful balancing—use patchouli as a 5% base anchor, grapefruit as 20% top note, with heart notes (florals) to bridge them.',
  },
  {
    oilId1: 'vetiver',
    oilId2: 'lemon',
    type: 'scent-clash',
    severity: 'low',
    title: 'Thick vs Light',
    description: 'Vetiver\'s thick, smoky viscosity creates textural conflict with light citrus.',
    explanation: 'Vetiver is one of the thickest, heaviest oils (like syrup). Lemon is thin and evaporates quickly. The sensory mismatch can be jarring.',
    recommendation: 'Add middle notes ( lavender, rosemary) to create a bridge between these extremes. Use vetiver sparingly (2-3%).',
  },
  {
    oilId1: 'sandalwood',
    oilId2: 'lime',
    type: 'scent-clash',
    severity: 'low',
    title: 'Creamy vs Sharp',
    description: 'Sandalwood\'s creamy softness conflicts with lime\'s piercing sharpness.',
    explanation: 'Sandalwood\'s santalols create a smooth, woody creaminess while lime\'s citral is sharp and acidic.',
    recommendation: 'Sweet orange or mandarin work better with sandalwood. If using lime, keep it under 10% and add vanilla to soften the transition.',
  },
  {
    oilId1: 'frankincense',
    oilId2: 'spearmint',
    type: 'scent-clash',
    severity: 'moderate',
    title: 'Sacred vs Casual',
    description: 'Frankincense\'s resinous spirituality clashes with spearmint\'s casual freshness.',
    explanation: 'Frankincense (boswellic acids) has been used in sacred ceremonies for millennia. Spearmint (carvone) is associated with toothpaste and candy.',
    recommendation: 'Use peppermint (more sophisticated) instead of spearmint, or replace frankincense with myrrh for better mint compatibility.',
  },

  // ============================================================================
  // HIGH-CITRAL OIL STACKING (NEW ATELIER OILS)
  // ============================================================================
  
  // Lemongrass interactions
  {
    oilId1: 'lemongrass',
    oilId2: 'lemon-myrtle',
    type: 'negative-reaction',
    severity: 'critical',
    title: 'CRITICAL: Extreme Citral Stacking',
    description: 'Lemongrass (75-85% citral) + Lemon Myrtle (90-98% citral) creates the highest possible citral concentration—SEVERE skin sensitization risk.',
    explanation: 'Combined citral content would be 85%+ of total blend—far exceeding IFRA safety limits of 0.7%. This combination can cause severe chemical burns and permanent sensitization.',
    recommendation: 'NEVER combine these oils. They are both high-citral oils and combining them creates a toxic dermal exposure.',
  },
  {
    oilId1: 'lemongrass',
    oilId2: 'may-chang',
    type: 'negative-reaction',
    severity: 'critical',
    title: 'CRITICAL: Unsafe Citral Combination',
    description: 'Lemongrass (75-85% citral) + May Chang (70-85% citral) exceeds safe dermal limits.',
    explanation: 'Both oils are restricted to 0.7-0.8% dermally due to citral content. Combined use makes it impossible to stay within safe limits.',
    recommendation: 'Use one OR the other, never both. Both serve similar aromatic purposes (citrus/lemon scent).',
  },
  
  // Lemon Myrtle interactions
  {
    oilId1: 'lemon-myrtle',
    oilId2: 'may-chang',
    type: 'negative-reaction',
    severity: 'critical',
    title: 'CRITICAL: Highest Citral Oils Combined',
    description: 'Lemon Myrtle (90-98% citral) + May Chang (70-85% citral) = EXTREME sensitization hazard.',
    explanation: 'This is the most dangerous combination of high-citral oils possible. Would cause severe skin reaction even at 1% total dilution.',
    recommendation: 'Absolutely contraindicated. Never use together.',
  },
  {
    oilId1: 'lemon-myrtle',
    oilId2: 'lemon',
    type: 'negative-reaction',
    severity: 'high',
    title: 'Phototoxicity + Sensitization Stack',
    description: 'Lemon Myrtle (sensitizing) + Lemon (phototoxic) creates dual skin hazard.',
    explanation: 'Lemon myrtle causes sensitization, lemon causes phototoxicity. Combined = skin damage from two different mechanisms.',
    recommendation: 'Avoid combining. If lemon scent needed, use lemon alone at proper dilution (2%) or substitute with non-phototoxic citrus.',
  },
  
  // Cinnamon interactions
  {
    oilId1: 'cinnamon-leaf',
    oilId2: 'cinnamon-bark',
    type: 'negative-reaction',
    severity: 'critical',
    title: 'CRITICAL: Dual Cinnamon Irritation',
    description: 'Cinnamon Leaf (80%+ eugenol) + Cinnamon Bark (60%+ cinnamaldehyde) = severe skin and mucous membrane damage.',
    explanation: 'Leaf and bark have different primary constituents but both are extreme irritants. Combined they attack skin through different chemical pathways (eugenol vs cinnamaldehyde).',
    recommendation: 'NEVER use together. Choose ONE type of cinnamon. Leaf is milder for skin, bark is stronger antimicrobial but more irritating.',
  },
  {
    oilId1: 'cinnamon-leaf',
    oilId2: 'clove-bud',
    type: 'negative-reaction',
    severity: 'critical',
    title: 'CRITICAL: Eugenol Overload',
    description: 'Cinnamon Leaf (80%+ eugenol) + Clove Bud (80-90% eugenol) = 160%+ eugenol equivalent—dangerous anticoagulant + irritation.',
    explanation: 'Combined eugenol concentration is medically significant. Increases bleeding risk and severe skin irritation. This combination has caused chemical burns in documented cases.',
    recommendation: 'ABSOLUTELY CONTRAINDICATED, especially for anyone on blood thinners or with bleeding disorders.',
  },
  
  // Juniper Berry + Myrrh (both emmenagogues)
  {
    oilId1: 'juniper-berry',
    oilId2: 'myrrh',
    type: 'negative-reaction',
    severity: 'high',
    title: 'Double Emmenagogue Risk',
    description: 'Both oils stimulate uterine contractions—additive abortifacient effect.',
    explanation: 'Juniper berry and myrrh are both traditional emmenagogues (menstruation-inducing). Combined, they significantly increase risk of uterine stimulation.',
    recommendation: 'PREGNANCY CONTRAINDICATION: Never use together if pregnant, trying to conceive, or breastfeeding.',
  },
  {
    oilId1: 'juniper-berry',
    oilId2: 'clary-sage',
    type: 'negative-reaction',
    severity: 'high',
    title: 'Uterine Stimulation Stack',
    description: 'Both oils affect hormones and uterus—combined emmenagogue effect.',
    explanation: 'Clary sage has hormonal effects, juniper berry stimulates uterus. Combined = potent menstrual/uterine stimulation.',
    recommendation: 'Avoid during pregnancy and conception attempts. Not suitable for hormonal blends unless specifically targeting menstruation.',
  },
  {
    oilId1: 'myrrh',
    oilId2: 'clary-sage',
    type: 'negative-reaction',
    severity: 'moderate',
    title: 'Hormonal + Uterine Effects Combined',
    description: 'Myrrh (emmenagogue) + Clary Sage (hormonal) = potent effect on female reproductive system.',
    explanation: 'Both oils affect the reproductive system through different pathways. Combined effect may be too strong for general use.',
    recommendation: 'Use with caution. Not for pregnancy. Consider using separately for specific therapeutic goals.',
  },
  
  // Ginger interactions
  {
    oilId1: 'ginger',
    oilId2: 'cinnamon-leaf',
    type: 'negative-reaction',
    severity: 'moderate',
    title: 'Anticoagulant Stack',
    description: 'Both oils affect blood clotting—monitor if on blood thinners.',
    explanation: 'Ginger inhibits thromboxane, cinnamon (eugenol) inhibits platelets. Combined = additive blood thinning effect.',
    recommendation: 'Use caution if on warfarin, apixaban, or other anticoagulants. Monitor for unusual bruising or bleeding.',
  },
  {
    oilId1: 'ginger',
    oilId2: 'clove-bud',
    type: 'negative-reaction',
    severity: 'high',
    title: 'High Anticoagulant Risk',
    description: 'Ginger + Clove Bud both inhibit clotting—dangerous with blood thinners.',
    explanation: 'Ginger (thromboxane inhibition) + Clove (eugenol antiplatelet) = significant bleeding risk when combined with anticoagulants.',
    recommendation: 'CONTRAINDICATED with warfarin, apixaban, rivaroxaban, and other blood thinners.',
  },
  
  // May Chang interactions with other citrals
  {
    oilId1: 'may-chang',
    oilId2: 'lemon',
    type: 'negative-reaction',
    severity: 'moderate',
    title: 'Citral + Phototoxicity Stack',
    description: 'May Chang (70-85% citral) + Lemon (phototoxic) increases overall skin risk.',
    explanation: 'Citral sensitization + phototoxicity = compounded skin damage potential.',
    recommendation: 'Use caution if exposing skin to sunlight. Consider avoiding this combination for topical use.',
  },
] 

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check for interactions between two oils
 */
export function getOilInteraction(oilId1: string, oilId2: string): OilInteraction | null {
  // Check both directions
  const interaction = OIL_INTERACTIONS.find(
    i => (i.oilId1 === oilId1 && i.oilId2 === oilId2) || 
         (i.oilId1 === oilId2 && i.oilId2 === oilId1)
  )
  return interaction || null
}

/**
 * Get all interactions for a set of oils
 */
export function getInteractionsForMix(oilIds: string[]): OilInteraction[] {
  const interactions: OilInteraction[] = []
  
  for (let i = 0; i < oilIds.length; i++) {
    for (let j = i + 1; j < oilIds.length; j++) {
      const interaction = getOilInteraction(oilIds[i], oilIds[j])
      if (interaction && interaction.type !== 'synergistic') {
        interactions.push(interaction)
      }
    }
  }
  
  return interactions
}

/**
 * Get synergistic suggestions for an oil
 */
export function getSynergisticSuggestions(oilId: string): string[] {
  const suggestions: string[] = []
  
  for (const combo of SYNERGISTIC_COMBINATIONS) {
    if (combo.oils.includes(oilId)) {
      suggestions.push(...combo.oils.filter(o => o !== oilId))
    }
  }
  
  return Array.from(new Set(suggestions))
}

/**
 * Check if a combination has critical warnings
 */
export function hasCriticalInteraction(oilIds: string[]): boolean {
  return getInteractionsForMix(oilIds).some(i => i.severity === 'critical')
}

// ============================================================================
// CONSENT REQUIREMENTS
// ============================================================================

export interface ConsentRequirement {
  severity: 'critical' | 'high' | 'moderate' | 'low'
  requiresAcknowledgment: boolean
  acknowledgmentText: string
  blockingIfNotAcknowledged: boolean
  userProfileFactors: {
    pregnancy: boolean
    tryingToConceive: boolean
    onBloodThinners: boolean
    epilepsy: boolean
    bleedingDisorder: boolean
    age: 'child' | 'adult' | 'elderly'
  }
}

function getRiskFactorText(profile: any): string {
  const factors = []
  if (profile.isPregnant) factors.push('pregnancy')
  if (profile.isTryingToConceive) factors.push('trying to conceive')
  if (profile.onBloodThinners) factors.push('blood thinning medication')
  if (profile.hasEpilepsy) factors.push('epilepsy')
  if (profile.hasBleedingDisorder) factors.push('a bleeding disorder')
  if (profile.age && profile.age < 12) factors.push('pediatric use')
  
  if (factors.length === 0) return 'risk factors'
  if (factors.length === 1) return factors[0]
  return factors.slice(0, -1).join(', ') + ' and ' + factors.slice(-1)
}

/**
 * Determine if a specific interaction requires user consent based on interaction + user profile
 */
export function requiresConsent(
  interaction: OilInteraction, 
  userProfile: {
    isPregnant?: boolean
    isTryingToConceive?: boolean
    onBloodThinners?: boolean
    hasEpilepsy?: boolean
    hasBleedingDisorder?: boolean
    age?: number
  }
): { 
  requiresAcknowledgment: boolean
  acknowledgmentText: string
  severity: string
} {
  // Critical interactions always require acknowledgment
  if (interaction.severity === 'critical') {
    return {
      requiresAcknowledgment: true,
      acknowledgmentText: `I understand that combining ${interaction.oilId1} and ${interaction.oilId2} poses a ${interaction.title.toLowerCase()}. I accept full responsibility for using this combination.`,
      severity: 'critical'
    }
  }
  
  // High severity + risk factors = require acknowledgment
  if (interaction.severity === 'high') {
    const hasRiskFactor = userProfile.isPregnant || 
                         userProfile.isTryingToConceive || 
                         userProfile.onBloodThinners || 
                         userProfile.hasEpilepsy ||
                         userProfile.hasBleedingDisorder ||
                         (userProfile.age && userProfile.age < 12)
    
    if (hasRiskFactor) {
      return {
        requiresAcknowledgment: true,
        acknowledgmentText: `I understand the risk of ${interaction.title.toLowerCase()}. I have ${getRiskFactorText(userProfile)} and accept responsibility for using this combination.`,
        severity: 'high-risk-profile'
      }
    }
  }
  
  // Moderate with pregnancy/TTC always requires acknowledgment
  if (interaction.severity === 'moderate' && (userProfile.isPregnant || userProfile.isTryingToConceive)) {
    return {
      requiresAcknowledgment: true,
      acknowledgmentText: `I am ${userProfile.isPregnant ? 'pregnant' : 'trying to conceive'} and understand this combination may not be recommended. I accept responsibility.`,
      severity: 'moderate-pregnancy'
    }
  }
  
  return {
    requiresAcknowledgment: false,
    acknowledgmentText: '',
    severity: interaction.severity
  }
}
