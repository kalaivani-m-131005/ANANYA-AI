/* ============================================================
   ANANYA-AI — Shared Page Stub Component
   Used as a placeholder for unimplemented pages in Phase 2.
   Replaced with real implementations in later phases.
   ============================================================ */

import { type LucideIcon, Construction } from 'lucide-react'
import { Badge } from '@/components/ui'

interface ComingSoonProps {
  title: string
  description: string
  phase: string
  icon?: LucideIcon
  features?: string[]
}

export function ComingSoon({
  title,
  description,
  phase,
  icon: Icon = Construction,
  features = [],
}: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-800 border border-surface-700">
        <Icon size={36} className="text-brand-400" />
      </div>

      <Badge variant="primary" className="mb-4">
        Coming in {phase}
      </Badge>

      <h2 className="font-display font-semibold text-2xl text-surface-50 mb-3">{title}</h2>

      <p className="text-surface-400 max-w-md leading-relaxed mb-8">{description}</p>

      {features.length > 0 && (
        <div className="w-full max-w-sm text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-surface-500 mb-3">
            Planned Features
          </p>
          <ul className="space-y-2" aria-label="Planned features">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-surface-400">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
