/**
 * Comprehensive Safety Validation System
 * 
 * Medical-grade safety checking for essential oil usage.
 * Checks medications, health conditions, age, pregnancy, and route of administration.
 */

import { 
  COMMON_MEDICATIONS, 
  OIL_MEDICATION_INTERACTIONS,
  HEALTH_CONDITIONS,
  OIL_CONDITION_CONTRAINDICATIONS,
  AGE_DOSAGE_LIMITS,
  searchMedications,
} from './medication-database';

// ============================================================================
// TYPES
// ============================================================================

export interface UserSafetyProfile {
  age: number;
  ageGroup: keyof typeof AGE_DOSAGE_LIMITS;
  isPregnant: boolean;
  isBreastfeeding: boolean;
  medications: UserMedication[];
  healthConditions: string[]; // condition IDs
  hasSensitiveSkin: boolean;
  weightKg?: number;
  intendedUse: 'topical' | 'inhalation' | 'both';
}

export interface UserMedication {
  id: string;
  name: string;
  genericName?: string;
  isActive: boolean;
}

export interface OilComponent {
  oilId: string;
  name: string;
  ml: number;
  drops: number;
}

export interface MixConfiguration {
  oils: OilComponent[];
  mode: 'pure' | 'carrier';
  bottleSize: number;
  carrierOilId?: string;
  intendedUse: 'topical' | 'inhalation' | 'both';
}

export interface SafetyWarning {
  level: 'info' | 'caution' | 'warning' | 'contraindicated';
  category: 'medication' | 'condition' | 'age' | 'pregnancy' | 'lactation' | 'dosage' | 'route' | 'allergy';
  title: string;
  message: string;
  affectedOils: string[];
  recommendation: string;
  alternatives?: string[];
  references?: string[];
}

