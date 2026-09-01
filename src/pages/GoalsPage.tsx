/* ============================================================
   ANANYA-AI — Goals Page (Phase 2 Stub)
   Full implementation in Phase 4.
   ============================================================ */

import { Target } from 'lucide-react'
import { ComingSoon } from '@/components/ui/ComingSoon'

export default function GoalsPage() {
  return (
    <ComingSoon
      title="Goals"
      description="Set, track, and achieve your academic goals with AI-powered suggestions and progress tracking."
      phase="Phase 4"
      icon={Target}
      features={[
        'Create short & long-term goals',
        'Goal progress percentage tracking',
        'AI-suggested sub-goals',
        'Deadline reminders',
        'Goal completion celebrations',
      ]}
    />
  )
}
