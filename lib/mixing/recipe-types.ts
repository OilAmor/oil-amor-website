/**
 * Oil Amor Mix Recipe System
 * Types for saving, sharing, and managing custom oil blends
 */

// ============================================================================
// CORE RECIPE TYPES
// ============================================================================

export interface MixRecipe {
  id: string
  name: string
  description?: string
  
  // Creator info
  createdBy: string // user ID
  creatorName: string
  isPublic: boolean
  
  // Recipe data
  mode: 'pure' | 'carrier'
  oils: RecipeOilComponent[]
  carrierRatio?: number // For carrier mode (5-75%)
  totalVolume: 5 | 10 | 15 | 20 | 30 | 50 | 100 // ml
  
  // Safety data
  safetyScore: number
  safetyRating: 'excellent' | 'good' | 'acceptable' | 'caution' | 'dangerous'
  warnings: string[] // IDs of active warnings
  
  // Metadata
  tags: RecipeTag[]
  intendedUse: 'sleep' | 'energy' | 'focus' | 'relaxation' | 'immunity' | 'pain-relief' | 'mood' | 'other'
  
  // Stats
  timesOrdered: number
  timesFavorited: number
  averageRating: number
  reviewCount: number
  
  // Timestamps
  createdAt: string
  updatedAt: string
}

export interface RecipeOilComponent {
  oilId: string
  oilName: string
  drops: number
  percentage?: number // Calculated field
}

export type RecipeTag = 
  | 'beginner-friendly'
  | 'child-safe'
  | 'pregnancy-safe'
  | 'sleep-aid'
  | 'energy-boost'
  | 'stress-relief'
  | 'focus'
  | 'immunity'
  | 'pain-relief'
  | 'luxury'
  | 'budget-friendly'
  | 'quick-mix'
  | 'signature'
  | 'community-favorite'

// ============================================================================
// USER RECIPE INTERACTIONS
// ============================================================================

export interface UserRecipeState {
  myRecipes: MixRecipe[]
  favoriteRecipeIds: string[]
  recentlyViewed: string[] // Recipe IDs
  sharedWithMe: SharedRecipe[]
}

export interface SharedRecipe {
  recipeId: string
  sharedBy: string
  sharedByName: string
  sharedAt: string
  message?: string
}

export interface RecipeReview {
  id: string
  recipeId: string
  userId: string
  userName: string
  rating: 1 | 2 | 3 | 4 | 5
  review: string
  wouldRecommend: boolean
  usageDuration: 'less-than-week' | '1-4-weeks' | '1-3-months' | '3-plus-months'
  createdAt: string
}

// ============================================================================
// RECIPE CREATION
// ============================================================================

export interface CreateRecipeInput {
  name: string
  description?: string
  mode: 'pure' | 'carrier'
  oils: { oilId: string; ml: number; percentage?: number }[]
  carrierRatio?: number
  carrierOilId?: string
  totalVolume: 5 | 10 | 15 | 20 | 30 | 50 | 100
  isPublic: boolean
  tags: RecipeTag[]
  intendedUse: MixRecipe['intendedUse']
}

// ============================================================================
// ALCHEMIST AI SUGGESTIONS
// ============================================================================

export interface AlchemistSuggestion {
  id: string
  name: string
  description: string
  mode: 'pure' | 'carrier'
  oils: { oilId: string; ml: number; reason: string }[]
  carrierRatio?: number
  crystal: string // Suggested crystal pairing
  intendedUse: MixRecipe['intendedUse']
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedPrice: number
  unlocks: string[] // Oil IDs this recipe would unlock
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const RECIPE_LIMITS = {
  MAX_OILS_PER_RECIPE: 5,
  MAX_RECIPES_PER_USER: 50,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
  PUBLIC_RECIPES_REQUIRED_RATING: 3.5,
} as const

export const RECIPE_TAGS: { id: RecipeTag; label: string; emoji: string }[] = [
  { id: 'beginner-friendly', label: 'Beginner Friendly', emoji: '🌱' },
  { id: 'child-safe', label: 'Child Safe', emoji: '👶' },
  { id: 'pregnancy-safe', label: 'Pregnancy Safe', emoji: '🤰' },
  { id: 'sleep-aid', label: 'Sleep Aid', emoji: '😴' },
  { id: 'energy-boost', label: 'Energy Boost', emoji: '⚡' },
  { id: 'stress-relief', label: 'Stress Relief', emoji: '😌' },
  { id: 'focus', label: 'Focus', emoji: '🧠' },
  { id: 'immunity', label: 'Immunity', emoji: '🛡️' },
  { id: 'pain-relief', label: 'Pain Relief', emoji: '💪' },
  { id: 'luxury', label: 'Luxury', emoji: '✨' },
  { id: 'budget-friendly', label: 'Budget Friendly', emoji: '💰' },
  { id: 'quick-mix', label: 'Quick Mix', emoji: '⚡' },
  { id: 'signature', label: 'Signature Blend', emoji: '🎨' },
  { id: 'community-favorite', label: 'Community Favorite', emoji: '❤️' },
]
