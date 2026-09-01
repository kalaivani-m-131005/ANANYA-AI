/* ============================================================
   ANANYA-AI — Resources Page (Phase 2 Stub)
   Full implementation in Phase 6.
   ============================================================ */

import { BookOpen } from 'lucide-react'
import { ComingSoon } from '@/components/ui/ComingSoon'

export default function ResourcesPage() {
  return (
    <ComingSoon
      title="Learning Resources"
      description="Discover curated learning resources — textbooks, videos, articles, and practice problems — personalised by AI to match your academic needs."
      phase="Phase 6"
      icon={BookOpen}
      features={[
        'Curated resource library',
        'Subject & topic filtering',
        'AI relevance scoring',
        'Bookmark & save resources',
        'Resource quality ratings',
        'Bias-checked content curation',
      ]}
    />
  )
}
