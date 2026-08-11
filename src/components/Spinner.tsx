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
 * button, a cell, a toolbar. Use `Skeleton` when the wait resolves into a known
 * block of content: a skeleton holds the space and stops the page jumping,
 * which a spinner cannot do.
 *
 * The name is carried by `aria-label` *and* by visually hidden text on purpose.
 * `role="status"` takes its name from the author only — text inside it is not
 * a name — so `aria-label` is what gives the element a name in the tree, while
 * the hidden text is what the polite live region actually has to announce when
 * the spinner mounts.
 */
export function Spinner({ size = 'md', label = 'Loading', className }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cx('ny-spinner', `ny-spinner--${size}`, className)}>
      <span className="ny-spinner__ring" aria-hidden="true" />
      <span className="ny-visually-hidden">{label}</span>
    </span>
  )
}
