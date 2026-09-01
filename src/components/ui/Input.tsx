/* ============================================================
   ANANYA-AI — Input Component
   Accessible text input with label, error, and helper text.
   ============================================================ */

import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  /** Icon placed on the left side of the input */
  leftIcon?: React.ReactNode
  /** Icon placed on the right side of the input */
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, leftIcon, rightIcon, id: propId, type = 'text', ...props },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = propId ?? generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-surface-200"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-400" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full h-10 rounded-lg px-3 text-sm',
              'bg-surface-800 border border-surface-600',
              'text-surface-50 placeholder:text-surface-400',
              'transition-colors duration-150',
              'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              [error && errorId, helperText && helperId].filter(Boolean).join(' ') || undefined
            }
            {...props}
          />

          {rightIcon && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="text-xs text-surface-400">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
