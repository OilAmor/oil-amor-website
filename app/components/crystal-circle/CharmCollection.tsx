'use client';

/**
 * Charm Collection Gallery
 * 
 * Displays customer's charm collection with:
 * - Collected charms (full color, selectable)
 * - Locked charms (silhouette with unlock condition)
 * - Progress indicators for next unlocks
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TierLevel,
  CRYSTAL_CIRCLE_TIERS
} from '@/oil-amor-tier1/lib/rewards/tiers';
import {
  CHARM_CATALOG,
  getAvailableCharms,
  getNextCharmMilestone,
  formatUnlockCondition
} from '@/oil-amor-tier1/lib/rewards/charm-system';

// ============================================================================
// TYPES
// ============================================================================

interface CharmCollectionProps {
  purchaseCount: number;
  tier: TierLevel;
  unlockedCharms: string[];
  customerId: string;
}

interface CharmCardProps {
  charm: {
    id: string;
    config: (typeof CHARM_CATALOG)[string];
    isLocked: boolean;
    isCollected: boolean;
    progressToUnlock: number;
    purchasesNeeded?: number;
  };
  isSelected: boolean;
  onSelect: () => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CharmCollection({
  purchaseCount,
  tier,
  unlockedCharms,
  customerId
}: CharmCollectionProps) {
  const [selectedCharm, setSelectedCharm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const availableCharms = getAvailableCharms(purchaseCount, tier);
  const nextMilestone = getNextCharmMilestone(purchaseCount);

  // Mark collected charms
  const charmsWithCollectionStatus = availableCharms.map(charm => ({
    ...charm,
    isCollected: unlockedCharms.includes('all') || unlockedCharms.includes(charm.id)
  }));

  const collectedCount = charmsWithCollectionStatus.filter(c => c.isCollected).length;
  const totalCount = charmsWithCollectionStatus.length;

  const handleCharmSelect = (charmId: string) => {
    const charm = charmsWithCollectionStatus.find(c => c.id === charmId);
    if (charm?.isCollected) {
      setSelectedCharm(charmId);
      console.log(`Selected charm ${charmId} for customer ${customerId}`);
    }
  };

  return (
    <div className="charm-collection">
      {/* Header */}
      <div className="collection-header">
        <div className="header-title">
          <h2>Charm Collection</h2>
          <div className="collection-stats">
            <div className="stat">
              <span className="stat-value collected">{collectedCount}</span>
              <span className="stat-separator">/</span>
              <span className="stat-value total">{totalCount}</span>
              <span className="stat-label">collected</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(collectedCount / totalCount) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        <div className="view-controls">
          <button
            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            ⊞
          </button>
          <button
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Next Milestone Banner */}
      {nextMilestone && (
        <motion.div
          className="milestone-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="milestone-icon">🎯</span>
          <span className="milestone-text">
            <strong>{nextMilestone.purchasesNeeded}</strong> more purchase
            {nextMilestone.purchasesNeeded > 1 ? 's' : ''} to unlock:{' '}
            {nextMilestone.charms.map(id => CHARM_CATALOG[id]?.name).join(', ')}
          </span>
        </motion.div>
      )}

      {/* Charms Grid/List */}
      <div className={`charms-container ${viewMode}`}>
        {charmsWithCollectionStatus.map((charm, index) => (
          <motion.div
            key={charm.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <CharmCard
              charm={charm}
              isSelected={selectedCharm === charm.id}
              onSelect={() => handleCharmSelect(charm.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Charm Details Modal */}
      <AnimatePresence>
        {selectedCharm && (
          <CharmDetailsModal
            charmId={selectedCharm}
            isCollected={unlockedCharms.includes(selectedCharm) || unlockedCharms.includes('all')}
            onClose={() => setSelectedCharm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// CHARM CARD COMPONENT
// ============================================================================

function CharmCard({ charm, isSelected, onSelect }: CharmCardProps) {
  const { id, config, isLocked, isCollected, progressToUnlock, purchasesNeeded } = charm;

  return (
    <motion.div
      className={`charm-card ${isLocked ? 'locked' : ''} ${isCollected ? 'collected' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      whileHover={isCollected ? { scale: 1.05, y: -5 } : {}}
      whileTap={isCollected ? { scale: 0.95 } : {}}
    >
      {/* Charm Visual */}
      <div className="charm-visual">
        {isLocked ? (
          <div className="locked-charm">
            <div className="silhouette">{getCharmIcon(config.id)}</div>
            <div className="lock-overlay">
              <span className="lock-icon">🔒</span>
            </div>
            {purchasesNeeded !== undefined && (
              <div className="unlock-progress">
                <div className="progress-ring-small">
                  <svg viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e0e0e0"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#C9A0DC"
                      strokeWidth="3"
                      strokeDasharray={`${progressToUnlock}, 100`}
                    />
                  </svg>
                  <span className="progress-text">{progressToUnlock}%</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="charm-image">
              <img
                src={config.image}
                alt={config.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {!isCollected && <div className="placeholder-icon">{getCharmIcon(id)}</div>}
            </div>
            {isCollected && (
              <motion.div
                className="collected-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                ✓
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Charm Info */}
      <div className="charm-info">
        <h4 className="charm-name">{config.name}</h4>
        <p className="charm-meaning">{config.meaning}</p>
        
        {isLocked ? (
          <span className="unlock-condition">
            {formatUnlockCondition(id)}
          </span>
        ) : isCollected ? (
          <span className="material-badge">{config.material}</span>
        ) : (
          <span className="available-badge">Available to Claim</span>
        )}
      </div>

      {/* Limited Edition Tag */}
      {config.limitedEdition && (
        <div className="limited-tag">Limited</div>
      )}
    </motion.div>
  );
}

// ============================================================================
// CHARM DETAILS MODAL
// ============================================================================

function CharmDetailsModal({
  charmId,
  isCollected,
  onClose
}: {
  charmId: string;
  isCollected: boolean;
  onClose: () => void;
}) {
  const config = CHARM_CATALOG[charmId];
  if (!config) return null;

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="charm-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-content">
          <div className="charm-visual-large">
            <img src={config.image} alt={config.name} />
          </div>

          <div className="charm-details">
            <h2>{config.name}</h2>
            <p className="meaning">{config.meaning}</p>
            <p className="description">{config.description}</p>

            <div className="detail-section">
              <h4>Material</h4>
              <p>{config.material}</p>
            </div>

            <div className="detail-section">
              <h4>Compatible Chains</h4>
              <div className="chain-tags">
                {config.compatibleChains.map(chain => (
                  <span key={chain} className="chain-tag">{chain}</span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h4>Care Instructions</h4>
              <ul>
                {config.careInstructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>

            {isCollected ? (
              <button className="action-button primary">
                Equip This Charm
              </button>
            ) : (
              <div className="locked-notice">
                <span>🔒</span>
                <p>{formatUnlockCondition(charmId)}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getCharmIcon(charmId: string): string {
  const icons: Record<string, string> = {
    'crescent-moon': '🌙',
    'lotus-flower': '🪷',
    'tree-of-life': '🌳',
    'evil-eye': '🧿',
    'compass': '🧭',
    'sunburst': '☀️',
    'custom-initial': '🔤',
    'birthstone': '💎'
  };
  return icons[charmId] || '✨';
}
