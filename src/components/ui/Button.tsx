/* ============================================================
   ANANYA-AI — Button Component
   Reusable, accessible button with variant and size system.
   ============================================================ */

import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

// ── Variants ───────────────────────────────────────────────────
const buttonVariants = cva(
  // Base styles applied to every button
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium rounded-lg',
    'transition-all duration-150 ease-in-out',
    'cursor-pointer select-none',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-600 text-white',
          'hover:bg-brand-500 active:bg-brand-700',
          'focus-visible:outline-brand-400',
          'shadow-sm',
        ],
        secondary: [
          'bg-surface-700 text-surface-50',
          'hover:bg-surface-600 active:bg-surface-800',
          'border border-surface-500',
          'focus-visible:outline-surface-400',
        ],
        ghost: [
          'bg-transparent text-surface-200',
          'hover:bg-surface-800 hover:text-surface-50',
          'focus-visible:outline-surface-400',
        ],
        outline: [
          'bg-transparent border border-brand-500 text-brand-400',
          'hover:bg-brand-950 hover:text-brand-300',
          'focus-visible:outline-brand-400',
        ],
        danger: [
          'bg-red-700 text-white',
          'hover:bg-red-600 active:bg-red-800',
          'focus-visible:outline-red-400',
          'shadow-sm',
        ],
        success: [
          'bg-green-700 text-white',
          'hover:bg-green-600 active:bg-green-800',
          'focus-visible:outline-green-400',
          'shadow-sm',
        ],
      },
      size: {
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

// ── Props ──────────────────────────────────────────────────────
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

// ── Component ──────────────────────────────────────────────────
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled ?? loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span
            className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
