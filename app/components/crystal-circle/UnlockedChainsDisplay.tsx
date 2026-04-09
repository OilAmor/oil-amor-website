'use client';

/**
 * Unlocked Chains Display
 * 
 * Shows available chain types with visual indicators for:
 * - Locked chains (grayed out with tier requirement)
 * - Unlocked chains (full color, selectable)
 * - Currently selected (highlighted with gold border)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TierLevel,
  ChainType,
  CRYSTAL_CIRCLE_TIERS
} from '@/oil-amor-tier1/lib/rewards/tiers';
import {
  CHAIN_CATALOG,
  getAvailableChains,
  getNextUnlockableChains
} from '@/oil-amor-tier1/lib/rewards/chain-system';

// ============================================================================
// TYPES
// ============================================================================

interface UnlockedChainsDisplayProps {
  tier: TierLevel;
  unlockedChains: ChainType[];
  customerId: string;
}

interface ChainCardProps {
  chain: {
    type: ChainType;
    config: (typeof CHAIN_CATALOG)[ChainType];
    isLocked: boolean;
    unlockProgress: number;
  };
  isSelected: boolean;
  canSelect: boolean;
  onSelect: () => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function UnlockedChainsDisplay({
  tier,
  unlockedChains,
  customerId
}: UnlockedChainsDisplayProps) {
  const [selectedChain, setSelectedChain] = useState<ChainType | null>(
    unlockedChains[0] || null
  );
  const [expandedChain, setExpandedChain] = useState<ChainType | null>(null);

  const availableChains = getAvailableChains(tier);
  const nextUnlocks = getNextUnlockableChains(tier);

  const handleChainSelect = (chainType: ChainType) => {
    if (unlockedChains.includes(chainType)) {
      setSelectedChain(chainType);
      // In real implementation, would persist selection
      console.log(`Selected chain ${chainType} for customer ${customerId}`);
    }
  };

  return (
    <div className="unlocked-chains-display">
      {/* Header */}
      <div className="chains-header">
        <h2>Your Chain Collection</h2>
        <p className="chains-subtitle">
          {unlockedChains.length} of 4 chains unlocked
        </p>
      </div>

      {/* Chains Grid */}
      <div className="chains-grid">
        {availableChains.map((chain, index) => (
          <motion.div
            key={chain.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ChainCard
              chain={chain}
              isSelected={selectedChain === chain.type}
              canSelect={unlockedChains.includes(chain.type)}
              onSelect={() => handleChainSelect(chain.type)}
            />
          </motion.div>
        ))}
      </div>

      {/* Next Unlock Teaser */}
      {nextUnlocks.length > 0 && (
        <div className="next-unlock-teaser">
          <h3>Unlock Next</h3>
          {nextUnlocks.map(chainType => {
            const config = CHAIN_CATALOG[chainType];
            return (
              <div key={chainType} className="teaser-card locked">
                <div className="teaser-icon">🔒</div>
                <div className="teaser-info">
                  <span className="teaser-name">{config.name}</span>
                  <span className="teaser-requirement">
                    Unlock at {getTierDisplayName(config.tierRequired)} tier
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Chain Details */}
      <AnimatePresence mode="wait">
        {selectedChain && (
          <SelectedChainDetails
            chainType={selectedChain}
            onClose={() => setSelectedChain(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// CHAIN CARD COMPONENT
// ============================================================================

function ChainCard({
  chain,
  isSelected,
  canSelect,
  onSelect
}: ChainCardProps) {
  const { type, config, isLocked, unlockProgress } = chain;

  return (
    <motion.div
      className={`chain-card ${isLocked ? 'locked' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
    >
      {/* Chain Image/Icon */}
      <div className="chain-visual">
        {isLocked ? (
          <div className="locked-overlay">
            <span className="lock-icon">🔒</span>
            <div className="progress-pill">
              <div
                className="progress-fill"
                style={{ width: `${unlockProgress}%` }}
              />
              <span>{unlockProgress}%</span>
            </div>
          </div>
        ) : (
          <>
            <img
              src={config.image}
              alt={config.name}
              className="chain-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/chains/placeholder.jpg';
              }}
            />
            {isSelected && (
              <motion.div
                className="selected-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <span>✓</span>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Chain Info */}
      <div className="chain-info">
        <h4 className="chain-name">{config.name}</h4>
        <p className="chain-description">
          {isLocked
            ? `Unlock at ${getTierDisplayName(config.tierRequired)} tier`
            : config.specifications.material}
        </p>
        {!isLocked && (
          <div className="chain-specs">
            <span className="spec">{config.specifications.length}</span>
            <span className="spec">{config.specifications.weight}</span>
          </div>
        )}
      </div>

      {/* Value Badge */}
      {!isLocked && (
        <div className="value-badge">
          <span className="value-label">Value</span>
          <span className="value-amount">${config.value}</span>
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// SELECTED CHAIN DETAILS
// ============================================================================

function SelectedChainDetails({
  chainType,
  onClose
}: {
  chainType: ChainType;
  onClose: () => void;
}) {
  const config = CHAIN_CATALOG[chainType];

  return (
    <motion.div
      className="selected-chain-details"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <button className="close-button" onClick={onClose}>
        ×
      </button>

      <div className="details-content">
        <div className="details-image">
          <img src={config.image} alt={config.name} />
        </div>

        <div className="details-info">
          <h3>{config.name}</h3>
          <p className="details-description">{config.description}</p>

          <div className="specifications">
            <h4>Specifications</h4>
            <dl>
              <dt>Material</dt>
              <dd>{config.specifications.material}</dd>
              <dt>Length</dt>
              <dd>{config.specifications.length}</dd>
              <dt>Clasp</dt>
              <dd>{config.specifications.clasp}</dd>
              <dt>Weight</dt>
              <dd>{config.specifications.weight}</dd>
              <dt>Finish</dt>
              <dd>{config.specifications.finish}</dd>
              <dt>Hypoallergenic</dt>
              <dd>{config.specifications.hypoallergenic ? 'Yes ✓' : 'No'}</dd>
            </dl>
          </div>

          <div className="care-instructions">
            <h4>Care Instructions</h4>
            <ul>
              {config.careInstructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>

          <button className="select-button primary">
            Use This Chain
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getTierDisplayName(tier: TierLevel): string {
  return CRYSTAL_CIRCLE_TIERS[tier].name;
}
