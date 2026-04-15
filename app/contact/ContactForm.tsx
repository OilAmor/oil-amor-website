'use client'

import { useState } from 'react'
import { logger } from '@/lib/logging/logger'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send message')
      }

      setIsSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      logger.info('Contact form submitted', { email: formData.email })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message'
      setError(message)
      logger.error('Contact form error', err as Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isSuccess) {
    return (
      <div className="p-10 rounded-2xl bg-[#111] border border-[#c9a227]/20 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#c9a227]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#c9a227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-[#f5f3ef] mb-3">
          Message sent
        </h3>
        <p className="text-[#a69b8a] mb-8 max-w-md mx-auto">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-6 py-3 rounded-full border border-[#f5f3ef]/20 text-[#f5f3ef] text-sm font-medium hover:border-[#c9a227]/50 hover:text-[#c9a227] transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-xs uppercase tracking-[0.15em] text-[#a69b8a]">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-[#0a080c] border border-[#262228] rounded-xl px-4 py-3.5 text-[#f5f3ef] placeholder:text-[#a69b8a]/40 focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/20 transition-all"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs uppercase tracking-[0.15em] text-[#a69b8a]">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-[#0a080c] border border-[#262228] rounded-xl px-4 py-3.5 text-[#f5f3ef] placeholder:text-[#a69b8a]/40 focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/20 transition-all"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="block text-xs uppercase tracking-[0.15em] text-[#a69b8a]">
          Subject
        </label>
        <div className="relative">
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full bg-[#0a080c] border border-[#262228] rounded-xl px-4 py-3.5 text-[#f5f3ef] focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/20 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select a subject</option>
            <option value="general">General inquiry</option>
            <option value="order">Order question</option>
            <option value="product">Product information</option>
            <option value="wholesale">Wholesale</option>
            <option value="press">Press & media</option>
            <option value="other">Other</option>
          </select>
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a69b8a] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-xs uppercase tracking-[0.15em] text-[#a69b8a]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full bg-[#0a080c] border border-[#262228] rounded-xl px-4 py-3.5 text-[#f5f3ef] placeholder:text-[#a69b8a]/40 focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/20 transition-all resize-none"
          placeholder="How can we help you?"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#d4af37] text-[#0a080c] font-medium hover:from-[#f5e6c8] hover:to-[#c9a227] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            Send Message
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </button>

      <p className="text-[#a69b8a] text-xs text-center">
        By submitting this form, you agree to our{' '}
        <a href="/privacy" className="text-[#c9a227] hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  )
}
