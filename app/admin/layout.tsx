export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Layout no longer redirects — auth is handled client-side by the dashboard
  // and server-side by API routes. This prevents infinite redirect loops.
  return <>{children}</>
}
