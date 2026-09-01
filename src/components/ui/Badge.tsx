/* ============================================================
   ANANYA-AI — Badge Component
   Inline status/category label with semantic colour variants.
   ============================================================ */

import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5',
    'text-xs font-medium leading-none whitespace-nowrap',
    'border',
  ],
  {
    variants: {
      variant: {
        default:  'bg-surface-700 text-surface-200 border-surface-600',
        primary:  'bg-brand-900/60 text-brand-300 border-brand-700',
        success:  'bg-green-900/60 text-green-300 border-green-700',
        warning:  'bg-amber-900/60 text-amber-300 border-amber-700',
        danger:   'bg-red-900/60 text-red-300 border-red-700',
        info:     'bg-blue-900/60 text-blue-300 border-blue-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
