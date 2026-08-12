import './Spinner.css'
import { cx } from '../lib/cx'

export interface SpinnerProps {
  /**
   * `sm` — inside a button or a table cell.
   * `md` — the default, for an inline "still working" mark next to text.
   * `lg` — the only thing on an otherwise empty panel.
   */
  size?: 'sm' | 'md' | 'lg'
  /** Accessible name, announced when the spinner appears. Default `Loading`. */
  label?: string
  className?: string
}

/**
 * An indeterminate progress mark, for waits with no measurable percentage.
 *
 * Use `Spinner` when the wait is short and the layout it replaces is small — a
 * button, a cell, a toolbar. Use `Skeleton` when the result has a known shape,
 * because a skeleton holds the space and stops the page jumping.
 *
 * The name is carried by `aria-label` *and* by visually hidden text on purpose:
 * `role="status"` takes its name from the author only, so `aria-label` names the
 * element while the hidden text is what the live region announces on mount.
 */
export function Spinner({ size = 'md', label = 'Loading', className }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cx('ny-spinner', `ny-spinner--${size}`, className)}>
      <span className="ny-spinner__ring" aria-hidden="true" />
      <span className="ny-visually-hidden">{label}</span>
    </span>
  )
}
