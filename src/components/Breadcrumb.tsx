import type { ReactNode } from 'react'
import './Breadcrumb.css'

/** One step in the trail. */
export interface BreadcrumbItem {
  label: ReactNode
  /** Renders the item as a link. Omit on the last item — it is the current page. */
  href?: string
  /** Renders the item as a button when there is no `href`; also fires on a link. */
  onClick?: () => void
}

/** Props for {@link Breadcrumb}. */
export interface BreadcrumbProps {
  /** Root first, current page last. The last item is never a link. */
  items: ReadonlyArray<BreadcrumbItem>
  /** Accessible name for the `<nav>`. Default `Breadcrumb`. */
  label?: string
  className?: string
}

/**
 * The trail back up the hierarchy: a `<nav>` wrapping an ordered list.
 *
 * The last item is the current page, so it renders as plain text with
 * `aria-current="page"` and never as a link or a button — a control that
 * navigates to where you already are is noise in the tab order, and the APG
 * calls for exactly this. Everything before it is a link when it has an `href`
 * and a button when it only has an `onClick`, so client-side routing does not
 * have to fake anchors.
 */
export function Breadcrumb({ items, label = 'Breadcrumb', className }: BreadcrumbProps) {
  const lastIndex = items.length - 1

  return (
    <nav className={['ny-breadcrumb', className].filter(Boolean).join(' ')} aria-label={label}>
      <ol className="ny-breadcrumb__list">
        {items.map((item, index) => {
          const current = index === lastIndex
          return (
            <li key={item.href ?? `ny-breadcrumb-item-${index}`} className="ny-breadcrumb__item">
              {current && (
                <span className="ny-breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              )}
              {!current && item.href != null && (
                <a className="ny-breadcrumb__link" href={item.href} onClick={item.onClick}>
                  {item.label}
                </a>
              )}
              {!current && item.href == null && (
                <button type="button" className="ny-breadcrumb__link" onClick={item.onClick}>
                  {item.label}
                </button>
              )}
              {!current && (
                <span className="ny-breadcrumb__separator" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
