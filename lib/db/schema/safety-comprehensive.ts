/**
 * Comprehensive Safety Database Schema
 * 
 * Medical-grade safety system for essential oil interactions.
 * Based on scientific literature, Tisserand & Young guidelines, 
 * and established aromatherapy safety protocols.
 * 
 * WARNING: This system is for guidance only. Users should always
 * consult healthcare professionals for medical advice.
 */

import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  index,
  pgEnum,
  uuid,
  decimal,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// SAFETY CLASSIFICATION ENUMS
// ============================================================================

// Pregnancy safety categories (Tisserand & Young based)
export const pregnancySafetyEnum = pgEnum('pregnancy_safety', [
  'category_a', // Safe throughout pregnancy
  'category_b', // Safe with restrictions
  'category_c', // Avoid during 1st trimester, caution later
  'category_d', // Avoid throughout pregnancy
  'category_x', // Contraindicated in pregnancy
  'unknown',    // Insufficient data
]);

// Lactation safety
export const lactationSafetyEnum = pgEnum('lactation_safety', [
  'compatible',     // Safe while breastfeeding
  'caution',        // Use with caution
  'avoid',          // Avoid while breastfeeding
  'insufficient',   // Insufficient data
]);

// Age group restrictions
export const ageRestrictionEnum = pgEnum('age_restriction', [
  'all_ages',           // Safe for all ages (properly diluted)
  'avoid_under_2',      // Avoid under 2 years
  'avoid_under_6',      // Avoid under 6 years
  'avoid_under_12',     // Avoid under 12 years
  'avoid_under_adult',  // Adult use only
]);

// Route of administration safety
export const routeSafetyEnum = pgEnum('route_safety', [
  'all_routes',           // Safe for all routes
  'inhalation_only',      // Inhalation only
  'avoid_topical',        // Avoid topical use
  'avoid_ingestion',      // Avoid internal use
  'dilution_required',    // Requires proper dilution
]);

// Interaction severity
export const interactionSeverityEnum = pgEnum('interaction_severity', [
  'minor',      // Monitor, usually manageable
  'moderate',   // Significant caution needed
  'major',      // Strongly avoid combination
  'contraindicated', // Never combine
]);

// ============================================================================
// MEDICATION DATABASE
// ============================================================================

export const medications = pgTable(
  'medications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    
    // Drug identification
    genericName: text('generic_name').notNull(),
    brandNames: text('brand_names').array(), // Common brand names
    drugClass: text('drug_class').notNull(), // Anticoagulant, antidepressant, etc.
    
    // Search/lookup
    searchTerms: text('search_terms').array(), // Alternative spellings, abbreviations
    
    // Safety metadata
    affectsBloodClotting: boolean('affects_blood_clotting').notNull().default(false),
    affectsBloodPressure: boolean('affects_blood_pressure').notNull().default(false),
    affectsBloodSugar: boolean('affects_blood_sugar').notNull().default(false),
    affectsLiver: boolean('affects_liver').notNull().default(false),
    affectsKidney: boolean('affects_kidney').notNull().default(false),
    affectsCns: boolean('affects_cns').notNull().default(false), // Central nervous system
    affectsHeart: boolean('affects_heart').notNull().default(false),
    
    // Mechanism notes (for interaction prediction)
    metabolismPathway: text('metabolism_pathway'), // CYP450 enzymes, etc.
    
    // Verification
    verifiedBy: text('verified_by'), // Medical professional who verified
    verifiedAt: timestamp('verified_at', { mode: 'date' }),
    
    // Metadata
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    genericNameIdx: index('med_generic_name_idx').on(table.genericName),
    drugClassIdx: index('med_drug_class_idx').on(table.drugClass),
    searchTermsIdx: index('med_search_terms_idx').on(table.searchTerms),
  })
);

// ============================================================================
// OIL-MEDICATION INTERACTIONS
// ============================================================================

