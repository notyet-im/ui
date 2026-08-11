import type { ReactNode } from 'react'
import { useRovingFocus } from '../hooks'
import './Tabs.css'
import { cx } from '../lib/cx'

export interface TabItem<T extends string> {
  value: T
  label: ReactNode
  /** Renders the tab inert. */
  disabled?: boolean
}

export interface TabsProps<T extends string> {
  items: ReadonlyArray<TabItem<T>>
  value: T
  onChange: (value: T) => void
  /** Accessible name for the tab list. */
  label?: string
  /**
   * `id` of the element this tab list controls, so assistive technology can
   * follow the relationship. Give your panel element the same `id` and
   * `role="tabpanel"`; `Tabs` renders only the strip.
   */
  panelId?: string
  className?: string
}

/**
 * Underlined tabs for switching the primary view of a panel.
 *
 * Use this for mutually exclusive *views of the same data*; use
 * `SegmentedControl` for filters that change what the data is.
 *
 * Keyboard: the strip is a single tab stop and arrow keys move within it, with
 * selection following focus — the WAI-ARIA `tablist` pattern.
 */
export function Tabs<T extends string>({ items, value, onChange, label, panelId, className }: TabsProps<T>) {
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
    <div className={cx('ny-tabs', className)} role="tablist" aria-label={label} onKeyDown={roving.onKeyDown}>
      {items.map((item, index) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          aria-controls={panelId}
          disabled={item.disabled}
          className="ny-tabs__tab"
          onClick={() => onChange(item.value)}
          {...roving.getItemProps(index)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
