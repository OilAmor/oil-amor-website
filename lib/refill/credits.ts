// =============================================================================
// Credit Management System
// =============================================================================
// Handles credit history, reservations, and transactions
// =============================================================================

import { db } from '@/lib/db'
import { creditReservations, CreditReservation, customerRewards, notifications } from '@/lib/db/schema-refill'
import { eq, and, desc, gt } from 'drizzle-orm'

// =============================================================================
// TYPES
// =============================================================================

export interface CreditHistoryItem {
  id: string
  type: 'earned' | 'used' | 'expired' | 'reserved'
  amount: number
  description: string
  date: Date
  orderId?: string
  bottleId?: string
}

export interface CreditBalance {
  available: number
  reserved: number
  total: number
}

// =============================================================================
// CREDIT HISTORY
// =============================================================================

/**
 * Get credit history for a customer
 */
export async function getCreditHistory(
  customerId: string,
  limit: number = 50
): Promise<CreditHistoryItem[]> {
  // Get reservations as credit history
  const reservations = await db.query.creditReservations.findMany({
    where: eq(creditReservations.customerId, customerId),
    orderBy: [desc(creditReservations.createdAt)],
    limit,
  })
  
  return reservations.map(reservation => ({
    id: reservation.id,
    type: mapReservationStatusToType(reservation.status),
    amount: parseFloat(reservation.amount.toString()),
    description: getReservationDescription(reservation),
    date: reservation.createdAt,
  }))
}

/**
 * Get customer credit balance
 */
export async function getCreditBalance(customerId: string): Promise<CreditBalance> {
  const profile = await db.query.customerRewards.findFirst({
    where: eq(customerRewards.customerId, customerId),
  })
  
  if (!profile) {
    return { available: 0, reserved: 0, total: 0 }
  }
  
  const available = parseFloat(profile.accountCredit.toString())
  const reserved = parseFloat(profile.reservedCredit.toString())
  
  return {
    available,
    reserved,
    total: available + reserved,
  }
}

// =============================================================================
// CREDIT RESERVATIONS
// =============================================================================

/**
 * Reserve credit for a refill order
 */
export async function reserveCredit(
  customerId: string,
  amount: number,
  reservationId: string
): Promise<boolean> {
  const profile = await db.query.customerRewards.findFirst({
    where: eq(customerRewards.customerId, customerId),
  })
  
  if (!profile) {
    return false
  }
  
  const availableCredit = parseFloat(profile.accountCredit.toString())
  
  if (availableCredit < amount) {
    return false
  }
  
  const newAvailable = availableCredit - amount
  const newReserved = parseFloat(profile.reservedCredit.toString()) + amount
  
  // Update customer rewards
  await db.update(customerRewards)
    .set({
      accountCredit: newAvailable.toString(),
      reservedCredit: newReserved.toString(),
      updatedAt: new Date(),
    })
    .where(eq(customerRewards.customerId, customerId))
  
  // Create reservation record
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour expiration
  
  await db.insert(creditReservations)
    .values({
      id: reservationId,
      customerId,
      amount: amount.toString(),
      status: 'pending',
      expiresAt,
    })
  
  return true
}

/**
 * Commit a credit reservation (apply the credit)
 */
export async function commitCreditReservation(
  reservationId: string
): Promise<boolean> {
  const reservation = await db.query.creditReservations.findFirst({
    where: eq(creditReservations.id, reservationId),
  })
  
  if (!reservation || reservation.status !== 'pending') {
    return false
  }
  
  const profile = await db.query.customerRewards.findFirst({
    where: eq(customerRewards.customerId, reservation.customerId),
  })
  
  if (!profile) {
    return false
  }
  
  const reservedAmount = parseFloat(reservation.amount.toString())
  const newReserved = parseFloat(profile.reservedCredit.toString()) - reservedAmount
  
  await db.update(customerRewards)
    .set({
      reservedCredit: Math.max(0, newReserved).toString(),
      updatedAt: new Date(),
    })
    .where(eq(customerRewards.customerId, reservation.customerId))
  
  await db.update(creditReservations)
    .set({
      status: 'committed',
      committedAt: new Date(),
    })
    .where(eq(creditReservations.id, reservationId))
  
  return true
}

