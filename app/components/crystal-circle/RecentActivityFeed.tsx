'use client';

/**
 * Recent Activity Feed
 * 
 * Displays recent rewards activity including tier changes,
 * charm unlocks, credit transactions, and purchases.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  getCustomerRewardsProfile,
  CreditTransaction
} from '@/oil-amor-tier1/lib/rewards/customer-rewards';
import { CRYSTAL_CIRCLE_TIERS, TierLevel } from '@/oil-amor-tier1/lib/rewards/tiers';
import { CHARM_CATALOG } from '@/oil-amor-tier1/lib/rewards/charm-system';

// ============================================================================
// TYPES
// ============================================================================

interface RecentActivityFeedProps {
  customerId: string;
  limit?: number;
}

type ActivityType = 
  | 'tier_upgrade'
  | 'charm_unlock'
  | 'chain_unlock'
  | 'credit_earned'
  | 'credit_spent'
  | 'purchase'
  | 'milestone';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
  icon: string;
  color: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function RecentActivityFeed({
  customerId,
  limit = 10
}: RecentActivityFeedProps) {
  const [activities, setActivities] = React.useState<ActivityItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadActivityFeed();
  }, [customerId]);

  const loadActivityFeed = async () => {
    try {
      setLoading(true);
      const profile = await getCustomerRewardsProfile(customerId);
      const feed = generateActivityFeed(profile);
      setActivities(feed.slice(0, limit));
    } catch (error) {
      console.error('Failed to load activity feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityFeedSkeleton />;
  }

  if (activities.length === 0) {
    return <EmptyActivityFeed />;
  }

  // Group activities by date
  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <div className="recent-activity-feed">
      <h3>Recent Activity</h3>
      
      <div className="activity-timeline">
        {Object.entries(groupedActivities).map(([date, items]) => (
          <div key={date} className="activity-group">
            <div className="date-header">
              <span className="date-label">{formatDateHeader(date)}</span>
              <div className="date-line" />
            </div>
            
            <div className="activity-items">
              {items.map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  index={index}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="view-all-button">
        View All Activity
      </button>
    </div>
  );
}

// ============================================================================
// ACTIVITY CARD
// ============================================================================

function ActivityCard({
  activity,
  index
}: {
  activity: ActivityItem;
  index: number;
}) {
  return (
    <motion.div
      className={`activity-card ${activity.type}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div
        className="activity-icon"
        style={{ backgroundColor: activity.color }}
      >
        {activity.icon}
      </div>
      
      <div className="activity-content">
        <div className="activity-header">
          <h4 className="activity-title">{activity.title}</h4>
          <span className="activity-time">
            {formatTime(activity.timestamp)}
          </span>
        </div>
        <p className="activity-description">{activity.description}</p>
        
        {/* Type-specific content */}
        {activity.type === 'tier_upgrade' && (
          <TierUpgradeDetails metadata={activity.metadata} />
        )}
        {activity.type === 'credit_earned' && (
          <CreditDetails metadata={activity.metadata} earned />
        )}
        {activity.type === 'credit_spent' && (
          <CreditDetails metadata={activity.metadata} earned={false} />
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// TYPE-SPECIFIC DETAILS
// ============================================================================

function TierUpgradeDetails({
  metadata
}: {
  metadata: Record<string, unknown>;
}) {
  const newTier = metadata.newTier as TierLevel;
  const tierConfig = CRYSTAL_CIRCLE_TIERS[newTier];
  
  return (
    <div className="tier-upgrade-preview" style={{ borderColor: tierConfig.color }}>
      <span className="tier-icon">{getTierEmoji(tierConfig.icon)}</span>
      <div className="tier-details">
        <span className="tier-name" style={{ color: tierConfig.color }}>
          {tierConfig.name}
        </span>
        <span className="tier-benefit-count">
          {(metadata.newBenefits as string[])?.length || 0} new benefits
        </span>
      </div>
    </div>
  );
}

function CreditDetails({
  metadata,
  earned
}: {
  metadata: Record<string, unknown>;
  earned: boolean;
}) {
  const amount = metadata.amount as number;
  const newBalance = metadata.newBalance as number;
  
  return (
    <div className="credit-details">
      <span className={`credit-amount ${earned ? 'earned' : 'spent'}`}>
        {earned ? '+' : '-'}${amount.toFixed(2)}
      </span>
      <span className="credit-balance">
        Balance: ${newBalance?.toFixed(2) || '0.00'}
      </span>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateActivityFeed(
  profile: Awaited<ReturnType<typeof getCustomerRewardsProfile>>
): ActivityItem[] {
  const activities: ActivityItem[] = [];

  // Add tier achievement
  if (profile.currentTier !== 'seed') {
    activities.push({
      id: `tier-${profile.customerId}`,
      type: 'tier_upgrade',
      title: `Reached ${CRYSTAL_CIRCLE_TIERS[profile.currentTier].name} Tier`,
      description: 'Congratulations on your tier advancement!',
      timestamp: profile.lastPurchaseDate || new Date(),
      metadata: { newTier: profile.currentTier },
      icon: '🏆',
      color: CRYSTAL_CIRCLE_TIERS[profile.currentTier].color
    });
  }

  // Add charm unlocks
  profile.unlockedCharms.forEach((charmId, index) => {
    if (charmId !== 'all' && CHARM_CATALOG[charmId]) {
      activities.push({
        id: `charm-${charmId}`,
        type: 'charm_unlock',
        title: 'New Charm Collected',
        description: `Added ${CHARM_CATALOG[charmId].name} to your collection`,
        timestamp: new Date(Date.now() - index * 86400000),
        metadata: { charmId },
        icon: '🔮',
        color: '#C9A0DC'
      });
    }
  });

  // Add credit transactions
  profile.creditHistory.forEach((transaction, index) => {
    activities.push({
      id: transaction.id,
      type: transaction.type === 'earned' ? 'credit_earned' : 'credit_spent',
      title: transaction.type === 'earned' ? 'Credit Earned' : 'Credit Used',
      description: transaction.reason,
      timestamp: new Date(transaction.createdAt),
      metadata: {
        amount: transaction.amount,
        newBalance: profile.accountCredit
      },
      icon: transaction.type === 'earned' ? '💰' : '🛒',
      color: transaction.type === 'earned' ? '#4CAF50' : '#FF9800'
    });
  });

  // Add purchase milestone
  if (profile.purchaseCount >= 5) {
    activities.push({
      id: `milestone-${profile.purchaseCount}`,
      type: 'milestone',
      title: `${profile.purchaseCount} Purchases Milestone`,
      description: 'Thank you for your continued loyalty!',
      timestamp: profile.lastPurchaseDate || new Date(),
      metadata: { count: profile.purchaseCount },
      icon: '🎉',
      color: '#FFD700'
    });
  }

  // Sort by timestamp (newest first)
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function groupActivitiesByDate(
  activities: ActivityItem[]
): Record<string, ActivityItem[]> {
  const grouped: Record<string, ActivityItem[]> = {};
  
  activities.forEach(activity => {
    const date = activity.timestamp.toDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(activity);
  });
  
  return grouped;
}

function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

function getTierEmoji(icon: string): string {
  const emojis: Record<string, string> = {
    seedling: '🌱',
    sprout: '🌿',
    flower: '🌸',
    sun: '☀️',
    star: '⭐'
  };
  return emojis[icon] || '✨';
}

// ============================================================================
// SKELETON & EMPTY STATES
// ============================================================================

function ActivityFeedSkeleton() {
  return (
    <div className="recent-activity-feed skeleton">
      <h3>Recent Activity</h3>
      {[1, 2, 3].map(i => (
        <div key={i} className="activity-skeleton">
          <div className="skeleton-icon" />
          <div className="skeleton-content">
            <div className="skeleton-title" />
            <div className="skeleton-description" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyActivityFeed() {
  return (
    <div className="recent-activity-feed empty">
      <h3>Recent Activity</h3>
      <div className="empty-state">
        <span className="empty-icon">📋</span>
        <p>No recent activity to display</p>
        <span className="empty-hint">
          Your rewards activity will appear here
        </span>
      </div>
    </div>
  );
}
