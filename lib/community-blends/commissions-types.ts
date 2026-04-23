/**
 * Blend Creator Commission Types and Constants
 * 
 * These are separated from the server actions file to allow non-async exports
 */

// ============================================================================
// CONSTANTS
// ============================================================================

export const CREATOR_COMMISSION_RATE = 10; // 10% commission rate

// ============================================================================
// TYPES
// ============================================================================

export interface CommissionResult {
  success: boolean;
  commissionId?: string;
  commissionAmount: number; // in cents
  creatorId?: string;
  error?: string;
  alreadyExists?: boolean;
}

export interface CreatorEarnings {
  totalEarned: number; // in cents
  pendingAmount: number; // in cents
  totalSales: number;
  blendCount: number;
}
