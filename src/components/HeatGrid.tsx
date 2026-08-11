import type { CSSProperties, ReactNode } from 'react'
import { useMemo } from 'react'
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
  /** Tightens the gaps and the minimum cell, for a matrix rather than a table. */
  density?: 'default' | 'compact'
  rowLabelWidth?: string | number
  headerFontSize?: string | number
  cellFontSize?: string | number
  minHeight?: string | number
  className?: string
  style?: CSSProperties
}

/**
 * Dense signed-value grid with a diverging teal/rust ramp.
 *
 * Cells are buttons when `onSelect` is given — the grid is then a drill-down
 * control — and inert `div`s when it is not. That follows from the prop rather
 * than from a flag because a button that does nothing when clicked is an
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
  rowLabelWidth = 92,
  headerFontSize = 'var(--ny-font-size-2xs)',
  cellFontSize = 'var(--ny-font-size-xs)',
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

  const classes = ['ny-heat-grid', `ny-heat-grid--${density}`, className]

  return (
    <div className={classes.filter(Boolean).join(' ')} style={{ minHeight, ...style }}>
      <div className="ny-heat-grid__header">
        <div className="ny-heat-grid__corner" style={{ width: rowLabelWidth }} />
        {columns.map((column) => (
          <div key={column.key} className="ny-heat-grid__column-label" style={{ fontSize: headerFontSize }}>
            {column.label}
          </div>
        ))}
      </div>

      {rows.map((row) => (
        <div key={row.key} className="ny-heat-grid__row">
          <div className="ny-heat-grid__row-label" style={{ width: rowLabelWidth }}>
            <span className="ny-heat-grid__row-code">{row.code}</span>
            {row.name}
          </div>
          {columns.map((column) => {
            const key = cellKey(row.key, column.key)
            const blank = blankDiagonal != null && row.key === column.key
            const cellValue = blank ? 0 : value(row.key, column.key)
            const tone = heatStyle(cellValue, resolvedMax)
            const selected = key === selectedKey
            const content = blank ? blankDiagonal : cellValue ? format(cellValue) : emptyText
            // `fontSize` applies to both branches. The blank diagonal is a cell
            // among cells: letting it inherit rendered the em-dash at body size
            // (14px) beside 2xs (11px) neighbours, on a taller line box.
            const cellStyle: CSSProperties = {
              fontSize: cellFontSize,
              ...(blank
                ? { background: 'var(--ny-surface-sunken)', color: 'var(--ny-text-subtle)' }
                : { background: tone.background, color: tone.color }),
            }

            // Inert unless there is somewhere for a click to go.
            if (onSelect == null || blank) {
              return (
                <div key={key} className="ny-heat-grid__cell" style={cellStyle}>
                  {content}
                </div>
              )
            }
            return (
              <button
                type="button"
                key={key}
                aria-pressed={selected}
                aria-label={`${row.code} ${column.label}`}
                className={`ny-heat-grid__cell${selected ? ' ny-heat-grid__cell--selected' : ''}`}
                style={cellStyle}
                onClick={() => onSelect(key, row.key, column.key)}
              >
                {content}
              </button>
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
  format = (v) => (v / 1000).toFixed(1),
  emptyText = '·',
  diagonalText = '—',
  className,
}: RotationMatrixProps) {
  const axis = useMemo(() => codes.map((code) => ({ key: code, code, label: code })), [codes])

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
      rowLabelWidth={34}
      cellFontSize="var(--ny-font-size-2xs)"
      className={className}
    />
  )
}
