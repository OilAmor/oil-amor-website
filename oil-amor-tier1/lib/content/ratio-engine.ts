/**
 * Oil Amor - Elite Ratio Engine
 * Dynamic essential oil to carrier oil ratio system
 */

// ============================================================================
// RATIO PRESETS - MAX 75% FOR CARRIER ENHANCED (Pure is separate)
// ============================================================================

export type RatioLevel = 'micro' | 'gentle' | 'balanced' | 'strong' | 'max'

export interface RatioPreset {
  id: RatioLevel
  name: string
  essentialOilPercent: number
  carrierOilPercent: number
  description: string
  bestFor: string[]
  warnings: string[]
  benefits: string[]
}

// CARRIER ENHANCED BLENDS - Maximum 75% essential oil
export const CARRIER_RATIOS: RatioPreset[] = [
  {
    id: 'micro',
    name: 'Micro-Dose',
    essentialOilPercent: 5,
    carrierOilPercent: 95,
    description: 'Extremely gentle, perfect for sensitive skin, children, and extended daily use. The subtlest aromatic experience with minimal potency.',
    bestFor: ['Sensitive skin', 'Children (2+)', 'Facial application', 'Daily long-term use', 'First-time users'],
    warnings: ['May be too subtle for experienced users', 'Scent dissipates quickly'],
    benefits: ['Minimal skin sensitivity risk', 'Economical for expensive oils', 'Gentle introduction to aromatherapy', 'Safe for facial use', 'Can apply multiple times daily'],
  },
  {
    id: 'gentle',
    name: 'Gentle Touch',
    essentialOilPercent: 10,
    carrierOilPercent: 90,
    description: 'A soft whisper of essential oil, ideal for those new to aromatherapy or with sensitive skin. Subtle yet effective.',
    bestFor: ['Sensitive individuals', 'Daily wear', 'Subtle fragrance', 'Beginners', 'Elderly'],
    warnings: ['Effects are mild', 'May require more frequent application'],
    benefits: ['Very gentle on skin', 'Economical choice', 'Builds tolerance gradually', 'Perfect for office/work', 'Safe for prolonged exposure'],
  },
  {
    id: 'balanced',
    name: 'Balanced Harmony',
    essentialOilPercent: 25,
    carrierOilPercent: 75,
    description: 'The sweet spot of aromatherapy - noticeable therapeutic benefits with comfortable skin tolerance. Our most popular choice.',
    bestFor: ['Daily wellness', 'Meditation', 'Stress relief', 'General use', 'Most adults'],
    warnings: ['Patch test recommended for sensitive skin'],
    benefits: ['Optimal therapeutic value', 'Good skin tolerance', 'Long-lasting scent', 'Versatile for most uses', 'Best value for money'],
  },
  {
    id: 'strong',
    name: 'Potent Strength',
    essentialOilPercent: 50,
    carrierOilPercent: 50,
    description: 'Powerful therapeutic concentration for those seeking maximum benefits. Intense aroma with rapid effectiveness.',
    bestFor: ['Therapeutic use', 'Aromatherapy practitioners', 'Short-term intensive use', 'Experienced users', 'Specific concerns'],
    warnings: ['Not for sensitive skin', 'Limit to small areas', 'May cause irritation if overused', 'Avoid sun exposure with citrus oils'],
    benefits: ['Maximum therapeutic potency', 'Rapid effect', 'Long-lasting between applications', 'Professional-grade strength', 'Deep tissue penetration'],
  },
  {
    id: 'max',
    name: 'Maximum Enhanced',
    essentialOilPercent: 75,
    carrierOilPercent: 25,
    description: 'The highest carrier-enhanced concentration available. Maximum therapeutic impact with minimal carrier interference. For those who want potency with just enough carrier for safe application.',
    bestFor: ['Advanced aromatherapy users', 'Intensive therapeutic protocols', 'Short-term targeted treatment', 'Professional practitioners', 'Maximum strength seekers'],
    warnings: ['High concentration - use sparingly', 'Not for daily prolonged use', 'Patch test essential', 'Avoid broken skin', 'Limit sun exposure'],
    benefits: ['Maximum enhanced potency', 'Just enough carrier for safe application', 'Rapid therapeutic action', 'Intense aromatic experience', 'Minimal carrier scent interference'],
  },
]

