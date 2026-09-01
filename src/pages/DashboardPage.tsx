/* ============================================================
   ANANYA-AI — Dashboard Page (Phase 2 Stub)
   Full implementation in Phase 7.
   ============================================================ */

import { LayoutDashboard } from 'lucide-react'
import { ComingSoon } from '@/components/ui/ComingSoon'

export default function DashboardPage() {
  return (
    <ComingSoon
      title="Dashboard"
      description="Your personalised academic command centre. See goals, tasks, AI recommendations, and performance analytics at a glance."
      phase="Phase 7"
      icon={LayoutDashboard}
      features={[
        'Goal progress overview',
        'Upcoming task timeline',
        'AI recommendation widgets',
        'Study streak tracker',
        'Recent AI conversations',
        'Bias fairness score card',
      ]}
    />
  )
}