/**
 * Release a credit reservation (return credit to available)
 */
export async function releaseCreditReservation(
  reservationId: string
): Promise<boolean> {
  const reservation = await db.query.creditReservations.findFirst({
    where: eq(creditReservations.id, reservationId),
  })
  
  if (!reservation || reservation.status !== 'pending') {
    return false
  }
  
  const profile = await db.query.customerRewards.findFirst({
    where: eq(customerRewards.customerId, reservation.customerId),
  })
  
  if (!profile) {
    return false
  }
  
  const reservedAmount = parseFloat(reservation.amount.toString())
  const newAvailable = parseFloat(profile.accountCredit.toString()) + reservedAmount
  const newReserved = parseFloat(profile.reservedCredit.toString()) - reservedAmount
  
  await db.update(customerRewards)
    .set({
      accountCredit: newAvailable.toString(),
      reservedCredit: Math.max(0, newReserved).toString(),
      updatedAt: new Date(),
    })
    .where(eq(customerRewards.customerId, reservation.customerId))
  
  await db.update(creditReservations)
    .set({
      status: 'released',
      releasedAt: new Date(),
    })
    .where(eq(creditReservations.id, reservationId))
  
  return true
}

/**
 * Expire old pending reservations
 */
export async function expireOldReservations(): Promise<number> {
  const now = new Date()
  
  const expiredReservations = await db.query.creditReservations.findMany({
    where: and(
      eq(creditReservations.status, 'pending'),
      gt(creditReservations.expiresAt, now)
    ),
  })
  
  for (const reservation of expiredReservations) {
    await releaseCreditReservation(reservation.id)
    
    await db.update(creditReservations)
      .set({
        status: 'expired',
      })
      .where(eq(creditReservations.id, reservation.id))
  }
  
  return expiredReservations.length
}

// =============================================================================
// CREDIT TRANSACTIONS
// =============================================================================

/**
 * Add credit to customer account
 */
export async function addCredit(
  customerId: string,
  amount: number,
  description: string
): Promise<void> {
  const profile = await db.query.customerRewards.findFirst({
    where: eq(customerRewards.customerId, customerId),
  })
  
  if (!profile) {
    throw new Error('Customer profile not found')
  }
  
  const newBalance = parseFloat(profile.accountCredit.toString()) + amount
  
  await db.update(customerRewards)
    .set({
      accountCredit: newBalance.toString(),
      updatedAt: new Date(),
    })
    .where(eq(customerRewards.customerId, customerId))
  
  // Create notification
  await db.insert(notifications)
    .values({
      customerId,
      type: 'credit_added',
      title: 'Credit Added to Your Account',
      message: `$${amount.toFixed(2)} has been added to your account. ${description}`,
    })
}

/**
 * Deduct credit from customer account
 */
export async function deductCredit(
  customerId: string,
  amount: number,
  description: string
): Promise<boolean> {
  const profile = await db.query.customerRewards.findFirst({
    where: eq(customerRewards.customerId, customerId),
  })
  
  if (!profile) {
    return false
  }
  
  const availableCredit = parseFloat(profile.accountCredit.toString())
  
  if (availableCredit < amount) {
    return false
  }
  
  const newBalance = availableCredit - amount
  
  await db.update(customerRewards)
    .set({
      accountCredit: newBalance.toString(),
      updatedAt: new Date(),
    })
    .where(eq(customerRewards.customerId, customerId))
  
  return true
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function mapReservationStatusToType(
  status: string
): 'earned' | 'used' | 'expired' | 'reserved' {
  switch (status) {
    case 'committed':
      return 'used'
    case 'expired':
      return 'expired'
    case 'released':
      return 'earned'
    case 'pending':
    default:
      return 'reserved'
  }
}

function getReservationDescription(reservation: CreditReservation): string {
  switch (reservation.status) {
    case 'committed':
      return 'Credit applied to refill order'
    case 'expired':
      return 'Reservation expired'
    case 'released':
      return 'Credit returned to account'
    case 'pending':
      return 'Credit reserved for pending order'
    default:
      return 'Credit transaction'
  }
}