// ============================================================================
// OIL-SPECIFIC RATIO BENEFITS
// ============================================================================

export interface OilRatioBenefit {
  ratioId: RatioLevel
  benefit: string
  explanation: string
}

export const OIL_RATIO_BENEFITS: Record<string, OilRatioBenefit[]> = {
  'lavender': [
    { ratioId: 'micro', benefit: 'Sleep Support', explanation: '5% Lavender provides gentle, sustained release throughout the night without overwhelming the senses.' },
    { ratioId: 'gentle', benefit: 'Anxiety Relief', explanation: '10% offers subtle calming for daily anxiety without drowsiness.' },
    { ratioId: 'balanced', benefit: 'Versatile Wellness', explanation: '25% is the perfect daily driver - effective for sleep, stress, and skin.' },
    { ratioId: 'strong', benefit: 'Rapid Calm', explanation: '50% delivers immediate anxiety relief and deep relaxation for acute stress.' },
    { ratioId: 'max', benefit: 'Intensive Therapy', explanation: '75% provides powerful therapeutic action for intense stress or sleep disruption.' },
  ],
  'myrrh': [
    { ratioId: 'micro', benefit: 'Affordable Luxury', explanation: '5% Myrrh at $1000/L becomes accessible - experience this sacred oil for under $25.' },
    { ratioId: 'gentle', benefit: 'Spiritual Practice', explanation: '10% is perfect for daily meditation and spiritual connection without overwhelming.' },
    { ratioId: 'balanced', benefit: 'Skin Rejuvenation', explanation: '25% provides powerful anti-aging benefits for mature skin at a fraction of pure cost.' },
    { ratioId: 'strong', benefit: 'Deep Healing', explanation: '50% offers intensive skin regeneration and spiritual depth for practitioners.' },
    { ratioId: 'max', benefit: 'Sacred Anointing', explanation: '75% delivers profound spiritual connection and intensive skin therapy. The most potent enhanced form.' },
  ],
  'eucalyptus': [
    { ratioId: 'micro', benefit: 'Daily Respiratory Support', explanation: '5% provides gentle, ongoing respiratory support safe for daily use.' },
    { ratioId: 'gentle', benefit: 'Clear Breathing', explanation: '10% offers noticeable congestion relief without overwhelming the senses.' },
    { ratioId: 'balanced', benefit: 'Cold & Flu Relief', explanation: '25% is ideal for seasonal support - effective yet comfortable.' },
    { ratioId: 'strong', benefit: 'Intensive Decongestant', explanation: '50% delivers rapid, powerful respiratory clearing for acute symptoms.' },
    { ratioId: 'max', benefit: 'Maximum Respiratory Power', explanation: '75% provides the strongest enhanced respiratory support available. Rapid action for severe congestion.' },
  ],
}

// Default benefits for oils without specific entries
export function getRatioBenefits(oilId: string, ratioId: RatioLevel): OilRatioBenefit | undefined {
  const oilBenefits = OIL_RATIO_BENEFITS[oilId]
  if (oilBenefits) {
    return oilBenefits.find(b => b.ratioId === ratioId)
  }
  // Default benefits
  const defaults: Record<RatioLevel, OilRatioBenefit> = {
    micro: { ratioId: 'micro', benefit: 'Gentle Introduction', explanation: '5% provides a subtle, safe introduction to this essential oil.' },
    gentle: { ratioId: 'gentle', benefit: 'Daily Wellness', explanation: '10% offers gentle therapeutic benefits suitable for daily use.' },
    balanced: { ratioId: 'balanced', benefit: 'Optimal Therapy', explanation: '25% delivers the best balance of potency and safety.' },
    strong: { ratioId: 'strong', benefit: 'Intensive Support', explanation: '50% provides strong therapeutic effects for acute needs.' },
    max: { ratioId: 'max', benefit: 'Maximum Enhanced', explanation: '75% offers the highest enhanced concentration for maximum therapeutic impact.' },
  }
  return defaults[ratioId]
}

