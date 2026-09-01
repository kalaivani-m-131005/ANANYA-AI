/* ============================================================
   ANANYA-AI — Card Component
   Content container with consistent surface, border, and radius.
   ============================================================ */

import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils'

// ── Card Root ──────────────────────────────────────────────────
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Elevated adds a stronger shadow */
  elevated?: boolean
  /** Bordered adds a visible border */
  bordered?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated = false, bordered = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-surface-900',
          bordered && 'border border-surface-700',
          elevated ? 'shadow-elevated' : 'shadow-card',
          'transition-shadow duration-200',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
Card.displayName = 'Card'

// ── Card Header ────────────────────────────────────────────────
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-5 border-b border-surface-700', className)}
      {...props}
    />
  ),
)
CardHeader.displayName = 'CardHeader'

// ── Card Title ─────────────────────────────────────────────────
const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-semibold text-surface-50 font-display text-lg leading-tight', className)}
      {...props}
    >
      {children}
    </h3>
  ),
)
CardTitle.displayName = 'CardTitle'

// ── Card Description ───────────────────────────────────────────
const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-surface-300 mt-1', className)}
      {...props}
    />
  ),
)
CardDescription.displayName = 'CardDescription'

// ── Card Content ───────────────────────────────────────────────
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-5', className)} {...props} />
  ),
)
CardContent.displayName = 'CardContent'

// ── Card Footer ────────────────────────────────────────────────
const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-t border-surface-700 flex items-center gap-3', className)}
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
