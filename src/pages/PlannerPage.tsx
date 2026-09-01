/* ============================================================
   ANANYA-AI — Study Planner Page (Phase 2 Stub)
   Full implementation in Phase 4.
   ============================================================ */

import { Calendar } from 'lucide-react'
import { ComingSoon } from '@/components/ui/ComingSoon'

export default function PlannerPage() {
  return (
    <ComingSoon
      title="Study Planner"
      description="Plan your study sessions on a weekly calendar, track hours studied, and let AI optimise your schedule."
      phase="Phase 4"
      icon={Calendar}
      features={[
        'Weekly & monthly calendar view',
        'Drag-and-drop session scheduling',
        'Subject colour coding',
        'Study hours analytics',
        'AI schedule optimisation',
      ]}
    />
  )
}
