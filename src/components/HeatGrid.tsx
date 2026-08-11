import type { CSSProperties, ReactNode } from 'react'
import { formatCompact } from '../lib/format'
import { heatStyle } from '../lib/heat'
import './HeatGrid.css'

export interface HeatGridRow {
  key: string
  /** Short code shown in monospace, e.g. `KR`. */
  code: string
  /** Full name shown beside the code. Omit on narrow layouts. */
  name?: string
}

export interface HeatGridColumn {
  key: string
  label: string
}

export interface HeatGridProps {
  rows: ReadonlyArray<HeatGridRow>
  columns: ReadonlyArray<HeatGridColumn>
  /** Signed value at an intersection. */
  value: (rowKey: string, columnKey: string) => number
  /** Largest absolute value for normalising the colour ramp. Computed if omitted. */
  max?: number
  /** Cell identity, also used for selection. Default `` `${row}|${column}` ``. */
  cellKey?: (rowKey: string, columnKey: string) => string
  selectedKey?: string | null
  onSelect?: (cellKey: string, rowKey: string, columnKey: string) => void
  /** Formats a non-zero cell. Default `formatCompact`. */
  format?: (value: number) => string
  /** Placeholder for a zero/absent cell. Default `·`. */
  emptyText?: string
  /**
   * Rendered instead of a value where the row and column keys match, on a
   * sunken cell. Only meaningful when both axes are the same set — a from→to
   * matrix, where the diagonal is a thing rotating with itself.
   */
  blankDiagonal?: ReactNode
  /**
   * Tightens the gaps, the minimum cell, the cell type and the row-label width,
   * for a matrix rather than a table. Each of those is a custom property the
   * mode overrides, so `compact` is the whole look and not a starting point.
   */
  density?: 'default' | 'compact'
  /** Overrides the density's label width — for a row whose `name` is hidden. */
  rowLabelWidth?: string | number
  /** Names the grid for assistive tech. Strongly recommended. */
  label?: string
  /**
   * Names the column of row labels — the blank corner above them. It cannot be
   * left empty: a header with no name is one assistive tech reads as missing,
   * and it cannot be dropped either, because then column *n* of each row would
   * line up against column *n−1* of the header.
   */
  rowHeaderLabel?: string
  minHeight?: string | number
  className?: string
  style?: CSSProperties
}

/**
 * Dense signed-value grid with a diverging teal/rust ramp.
 *
 * The structure is a real grid: `row`, `columnheader`, `rowheader`, `gridcell`.
 * That is what carries a cell's meaning — a screen reader reaches "+1.8" and can
 * name the row and column it sits at, from the headers, rather than needing each
 * cell to repeat them.
 *
 * A cell holds a `<button>` when `onSelect` is given, and its value directly
 * when it is not. The button nests inside the cell rather than replacing it: a
 * native button keeps keyboard activation and focus for free, and overriding its
 * role with `gridcell` would have thrown that away. There is no button at all
 * without `onSelect`, because a button that does nothing when clicked is an
 * accessibility defect, not a style.
 */
