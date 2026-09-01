/* ============================================================
   ANANYA-AI — Notifications Page (Phase 2 Stub)
   Full implementation in Phase 7.
   ============================================================ */

import { Bell } from 'lucide-react'
import { ComingSoon } from '@/components/ui/ComingSoon'

export default function NotificationsPage() {
  return (
    <ComingSoon
      title="Notifications"
      description="Stay up to date with goal deadlines, AI recommendations, study reminders, and system alerts."
      phase="Phase 7"
      icon={Bell}
      features={[
        'In-app notification feed',
        'Notification categories & filtering',
        'Mark as read / bulk clear',
        'Deadline reminder alerts',
        'AI recommendation notifications',
        'Push notification settings',
      ]}
    />
  )
}
