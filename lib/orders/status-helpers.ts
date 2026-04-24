/**
 * Client-Safe Status Helpers
 * 
 * Pure functions for order status display. Safe to import in client components.
 * Does NOT import lib/db or any server-only modules.
 */

import { OrderStatus } from '@/lib/db/schema/orders'

export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: 'gray',
    confirmed: 'blue',
    processing: 'indigo',
    blending: 'amber',
    'quality-check': 'yellow',
    'ready-to-ship': 'teal',
    shipped: 'cyan',
    delivered: 'green',
    cancelled: 'red',
    refunded: 'rose',
  }
  return colors[status] || 'gray'
}

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    blending: 'Mixing',
    'quality-check': 'Quality Check',
    'ready-to-ship': 'Ready to Ship',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  }
  return labels[status] || status
}

export function getNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
  const nextMap: Record<OrderStatus, OrderStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['blending', 'cancelled'],
    processing: ['blending', 'cancelled'],
    blending: ['quality-check', 'cancelled'],
    'quality-check': ['ready-to-ship', 'blending'],
    'ready-to-ship': ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: ['refunded'],
    cancelled: [],
    refunded: [],
  }
  return nextMap[currentStatus] || []
}
