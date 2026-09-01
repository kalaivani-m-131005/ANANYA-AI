/* ============================================================
   ANANYA-AI — App Layout
   The authenticated shell: Sidebar + Topbar + Content area.
   ============================================================ */

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { cn } from '@/utils'

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      {/* ── Sidebar ── */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar onMobileMenuOpen={() => setMobileMenuOpen(true)} />

        {/* Page content */}
        <main
          id="main-content"
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden',
            'px-4 py-6 lg:px-6 lg:py-8',
            // Extra bottom padding on mobile for the bottom tab bar
            'pb-20 lg:pb-8',
          )}
        >
          <Outlet />
        </main>
      </div>

      {/* ── Mobile bottom navigation ── */}
      <MobileNav />
    </div>
  )
}
