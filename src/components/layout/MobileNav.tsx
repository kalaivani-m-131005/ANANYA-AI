/* ============================================================
   ANANYA-AI — Mobile Bottom Navigation
   Tab-bar navigation for small screens (320px–767px).
   ============================================================ */

import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Bot,
  BarChart3,
  Lightbulb,
  User,
} from 'lucide-react'
import { cn } from '@/utils'

interface MobileNavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const MOBILE_NAV: MobileNavItem[] = [
  { label: 'Home',    path: '/app/dashboard',       icon: <LayoutDashboard size={20} /> },
  { label: 'AI',      path: '/app/ai-chat',          icon: <Bot size={20} /> },
  { label: 'Insights',path: '/app/analytics',        icon: <BarChart3 size={20} /> },
  { label: 'Suggest', path: '/app/recommendations',  icon: <Lightbulb size={20} /> },
  { label: 'Profile', path: '/app/profile',          icon: <User size={20} /> },
]

export function MobileNav() {
  const location = useLocation()

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        'fixed bottom-0 inset-x-0 z-40 lg:hidden',
        'bg-surface-900/95 backdrop-blur-md',
        'border-t border-surface-700',
        'safe-area-inset-bottom',
      )}
    >
      <ul className="flex items-stretch h-16" role="list">
        {MOBILE_NAV.map((item) => {
          const isActive =
            item.path === '/app/dashboard'
              ? location.pathname === '/app' || location.pathname === '/app/dashboard'
              : location.pathname.startsWith(item.path)

          return (
            <li key={item.path} className="flex-1">
              <NavLink
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 h-full w-full',
                  'text-[10px] font-medium transition-colors duration-150',
                  isActive
                    ? 'text-brand-400'
                    : 'text-surface-500 hover:text-surface-300',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Icon with active indicator dot */}
                <span className="relative">
                  {item.icon}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-brand-400"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
