/* ============================================================
   ANANYA-AI — Tasks Page (Phase 2 Stub)
   Full implementation in Phase 4.
   ============================================================ */

import { CheckSquare } from 'lucide-react'
import { ComingSoon } from '@/components/ui/ComingSoon'

export default function TasksPage() {
  return (
    <ComingSoon
      title="Tasks"
      description="Organise your daily study tasks, assignment deadlines, and revision schedules with a smart Kanban board."
      phase="Phase 4"
      icon={CheckSquare}
      features={[
        'Kanban-style task board',
        'Task priority & tags',
        'Deadline tracking',
        'AI-suggested task breakdown',
        'Subtask management',
      ]}
    />
  )
}