export function HeatGrid({
  rows,
  columns,
  value,
  max,
  cellKey = (rowKey, columnKey) => `${rowKey}|${columnKey}`,
  selectedKey = null,
  onSelect,
  format = formatCompact,
  emptyText = '·',
  blankDiagonal,
  density = 'default',
  rowLabelWidth,
  label,
  rowHeaderLabel = 'Row',
  minHeight,
  className,
  style,
}: HeatGridProps) {
  const resolvedMax =
    max ??
    rows.reduce(
      (acc, row) =>
        columns.reduce((inner, column) => Math.max(inner, Math.abs(value(row.key, column.key))), acc),
      0,
    )

  const classes = ['ny-heat-grid', density === 'compact' && 'ny-heat-grid--compact', className]

  return (
    <div
      role="grid"
      aria-label={label}
      className={classes.filter(Boolean).join(' ')}
      style={{ minHeight, ...style }}
    >
      <div role="row" className="ny-heat-grid__header">
        <div role="columnheader" className="ny-heat-grid__corner" style={{ width: rowLabelWidth }}>
          {/* Real text, not `aria-label`: an empty header is one assistive tech
              reads as missing, and the corner cannot be dropped either, or
              column n of each row would line up against column n−1 of the
              header. Hidden because sighted readers get it from the row labels
              directly underneath. */}
          <span className="ny-visually-hidden">{rowHeaderLabel}</span>
        </div>
        {columns.map((column) => (
          <div role="columnheader" key={column.key} className="ny-heat-grid__column-label">
            {column.label}
          </div>
        ))}
      </div>

      {rows.map((row) => (
        <div role="row" key={row.key} className="ny-heat-grid__row">
          <div role="rowheader" className="ny-heat-grid__row-label" style={{ width: rowLabelWidth }}>
            <span className="ny-heat-grid__row-code">{row.code}</span>
            {row.name}
          </div>
          {columns.map((column) => {
            const key = cellKey(row.key, column.key)
            const blank = blankDiagonal != null && row.key === column.key
            const cellValue = blank ? 0 : value(row.key, column.key)
            const content = blank ? blankDiagonal : cellValue ? format(cellValue) : emptyText
            // A blanked cell is a zero cell, and `heatStyle` already says what a
            // zero cell looks like — restating it here meant retuning that
            // fallback in `lib/heat.ts` would move every zero cell in every grid
            // except the matrix diagonal, the one that most needs to match.
            const tone = heatStyle(cellValue, resolvedMax)
            const selected = !blank && key === selectedKey
            const classes = `ny-heat-grid__cell${selected ? ' ny-heat-grid__cell--selected' : ''}`

            return (
              <div role="gridcell" key={key} className={classes} style={tone}>
                {/* Inert unless there is somewhere for a click to go. */}
                {onSelect == null || blank ? (
                  content
                ) : (
                  <button
                    type="button"
                    aria-pressed={selected}
                    className="ny-heat-grid__button"
                    onClick={() => onSelect(key, row.key, column.key)}
                  >
                    {content}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/* Rotation matrix --------------------------------------------------------- */

export interface RotationMatrixProps {
  /** Member codes; used for both axes. */
  codes: ReadonlyArray<string>
  /** Directional volume from `row` to `column`. */
  value: (from: string, to: string) => number
  max?: number
  /** Formats a non-zero cell. Default: one decimal of thousands. */
  format?: (value: number) => string
  emptyText?: string
  /** Text for the from===to diagonal. Default `—`. */
  diagonalText?: string
  /** Names the grid for assistive tech. Strongly recommended. */
  label?: string
  /** Names the corner above the row codes. Default `From`. */
  rowHeaderLabel?: string
  className?: string
}

/**
 * Square from→to matrix. The diagonal is deliberately blanked — a market
 * rotating with itself is not a cross-border flow.
 *
 * It is a `HeatGrid` whose two axes are the same set: same header-plus-rows
 * structure, same `heatStyle` ramp, same cell geometry. It used to be a second
 * copy of that render and a second copy of its stylesheet, which had already
 * diverged on whether to take the absolute value when computing the ramp
 * maximum. Kept as its own component because "both axes are this one list" is
 * real knowledge a caller should not have to restate.
 */
export function RotationMatrix({
  codes,
  value,
  max,
  // Unsigned: a rotation matrix holds directional volume, so every cell is
  // positive and a `+` on all of them says nothing. The thousands scale and the
  // ≥9950 rounding still come from `lib/format`, which owns them.
  format = (v) => formatCompact(v, false),
  emptyText = '·',
  diagonalText = '—',
  label,
  rowHeaderLabel = 'From',
  className,
}: RotationMatrixProps) {
  const axis = codes.map((code) => ({ key: code, code, label: code }))

  return (
    <HeatGrid
      rows={axis}
      columns={axis}
      value={value}
      max={max}
      format={format}
      emptyText={emptyText}
      blankDiagonal={diagonalText}
      density="compact"
      label={label}
      rowHeaderLabel={rowHeaderLabel}
      className={className}
    />
  )
}
