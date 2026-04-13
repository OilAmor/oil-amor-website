'use client';

/**
 * ForeverBottleCard - Individual bottle card component
 * Displays bottle status, fill level, and action buttons
 */

import React from 'react';
import Image from 'next/image';

import type { ForeverBottle } from '@/lib/refill/forever-bottle';

// ============================================================================
// TYPES
// ============================================================================

interface ForeverBottleCardProps {
  bottle: ForeverBottle;
  onOrderRefill: () => void;
  onGenerateLabel: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const OIL_TYPE_IMAGES: Record<string, string> = {
  'lavender': '/images/oils/lavender.jpg',
  'eucalyptus': '/images/oils/eucalyptus.jpg',
  'peppermint': '/images/oils/peppermint.jpg',
  'tea-tree': '/images/oils/tea-tree.jpg',
  'lemon': '/images/oils/lemon.jpg',
  'frankincense': '/images/oils/frankincense.jpg',
  'rosemary': '/images/oils/rosemary.jpg',
  'orange': '/images/oils/orange.jpg',
};

const OIL_TYPE_COLORS: Record<string, string> = {
  'lavender': '#9b7cb6',
  'eucalyptus': '#5a9a6e',
  'peppermint': '#6bb5a0',
  'tea-tree': '#4a7c59',
  'lemon': '#e8d44d',
  'frankincense': '#c4a77d',
  'rosemary': '#5a8a6e',
  'orange': '#e8a84d',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ForeverBottleCard({
  bottle,
  onOrderRefill,
  onGenerateLabel,
}: ForeverBottleCardProps) {
  const fillPercentage = (bottle.currentFillLevel / 100) * 100;
  const fillColor = getFillColor(fillPercentage);
  const statusConfig = getStatusConfig(bottle.status);
  const oilImage = OIL_TYPE_IMAGES[bottle.oilType.toLowerCase()] || '/images/oils/default.jpg';
  const oilColor = OIL_TYPE_COLORS[bottle.oilType.toLowerCase()] || '#6bb5a0';

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header with Oil Type */}
      <div 
        className="relative h-24 overflow-hidden"
        style={{ backgroundColor: `${oilColor}20` }}
      >
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, ${oilColor}40 0%, transparent 100%)`
          }}
        />
        <div className="relative flex h-full items-center justify-between px-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 capitalize">
              {bottle.oilType}
            </h3>
            <p className="text-sm text-gray-600">{bottle.capacity}</p>
          </div>
          <div className="rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-sm">
            <BottleIcon color={oilColor} />
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute right-3 top-3">
          <StatusBadge status={bottle.status} />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Serial Number */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Serial Number
          </span>
          <span className="font-mono text-sm font-semibold text-gray-900">
            {bottle.serialNumber}
          </span>
        </div>

        {/* Fill Level */}
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-gray-600">Fill Level</span>
            <span className="font-medium text-gray-900">
              {bottle.currentFillLevel}ml / 100ml
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${fillPercentage}%`,
                backgroundColor: fillColor,
              }}
            />
          </div>
          <p className={`mt-1 text-xs ${fillPercentage <= 20 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            {getFillLevelMessage(fillPercentage)}
          </p>
        </div>

        {/* Refill Count */}
        <div className="mb-4 flex items-center gap-2">
          <RefillCountBadge count={bottle.refillCount} />
          {bottle.lastRefillDate && (
            <span className="text-xs text-gray-500">
              Last refill: {formatDate(bottle.lastRefillDate)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {bottle.status === 'active' && fillPercentage <= 30 && (
            <button
              onClick={onOrderRefill}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Order Refill
            </button>
          )}
          
          {bottle.status === 'active' && fillPercentage > 30 && (
            <button
              disabled
              className="flex-1 cursor-not-allowed rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-400"
            >
              Still Full
            </button>
          )}
          
          {bottle.status === 'empty' && (
            <button
              onClick={onOrderRefill}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Order Refill
            </button>
          )}
          
          {bottle.status === 'in-transit' && (
            <button
              disabled
              className="flex-1 cursor-not-allowed rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700"
            >
              In Transit
            </button>
          )}
          
          {bottle.status === 'refilled' && (
            <button
              onClick={onGenerateLabel}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Track Order
            </button>
          )}
          
          {bottle.status === 'retired' && (
            <button
              disabled
              className="flex-1 cursor-not-allowed rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-500"
            >
              Retired
            </button>
          )}
        </div>

        {/* Additional Info */}
        {bottle.returnLabel && bottle.status === 'in-transit' && (
          <div className="mt-3 rounded-lg bg-amber-50 p-3">
            <p className="text-xs text-amber-800">
              <span className="font-medium">Tracking:</span>{' '}
              <a 
                href={`https://auspost.com.au/mypost/track/#/details/${bottle.returnLabel.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-900"
              >
                {bottle.returnLabel.trackingNumber}
              </a>
            </p>
            <p className="mt-1 text-xs text-amber-600">
              Label expires: {formatDate(bottle.returnLabel.expiresAt)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StatusBadge({ status }: { status: ForeverBottle['status'] }) {
  const config = getStatusConfig(status);
  
  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
      ${config.bgColor} ${config.textColor}
    `}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}

function RefillCountBadge({ count }: { count: number }) {
  const milestones = [10, 25, 50];
  const nextMilestone = milestones.find((m) => m > count);
  
  return (
    <div className="group relative">
      <span className={`
        inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
        ${count >= 50 ? 'bg-purple-100 text-purple-800' :
          count >= 25 ? 'bg-blue-100 text-blue-800' :
          count >= 10 ? 'bg-emerald-100 text-emerald-800' :
          'bg-gray-100 text-gray-700'
        }
      `}>
        <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {count} {count === 1 ? 'refill' : 'refills'}
      </span>
      
      {nextMilestone && (
        <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
          {nextMilestone - count} more until {nextMilestone}!
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}

function BottleIcon({ color }: { color: string }) {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 4V8C8 9.10457 8.89543 10 10 10H14C15.1046 10 16 9.10457 16 8V4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 4H17M7 4C5.89543 4 5 4.89543 5 6V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V6C19 4.89543 18.1046 4 17 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 14V14.01M12 17V17.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getFillColor(percentage: number): string {
  if (percentage > 50) return '#10b981'; // emerald-500
  if (percentage >= 20) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
}

function getFillLevelMessage(percentage: number): string {
  if (percentage > 50) return 'Plenty remaining';
  if (percentage >= 20) return 'Getting low - consider refilling soon';
  return 'Almost empty - order refill now';
}

function getStatusConfig(status: ForeverBottle['status']) {
  switch (status) {
    case 'active':
      return {
        label: 'Active',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        dotColor: 'bg-emerald-500',
      };
    case 'empty':
      return {
        label: 'Empty',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
        dotColor: 'bg-amber-500',
      };
    case 'in-transit':
      return {
        label: 'In Transit',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        dotColor: 'bg-blue-500',
      };
    case 'refilled':
      return {
        label: 'Refilled',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        dotColor: 'bg-purple-500',
      };
    case 'retired':
      return {
        label: 'Retired',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        dotColor: 'bg-gray-500',
      };
    default:
      return {
        label: 'Unknown',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        dotColor: 'bg-gray-400',
      };
  }
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
