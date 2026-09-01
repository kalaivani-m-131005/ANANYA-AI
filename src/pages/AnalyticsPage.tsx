/* ============================================================
   ANANYA-AI — Analytics Page (Phase 2 Stub)
   Full implementation in Phase 6.
   ============================================================ */

import { BarChart3 } from 'lucide-react'
import { ComingSoon } from '@/components/ui/ComingSoon'

export default function AnalyticsPage() {
  return (
    <ComingSoon
      title="Performance Analytics"
      description="Visualise your academic performance over time with rich charts, study trends, and AI-generated insights."
      phase="Phase 6"
      icon={BarChart3}
      features={[
        'Study hours line charts',
        'Subject performance radar chart',
        'Goal completion rate trends',
        'Comparative peer analytics (anonymised)',
        'AI narrative performance summary',
        'Fairness score breakdown',
      ]}
    />
  )
}
