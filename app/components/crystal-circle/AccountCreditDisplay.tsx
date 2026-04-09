'use client';

/**
 * Account Credit Display
 * 
 * Shows current credit balance, transaction history,
 * credit usage toggle, and expiry warnings.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditTransaction,
  getCreditHistory,
  getExpiringCredit
} from '@/oil-amor-tier1/lib/rewards/customer-rewards';

// ============================================================================
// TYPES
// ============================================================================

interface AccountCreditDisplayProps {
  customerId: string;
  balance: number;
  history: CreditTransaction[];
  refillDiscount: number;
}

type TransactionFilter = 'all' | 'earned' | 'spent';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AccountCreditDisplay({
  customerId,
  balance,
  history,
  refillDiscount
}: AccountCreditDisplayProps) {
  const [useCreditOnNextOrder, setUseCreditOnNextOrder] = useState(true);
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Filter transactions
  const filteredHistory = history.filter(t => {
    if (filter === 'earned') return t.type === 'earned';
    if (filter === 'spent') return t.type === 'spent';
    return true;
  });

  const displayedHistory = showAllHistory 
    ? filteredHistory 
    : filteredHistory.slice(0, 5);

  // Calculate stats
  const totalEarned = history
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalSpent = history
    .filter(t => t.type === 'spent')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Check for expiring credit
  const [expiringCredit, setExpiringCredit] = useState<{ amount: number; expiryDate: Date } | null>(null);
  
  React.useEffect(() => {
    const checkExpiring = async () => {
      const expiring = await getExpiringCredit(customerId, 30);
      setExpiringCredit(expiring);
    };
    checkExpiring();
  }, [customerId]);

  return (
    <div className="account-credit-display">
      {/* Credit Balance Card */}
      <CreditBalanceCard
        balance={balance}
        totalEarned={totalEarned}
        totalSpent={totalSpent}
        refillDiscount={refillDiscount}
      />

      {/* Expiry Warning */}
      {expiringCredit && (
        <ExpiryWarning
          amount={expiringCredit.amount}
          expiryDate={expiringCredit.expiryDate}
        />
      )}

      {/* Usage Toggle */}
      <div className="usage-toggle-section">
        <h3>Credit Settings</h3>
        <label className="toggle-label">
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={useCreditOnNextOrder}
              onChange={(e) => setUseCreditOnNextOrder(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </div>
          <span className="toggle-text">
            Use account credit on next order
            <small>Credit will be automatically applied at checkout</small>
          </span>
        </label>
      </div>

      {/* Transaction History */}
      <div className="transaction-history">
        <div className="history-header">
          <h3>Transaction History</h3>
          <div className="filter-tabs">
            {(['all', 'earned', 'spent'] as TransactionFilter[]).map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="transactions-list">
          <AnimatePresence mode="wait">
            {displayedHistory.length > 0 ? (
              displayedHistory.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                />
              ))
            ) : (
              <motion.div
                className="no-transactions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="empty-icon">📝</span>
                <p>No {filter !== 'all' ? filter + ' ' : ''}transactions yet</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filteredHistory.length > 5 && (
          <button
            className="show-more-button"
            onClick={() => setShowAllHistory(!showAllHistory)}
          >
            {showAllHistory 
              ? 'Show Less' 
              : `Show ${filteredHistory.length - 5} More`
            }
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-button">
            <span className="icon">🛒</span>
            <span>Shop Now</span>
          </button>
          <button className="action-button">
            <span className="icon">🎁</span>
            <span>Send as Gift</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function CreditBalanceCard({
  balance,
  totalEarned,
  totalSpent,
  refillDiscount
}: {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  refillDiscount: number;
}) {
  return (
    <motion.div
      className="credit-balance-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="balance-main">
        <span className="balance-label">Available Credit</span>
        <div className="balance-amount">
          <span className="currency">$</span>
          <motion.span
            className="amount"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={balance}
          >
            {balance.toFixed(2)}
          </motion.span>
        </div>
        {refillDiscount > 0 && (
          <div className="refill-badge">
            <span className="discount">{refillDiscount}% OFF</span>
            <span>all refills</span>
          </div>
        )}
      </div>

      <div className="balance-stats">
        <div className="stat">
          <span className="stat-label">Total Earned</span>
          <span className="stat-value positive">+${totalEarned.toFixed(2)}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-label">Total Spent</span>
          <span className="stat-value negative">-${totalSpent.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ExpiryWarning({
  amount,
  expiryDate
}: {
  amount: number;
  expiryDate: Date;
}) {
  const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      className="expiry-warning"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <span className="warning-icon">⏰</span>
      <div className="warning-content">
        <p className="warning-title">Credit Expiring Soon</p>
        <p className="warning-text">
          <strong>${amount.toFixed(2)}</strong> will expire in{' '}
          <strong>{daysLeft} day{daysLeft > 1 ? 's' : ''}</strong> ({expiryDate.toLocaleDateString()})
        </p>
      </div>
      <button className="use-now-button">Use Now</button>
    </motion.div>
  );
}

function TransactionRow({
  transaction,
  index
}: {
  transaction: CreditTransaction;
  index: number;
}) {
  const isEarned = transaction.type === 'earned';
  const isExpired = transaction.type === 'expired';
  
  const typeIcons: Record<string, string> = {
    earned: '💰',
    spent: '🛒',
    expired: '⏰',
    adjusted: '⚙️'
  };

  return (
    <motion.div
      className={`transaction-row ${transaction.type}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="transaction-icon">{typeIcons[transaction.type]}</div>
      
      <div className="transaction-details">
        <span className="transaction-reason">{transaction.reason}</span>
        {transaction.orderId && (
          <span className="transaction-order">Order {transaction.orderId.slice(-8)}</span>
        )}
        <span className="transaction-date">
          {new Date(transaction.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="transaction-amount">
        <span className={`amount ${isEarned ? 'positive' : isExpired ? 'expired' : 'negative'}`}>
          {isEarned ? '+' : ''}{transaction.amount.toFixed(2)}
        </span>
        {transaction.expiresAt && (
          <span className="expiry-date">
            Expires {new Date(transaction.expiresAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// STYLES
// ============================================================================

// CSS styles would be in a separate CSS/SCSS file:
/*
.account-credit-display {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.credit-balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
}

.balance-amount {
  font-size: 3rem;
  font-weight: 700;
}

.transaction-row {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.transaction-row.earned .amount { color: #4caf50; }
.transaction-row.spent .amount { color: #f44336; }
.transaction-row.expired .amount { color: #9e9e9e; }
*/
