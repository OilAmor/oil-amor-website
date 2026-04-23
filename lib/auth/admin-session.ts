import { getIronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { env } from '@/env'

export interface AdminSessionData {
  isAdmin: boolean
  loggedInAt?: string
}

if (!env.ADMIN_SESSION_PASSWORD) {
  throw new Error('ADMIN_SESSION_PASSWORD is required and must be at least 32 characters')
}

const password = env.ADMIN_SESSION_PASSWORD

export const adminSessionOptions: SessionOptions = {
  cookieName: 'oilamor_admin_session',
  password,
  cookieOptions: {
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 hours
  },
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  return getIronSession<AdminSessionData>(cookieStore, adminSessionOptions)
}

export async function requireAdminSession() {
  const session = await getAdminSession()
  if (!session.isAdmin) {
    throw new Error('Unauthorized')
  }
  return session
}
