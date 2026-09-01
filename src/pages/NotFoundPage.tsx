/* ============================================================
   ANANYA-AI — 404 Not Found Page
   ============================================================ */

import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-950 px-6 py-12 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-800 border border-surface-700">
        <AlertTriangle size={36} className="text-amber-400" />
      </div>

      <h1 className="font-display font-bold text-6xl text-surface-700 mb-4">404</h1>
      <h2 className="font-display font-semibold text-2xl text-surface-50 mb-3">Page not found</h2>
      <p className="text-surface-400 max-w-sm mb-8 leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        to="/app/dashboard"
        className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors"
      >
        <Home size={16} />
        Back to Dashboard
      </Link>
    </div>
  )
}
