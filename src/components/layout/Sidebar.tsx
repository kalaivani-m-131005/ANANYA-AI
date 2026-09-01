/* ============================================================
   ANANYA-AI — Sidebar Component
   Persistent navigation sidebar for the authenticated app shell.
   ============================================================ */

import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Target,
  CheckSquare,
  Calendar,
  Bot,
  BarChart3,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Bell,
  ChevronLeft,
  Sparkles,
  X,
} from 'lucide-react'
import { cn } from '@/utils'
import { Badge } from '@/components/ui'

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
  /** Mobile: sidebar open state */
  mobileOpen: boolean
  onMobileClose: () => void
}

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  badge?: string
  section?: string
}

const NAV_ITEMS: NavItem[] = [
  // ── Core ──
  {
    section: 'Core',
    label: 'Dashboard',
    path: '/app/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'Profile',
    path: '/app/profile',
    icon: <User size={18} />,
  },
  // ── Planning ──
  {
    section: 'Planning',
    label: 'Goals',
    path: '/app/goals',
    icon: <Target size={18} />,
  },
  {
    label: 'Tasks',
    path: '/app/tasks',
    icon: <CheckSquare size={18} />,
  },
  {
    label: 'Study Planner',
    path: '/app/planner',
    icon: <Calendar size={18} />,
  },
  // ── AI ──
  {
    section: 'AI Assistant',
    label: 'AI Chat',
    path: '/app/ai-chat',
    icon: <Bot size={18} />,
    badge: 'AI',
  },
  {
    label: 'Recommendations',
    path: '/app/recommendations',
    icon: <Lightbulb size={18} />,
  },
  {
    label: 'Resources',
    path: '/app/resources',
    icon: <BookOpen size={18} />,
  },
  // ── Insights ──
  {
    section: 'Insights',
    label: 'Analytics',
    path: '/app/analytics',
    icon: <BarChart3 size={18} />,
  },
  // ── Support ──
  {
    section: 'Support',
    label: 'Doubts',
    path: '/app/doubts',
    icon: <HelpCircle size={18} />,
  },
  {
    label: 'Notifications',
    path: '/app/notifications',
    icon: <Bell size={18} />,
    badge: '3',
  },
]

export function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation()

  // Group items by section
  const sections: { title: string; items: NavItem[] }[] = []
  let currentSection = { title: '', items: [] as NavItem[] }

  for (const item of NAV_ITEMS) {
    if (item.section) {
      if (currentSection.items.length > 0) sections.push(currentSection)
      currentSection = { title: item.section, items: [] }
    }
    currentSection.items.push(item)
  }
  if (currentSection.items.length > 0) sections.push(currentSection)

  const sidebarContent = (
    <nav
      aria-label="Main navigation"
      className={cn(
        'flex flex-col h-full bg-surface-900 border-r border-surface-700',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* ── Logo ── */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 border-b border-surface-700',
          'h-16 shrink-0 overflow-hidden',
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600">
          <Sparkles size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display font-bold text-surface-50 text-sm leading-tight truncate">
              ANANYA-AI
            </p>
            <p className="text-[10px] text-surface-400 truncate">Academic Assistant</p>
          </div>
        )}
      </div>

      {/* ── Nav Items ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-1 px-2">
        {sections.map((section) => (
          <div key={section.title} className="mb-2">
            {/* Section label */}
            {!collapsed && section.title && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-surface-500 select-none">
                {section.title}
              </p>
            )}
            {collapsed && section.title && (
              <hr className="border-surface-700 my-2 mx-1" />
            )}

            {section.items.map((item) => {
              const isActive =
                item.path === '/app/dashboard'
                  ? location.pathname === '/app' || location.pathname === '/app/dashboard'
                  : location.pathname.startsWith(item.path)

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2',
                    'text-sm transition-colors duration-150',
                    'group relative',
                    isActive
                      ? 'bg-brand-700/30 text-brand-300 font-medium'
                      : 'text-surface-300 hover:bg-surface-800 hover:text-surface-100',
                    collapsed && 'justify-center px-2',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-brand-400" />
                  )}

                  <span className="shrink-0">{item.icon}</span>

                  {!collapsed && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <Badge variant="primary" className="ml-auto shrink-0 text-[10px]">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <span
                      role="tooltip"
                      className={cn(
                        'pointer-events-none absolute left-full ml-2 z-50',
                        'rounded-md bg-surface-700 border border-surface-600',
                        'px-2 py-1 text-xs text-surface-100 shadow-float whitespace-nowrap',
                        'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </div>

      {/* ── Collapse Toggle (desktop only) ── */}
      <div className="shrink-0 border-t border-surface-700 p-2">
        <button
          onClick={() => onCollapse(!collapsed)}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-3 py-2',
            'text-xs text-surface-400 hover:bg-surface-800 hover:text-surface-200',
            'transition-colors duration-150',
            collapsed && 'justify-center',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={16}
            className={cn('transition-transform duration-300', collapsed && 'rotate-180')}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>

      {/* ── Mobile close button ── */}
      {mobileOpen && (
        <button
          className="absolute top-4 right-4 text-surface-400 hover:text-surface-100 lg:hidden"
          onClick={onMobileClose}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      )}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 lg:hidden animate-fade-in relative">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
