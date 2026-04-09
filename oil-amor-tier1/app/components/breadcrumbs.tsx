'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname)

  if (breadcrumbItems.length === 0) return null

  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn('py-4 px-6 lg:px-12', className)}
    >
      <ol className="flex items-center gap-2 text-sm text-gray-500">
        <li>
          <Link 
            href="/" 
            className="hover:text-miron-void transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-300" />
            {index === breadcrumbItems.length - 1 ? (
              <span className="text-miron-void font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="hover:text-miron-void transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length === 0) return []
  
  const breadcrumbs: BreadcrumbItem[] = []
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Skip IDs (assuming they're slugs with hyphens or numeric)
    if (segment.includes('-') || !isNaN(Number(segment))) {
      // Try to get product name from URL or use a cleaned version
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      breadcrumbs.push({
        label,
        href: currentPath,
      })
    } else {
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
      })
    }
  })
  
  return breadcrumbs
}
