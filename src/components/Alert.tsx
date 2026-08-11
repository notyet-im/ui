import type { ReactNode } from 'react'
import './Alert.css'
import { Button } from './Button'
import { CloseIcon } from './icons'

export interface AlertProps {
  /**
   * `info` — context the reader did not ask for but benefits from.
   * `success` — an action completed.
   * `warning` — something will go wrong if ignored.
   * `danger` — something already went wrong.
   */
  tone?: 'info' | 'success' | 'warning' | 'danger'
  /** Short summary line. Omit for a one-sentence alert and put the text in `children`. */
  title?: ReactNode
  children?: ReactNode
  /** Decorative glyph shown before the text; it is hidden from assistive tech. */
  icon?: ReactNode
  /** Renders a dismiss control when provided. Omit for an alert the reader cannot clear. */
  onDismiss?: () => void
  className?: string
}

/**
 * A block message about the page, a form, or an operation that just ran.
 *
 * Use `Alert` when the message needs a sentence, a title or a dismiss control;
 * use `Badge` when a one-word state marker on an existing row is enough.
 *
 * The live-region role is derived from the tone, never fixed: `danger` and
 * `warning` render `role="alert"` (assertive — it interrupts whatever the screen
 * reader is saying), while `info` and `success` render `role="status"` (polite —
 * it waits for a pause). Announcing "saved" assertively would cut off the
 * reader mid-sentence for news that could have waited, which is hostile; the
 * inverse, a polite failure, can be missed entirely.
 */
export function Alert({ tone = 'info', title, children, icon, onDismiss, className }: AlertProps) {
  const role = tone === 'danger' || tone === 'warning' ? 'alert' : 'status'

  return (
    <div role={role} className={['ny-alert', `ny-tone--${tone}`, className].filter(Boolean).join(' ')}>
      {icon != null && (
        <span className="ny-alert__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="ny-alert__body">
        {title != null && <p className="ny-alert__title">{title}</p>}
        {children != null && <div className="ny-alert__message">{children}</div>}
      </div>
      {onDismiss != null && (
        <Button
          iconOnly
          label="Dismiss"
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="ny-alert__dismiss"
        >
          <CloseIcon />
        </Button>
      )}
    </div>
  )
}
