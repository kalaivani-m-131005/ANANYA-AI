/* ============================================================
   ANANYA-AI — Doubts Page (Phase 2 Stub)
   Full implementation in Phase 7.
   ============================================================ */

import { HelpCircle } from 'lucide-react'
import { ComingSoon } from '@/components/ui/ComingSoon'

export default function DoubtsPage() {
  return (
    <ComingSoon
      title="Doubt Management"
      description="Log academic doubts, get AI-assisted resolutions, and track which concepts need revisiting."
      phase="Phase 7"
      icon={HelpCircle}
      features={[
        'Doubt logging by subject & topic',
        'AI-powered doubt resolution',
        'Doubt status tracking (open/resolved)',
        'Doubt history & patterns',
        'Link doubts to study sessions',
      ]}
    />
  )
}
