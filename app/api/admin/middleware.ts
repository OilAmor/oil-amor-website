// =============================================================================
// Admin API Authentication Middleware
// =============================================================================
// Protects all admin API routes with API key authentication
// =============================================================================

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for admin API key
  const apiKey = request.headers.get('x-admin-api-key')
  
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/admin/:path*'
}
