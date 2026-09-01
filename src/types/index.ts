/* ============================================================
   ANANYA-AI — Shared Type Definitions
   Foundation types for Phase 2. Expanded in later phases.
   ============================================================ */

// ── Navigation ────────────────────────────────────────────────
export interface NavItem {
  label: string
  path: string
  icon: string
  /** Badge text shown next to the label (e.g. notification count) */
  badge?: string | number
  children?: NavItem[]
}

// ── API ───────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

// ── Component Variants ────────────────────────────────────────
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'success'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

// ── UI State ──────────────────────────────────────────────────
export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}
