// biome-ignore-all lint/a11y/noRedundantRoles: the table roles below are only
// redundant while the table is laid out as a table. The stacked reflow sets
// `display: block` on <table>, <tbody>, <tr> and <td>, and Chromium drops a
// table's implicit semantics the moment its display type changes — the header
// associations go with them. Naming the roles is the documented fix, and it has
// to be unconditional because CSS, not JS, decides which layout is live.

import type { ReactNode } from 'react'
import './Table.css'

/** Sort direction. Ascending means smallest — or alphabetically first — on top. */
export type TableSortDirection = 'asc' | 'desc'

/** The table's current sort state. */
export interface TableSort {
  /** The `key` of the column currently sorted. */
  key: string
  direction: TableSortDirection
}

/** One column of a {@link Table}, `T` being the row type it reads from. */
export interface TableColumn<T> {
  /** Identity of the column. Also the fallback field read from the row. */
  key: string
  header: ReactNode
  /** Text alignment. Defaults to `end` for `numeric` columns, `start` otherwise. */
  align?: 'start' | 'end'
  /**
   * Renders the column in `--ny-font-numeric` with tabular figures and right
   * alignment. This system is data-dense: a column of unaligned proportional
   * digits is unreadable at a glance, which is the whole point of a table.
   */
  numeric?: boolean
  /** Any CSS width, applied through a `<col>` so it survives `border-collapse`. */
  width?: string
  /** Cell renderer. Without one the column reads `row[key]` and stringifies it. */
  render?: (row: T) => ReactNode
}

/** Props for {@link Table}. */
export interface TableProps<T> {
  columns: ReadonlyArray<TableColumn<T>>
  rows: ReadonlyArray<T>
  /** Stable identity for a row. Required — index keys reorder wrongly on sort. */
  rowKey: (row: T) => string
  /** Rendered in a real `<caption>`; it is the table's accessible name. */
  caption?: ReactNode
  density?: 'compact' | 'default'
  /** Shown in place of the body when `rows` is empty. Default `No results`. */
  empty?: ReactNode
  /** Which column is sorted, and how. Sorting itself stays the caller's job. */
  sort?: TableSort
  /**
   * Supplying this makes every column sortable: its header becomes a `<button>`
   * and the `<th>` carries `aria-sort`. Activating a header toggles direction
   * when it is already the sorted column, and starts at `asc` otherwise.
   */
  onSortChange?: (key: string, direction: TableSortDirection) => void
  className?: string
}

/** Reads `row[key]` for a column with no `render`, without asserting on `T`. */
function readField(row: unknown, key: string): unknown {
  return typeof row === 'object' && row !== null ? (row as Record<string, unknown>)[key] : undefined
}

function cellContent<T>(row: T, column: TableColumn<T>): ReactNode {
  if (column.render != null) return column.render(row)
  const value = readField(row, column.key)
  if (value == null) return null
  if (typeof value === 'string' || typeof value === 'number') return value
  return String(value)
}

function ariaSortFor(key: string, sort?: TableSort): 'ascending' | 'descending' | 'none' {
  if (sort == null || sort.key !== key) return 'none'
  return sort.direction === 'asc' ? 'ascending' : 'descending'
}

/** Toggle on the sorted column, `asc` on any other. */
function nextDirection(key: string, sort?: TableSort): TableSortDirection {
  return sort != null && sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc'
}

const SORT_GLYPH = { ascending: '↑', descending: '↓', none: '↕' } as const

/**
 * A real `<table>` — `<caption>`, `<thead>`, `<th scope="col">` — for tabular
 * data, generic over its row type.
 *
 * Below a narrow **container** width each row reflows into a label/value list,
 * so the table never overflows a sidebar it was dropped into. That reflow is a
 * `@container` query, not a media query, deliberately: what matters is the
 * space the table is actually in, not how wide the window happens to be.
 *
 * Sorting is controlled. `sort` says what the state is and `onSortChange` says
 * the user asked to change it; the caller owns the ordering of `rows`, because
 * only the caller knows whether to sort in memory or refetch.
 */
export function Table<T>({
  columns,
  rows,
  rowKey,
  caption,
  density = 'default',
  empty = 'No results',
  sort,
  onSortChange,
  className,
}: TableProps<T>) {
  const sortable = onSortChange != null
  const hasWidths = columns.some((column) => column.width != null)

  return (
    <div className={['ny-table', `ny-table--${density}`, className].filter(Boolean).join(' ')}>
      <table role="table" className="ny-table__table">
        {caption != null && <caption className="ny-table__caption">{caption}</caption>}
        {hasWidths && (
          <colgroup>
            {columns.map((column) => (
              <col key={column.key} style={{ width: column.width }} />
            ))}
          </colgroup>
        )}
        <thead role="rowgroup" className="ny-table__head">
          <tr role="row" className="ny-table__row">
            {columns.map((column) => {
              const align = column.align ?? (column.numeric ? 'end' : 'start')
              const state = ariaSortFor(column.key, sort)
              return (
                <th
                  key={column.key}
                  role="columnheader"
                  scope="col"
                  aria-sort={sortable ? state : undefined}
                  className={`ny-table__header-cell ny-table__header-cell--${align}`}
                >
                  {sortable ? (
                    <button
                      type="button"
                      className="ny-table__sort"
                      onClick={() => onSortChange?.(column.key, nextDirection(column.key, sort))}
                    >
                      <span>{column.header}</span>
                      <span className="ny-table__sort-icon" aria-hidden="true">
                        {SORT_GLYPH[state]}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody role="rowgroup" className="ny-table__body">
          {rows.length === 0 ? (
            <tr role="row" className="ny-table__row">
              <td role="cell" colSpan={columns.length} className="ny-table__cell ny-table__empty">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} role="row" className="ny-table__row">
                {columns.map((column) => {
                  const align = column.align ?? (column.numeric ? 'end' : 'start')
                  const classes = [
                    'ny-table__cell',
                    `ny-table__cell--${align}`,
                    column.numeric === true && 'ny-table__cell--numeric',
                  ].filter(Boolean)
                  return (
                    <td
                      key={column.key}
                      role="cell"
                      className={classes.join(' ')}
                      data-label={typeof column.header === 'string' ? column.header : undefined}
                    >
                      {/*
                       * The stacked layout shows the column header beside each
                       * value. A string header rides on `data-label` and is
                       * drawn by a `::before`, because a real element would be
                       * one hidden node per cell — on a 200-row six-column
                       * table that was 1,200 spans, a third of the body's DOM,
                       * invisible at every width above the reflow point.
                       *
                       * A `ReactNode` header cannot be an attribute, so it
                       * keeps the span. Either way it stays out of the
                       * accessibility tree: the `<th>` association already
                       * carries the header, and announcing it twice would read
                       * every column name on every row.
                       */}
                      {typeof column.header !== 'string' && (
                        <span className="ny-table__label" aria-hidden="true">
                          {column.header}
                        </span>
                      )}
                      <span className="ny-table__value">{cellContent(row, column)}</span>
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
