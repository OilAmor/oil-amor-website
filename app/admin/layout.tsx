import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth/admin-session'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  if (!session.isAdmin) {
    redirect('/admin/login')
  }

  return <>{children}</>
}
