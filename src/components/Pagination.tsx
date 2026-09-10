import './Pagination.css'
import { cx } from '../lib/cx'

/** One slot in the rendered page list: a page number, or a truncation marker. */
export type PaginationItem = number | 'ellipsis'

/** Props for {@link Pagination}. */
export interface PaginationProps {
  /** 1-based. Clamped into `[1, pageCount]` before anything is rendered. */
  page: number
  pageCount: number
  onChange: (page: number) => void
  /** Pages shown either side of the current one. Default 1. */
  siblingCount?: number
  /** Accessible name for the `<nav>`. Default `Pagination`. */
  label?: string
  className?: string
}

function pageSpan(from: number, to: number): ReadonlyArray<number> {
  return Array.from({ length: Math.max(0, to - from + 1) }, (_unused, offset) => from + offset)
}

/**
 * Builds the page list, with `'ellipsis'` where pages were dropped.
 *
 * Pure, exported and unit-tested directly: the slot arithmetic is the only part
 * of pagination that is genuinely easy to get wrong, and testing it through the
 * rendered DOM would mean asserting on button text to prove a maths bug.
 *
 * The list has a fixed length once truncation kicks in — `2 * siblingCount + 5`
 * (first, last, current, both sibling runs, and two markers) — so the control
 * never changes width as the user pages through. Two markers never end up
 * adjacent, and a marker is never rendered in place of a single hidden page at
 * the ends, because those runs are emitted at full length instead.
 */
export function paginationRange(
  page: number,
  pageCount: number,
  siblingCount = 1,
): ReadonlyArray<PaginationItem> {
  const total = Math.max(0, Math.trunc(pageCount))
  if (total === 0) return []

  const current = Math.min(Math.max(Math.trunc(page), 1), total)
  const siblings = Math.max(0, Math.trunc(siblingCount))
  const maxSlots = siblings * 2 + 5

  if (total <= maxSlots) return pageSpan(1, total)

  const firstSibling = Math.max(current - siblings, 1)
  const lastSibling = Math.min(current + siblings, total)
  const truncateStart = firstSibling > 2
  const truncateEnd = lastSibling < total - 1
  /** first/last + current + both sibling runs, with only one marker to pay for. */
  const runLength = siblings * 2 + 3

  if (!truncateStart && truncateEnd) return [...pageSpan(1, runLength), 'ellipsis', total]
  if (truncateStart && !truncateEnd) return [1, 'ellipsis', ...pageSpan(total - runLength + 1, total)]
  return [1, 'ellipsis', ...pageSpan(firstSibling, lastSibling), 'ellipsis', total]
}

/**
 * Prev/next, drawn rather than typed: a glyph typed as `‹`/`›` inherits the
 * button's numeric face and reads thin and undersized beside the digits.
 *
 * One path, mirrored in CSS for `next`, rather than two coordinate strings that
 * have to be kept reflections of each other by hand. Strokes `currentColor` so
 * it rides the button's own muted → text → disabled ladder, where the chevron
 * `Select` draws pins a single colour. Inline rather than in `icons.tsx`, which
 * is for a shape used by more than one component; Select's carries its own affix
 * classes, size and stroke, so sharing it would mean parameterising three things
 * to save one path. `Pagination.css` sizes and flips it.
 */
function Chevron({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      className={cx('ny-pagination__chevron', direction === 'next' && 'ny-pagination__chevron--next')}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 6l-6 6 6 6" />
    </svg>
  )
}

/**
 * Page navigation for a paged collection: a `<nav>` wrapping a list of page
 * buttons, bracketed by previous/next.
 *
 * Every button carries a spelled-out accessible name (`Go to page 3`) rather
 * than relying on the visible digit, and the current page is marked
 * `aria-current="page"` instead of only being coloured. Previous and next are
 * genuinely `disabled` at the ends — not hidden, so the control does not
 * reflow, and not merely styled, so they leave the tab order.
 */
export function Pagination({
  page,
  pageCount,
  onChange,
  siblingCount = 1,
  label = 'Pagination',
  className,
}: PaginationProps) {
  const total = Math.max(0, Math.trunc(pageCount))
  const current = Math.min(Math.max(Math.trunc(page), 1), Math.max(total, 1))
  const items = paginationRange(current, total, siblingCount)

  return (
    <nav className={cx('ny-pagination', className)} aria-label={label}>
      <ul className="ny-pagination__list">
        <li className="ny-pagination__item">
          <button
            type="button"
            className="ny-pagination__button"
            aria-label="Go to previous page"
            disabled={current <= 1}
            onClick={() => onChange(current - 1)}
          >
            <Chevron direction="prev" />
          </button>
        </li>

        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <li
              key={index === 1 ? 'ny-pagination-gap-start' : 'ny-pagination-gap-end'}
              className="ny-pagination__item"
            >
              <span className="ny-pagination__ellipsis" aria-hidden="true">
                …
              </span>
            </li>
          ) : (
            <li key={item} className="ny-pagination__item">
              <button
                type="button"
                className="ny-pagination__button"
                aria-label={`Go to page ${item}`}
                aria-current={item === current ? 'page' : undefined}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}

        <li className="ny-pagination__item">
          <button
            type="button"
            className="ny-pagination__button"
            aria-label="Go to next page"
            disabled={current >= total}
            onClick={() => onChange(current + 1)}
          >
            <Chevron direction="next" />
          </button>
        </li>
      </ul>
    </nav>
  )
}
