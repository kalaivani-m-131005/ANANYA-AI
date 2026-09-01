/* ============================================================
   ANANYA-AI — Register Page (Phase 2 structural shell)
   Authentication logic implemented in Phase 3.
   ============================================================ */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import api from '@/services/api'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }
    
    setIsLoading(true)
    
    try {
      const response = await api.post('/auth/register', { name, email, password })
      login(response.data.token, response.data.user)
      navigate('/app/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 px-6 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-lg">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-surface-50 text-lg leading-tight">ANANYA-AI</p>
            <p className="text-xs text-surface-400">Academic Assistant</p>
          </div>
        </div>

        <div
          className="rounded-2xl bg-surface-900 border border-surface-700 p-8 shadow-elevated"
          role="main"
        >
          <h2 className="font-display font-semibold text-2xl text-surface-50 mb-1">
            Create your account
          </h2>
          <p className="text-sm text-surface-400 mb-8">
            Start your bias-aware academic journey today.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ── Form shell (logic wired in Phase 3) ── */}
          <form
            aria-label="Registration form"
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >
            <Input
              id="register-name"
              type="text"
              label="Full name"
              placeholder="Your full name"
              autoComplete="name"
              required
              leftIcon={<User size={16} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />

            <Input
              id="register-email"
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
              id="register-password"
              type="password"
              label="Password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
              leftIcon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <Input
              id="register-confirm-password"
              type="password"
              label="Confirm password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
              leftIcon={<Lock size={16} />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />

            <Button
              id="register-submit"
              type="submit"
              fullWidth
              disabled={isLoading || !name || !email || !password || !confirmPassword}
              className="mt-2"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
              {!isLoading && <ArrowRight size={16} />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
