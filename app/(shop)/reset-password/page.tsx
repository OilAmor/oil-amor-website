'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Crown } from 'lucide-react'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isValidToken, setIsValidToken] = useState(true)

  useEffect(() => {
    if (!token) {
      setIsValidToken(false)
      setError('Invalid or missing reset token')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to reset password')
      }

      setIsSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidToken) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
          <Crown className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="font-serif text-2xl text-[#f5f3ef]">Invalid Reset Link</h2>
        <p className="text-[#a69b8a]">
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a227] text-[#0a080c] rounded-xl font-medium hover:bg-[#f5e6c8] transition-colors"
        >
          Request New Link
        </Link>
      </div>
    )
  }

  return (
    <>
      {!isSuccess ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Password */}
          <div>
            <label className="block text-sm text-[#a69b8a] mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a69b8a]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-[#f5f3ef]/10 rounded-xl py-3 pl-12 pr-12 text-[#f5f3ef] placeholder:text-[#a69b8a]/50 focus:outline-none focus:border-[#c9a227]/50"
                placeholder="Min 8 characters"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a69b8a] hover:text-[#f5f3ef]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-[#a69b8a] mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a69b8a]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#111] border border-[#f5f3ef]/10 rounded-xl py-3 pl-12 pr-4 text-[#f5f3ef] placeholder:text-[#a69b8a]/50 focus:outline-none focus:border-[#c9a227]/50"
                placeholder="Confirm your password"
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
            {isLoading ? 'Resetting...' : 'Reset Password'}
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
          
          <h2 className="font-serif text-2xl text-[#f5f3ef]">Password Reset!</h2>
          
          <p className="text-[#f5f3ef]">
            Your password has been successfully reset.
            Redirecting to login...
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#111] border border-[#f5f3ef]/10 rounded-xl text-[#f5f3ef] hover:bg-[#f5f3ef]/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Login
          </Link>
        </motion.div>
      )}
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#0a080c] pt-32 pb-16">
      <div className="max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-[#c9a227]" />
          </div>
          <h1 className="font-serif text-3xl text-[#f5f3ef] mb-2">
            Create New Password
          </h1>
          <p className="text-[#a69b8a]">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  )
}
