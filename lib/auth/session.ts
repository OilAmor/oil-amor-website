import { getIronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { env } from '@/env'

export interface SessionData {
  customerId?: string
  email?: string
  firstName?: string
  lastName?: string
  isLoggedIn: boolean
}

if (!env.IRON_SESSION_PASSWORD) {
  throw new Error('IRON_SESSION_PASSWORD is required and must be at least 32 characters')
}

const password = env.IRON_SESSION_PASSWORD

export const sessionOptions: SessionOptions = {
  cookieName: 'oilamor_session',
  password,
  cookieOptions: {
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session.isLoggedIn || !session.customerId) {
    throw new Error('Unauthorized')
  }
  return session
}
