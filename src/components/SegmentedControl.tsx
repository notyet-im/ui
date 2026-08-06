import type { ReactNode } from 'react'
import { useRovingFocus } from '../hooks'
import './SegmentedControl.css'

export interface SegmentedControlItem<T extends string> {
  value: T
  label: ReactNode
  /** Renders the pill inert. The group skips over it — it stays reachable. */
  disabled?: boolean
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
  /** Renders the whole group inert. */
  disabled?: boolean
  className?: string
}

/**
 * A pill group for picking exactly one of a small set of options.
 *
 * Use `SegmentedControl` for filters that change *what the data is*; use `Tabs`
 * for switching between views of the same data.
 *
 * Keyboard: the group is a single tab stop and arrow keys move within it, with
 * selection following focus — the WAI-ARIA `radiogroup` pattern.
 */
export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  variant = 'text',
  label,
  disabled = false,
  className,
}: SegmentedControlProps<T>) {
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  )

  const roving = useRovingFocus({
    count: items.length,
    activeIndex,
    onMove: (index) => {
      const item = items[index]
      if (item != null && item.disabled !== true) onChange(item.value)
    },
  })

  return (
    <div
      className={['ny-segmented', className].filter(Boolean).join(' ')}
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      onKeyDown={disabled ? undefined : roving.onKeyDown}
    >
      {items.map((item, index) => (
        <button
          key={item.value}
          type="button"
          role="radio"
          aria-checked={value === item.value}
          disabled={disabled || item.disabled}
          className={`ny-segmented__item ny-segmented__item--${variant}`}
          onClick={() => onChange(item.value)}
          {...roving.getItemProps(index)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