export interface SafetyValidationResult {
  canProceed: boolean;
  requiresMedicalConsultation: boolean;
  safetyScore: number; // 0-100
  warnings: SafetyWarning[];
  allowedOils: string[];
  contraindicatedOils: string[];
  dosageLimits: {
    maxTotalDrops: number;
    maxDilutionPercent: number;
  };
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Main safety validation function
 */
export function validateMixSafety(
  mix: MixConfiguration,
  userProfile: UserSafetyProfile
): SafetyValidationResult {
  const warnings: SafetyWarning[] = [];
  const contraindicatedOils = new Set<string>();
  const cautionedOils = new Set<string>();
  let requiresMedicalConsultation = false;

  // 1. Check age-based limits
  const ageWarnings = checkAgeRestrictions(mix, userProfile);
  warnings.push(...ageWarnings);

  // 2. Check pregnancy restrictions
  if (userProfile.isPregnant) {
    const pregnancyWarnings = checkPregnancyRestrictions(mix);
    warnings.push(...pregnancyWarnings);
    pregnancyWarnings.forEach(w => {
      if (w.level === 'contraindicated') {
        w.affectedOils.forEach(oil => contraindicatedOils.add(oil));
      }
    });
  }

  // 3. Check lactation restrictions
  if (userProfile.isBreastfeeding) {
    const lactationWarnings = checkLactationRestrictions(mix);
    warnings.push(...lactationWarnings);
  }

  // 4. Check medication interactions
  if (userProfile.medications.length > 0) {
    const medWarnings = checkMedicationInteractions(mix, userProfile.medications);
    warnings.push(...medWarnings);
    medWarnings.forEach(w => {
      if (w.level === 'contraindicated') {
        w.affectedOils.forEach(oil => contraindicatedOils.add(oil));
        requiresMedicalConsultation = true;
      }
      if (w.level === 'warning') {
        w.affectedOils.forEach(oil => cautionedOils.add(oil));
      }
    });
  }

  // 5. Check health condition contraindications
  if (userProfile.healthConditions.length > 0) {
    const conditionWarnings = checkConditionContraindications(mix, userProfile.healthConditions);
    warnings.push(...conditionWarnings);
    conditionWarnings.forEach(w => {
      if (w.level === 'contraindicated') {
        w.affectedOils.forEach(oil => contraindicatedOils.add(oil));
        requiresMedicalConsultation = true;
      }
    });
  }

  // 6. Check route-specific safety
  const routeWarnings = checkRouteSafety(mix, userProfile);
  warnings.push(...routeWarnings);

  // 7. Check dosage limits
  const dosageWarnings = checkDosageLimits(mix, userProfile);
  warnings.push(...dosageWarnings);

  // Calculate safety score
  const safetyScore = calculateSafetyScore(
    mix.oils.length,
    contraindicatedOils.size,
    cautionedOils.size,
    warnings.filter(w => w.level === 'warning').length,
    warnings.filter(w => w.level === 'contraindicated').length
  );

  // Determine if can proceed
  const canProceed = contraindicatedOils.size === 0 && safetyScore >= 60;

  // Get allowed oils
  const allowedOils = mix.oils
    .filter(oil => !contraindicatedOils.has(oil.oilId))
    .map(oil => oil.oilId);

  // Get dosage limits
  const ageLimits = AGE_DOSAGE_LIMITS[userProfile.ageGroup];

  return {
    canProceed,
    requiresMedicalConsultation,
    safetyScore,
    warnings: warnings.sort((a, b) => {
      const severityOrder = { contraindicated: 0, warning: 1, caution: 2, info: 3 };
      return severityOrder[a.level] - severityOrder[b.level];
    }),
    allowedOils,
    contraindicatedOils: Array.from(contraindicatedOils),
    dosageLimits: {
      maxTotalDrops: ageLimits.maxDrops,
      maxDilutionPercent: ageLimits.maxDilution,
    },
  };
}

/**
 * Check age-based restrictions
 */
function checkAgeRestrictions(
  mix: MixConfiguration,
  profile: UserSafetyProfile
): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];
  const limits = AGE_DOSAGE_LIMITS[profile.ageGroup];

  // Check if any oils are contraindicated for age
  const ageRestrictedOils = mix.oils.filter(oil => {
    // Check specific age restrictions in database
    const restriction = getOilAgeRestriction(oil.oilId);
    if (!restriction) return false;
    
    switch (restriction) {
      case 'avoid_under_adult':
        return profile.age < 18;
      case 'avoid_under_12':
        return profile.age < 12;
      case 'avoid_under_6':
        return profile.age < 6;
      case 'avoid_under_2':
        return profile.age < 2;
      default:
        return false;
    }
  });

  if (ageRestrictedOils.length > 0) {
    warnings.push({
      level: 'contraindicated',
      category: 'age',
      title: 'Age Restriction',
      message: `The following oils are not recommended for your age group (${limits.label}): ${ageRestrictedOils.map(o => o.name).join(', ')}.`,
      affectedOils: ageRestrictedOils.map(o => o.oilId),
      recommendation: `For ${limits.label}, use only oils specifically approved for this age group such as lavender, chamomile, and mandarin at maximum ${limits.maxDilution}% dilution.`,
    });
  }

  // Check total drop count
  const totalDrops = mix.oils.reduce((sum, o) => sum + o.drops, 0);
  if (totalDrops > limits.maxDrops) {
    warnings.push({
      level: 'warning',
      category: 'dosage',
      title: 'Excessive Dosage for Age',
      message: `Your blend contains ${totalDrops} drops, which exceeds the maximum recommended ${limits.maxDrops} drops for ${limits.label}.`,
      affectedOils: mix.oils.map(o => o.oilId),
      recommendation: `Reduce total drops to ${limits.maxDrops} or less for safe use at your age.`,
    });
  }

  // Check dilution percentage
  if (mix.mode === 'carrier') {
    const dilutionPercent = (totalDrops / mix.bottleSize) * 100;
    if (dilutionPercent > limits.maxDilution) {
      warnings.push({
        level: 'warning',
        category: 'dosage',
        title: 'Concentration Too High',
        message: `Your blend concentration (${dilutionPercent.toFixed(1)}%) exceeds the ${limits.maxDilution}% maximum for ${limits.label}.`,
        affectedOils: mix.oils.map(o => o.oilId),
        recommendation: `Increase carrier oil or reduce essential oil drops to achieve maximum ${limits.maxDilution}% concentration.`,
      });
    }
  }

  return warnings;
}

