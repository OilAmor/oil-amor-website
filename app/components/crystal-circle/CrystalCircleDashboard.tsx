'use client';

/**
 * Crystal Circle Dashboard
 * 
 * Main rewards dashboard showing tier status, progress, benefits,
 * chain inventory, charm collection, and account credit.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TierLevel,
  CRYSTAL_CIRCLE_TIERS,
  getTierProgressDetails,
  getNextTier
} from '@/oil-amor-tier1/lib/rewards/tiers';
import {
  CustomerRewardsProfile,
  getCustomerRewardsProfile
} from '@/oil-amor-tier1/lib/rewards/customer-rewards';
import { TierProgressCard } from './TierProgressCard';
import { UnlockedChainsDisplay } from './UnlockedChainsDisplay';
import { CharmCollection } from './CharmCollection';
import { AccountCreditDisplay } from './AccountCreditDisplay';
import { RecentActivityFeed } from './RecentActivityFeed';

// ============================================================================
// TYPES
// ============================================================================

interface CrystalCircleDashboardProps {
  customerId: string;
  initialData?: CustomerRewardsProfile;
}

interface DashboardState {
  profile: CustomerRewardsProfile | null;
  loading: boolean;
  error: string | null;
  activeTab: 'overview' | 'chains' | 'charms' | 'credit';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CrystalCircleDashboard({
  customerId,
  initialData
}: CrystalCircleDashboardProps) {
  const [state, setState] = useState<DashboardState>({
    profile: initialData || null,
    loading: !initialData,
    error: null,
    activeTab: 'overview'
  });

  useEffect(() => {
    if (!initialData) {
      loadProfile();
    }
  }, [customerId]);

  const loadProfile = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const profile = await getCustomerRewardsProfile(customerId);
      setState(prev => ({ ...prev, profile, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load your rewards profile. Please try again.'
      }));
    }
  };

  if (state.loading) {
    return <DashboardSkeleton />;
  }

  if (state.error || !state.profile) {
    return <DashboardError message={state.error || 'Profile not found'} onRetry={loadProfile} />;
  }

  const { profile } = state;
  const tierConfig = CRYSTAL_CIRCLE_TIERS[profile.currentTier];
  const progress = profile.progressToNextTier;

  return (
    <div className="crystal-circle-dashboard">
      {/* Header with Tier Badge */}
      <DashboardHeader profile={profile} tierConfig={tierConfig} />

      {/* Navigation Tabs */}
      <TabNavigation activeTab={state.activeTab} onTabChange={(tab) => 
        setState(prev => ({ ...prev, activeTab: tab }))
      } />

      {/* Main Content */}
      <div className="dashboard-content">
        <AnimatePresence mode="wait">
          {state.activeTab === 'overview' && (
            <OverviewTab
              key="overview"
              profile={profile}
              tierConfig={tierConfig}
              progress={progress}
            />
          )}
          {state.activeTab === 'chains' && (
            <ChainsTab key="chains" profile={profile} />
          )}
          {state.activeTab === 'charms' && (
            <CharmsTab key="charms" profile={profile} />
          )}
          {state.activeTab === 'credit' && (
            <CreditTab key="credit" profile={profile} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function DashboardHeader({
  profile,
  tierConfig
}: {
  profile: CustomerRewardsProfile;
  tierConfig: (typeof CRYSTAL_CIRCLE_TIERS)[TierLevel];
}) {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="tier-badge-section">
          <motion.div
            className="tier-badge"
            style={{ backgroundColor: tierConfig.color }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TierIcon icon={tierConfig.icon} />
          </motion.div>
          <div className="tier-info">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {tierConfig.name}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {tierConfig.description}
            </motion.p>
          </div>
        </div>

        <div className="member-since">
          <span>Crystal Circle Member Since</span>
          <strong>{new Date(profile.memberSince).toLocaleDateString()}</strong>
        </div>
      </div>
    </header>
  );
}

function TierIcon({ icon }: { icon: string }) {
  const iconPaths: Record<string, string> = {
    seedling: '🌱',
    sprout: '🌿',
    flower: '🌸',
    sun: '☀️',
    star: '⭐'
  };

  return (
    <span className="tier-icon" role="img" aria-label={icon}>
      {iconPaths[icon] || '✨'}
    </span>
  );
}

function TabNavigation({
  activeTab,
  onTabChange
}: {
  activeTab: string;
  onTabChange: (tab: DashboardState['activeTab']) => void;
}) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'chains', label: 'Chains', icon: '⛓️' },
    { id: 'charms', label: 'Charms', icon: '🔮' },
    { id: 'credit', label: 'Credit', icon: '💰' }
  ];

  return (
    <nav className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id as DashboardState['activeTab'])}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ============================================================================
// TAB COMPONENTS
// ============================================================================

function OverviewTab({
  profile,
  tierConfig,
  progress
}: {
  profile: CustomerRewardsProfile;
  tierConfig: (typeof CRYSTAL_CIRCLE_TIERS)[TierLevel];
  progress: CustomerRewardsProfile['progressToNextTier'];
}) {
  return (
    <motion.div
      className="tab-content overview-tab"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overview-grid">
        {/* Tier Progress Card */}
        <div className="grid-item large">
          <TierProgressCard
            tier={profile.currentTier}
            totalSpend={profile.totalSpend}
            progress={progress}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid-item">
          <QuickStatsCard profile={profile} />
        </div>

        {/* Benefits Summary */}
        <div className="grid-item">
          <BenefitsSummary tier={profile.currentTier} benefits={tierConfig.benefits} />
        </div>

        {/* Chains Preview */}
        <div className="grid-item">
          <ChainsPreview unlockedChains={profile.unlockedChains} />
        </div>

        {/* Charms Preview */}
        <div className="grid-item">
          <CharmsPreview
            unlockedCharms={profile.unlockedCharms}
            purchaseCount={profile.purchaseCount}
          />
        </div>

        {/* Credit Preview */}
        <div className="grid-item">
          <CreditPreview
            balance={profile.accountCredit}
            refillDiscount={profile.refillDiscount}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid-item full-width">
          <RecentActivityFeed customerId={profile.customerId} limit={5} />
        </div>
      </div>
    </motion.div>
  );
}

