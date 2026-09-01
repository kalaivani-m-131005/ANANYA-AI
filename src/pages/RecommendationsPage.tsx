/* ============================================================
   ANANYA-AI — Recommendations Page (Phase 2 Stub)
   Full implementation in Phase 6.
   ============================================================ */

import { Lightbulb } from 'lucide-react'
import { ComingSoon } from '@/components/ui/ComingSoon'

export default function RecommendationsPage() {
  return (
    <ComingSoon
      title="Personalised Recommendations"
      description="Receive AI-powered, bias-aware academic recommendations tailored to your learning style, goals, and performance data."
      phase="Phase 6"
      icon={Lightbulb}
      features={[
        'Personalised study strategy suggestions',
        'Explainable recommendation reasoning',
        'Bias fairness score per recommendation',
        'Recommendation history & feedback',
        'Subject-specific resource suggestions',
        'Adaptive difficulty adjustments',
      ]}
    />
  )
}
