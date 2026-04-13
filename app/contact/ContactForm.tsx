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
      <div className="bg-[#141218] border border-[#262228] p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#c9a227]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#c9a227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl text-[#f5f3ef] mb-3">
          Message sent
        </h3>
        <p className="text-[#a69b8a] mb-6">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-[#c9a227] hover:underline text-sm"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/20 border border-red-900/50 p-4 text-red-200 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-[#141218] border border-[#262228] px-4 py-3 text-[#f5f3ef] focus:outline-none focus:border-[#c9a227] transition-colors"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-[#141218] border border-[#262228] px-4 py-3 text-[#f5f3ef] focus:outline-none focus:border-[#c9a227] transition-colors"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] mb-2">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full bg-[#141218] border border-[#262228] px-4 py-3 text-[#f5f3ef] focus:outline-none focus:border-[#c9a227] transition-colors appearance-none cursor-pointer"
        >
          <option value="">Select a subject</option>
          <option value="general">General inquiry</option>
          <option value="order">Order question</option>
          <option value="product">Product information</option>
          <option value="wholesale">Wholesale</option>
          <option value="press">Press & media</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full bg-[#141218] border border-[#262228] px-4 py-3 text-[#f5f3ef] focus:outline-none focus:border-[#c9a227] transition-colors resize-none"
          placeholder="How can we help you?"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-luxury w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
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
