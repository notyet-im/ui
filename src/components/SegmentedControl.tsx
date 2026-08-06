import type { ReactNode } from 'react'
import './SegmentedControl.css'

export interface SegmentedControlItem<T extends string> {
  value: T
  label: ReactNode
}

export interface SegmentedControlProps<T extends string> {
  items: ReadonlyArray<SegmentedControlItem<T>>
  value: T
  onChange: (value: T) => void
  /**
   * `text` — proportional, for word labels like "Institutional".
   * `mono` — tabular, for code-like labels such as `1D` / `30D` so the pills
   * keep an even rhythm regardless of which is selected.
   */
  variant?: 'text' | 'mono'
  /** Accessible name for the group. */
  label?: string
  className?: string
}

/** A pill group for picking exactly one of a small set of options. */
export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  variant = 'text',
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={['cf-segmented', className].filter(Boolean).join(' ')} role="radiogroup" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="radio"
          aria-checked={value === item.value}
          className={`cf-segmented__item cf-segmented__item--${variant}`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
