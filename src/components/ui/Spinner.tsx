/* ============================================================
   ANANYA-AI — Spinner Component
   Accessible loading indicator.
   ============================================================ */

import { cn } from '@/utils'

export interface SpinnerProps {
  /** Size in Tailwind units (e.g. 4 = 1rem, 6 = 1.5rem) */
  size?: 4 | 5 | 6 | 8 | 10 | 12
  className?: string
  label?: string
}

const sizeMap: Record<NonNullable<SpinnerProps['size']>, string> = {
  4:  'h-4 w-4 border-2',
  5:  'h-5 w-5 border-2',
  6:  'h-6 w-6 border-2',
  8:  'h-8 w-8 border-[3px]',
  10: 'h-10 w-10 border-[3px]',
  12: 'h-12 w-12 border-4',
}

export function Spinner({ size = 6, className, label = 'Loading…' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <span
        className={cn(
          'rounded-full border-brand-500 border-t-transparent',
          'animate-spin',
          sizeMap[size],
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}

// ── Full-page loading overlay ──────────────────────────────────
export function PageLoader({ label = 'Loading page…' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-950/90 backdrop-blur-sm gap-4"
    >
      <Spinner size={10} />
      <p className="text-sm text-surface-300 animate-pulse-soft">{label}</p>
    </div>
  )
}