export const oilMedicationInteractions = pgTable(
  'oil_medication_interactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    
    oilId: text('oil_id').notNull(), // References our oil IDs
    medicationId: uuid('medication_id')
      .notNull()
      .references(() => medications.id, { onDelete: 'cascade' }),
    
    // Interaction details
    severity: interactionSeverityEnum('severity').notNull(),
    mechanism: text('mechanism').notNull(), // How they interact
    
    // Clinical effects
    potentialEffects: text('potential_effects').array(), // What could happen
    
    // Management
    recommendation: text('recommendation').notNull(), // What to do
    alternativeOils: text('alternative_oils').array(), // Safer alternatives
    
    // Evidence
    evidenceLevel: text('evidence_level').notNull(), // clinical, anecdotal, theoretical
    references: text('references').array(), // Scientific references
    
    // Notes
    notes: text('notes'),
    
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    oilIdIdx: index('interaction_oil_id_idx').on(table.oilId),
    medicationIdIdx: index('interaction_med_id_idx').on(table.medicationId),
    uniqueInteraction: index('unique_oil_med_interaction').on(table.oilId, table.medicationId),
  })
);

// ============================================================================
// HEALTH CONDITIONS DATABASE
// ============================================================================

export const healthConditions = pgTable(
  'health_conditions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    
    // Condition identification
    name: text('name').notNull().unique(),
    category: text('category').notNull(), // cardiovascular, neurological, etc.
    
    // Search terms
    aliases: text('aliases').array(), // Alternative names
    searchTerms: text('search_terms').array(),
    
    // Severity classifications
    isLifeThreatening: boolean('is_life_threatening').notNull().default(false),
    requiresMedicalSupervision: boolean('requires_medical_supervision').notNull().default(false),
    
    // Created at
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    categoryIdx: index('condition_category_idx').on(table.category),
    searchTermsIdx: index('condition_search_idx').on(table.searchTerms),
  })
);

// ============================================================================
// OIL-CONDITION CONTRAINDICATIONS
// ============================================================================

export const oilConditionContraindications = pgTable(
  'oil_condition_contraindications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    
    oilId: text('oil_id').notNull(),
    conditionId: uuid('condition_id')
      .notNull()
      .references(() => healthConditions.id, { onDelete: 'cascade' }),
    
    // Contraindication details
    severity: interactionSeverityEnum('severity').notNull(),
    reason: text('reason').notNull(), // Why it's contraindicated
    
    // Specific concerns
    specificRisks: text('specific_risks').array(),
    
    // Alternatives
    alternativeOils: text('alternative_oils').array(),
    
    // Management
    ifUnavoidable: text('if_unavoidable'), // What to do if they must use it
    
    evidenceLevel: text('evidence_level').notNull(),
    references: text('references').array(),
    
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    oilIdIdx: index('contra_oil_id_idx').on(table.oilId),
    conditionIdIdx: index('contra_condition_id_idx').on(table.conditionId),
  })
);

// ============================================================================
// COMPREHENSIVE OIL SAFETY PROFILES
// ============================================================================

