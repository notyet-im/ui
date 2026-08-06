import type { ReactNode, Ref } from 'react'
import './Button.css'

export interface ButtonProps {
  /**
   * `primary` — the one affirmative action on a surface. Solid accent fill.
   * `secondary` — the default. Bordered, sits on the surface without shouting.
   * `ghost` — borderless, for dense toolbars and inline actions.
   * `danger` — destructive. Tinted rather than solid, so the label keeps its
   *   contrast in both themes.
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /**
   * `sm` — 28px, for dense control rows.
   * `md` — 34px, the system default.
   * `lg` — 44px, for touch-first surfaces.
   */
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  /** Swaps the leading icon for a spinner, sets `aria-busy`, and blocks clicks. */
  loading?: boolean
  /** Explicit, because the HTML default (`submit`) surprises people outside forms. */
  type?: 'button' | 'submit' | 'reset'
  /** Decorative glyph before the label. Hidden from assistive tech. */
  iconStart?: ReactNode
  /** Decorative glyph after the label. Hidden from assistive tech. */
  iconEnd?: ReactNode
  /** Stretch to the width of the container — for stacked forms and dialogs. */
  fullWidth?: boolean
  onClick?: () => void
  /** Submitted with the form when this button is the submitter. */
  name?: string
  /** Submitted with the form when this button is the submitter. */
  value?: string
  /** `id` of the form to submit, for buttons rendered outside it. */
  form?: string
  ref?: Ref<HTMLButtonElement>
  children?: ReactNode
  className?: string
}

/** Indeterminate spinner. Local to `Button` so `loading` costs no extra import. */
function ButtonSpinner() {
  return (
    <svg
      className="ny-button__spinner"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  )
}

/**
 * The system's text action.
 *
 * Separate from `IconButton` and `GhostButton`, which are their own published
 * components with their own contracts — this is the general labelled button.
 *
 * `loading` implies `disabled`: a button that is already working should not be
 * able to start the work again, and `aria-busy` tells assistive tech why.
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  iconStart,
  iconEnd,
  fullWidth = false,
  onClick,
  name,
  value,
  form,
  ref,
  children,
  className,
}: ButtonProps) {
  const classes = [
    'ny-button',
    `ny-button--${variant}`,
    `ny-button--${size}`,
    fullWidth && 'ny-button--full',
    className,
  ]
  return (
    <button
      ref={ref}
      type={type}
      name={name}
      value={value}
      form={form}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={classes.filter(Boolean).join(' ')}
    >
      {loading ? (
        <ButtonSpinner />
      ) : (
        iconStart != null && (
          <span className="ny-button__icon" aria-hidden="true">
            {iconStart}
          </span>
        )
      )}
      {children}
      {iconEnd != null && (
        <span className="ny-button__icon" aria-hidden="true">
          {iconEnd}
        </span>
      )}
    </button>
  )
}
