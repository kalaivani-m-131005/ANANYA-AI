/* ============================================================
   ANANYA-AI — Root Application Component
   Configures React Router with all foundation routes.
   "Your Academic Journey, Powered by Fair AI."
   ============================================================ */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'

// Layout
import { AppLayout } from '@/components/layout/AppLayout'

// Loading fallback
import { PageLoader } from '@/components/ui/Spinner'

// ── Pages (lazy loaded for performance) ───────────────────────
const LoginPage          = lazy(() => import('@/pages/LoginPage'))
const RegisterPage       = lazy(() => import('@/pages/RegisterPage'))
const DashboardPage      = lazy(() => import('@/pages/DashboardPage'))
const ProfilePage        = lazy(() => import('@/pages/ProfilePage'))
const GoalsPage          = lazy(() => import('@/pages/GoalsPage'))
const TasksPage          = lazy(() => import('@/pages/TasksPage'))
const PlannerPage        = lazy(() => import('@/pages/PlannerPage'))
const AIChatPage         = lazy(() => import('@/pages/AIChatPage'))
const AnalyticsPage      = lazy(() => import('@/pages/AnalyticsPage'))
const RecommendationsPage = lazy(() => import('@/pages/RecommendationsPage'))
const ResourcesPage      = lazy(() => import('@/pages/ResourcesPage'))
const DoubtsPage         = lazy(() => import('@/pages/DoubtsPage'))
const NotificationsPage  = lazy(() => import('@/pages/NotificationsPage'))
const NotFoundPage       = lazy(() => import('@/pages/NotFoundPage'))

// ── Auth Guard ─────────────────────────────────────────────────
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return <>{children}</>;
}

// ── Application ────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<PublicGuard><LoginPage /></PublicGuard>} />
            <Route path="/register" element={<PublicGuard><RegisterPage /></PublicGuard>} />

            {/* ── Authenticated app routes ── */}
            <Route path="/app" element={<AuthGuard><AppLayout /></AuthGuard>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"       element={<DashboardPage />} />
              <Route path="profile"         element={<ProfilePage />} />
              <Route path="goals"           element={<GoalsPage />} />
              <Route path="tasks"           element={<TasksPage />} />
              <Route path="planner"         element={<PlannerPage />} />
              <Route path="ai-chat"         element={<AIChatPage />} />
              <Route path="analytics"       element={<AnalyticsPage />} />
              <Route path="recommendations" element={<RecommendationsPage />} />
              <Route path="resources"       element={<ResourcesPage />} />
              <Route path="doubts"          element={<DoubtsPage />} />
              <Route path="notifications"   element={<NotificationsPage />} />
            </Route>

            {/* ── 404 catch-all ── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
