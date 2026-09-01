/* ============================================================
   ANANYA-AI — Topbar Component
   App-level header: breadcrumb, search hint, user area.
   ============================================================ */

import { Menu, Bell, Search, Sparkles, ChevronRight, LogOut } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { cn } from '@/utils'
import { useAuth } from '@/context/AuthContext'

interface TopbarProps {
  onMobileMenuOpen: () => void
}

// ── Route → readable page title ────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  '/app':                 'Dashboard',
  '/app/dashboard':       'Dashboard',
  '/app/profile':         'Student Profile',
  '/app/goals':           'Goals',
  '/app/tasks':           'Tasks',
  '/app/planner':         'Study Planner',
  '/app/ai-chat':         'AI Academic Assistant',
  '/app/analytics':       'Performance Analytics',
  '/app/recommendations': 'Recommendations',
  '/app/resources':       'Learning Resources',
  '/app/doubts':          'Doubt Management',
  '/app/notifications':   'Notifications',
}

function getPageTitle(pathname: string): string {
  return PAGE_TITLES[pathname] ?? 'ANANYA-AI'
}

function getBreadcrumbs(pathname: string): { label: string; path: string }[] {
  const crumbs = [{ label: 'App', path: '/app' }]
  const title = PAGE_TITLES[pathname]
  if (title && pathname !== '/app' && pathname !== '/app/dashboard') {
    crumbs.push({ label: title, path: pathname })
  }
  return crumbs
}

export function Topbar({ onMobileMenuOpen }: TopbarProps) {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)
  const breadcrumbs = getBreadcrumbs(location.pathname)
  const { user, logout } = useAuth()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 shrink-0',
        'flex items-center gap-4 px-4 lg:px-6',
        'bg-surface-900/80 backdrop-blur-md',
        'border-b border-surface-700',
      )}
    >
      {/* ── Mobile menu toggle ── */}
      <button
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-surface-400 hover:bg-surface-800 hover:text-surface-100 transition-colors"
        onClick={onMobileMenuOpen}
        aria-label="Open navigation menu"
        aria-expanded="false"
      >
        <Menu size={20} />
      </button>

      {/* ── Breadcrumb / Page title ── */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumb trail */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-xs text-surface-500 mb-0.5">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={12} className="text-surface-600" />}
              <span className={i === breadcrumbs.length - 1 ? 'text-surface-400' : 'text-surface-500'}>
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>

        {/* Page title */}
        <h1 className="font-display font-semibold text-surface-50 text-base leading-tight truncate">
          {pageTitle}
        </h1>
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search hint */}
        <button
          className={cn(
            'hidden md:flex items-center gap-2 h-9 px-3 rounded-lg',
            'bg-surface-800 border border-surface-700',
            'text-sm text-surface-400 hover:text-surface-200',
            'transition-colors duration-150',
            'cursor-pointer',
          )}
          aria-label="Search"
        >
          <Search size={15} />
          <span className="text-xs">Search…</span>
          <kbd className="ml-2 rounded border border-surface-600 bg-surface-700 px-1.5 py-0.5 text-[10px] text-surface-400">
            ⌘K
          </kbd>
        </button>

        {/* Notifications bell */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-lg text-surface-400 hover:bg-surface-800 hover:text-surface-100 transition-colors"
          aria-label="Notifications (3 unread)"
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500"
            aria-hidden="true"
          />
        </button>

        {/* User avatar / profile */}
        <button
          className="flex items-center gap-2.5 h-9 px-2 rounded-lg hover:bg-surface-800 transition-colors group"
          aria-label="Open user menu"
          aria-haspopup="true"
        >
          <div className="h-7 w-7 rounded-full bg-brand-700 flex items-center justify-center shrink-0">
            <Sparkles size={14} className="text-brand-200" />
          </div>
          <div className="hidden sm:block text-left min-w-0">
            <p className="text-xs font-medium text-surface-200 leading-tight truncate max-w-[100px]">
              {user?.name || 'Student'}
            </p>
            <p className="text-[10px] text-surface-500 leading-tight">View profile</p>
          </div>
        </button>
        
        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ml-1"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}

