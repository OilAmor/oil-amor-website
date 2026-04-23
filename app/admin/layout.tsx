import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth/admin-session'
import { headers } from 'next/headers'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()
  
  // Get current pathname to avoid infinite redirect on login page
  const headersList = headers()
  const pathname = headersList.get('x-invoke-path') || headersList.get('next-url') || ''
  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login')
  
  // Only redirect if not authenticated AND not already on login page
  if (!session.isAdmin && !isLoginPage) {
    redirect('/admin/login')
  }

  return <>{children}</>
}
