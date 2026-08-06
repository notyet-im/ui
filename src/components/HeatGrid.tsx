import type { CSSProperties } from 'react'
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
 * Cells are buttons: this grid is a drill-down control, not just a readout.
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

  return (
    <div className={['ny-heat-grid', className].filter(Boolean).join(' ')} style={{ minHeight, ...style }}>
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
            const cellValue = value(row.key, column.key)
            const key = cellKey(row.key, column.key)
            const tone = heatStyle(cellValue, resolvedMax)
            const selected = key === selectedKey
            return (
              <button
                type="button"
                key={key}
                aria-pressed={selected}
                aria-label={`${row.code} ${column.label}`}
                className={`ny-heat-grid__cell${selected ? ' ny-heat-grid__cell--selected' : ''}`}
                style={{ background: tone.background, color: tone.color, fontSize: cellFontSize }}
                onClick={() => onSelect?.(key, row.key, column.key)}
              >
                {cellValue ? format(cellValue) : emptyText}
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
  const resolvedMax =
    max ?? codes.reduce((acc, from) => codes.reduce((inner, to) => Math.max(inner, value(from, to)), acc), 0)

  return (
    <div className={['ny-matrix', className].filter(Boolean).join(' ')}>
      <div className="ny-matrix__header">
        <div className="ny-matrix__corner" />
        {codes.map((code) => (
          <div key={code} className="ny-matrix__column-label">
            {code}
          </div>
        ))}
      </div>
      {codes.map((from) => (
        <div key={from} className="ny-matrix__row">
          <div className="ny-matrix__row-label">{from}</div>
          {codes.map((to) => {
            const cellValue = value(from, to)
            const diagonal = from === to
            const tone = heatStyle(cellValue, resolvedMax)
            return (
              <div
                key={`${from}->${to}`}
                className="ny-matrix__cell"
                style={{
                  background: diagonal ? 'var(--ny-surface-sunken)' : tone.background,
                  color: diagonal ? 'var(--ny-text-subtle)' : tone.color,
                }}
              >
                {diagonal ? diagonalText : cellValue ? format(cellValue) : emptyText}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