/**
 * Check pregnancy restrictions
 */
function checkPregnancyRestrictions(mix: MixConfiguration): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];

  const unsafeOils = mix.oils.filter(oil => {
    const category = getOilPregnancyCategory(oil.oilId);
    return category === 'category_d' || category === 'category_x';
  });

  if (unsafeOils.length > 0) {
    warnings.push({
      level: 'contraindicated',
      category: 'pregnancy',
      title: 'CONTRAINDICATED in Pregnancy',
      message: `The following oils are NOT SAFE during pregnancy: ${unsafeOils.map(o => o.name).join(', ')}. These oils can stimulate uterine contractions, affect fetal development, or are toxic.`,
      affectedOils: unsafeOils.map(o => o.oilId),
      recommendation: 'During pregnancy, use ONLY these oils: Lavender, Mandarin, Neroli, Frankincense, Roman Chamomile, Geranium (in 2nd/3rd trimester only). Maximum 1% dilution.',
      alternatives: ['lavender', 'mandarin', 'neroli', 'frankincense', 'roman-chamomile'],
      references: ['Tisserand & Young Essential Oil Safety, 2nd Edition'],
    });
  }

  // First trimester extra caution
  const cautionOils = mix.oils.filter(oil => {
    const category = getOilPregnancyCategory(oil.oilId);
    return category === 'category_c';
  });

  if (cautionOils.length > 0) {
    warnings.push({
      level: 'warning',
      category: 'pregnancy',
      title: 'Caution in Early Pregnancy',
      message: `${cautionOils.map(o => o.name).join(', ')} should be avoided in the first trimester and used with caution thereafter.`,
      affectedOils: cautionOils.map(o => o.oilId),
      recommendation: 'Wait until 2nd trimester to use these oils, and only with physician approval.',
    });
  }

  return warnings;
}

/**
 * Check lactation restrictions
 */
function checkLactationRestrictions(mix: MixConfiguration): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];

  const unsafeOils = mix.oils.filter(oil => {
    const safety = getOilLactationSafety(oil.oilId);
    return safety === 'avoid';
  });

  if (unsafeOils.length > 0) {
    warnings.push({
      level: 'warning',
      category: 'lactation',
      title: 'Caution While Breastfeeding',
      message: `The following oils should be avoided while breastfeeding: ${unsafeOils.map(o => o.name).join(', ')}.`,
      affectedOils: unsafeOils.map(o => o.oilId),
      recommendation: 'Safe oils while breastfeeding: Lavender, Mandarin, Neroli, Frankincense, Roman Chamomile. Apply after feeding, not before.',
      alternatives: ['lavender', 'mandarin', 'neroli', 'frankincense', 'roman-chamomile'],
    });
  }

  return warnings;
}

/**
 * Check medication interactions
 */
function checkMedicationInteractions(
  mix: MixConfiguration,
  medications: UserMedication[]
): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];

  for (const med of medications) {
    if (!med.isActive) continue;

    // Find interactions for this medication
    const interactions = OIL_MEDICATION_INTERACTIONS.filter(interaction => {
      // Match by medication ID or name
      const medMatch = COMMON_MEDICATIONS.find(m => 
        m.genericName.toLowerCase() === med.name.toLowerCase() ||
        m.brandNames?.some(b => b.toLowerCase() === med.name.toLowerCase())
      );
      
      return medMatch && interaction.oilId && mix.oils.some(o => o.oilId === interaction.oilId);
    });

    for (const interaction of interactions) {
      const affectedOil = mix.oils.find(o => o.oilId === interaction.oilId);
      if (!affectedOil) continue;

      const warning: SafetyWarning = {
        level: interaction.severity as SafetyWarning['level'] || 'caution',
        category: 'medication',
        title: `Interaction with ${med.name}`,
        message: `${affectedOil.name} interacts with ${med.name}: ${interaction.mechanism}`,
        affectedOils: [affectedOil.oilId],
        recommendation: interaction.recommendation || 'Consult your healthcare provider before using.',
      };

      if (interaction.alternativeOils) {
        warning.alternatives = interaction.alternativeOils;
      }

      warnings.push(warning);
    }

    // Check for anticoagulant use generally
    const isAnticoagulant = COMMON_MEDICATIONS.find(m => 
      m.genericName.toLowerCase() === med.name.toLowerCase() && m.affectsBloodClotting
    );

    if (isAnticoagulant) {
      const anticoagOils = mix.oils.filter(o => 
        ['clove-bud', 'wintergreen', 'cinnamon-bark'].includes(o.oilId)
      );

      if (anticoagOils.length > 0) {
        warnings.push({
          level: 'contraindicated',
          category: 'medication',
          title: 'CRITICAL: Blood Thinner Interaction',
          message: `You are taking ${med.name} (blood thinner). ${anticoagOils.map(o => o.name).join(', ')} can increase bleeding risk significantly.`,
          affectedOils: anticoagOils.map(o => o.oilId),
          recommendation: 'DO NOT USE these oils while taking blood thinners. The combination can cause severe hemorrhage.',
          alternatives: ['lavender', 'frankincense', 'bergamot-fcf'],
        });
      }
    }
  }

  return warnings;
}

