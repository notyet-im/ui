import type { CSSProperties, ReactNode } from 'react'
import './Controls.css'

/* Icon button ------------------------------------------------------------- */

export interface IconButtonProps {
  /** Required — the button has no text, so it needs an explicit name. */
  label: string
  onClick?: () => void
  children?: ReactNode
  className?: string
}

/** A square 34px button holding a single icon. */
export function IconButton({ label, onClick, children, className }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={['ny-icon-button', className].filter(Boolean).join(' ')}
    >
      {children}
    </button>
  )
}

/* Ghost button ------------------------------------------------------------ */

export interface GhostButtonProps {
  onClick?: () => void
  children?: ReactNode
  className?: string
}

/** Low-emphasis inline action — "clear", "reset" and friends. */
export function GhostButton({ onClick, children, className }: GhostButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={['ny-ghost-button', className].filter(Boolean).join(' ')}
    >
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

/** A native `<select>` restyled to match the control row, with a drawn chevron. */
export function Select<T extends string>({ options, value, onChange, label, className }: SelectProps<T>) {
  return (
    <div className={['ny-select', className].filter(Boolean).join(' ')}>
      <select
        className="ny-select__input"
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
        className="ny-select__chevron"
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
   * `kicker` — above a page title.
   * `label` — above a panel section.
   * `tile` — inside a compact stat tile.
   */
  variant?: 'kicker' | 'label' | 'tile'
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/** Small uppercase monospace label. The system's quietest text role. */
export function Eyebrow({ variant = 'label', children, className, style }: EyebrowProps) {
  return (
    <div
      className={['ny-eyebrow', `ny-eyebrow--${variant}`, className].filter(Boolean).join(' ')}
      style={style}
    >
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
    <div className={['ny-legend', className].filter(Boolean).join(' ')}>
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
