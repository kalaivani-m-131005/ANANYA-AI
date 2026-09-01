/* ============================================================
   ANANYA-AI — Login Page (Phase 2 structural shell)
   Authentication logic implemented in Phase 3.
   ============================================================ */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import api from '@/services/api'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const response = await api.post('/auth/login', { email, password })
      login(response.data.token, response.data.user)
      navigate('/app/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: brand ── */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-between p-12 bg-surface-900 border-r border-surface-700 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-lg">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-surface-50 text-lg leading-tight">ANANYA-AI</p>
            <p className="text-xs text-surface-400">Academic Assistant</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <blockquote>
            <p className="font-display text-3xl font-semibold text-surface-50 leading-snug mb-4">
              "Your Academic Journey,<br />
              <span className="text-brand-400">Powered by Fair AI.</span>"
            </p>
            <p className="text-surface-400 text-sm leading-relaxed max-w-sm">
              A bias-aware academic support platform that gives every student an equal,
              personalised path to success.
            </p>
          </blockquote>
        </div>

        {/* Features list */}
        <div className="relative z-10">
          {[
            'AI-powered personalised guidance',
            'Bias-aware recommendations',
            'Smart study planning',
            'Performance analytics',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" aria-hidden="true" />
              <span className="text-sm text-surface-400">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-surface-950">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
            <Sparkles size={18} className="text-white" />
          </div>
          <p className="font-display font-bold text-surface-50 text-lg">ANANYA-AI</p>
        </div>

        <div className="w-full max-w-sm animate-fade-in">
          <h2 className="font-display font-semibold text-2xl text-surface-50 mb-1">Welcome back</h2>
          <p className="text-sm text-surface-400 mb-8">Sign in to continue your academic journey.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ── Form shell (logic wired in Phase 3) ── */}
          <form
            aria-label="Login form"
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >
            <Input
              id="login-email"
              type="email"
              label="Email address"
              placeholder="you@university.ac.in"
              autoComplete="email"
              required
              leftIcon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <Input
              id="login-password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              leftIcon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-surface-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-surface-600 bg-surface-800 text-brand-600"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-brand-400 hover:text-brand-300 transition-colors opacity-60"
              >
                Forgot password?
              </button>
            </div>

            <Button
              id="login-submit"
              type="submit"
              fullWidth
              disabled={isLoading || !email || !password}
              className="mt-2"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              {!isLoading && <ArrowRight size={16} />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
