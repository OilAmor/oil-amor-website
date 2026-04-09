'use client';

/**
 * Tier Progress Card
 * 
 * Visual card showing current tier with animated progress ring,
 * benefits list with checkmarks, and next tier preview.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  TierLevel,
  CRYSTAL_CIRCLE_TIERS,
  getNextTier,
  getTierDisplayName,
  getAllUnlockedBenefits,
  getTierExclusiveBenefits
} from '@/oil-amor-tier1/lib/rewards/tiers';

// ============================================================================
// TYPES
// ============================================================================

interface TierProgressCardProps {
  tier: TierLevel;
  totalSpend: number;
  progress: {
    current: number;
    target: number;
    percentage: number;
    amountNeeded: number;
    nextTierName: string | null;
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TierProgressCard({
  tier,
  totalSpend,
  progress
}: TierProgressCardProps) {
  const tierConfig = CRYSTAL_CIRCLE_TIERS[tier];
  const nextTier = getNextTier(tier);
  const nextTierConfig = nextTier ? CRYSTAL_CIRCLE_TIERS[nextTier] : null;
  
  const allBenefits = getAllUnlockedBenefits(tier);
  const exclusiveBenefits = getTierExclusiveBenefits(tier);

  return (
    <div className="tier-progress-card">
      {/* Progress Ring Section */}
      <div className="progress-section">
        <div className="tier-visual">
          <ProgressRing
            percentage={progress.percentage}
            color={tierConfig.color}
            icon={tierConfig.icon}
          />
          <div className="tier-label">
            <span className="tier-name">{tierConfig.name}</span>
            <span className="tier-rank">Tier {getTierRank(tier)} of 5</span>
          </div>
        </div>

        <div className="progress-details">
          <div className="spend-display">
            <span className="spend-label">Total Spend</span>
            <span className="spend-amount">${totalSpend.toFixed(2)}</span>
          </div>

          {nextTierConfig ? (
            <div className="next-tier-progress">
              <div className="progress-bar-container">
                <motion.div
                  className="progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ backgroundColor: tierConfig.color }}
                />
              </div>
              <p className="progress-message">
                <strong>${progress.amountNeeded.toFixed(2)}</strong> away from{' '}
                <span style={{ color: nextTierConfig.color }}>
                  {nextTierConfig.name}
                </span>
              </p>
            </div>
          ) : (
            <div className="max-tier-message">
              <span className="crown">👑</span>
              <p>You've reached the pinnacle of Crystal Circle!</p>
            </div>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <h3>Your Benefits</h3>
        <ul className="benefits-list">
          {exclusiveBenefits.map((benefit, index) => (
            <motion.li
              key={index}
              className="benefit-item new"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="benefit-icon">✨</span>
              <span className="benefit-text">{benefit}</span>
              <span className="new-badge">NEW</span>
            </motion.li>
          ))}
          {allBenefits
            .filter(b => !exclusiveBenefits.includes(b))
            .slice(0, 5 - exclusiveBenefits.length)
            .map((benefit, index) => (
              <motion.li
                key={`existing-${index}`}
                className="benefit-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (exclusiveBenefits.length + index) * 0.1 }}
              >
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">{benefit}</span>
              </motion.li>
            ))}
        </ul>
        {allBenefits.length > 5 && (
          <button className="view-all-benefits">View all {allBenefits.length} benefits</button>
        )}
      </div>

      {/* Next Tier Preview */}
      {nextTierConfig && (
        <div className="next-tier-preview">
          <div className="preview-header">
            <span className="teaser-label">Coming Next</span>
            <span className="tier-name" style={{ color: nextTierConfig.color }}>
              {nextTierConfig.name}
            </span>
          </div>
          <div className="preview-benefits">
            {getTierExclusiveBenefits(nextTier).slice(0, 3).map((benefit, index) => (
              <div key={index} className="preview-benefit">
                <span className="lock-icon">🔒</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PROGRESS RING COMPONENT
// ============================================================================

function ProgressRing({
  percentage,
  color,
  icon
}: {
  percentage: number;
  color: string;
  icon: string;
}) {
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const iconPaths: Record<string, string> = {
    seedling: '🌱',
    sprout: '🌿',
    flower: '🌸',
    sun: '☀️',
    star: '⭐'
  };

  return (
    <div className="progress-ring">
      <svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        {/* Background circle */}
        <circle
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <motion.circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="ring-content">
        <motion.span
          className="tier-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          {iconPaths[icon] || '✨'}
        </motion.span>
        <span className="percentage">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getTierRank(tier: TierLevel): number {
  const ranks: Record<TierLevel, number> = {
    seed: 1,
    sprout: 2,
    bloom: 3,
    radiance: 4,
    luminary: 5
  };
  return ranks[tier];
}