/**
 * Check health condition contraindications
 */
function checkConditionContraindications(
  mix: MixConfiguration,
  conditionIds: string[]
): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];

  for (const conditionId of conditionIds) {
    const contras = OIL_CONDITION_CONTRAINDICATIONS.filter(c => 
      c.conditionId === conditionId && mix.oils.some(o => o.oilId === c.oilId)
    );

    for (const contra of contras) {
      const oil = mix.oils.find(o => o.oilId === contra.oilId);
      if (!oil) continue;

      const condition = HEALTH_CONDITIONS.find(c => c.id === conditionId);

      warnings.push({
        level: contra.severity as SafetyWarning['level'] || 'caution',
        category: 'condition',
        title: `${condition?.name || conditionId} Contraindication`,
        message: `${oil.name} is ${contra.severity} for individuals with ${condition?.name || conditionId}: ${contra.reason}`,
        affectedOils: [oil.oilId],
        recommendation: contra.alternativeOils 
          ? `Use alternatives: ${contra.alternativeOils.join(', ')}`
          : 'Consult your healthcare provider before using this oil.',
        alternatives: contra.alternativeOils,
      });
    }
  }

  return warnings;
}

/**
 * Check route-specific safety
 */
function checkRouteSafety(
  mix: MixConfiguration,
  profile: UserSafetyProfile
): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];

  // Check for phototoxic oils if topical use intended
  if (profile.intendedUse === 'topical' || profile.intendedUse === 'both') {
    const phototoxicOils = mix.oils.filter(oil => isOilPhototoxic(oil.oilId));
    
    if (phototoxicOils.length > 0) {
      warnings.push({
        level: 'warning',
        category: 'route',
        title: 'Photosensitivity Warning',
        message: `${phototoxicOils.map(o => o.name).join(', ')} can cause severe sunburn when applied to skin before sun exposure.`,
        affectedOils: phototoxicOils.map(o => o.oilId),
        recommendation: 'If using topically: Apply only to covered skin, wait 12-18 hours before sun exposure, or use bergapten-free (FCF) varieties.',
      });
    }
  }

  // Check for inhalation restrictions
  if (profile.intendedUse === 'inhalation') {
    const respiratorySensitizers = mix.oils.filter(oil => 
      isRespiratorySensitizer(oil.oilId)
    );

    if (respiratorySensitizers.length > 0) {
      warnings.push({
        level: 'caution',
        category: 'route',
        title: 'Respiratory Sensitivity',
        message: `${respiratorySensitizers.map(o => o.name).join(', ')} may irritate airways in some individuals.`,
        affectedOils: respiratorySensitizers.map(o => o.oilId),
        recommendation: 'Use in well-ventilated area. Discontinue if coughing, wheezing, or breathlessness occurs.',
      });
    }
  }

  return warnings;
}

/**
 * Check dosage limits
 */