export const oilSafetyProfiles = pgTable(
  'oil_safety_profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    oilId: text('oil_id').notNull().unique(),
    
    // Pregnancy & lactation
    pregnancySafety: pregnancySafetyEnum('pregnancy_safety').notNull().default('unknown'),
    pregnancyTrimester1: text('pregnancy_trimester_1_notes'),
    pregnancyTrimester2: text('pregnancy_trimester_2_notes'),
    pregnancyTrimester3: text('pregnancy_trimester_3_notes'),
    lactationSafety: lactationSafetyEnum('lactation_safety').notNull().default('insufficient'),
    lactationNotes: text('lactation_notes'),
    
    // Age restrictions
    ageRestriction: ageRestrictionEnum('age_restriction').notNull().default('all_ages'),
    pediatricNotes: text('pediatric_notes'),
    geriatricNotes: text('geriatric_notes'), // Elderly considerations
    
    // Route safety
    topicalSafety: routeSafetyEnum('topical_safety').notNull().default('dilution_required'),
    inhalationSafety: routeSafetyEnum('inhalation_safety').notNull().default('all_routes'),
    ingestionSafety: routeSafetyEnum('ingestion_safety').notNull().default('avoid_ingestion'),
    
    // Maximum concentrations
    maxDermalConcentration: decimal('max_dermal_concentration', { precision: 4, scale: 2 }), // Percentage
    maxDermalConcentrationSensitive: decimal('max_dermal_concentration_sensitive', { precision: 4, scale: 2 }),
    
    // Toxicity
    ld50Oral: text('ld50_oral'), // Oral toxicity data
    ld50Dermal: text('ld50_dermal'), // Dermal toxicity
    
    // Irritation/Sensitization
    skinIrritationPotential: text('skin_irritation_potential'), // mild, moderate, severe
    sensitizationPotential: text('sensitization_potential'),
    mucousMembraneIrritation: boolean('mucous_membrane_irritation').notNull().default(false),
    
    // Phototoxicity
    phototoxic: boolean('phototoxic').notNull().default(false),
    phototoxicConcentration: decimal('phototoxic_concentration', { precision: 4, scale: 2 }), // % that causes reaction
    furocoumarins: text('furocoumarins'), // Specific compounds
    photosensitivityDuration: integer('photosensitivity_duration'), // Hours after application
    
    // Systemic effects
    neurotoxic: boolean('neurotoxic').notNull().default(false),
    hepatotoxic: boolean('hepatotoxic').notNull().default(false),
    nephrotoxic: boolean('nephrotoxic').notNull().default(false),
    carcinogenic: boolean('carcinogenic').notNull().default(false),
    
    // Respiratory
    respiratorySensitizer: boolean('respiratory_sensitizer').notNull().default(false),
    asthmaTrigger: boolean('asthma_trigger').notNull().default(false),
    
    // Cardiovascular
    affectsBloodPressure: text('affects_blood_pressure'), // raises, lowers, variable
    affectsHeartRate: text('affects_heart_rate'),
    anticoagulant: boolean('anticoagulant').notNull().default(false),
    
    // Endocrine
    hormoneLike: boolean('hormone_like').notNull().default(false),
    estrogenic: boolean('estrogenic').notNull().default(false),
    
    // Special populations
    epilepsyWarning: boolean('epilepsy_warning').notNull().default(false),
    glaucomaWarning: boolean('glaucoma_warning').notNull().default(false),
    
    // Allergen info
    commonAllergens: text('common_allergens').array(), // e.g., ['linalool', 'limonene']
    crossReactivity: text('cross_reactivity').array(), // Cross-reacts with these substances
    
    // General safety notes
    generalSafetyNotes: text('general_safety_notes'),
    maximumDailyExposure: text('maximum_daily_exposure'), // Drops or ml per day
    
    // References
    primaryReferences: text('primary_references').array(),
    
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
    verifiedBy: text('verified_by'),
    verifiedAt: timestamp('verified_at', { mode: 'date' }),
  },
  (table) => ({
    oilIdIdx: index('safety_oil_id_idx').on(table.oilId),
    pregnancyIdx: index('safety_pregnancy_idx').on(table.pregnancySafety),
    ageIdx: index('safety_age_idx').on(table.ageRestriction),
  })
);

// ============================================================================
// USER MEDICATIONS (User's saved medications)
// ============================================================================

export const userMedications = pgTable(
  'user_medications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(),
    
    // Medication reference (if in our DB) or custom entry
    medicationId: uuid('medication_id').references(() => medications.id),
    customMedicationName: text('custom_medication_name'),
    
    // User details
    dosage: text('dosage'),
    frequency: text('frequency'),
    prescribedFor: text('prescribed_for'),
    
    // Status
    isActive: boolean('is_active').notNull().default(true),
    startedAt: timestamp('started_at', { mode: 'date' }),
    endedAt: timestamp('ended_at', { mode: 'date' }),
    
    // Verification
    verifiedByHealthcareProvider: boolean('verified_by_healthcare_provider').notNull().default(false),
    
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('user_med_user_id_idx').on(table.userId),
    activeIdx: index('user_med_active_idx').on(table.userId, table.isActive),
  })
);

