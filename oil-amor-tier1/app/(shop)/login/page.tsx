'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight,
  Crown,
  Sparkles
} from 'lucide-react'
import { useUser } from '@/lib/context/user-context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, loginDemo } = useUser()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      router.push('/account')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    loginDemo()
    router.push('/account')
  }

  return (
    <main className="min-h-screen bg-[#0a080c] pt-32 pb-16">
      <div className="max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-[#c9a227]" />
          </div>
          <h1 className="font-serif text-3xl text-[#f5f3ef] mb-2">Welcome Back</h1>
          <p className="text-[#a69b8a]">Sign in to access your collection</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-[#111] border border-[#f5f3ef]/10"
        >
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[#a69b8a] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a69b8a]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0a080c] border border-[#f5f3ef]/10 text-[#f5f3ef] placeholder:text-[#a69b8a]/50 focus:border-[#c9a227] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#a69b8a] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a69b8a]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#0a080c] border border-[#f5f3ef]/10 text-[#f5f3ef] placeholder:text-[#a69b8a]/50 focus:border-[#c9a227] focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a69b8a] hover:text-[#f5f3ef] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#a69b8a] cursor-pointer">
                <input type="checkbox" className="rounded bg-[#0a080c] border-[#f5f3ef]/20" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-[#c9a227] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#c9a227] text-[#0a080c] font-medium hover:bg-[#f5f3ef] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#f5f3ef]/10" />
            <span className="text-xs text-[#a69b8a] uppercase">Or</span>
            <div className="flex-1 h-px bg-[#f5f3ef]/10" />
          </div>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            className="w-full py-3 rounded-xl border border-[#f5f3ef]/20 text-[#f5f3ef] font-medium hover:bg-[#f5f3ef]/5 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#c9a227]" />
            Try Demo Account
          </button>
        </motion.div>

        {/* Sign Up Link */}
        <p className="text-center text-[#a69b8a] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#c9a227] hover:underline">
            Create one
          </Link>
        </p>

        {/* Back Link */}
        <Link 
          href="/"
          className="block text-center text-sm text-[#a69b8a] hover:text-[#f5f3ef] mt-8 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  )
}
