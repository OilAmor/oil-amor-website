/**
 * Structured Data Component
 * Renders JSON-LD schemas for SEO
 */

interface StructuredDataProps {
  schema: Record<string, unknown>
}

export function StructuredData({ schema }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
