/* ============================================================
   ANANYA-AI — AI Chat Page (Phase 2 Stub)
   Full implementation in Phase 5.
   ============================================================ */

import { Bot } from 'lucide-react'
import { ComingSoon } from '@/components/ui/ComingSoon'

export default function AIChatPage() {
  return (
    <ComingSoon
      title="AI Academic Assistant"
      description="Have real-time conversations with your AI academic tutor. Get explanations, study tips, and personalised guidance powered by Gemini."
      phase="Phase 5"
      icon={Bot}
      features={[
        'Real-time streaming AI responses',
        'Conversation history & search',
        'Subject-specific assistance',
        'Bias-aware response generation',
        'Code and formula rendering',
        'Export conversation as notes',
      ]}
    />
  )
}