function checkDosageLimits(
  mix: MixConfiguration,
  profile: UserSafetyProfile
): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];
  const limits = AGE_DOSAGE_LIMITS[profile.ageGroup];

  // Check individual oil maximum concentrations
  for (const oil of mix.oils) {
    const maxConcentration = getOilMaxConcentration(oil.oilId, profile.hasSensitiveSkin);
    if (!maxConcentration) continue;

    const actualConcentration = (oil.drops / mix.bottleSize) * 100;
    
    if (actualConcentration > maxConcentration) {
      warnings.push({
        level: 'warning',
        category: 'dosage',
        title: `${oil.name} Concentration Exceeds Safe Limit`,
        message: `${oil.name} is at ${actualConcentration.toFixed(1)}%, exceeding the maximum safe concentration of ${maxConcentration}%.`,
        affectedOils: [oil.oilId],
        recommendation: `Reduce ${oil.name} to maximum ${maxConcentration}% to avoid skin irritation or toxicity.`,
      });
    }
  }

  return warnings;
}

/**
 * Calculate overall safety score
 */
function calculateSafetyScore(
  totalOils: number,
  contraindicatedCount: number,
  cautionCount: number,
  warningCount: number,
  criticalCount: number
): number {
  let score = 100;

  // Critical deductions
  score -= criticalCount * 50;
  score -= contraindicatedCount * 40;
  score -= warningCount * 15;
  score -= cautionCount * 5;

  // Multiple oils compound risk slightly
  if (totalOils > 3) {
    score -= (totalOils - 3) * 2;
  }

  return Math.max(0, Math.min(100, score));
}

// ============================================================================
// HELPER FUNCTIONS (to be populated from database)
// ============================================================================

function getOilAgeRestriction(oilId: string): string | null {
  // This would query the oilSafetyProfiles table
  const ageRestrictions: Record<string, string> = {
    'peppermint': 'avoid_under_6',
    'eucalyptus': 'avoid_under_6',
    'rosemary': 'avoid_under_6',
    'sage': 'avoid_under_adult',
    'hyssop': 'avoid_under_adult',
    'camphor': 'avoid_under_adult',
    'wintergreen': 'avoid_under_12',
    'clove-bud': 'avoid_under_2',
  };
  return ageRestrictions[oilId] || null;
}

function getOilPregnancyCategory(oilId: string): string {
  const categories: Record<string, string> = {
    'clary-sage': 'category_d',
    'sage': 'category_x',
    'hyssop': 'category_x',
    'juniper-berry': 'category_d',
    'rosemary': 'category_d',
    'fennel': 'category_d',
    'aniseed': 'category_d',
    'cinnamon-bark': 'category_c',
    'lavender': 'category_b',
    'mandarin': 'category_b',
    'frankincense': 'category_b',
    'roman-chamomile': 'category_b',
  };
  return categories[oilId] || 'category_a';
}

function getOilLactationSafety(oilId: string): string {
  const safety: Record<string, string> = {
    'sage': 'avoid',
    'hyssop': 'avoid',
    'wormwood': 'avoid',
    'lavender': 'compatible',
    'mandarin': 'compatible',
    'frankincense': 'compatible',
  };
  return safety[oilId] || 'caution';
}

function isOilPhototoxic(oilId: string): boolean {
  const phototoxicOils = [
    'bergamot', 'lime', 'lemon', 'grapefruit', 'bitter-orange',
    'angelica-root', 'cumin'
  ];
  return phototoxicOils.includes(oilId);
}

function isRespiratorySensitizer(oilId: string): boolean {
  const sensitizers = ['cinnamon-bark', 'cinnamon-leaf', 'clove-bud', 'oregano'];
  return sensitizers.includes(oilId);
}

function getOilMaxConcentration(oilId: string, sensitiveSkin: boolean): number | null {
  const concentrations: Record<string, number> = {
    'cinnamon-bark': 0.1,
    'clove-bud': 0.5,
    'oregano': 1.0,
    'thyme-thymol': 1.0,
    'lemongrass': 0.7,
    'bergamot': 0.4,
    'lemon': 2.0,
    'lavender': 5.0,
    'tea-tree': 15.0,
  };
  
  const base = concentrations[oilId];
  if (!base) return null;
  
  return sensitiveSkin ? base * 0.5 : base;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  searchMedications,
  COMMON_MEDICATIONS,
  HEALTH_CONDITIONS,
  AGE_DOSAGE_LIMITS,
};