function ChainsTab({ profile }: { profile: CustomerRewardsProfile }) {
  return (
    <motion.div
      className="tab-content"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <UnlockedChainsDisplay
        tier={profile.currentTier}
        unlockedChains={profile.unlockedChains}
        customerId={profile.customerId}
      />
    </motion.div>
  );
}

function CharmsTab({ profile }: { profile: CustomerRewardsProfile }) {
  return (
    <motion.div
      className="tab-content"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CharmCollection
        purchaseCount={profile.purchaseCount}
        tier={profile.currentTier}
        unlockedCharms={profile.unlockedCharms}
        customerId={profile.customerId}
      />
    </motion.div>
  );
}

function CreditTab({ profile }: { profile: CustomerRewardsProfile }) {
  return (
    <motion.div
      className="tab-content"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <AccountCreditDisplay
        customerId={profile.customerId}
        balance={profile.accountCredit}
        history={profile.creditHistory}
        refillDiscount={profile.refillDiscount}
      />
    </motion.div>
  );
}

// ============================================================================
// PREVIEW CARDS
// ============================================================================

function QuickStatsCard({ profile }: { profile: CustomerRewardsProfile }) {
  const stats = [
    { label: 'Total Spend', value: `$${profile.totalSpend.toFixed(2)}` },
    { label: 'Purchases', value: profile.purchaseCount.toString() },
    { label: 'Crystals', value: profile.crystalsCollected.length.toString() },
    { label: 'Cords Owned', value: profile.cordsOwned.toString() }
  ];

  return (
    <div className="preview-card quick-stats">
      <h3>Your Journey</h3>
      <div className="stats-grid">
        {stats.map(stat => (
          <div key={stat.label} className="stat-item">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BenefitsSummary({
  tier,
  benefits
}: {
  tier: TierLevel;
  benefits: string[];
}) {
  const nextTier = getNextTier(tier);

  return (
    <div className="preview-card benefits-summary">
      <h3>Your Benefits</h3>
      <ul className="benefits-list">
        {benefits.slice(0, 4).map((benefit, index) => (
          <li key={index} className="benefit-item">
            <span className="checkmark">✓</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      {nextTier && (
        <p className="more-benefits">
          + more at {CRYSTAL_CIRCLE_TIERS[nextTier].name} tier
        </p>
      )}
    </div>
  );
}

function ChainsPreview({ unlockedChains }: { unlockedChains: string[] }) {
  return (
    <div className="preview-card chains-preview">
      <h3>Your Chains</h3>
      <div className="chains-count">
        <span className="count">{unlockedChains.length}</span>
        <span className="total">/ 4 unlocked</span>
      </div>
      <div className="chain-dots">
        {['silver-plated', 'gold-plated', 'sterling-silver', '14k-gold-filled'].map(
          (chain, index) => (
            <span
              key={chain}
              className={`chain-dot ${unlockedChains.includes(chain) ? 'unlocked' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          )
        )}
      </div>
    </div>
  );
}

function CharmsPreview({
  unlockedCharms,
  purchaseCount
}: {
  unlockedCharms: string[];
  purchaseCount: number;
}) {
  const totalCharms = 8;
  const collected = unlockedCharms.includes('all') ? totalCharms : unlockedCharms.length;

  return (
    <div className="preview-card charms-preview">
      <h3>Charm Collection</h3>
      <div className="charms-progress">
        <div className="progress-ring">
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
              strokeDasharray={`${(collected / totalCharms) * 100}, 100`}
            />
          </svg>
          <div className="ring-content">
            <span className="collected">{collected}</span>
            <span className="separator">/</span>
            <span className="total">{totalCharms}</span>
          </div>
        </div>
      </div>
      <p className="next-milestone">{purchaseCount} purchases made</p>
    </div>
  );
}

function CreditPreview({
  balance,
  refillDiscount
}: {
  balance: number;
  refillDiscount: number;
}) {
  return (
    <div className="preview-card credit-preview">
      <h3>Account Credit</h3>
      <div className="credit-balance">
        <span className="currency">$</span>
        <span className="amount">{balance.toFixed(2)}</span>
      </div>
      {refillDiscount > 0 && (
        <div className="refill-discount">
          <span className="badge">{refillDiscount}% OFF</span>
          <span>refills</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SKELETON & ERROR STATES
// ============================================================================

function DashboardSkeleton() {
  return (
    <div className="crystal-circle-dashboard skeleton">
      <div className="skeleton-header">
        <div className="skeleton-badge" />
        <div className="skeleton-text">
          <div className="skeleton-title" />
          <div className="skeleton-description" />
        </div>
      </div>
      <div className="skeleton-tabs">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton-tab" />
        ))}
      </div>
      <div className="skeleton-content">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="skeleton-card" />
        ))}
      </div>
    </div>
  );
}

function DashboardError({
  message,
  onRetry
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="dashboard-error">
      <div className="error-icon">💎</div>
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <button onClick={onRetry} className="retry-button">
        Try Again
      </button>
    </div>
  );
}