// ============================================================================
// USER HEALTH CONDITIONS
// ============================================================================

export const userHealthConditions = pgTable(
  'user_health_conditions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(),
    
    // Condition reference or custom
    conditionId: uuid('condition_id').references(() => healthConditions.id),
    customConditionName: text('custom_condition_name'),
    
    // Details
    severity: text('severity'), // mild, moderate, severe
    diagnosedBy: text('diagnosed_by'),
    diagnosisDate: timestamp('diagnosis_date', { mode: 'date' }),
    
    // Current status
    isActive: boolean('is_active').notNull().default(true),
    managedBy: text('managed_by').array(), // medications, lifestyle, etc.
    
    // Safety relevance
    requiresMedicalSupervision: boolean('requires_medical_supervision').notNull().default(false),
    
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('user_condition_user_id_idx').on(table.userId),
    activeIdx: index('user_condition_active_idx').on(table.userId, table.isActive),
  })
);

// ============================================================================
// SAFETY INCIDENTS LOG (For tracking and improving)
// ============================================================================

export const safetyIncidents = pgTable(
  'safety_incidents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(),
    
    // Incident details
    incidentType: text('incident_type').notNull(), // reaction, interaction, etc.
    severity: text('severity').notNull(), // mild, moderate, severe
    
    // What was used
    oilsUsed: text('oils_used').array(),
    medicationsAtTime: text('medications_at_time').array(),
    conditionsAtTime: text('conditions_at_time').array(),
    
    // Description
    symptoms: text('symptoms').array(),
    description: text('description'),
    onsetTime: text('onset_time'), // How long after use
    duration: text('duration'),
    
    // Resolution
    actionTaken: text('action_taken'),
    resolved: boolean('resolved'),
    medicalAttentionRequired: boolean('medical_attention_required').notNull().default(false),
    
    // Follow-up
    reportedToHealthcareProvider: boolean('reported_to_healthcare_provider').notNull().default(false),
    
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('incident_user_id_idx').on(table.userId),
    typeIdx: index('incident_type_idx').on(table.incidentType),
    createdAtIdx: index('incident_created_idx').on(table.createdAt),
  })
);

// ============================================================================
// RELATIONS
// ============================================================================

export const medicationsRelations = relations(medications, ({ many }) => ({
  interactions: many(oilMedicationInteractions),
}));

export const oilMedicationInteractionsRelations = relations(oilMedicationInteractions, ({ one }) => ({
  medication: one(medications, {
    fields: [oilMedicationInteractions.medicationId],
    references: [medications.id],
  }),
}));

export const healthConditionsRelations = relations(healthConditions, ({ many }) => ({
  contraindications: many(oilConditionContraindications),
}));

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Medication = typeof medications.$inferSelect;
export type InsertMedication = typeof medications.$inferInsert;

export type OilMedicationInteraction = typeof oilMedicationInteractions.$inferSelect;
export type InsertOilMedicationInteraction = typeof oilMedicationInteractions.$inferInsert;

export type HealthCondition = typeof healthConditions.$inferSelect;
export type InsertHealthCondition = typeof healthConditions.$inferInsert;

export type OilConditionContraindication = typeof oilConditionContraindications.$inferSelect;
export type InsertOilConditionContraindication = typeof oilConditionContraindications.$inferInsert;

export type OilSafetyProfile = typeof oilSafetyProfiles.$inferSelect;
export type InsertOilSafetyProfile = typeof oilSafetyProfiles.$inferInsert;

export type UserMedication = typeof userMedications.$inferSelect;
export type InsertUserMedication = typeof userMedications.$inferInsert;

export type UserHealthCondition = typeof userHealthConditions.$inferSelect;
export type InsertUserHealthCondition = typeof userHealthConditions.$inferInsert;

export type SafetyIncident = typeof safetyIncidents.$inferSelect;
export type InsertSafetyIncident = typeof safetyIncidents.$inferInsert;