// ============================================================================
// SAFETY WARNINGS
// ============================================================================

export interface SafetyWarning {
  condition: string
  message: string
  severity: 'info' | 'warning' | 'danger'
}

export function getSafetyWarnings(
  oilId: string,
  ratio: RatioPreset
): SafetyWarning[] {
  const warnings: SafetyWarning[] = []
  
  // Ratio-based warnings
  if (ratio.id === 'max') {
    warnings.push({
      condition: 'Maximum Enhanced Concentration',
      message: '75% is our highest enhanced ratio. Use sparingly and not for prolonged daily use.',
      severity: 'warning',
    })
  }
  
  if (ratio.id === 'strong') {
    warnings.push({
      condition: 'High Concentration',
      message: 'Patch test recommended. Limit to small areas and short-term use.',
      severity: 'warning',
    })
  }
  
  // Oil-specific warnings
  if (oilId === 'cinnamon-bark' && ratio.essentialOilPercent > 10) {
    warnings.push({
      condition: 'Hot Oil',
      message: 'Cinnamon bark can irritate skin. Ensure adequate dilution with a gentle carrier oil.',
      severity: 'warning',
    })
  }
  
  if (oilId === 'clove-bud' && ratio.essentialOilPercent > 25) {
    warnings.push({
      condition: 'Strong Oil',
      message: 'Clove is very potent. High concentrations may numb skin temporarily.',
      severity: 'warning',
    })
  }
  
  if (['lemon', 'lemon-myrtle', 'may-chang'].includes(oilId) && ratio.essentialOilPercent > 10) {
    warnings.push({
      condition: 'Photosensitivity',
      message: 'Citrus oils can increase sun sensitivity. Avoid sun exposure for 12 hours after application.',
      severity: 'warning',
    })
  }
  
  if (oilId === 'myrrh' && ratio.id === 'max') {
    warnings.push({
      condition: 'Premium Oil',
      message: 'Myrrh at 75% is extremely valuable. Consider lower ratios for daily use to extend your supply.',
      severity: 'info',
    })
  }
  
  return warnings
}

// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================

export type UseCase = 'daily' | 'sensitive' | 'therapeutic' | 'spiritual' | 'facial' | 'children' | 'intensive'

export function getRecommendedRatio(useCase: UseCase): RatioLevel {
  const recommendations: Record<UseCase, RatioLevel> = {
    daily: 'balanced',
    sensitive: 'gentle',
    therapeutic: 'strong',
    spiritual: 'balanced',
    facial: 'micro',
    children: 'micro',
    intensive: 'max',
  }
  return recommendations[useCase]
}

export const USE_CASE_DESCRIPTIONS: Record<UseCase, { label: string; description: string }> = {
  daily: { label: 'Daily Use', description: 'For everyday wellness and general aromatherapy' },
  sensitive: { label: 'Sensitive Skin', description: 'Gentle formulation for delicate skin types' },
  therapeutic: { label: 'Therapeutic', description: 'Maximum benefits for specific concerns' },
  spiritual: { label: 'Spiritual Practice', description: 'For meditation, rituals, and inner work' },
  facial: { label: 'Facial Care', description: 'Gentle enough for delicate facial skin' },
  children: { label: 'Children (2+)', description: 'Extra gentle for young ones' },
  intensive: { label: 'Intensive Care', description: 'Maximum enhanced strength for acute needs' },
}

// Export the ratios as RATIO_PRESETS for backward compatibility
export const RATIO_PRESETS = CARRIER_RATIOS
