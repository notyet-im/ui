import type { CSSProperties, ReactNode } from 'react'
import './Controls.css'
// Select wears `.ny-input`, so its stylesheet has to be loaded alongside this one.
import './Input.css'
import { cx } from '../lib/cx'

/* Inline action ------------------------------------------------------------ */

export interface InlineActionProps {
  onClick?: () => void
  children?: ReactNode
  className?: string
}

/**
 * A low-emphasis action sized for running text — "clear", "reset" and friends.
 *
 * Deliberately *not* a Button size: it is monospace at `--ny-font-size-2xs`,
 * roughly half a control's height, and belongs beside text rather than in a
 * control row. `Button variant="ghost"` is the borderless full-size control.
 */
export function InlineAction({ onClick, children, className }: InlineActionProps) {
  return (
    <button type="button" onClick={onClick} className={cx('ny-inline-action', className)}>
      {children}
    </button>
  )
}

/* Select ------------------------------------------------------------------ */

export interface SelectOption<T extends string> {
  value: T
  label: ReactNode
}

export interface SelectProps<T extends string> {
  options: ReadonlyArray<SelectOption<T>>
  value: T
  onChange: (value: T) => void
  /** Accessible name for the control. */
  label?: string
  className?: string
}

/**
 * A native `<select>` wearing `Input`'s box, with a drawn chevron.
 *
 * It carries `.ny-input` deliberately: the border, radius, fill, hover and
 * disabled treatment are all Input's, so the two controls cannot drift apart.
 * The chevron reuses Input's end-affix, which is already positioned and already
 * lets clicks fall through to the control.
 */
export function Select<T extends string>({ options, value, onChange, label, className }: SelectProps<T>) {
  return (
    <div className={cx('ny-select', className)}>
      <select
        className="ny-select__input ny-input ny-input--md ny-input--with-suffix"
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        width="13"
        height="13"
        fill="none"
        stroke="var(--ny-text-muted)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ny-input-group__affix ny-input-group__affix--end"
        aria-hidden="true"
      >
        <path d="M6 9.5l6 6 6-6" />
      </svg>
    </div>
  )
}

/* Eyebrow ----------------------------------------------------------------- */

export interface EyebrowProps {
  /**
   * `label` — above a page title or a panel section. The default.
   * `tile` — inside a compact stat tile, where the tighter box wants tighter
   *   tracking.
   *
   * There was a third, `kicker`, for the page-title case. It compiled to rules
   * byte-identical to `label`: two names, one rendering, and a prop whose value
   * the stylesheet did not honour.
   */
  variant?: 'label' | 'tile'
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/** Small uppercase monospace label. The system's quietest text role. */
export function Eyebrow({ variant = 'label', children, className, style }: EyebrowProps) {
  return (
    <div className={cx('ny-eyebrow', `ny-eyebrow--${variant}`, className)} style={style}>
      {children}
    </div>
  )
}

/* Legend ------------------------------------------------------------------ */

export interface LegendItem {
  color: string
  label: ReactNode
}

export interface LegendProps {
  items: ReadonlyArray<LegendItem>
  /** Trailing text with no swatch, e.g. a running total. */
  note?: ReactNode
  className?: string
}

/** Colour key for a chart. */
export function Legend({ items, note, className }: LegendProps) {
  return (
    <div className={cx('ny-legend', className)}>
      {items.map((item, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static non-reordering list; LegendItem has no id, label is a ReactNode, colours are not unique
        <span key={i} className="ny-legend__item">
          <span className="ny-legend__swatch" style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
      {note != null && <span style={{ color: 'var(--ny-text-subtle)' }}>{note}</span>}
    </div>
  )
}
