'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="text-6xl text-gold-pure mb-6 block">◈</span>
        <h1 className="font-display text-4xl text-miron-void mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Please try again or return to the atelier.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-miron-void text-white text-sm uppercase tracking-wide hover:bg-gold-pure hover:text-miron-void transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-miron-void text-miron-void text-sm uppercase tracking-wide hover:bg-miron-void hover:text-white transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
