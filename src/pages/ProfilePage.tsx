/* ============================================================
   ANANYA-AI — Profile Page (Phase 2 Stub)
   Full implementation in Phase 4.
   ============================================================ */

import { User } from 'lucide-react'
import { ComingSoon } from '@/components/ui/ComingSoon'

export default function ProfilePage() {
  return (
    <ComingSoon
      title="Student Profile"
      description="Manage your academic profile, learning preferences, and fairness settings to get the most personalised experience."
      phase="Phase 4"
      icon={User}
      features={[
        'Personal information management',
        'Academic year & stream selection',
        'Learning style preferences',
        'Bias disclosure settings',
        'Profile photo upload',
      ]}
    />
  )
}
