import type { ReactNode } from 'react'
import './Tabs.css'

export interface TabItem<T extends string> {
  value: T
  label: ReactNode
}

export interface TabsProps<T extends string> {
  items: ReadonlyArray<TabItem<T>>
  value: T
  onChange: (value: T) => void
  /** Accessible name for the tab list. */
  label?: string
  className?: string
}

/**
 * Underlined tabs for switching the primary view of a panel.
 *
 * Use this for mutually exclusive *views of the same data*; use
 * `SegmentedControl` for filters that change what the data is.
 */
export function Tabs<T extends string>({ items, value, onChange, label, className }: TabsProps<T>) {
  return (
    <div className={['ny-tabs', className].filter(Boolean).join(' ')} role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          className="ny-tabs__tab"
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
