'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle, Crown } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send reset email')
      }

      setIsSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a080c] pt-32 pb-16">
      <div className="max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-[#c9a227]" />
          </div>
          <h1 className="font-serif text-3xl text-[#f5f3ef] mb-2">
            {isSent ? 'Check Your Email' : 'Reset Password'}
          </h1>
          <p className="text-[#a69b8a]">
            {isSent 
              ? `We've sent a reset link to ${email}` 
              : 'Enter your email to receive a reset link'}
          </p>
        </div>

        {/* Form */}
        {!isSent ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email */}
            <div>
              <label className="block text-sm text-[#a69b8a] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a69b8a]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111] border border-[#f5f3ef]/10 rounded-xl py-3 pl-12 pr-4 text-[#f5f3ef] placeholder:text-[#a69b8a]/50 focus:outline-none focus:border-[#c9a227]/50"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#c9a227] text-[#0a080c] rounded-xl font-medium hover:bg-[#f5e6c8] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-[#a69b8a] hover:text-[#f5f3ef] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-[#2ecc71]/10 border border-[#2ecc71]/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-[#2ecc71]" />
            </div>
            
            <p className="text-[#f5f3ef]">
              Check your inbox for instructions to reset your password.
              The link will expire in 1 hour.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#111] border border-[#f5f3ef]/10 rounded-xl text-[#f5f3ef] hover:bg-[#f5f3ef]/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  )
}
