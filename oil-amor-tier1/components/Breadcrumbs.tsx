/**
 * Breadcrumbs Component
 * Navigation breadcrumbs with schema markup
 */

import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://oilamor.com${item.href}` }),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav aria-label="Breadcrumb" className="py-4">
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-[#a69b8a]">/</span>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-[#a69b8a] hover:text-[#f5f3ef] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#f5f3ef]">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
