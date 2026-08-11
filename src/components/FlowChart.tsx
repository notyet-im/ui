import type { ReactNode } from 'react'
import { useMeasure } from '../hooks'
import { deltaColors } from '../tokens'
import './FlowChart.css'
import { cx } from '../lib/cx'

/**
 * The shell `SankeyFlow` and `RotationRing` are both drawn inside.
 *
 * Internal — not exported from the barrel, so it never becomes its own card.
 * The two charts are genuinely different (a radial ring, a two-column stack)
 * but the frame around them was the same code twice: the measure gate was
 * byte-identical including its comments, and the selection colour and opacity
 * ternaries differed only in the name of the thing being drawn.
 */

/**
 * Ribbon opacity under selection.
 *
 * These were declared per chart and had drifted — the ring dimmed at 0.06 and
 * lifted to 0.55, the Sankey at 0.07 and 0.5, with `RESTING` matching in both.
 * That last agreement is what gave it away: a deliberate difference would not
 * have left one of the three in step. Unified on the Sankey's pair.
 */
const DIMMED = 0.07
const FOCUSED = 0.5
const RESTING = 0.3

/** How strongly to draw an edge, given what is selected. */
export function edgeOpacity(selectedId: string | null, from: string, to: string): number {
  if (selectedId == null) return RESTING
  return from === selectedId || to === selectedId ? FOCUSED : DIMMED
}

/**
 * Teal where the selection is receiving, rust where it is sending, neutral
 * otherwise — the system's data encoding, applied to an edge.
 */
export function edgeColor(selectedId: string | null, from: string, to: string): string {
  if (to === selectedId) return deltaColors.positive
  if (from === selectedId) return deltaColors.negative
  return deltaColors.neutral
}

export interface FlowFieldProps {
  /** Omit to measure the container. See either chart's `width` prop. */
  width?: number
  height: number
  className?: string
  /** Called with a real pixel width — never zero. */
  children: (width: number) => ReactNode
}

/**
 * Measures the container and hands its width to the drawing.
 *
 * The charts lay out in real CSS pixels because their labels are HTML and must
 * not scale, so nothing can be drawn until a width exists. On the measuring
 * path that is one frame, and the ref has to stay attached through it — which
 * is why this renders the same element either way rather than returning early
 * from two places.
 */
export function FlowField({ width, height, className, children }: FlowFieldProps) {
  // Only observe when the caller has not already told us the width.
  const [ref, measured] = useMeasure<HTMLDivElement>(width == null)
  const resolved = width ?? measured.width

  return (
    <div ref={ref} className={cx('ny-flow', className)} style={{ height }}>
      {resolved > 0 && children(resolved)}
    </div>
  )
}

export interface FlowLabelProps {
  /** Absolute placement, straight from the layout. */
  placement: {
    left: number
    top: number
    maxWidth: number
    transform: string
    textAlign: 'left' | 'right'
  }
  onClick?: () => void
  /** The node's name. */
  children: ReactNode
  value: ReactNode
  valueColor: string
  /** Tighter type, for a ring whose labels sit closer together. */
  dense?: boolean
}

/**
 * A node's name and value, positioned beside the drawing.
 *
 * This is the accessible half of both charts: the `<svg>` is `aria-hidden`, so
 * these buttons are what carries the data to assistive tech and to the keyboard.
 */
export function FlowLabel({ placement, onClick, children, value, valueColor, dense }: FlowLabelProps) {
  const suffix = dense ? ' ny-flow__label-name--dense' : ''
  return (
    <button
      type="button"
      className="ny-flow__label"
      onClick={onClick}
      style={{
        maxWidth: placement.maxWidth,
        left: placement.left,
        top: placement.top,
        transform: placement.transform,
        textAlign: placement.textAlign,
      }}
    >
      <div className={`ny-flow__label-name${suffix}`}>{children}</div>
      <div
        className={`ny-flow__label-value${dense ? ' ny-flow__label-value--dense' : ''}`}
        style={{ color: valueColor }}
      >
        {value}
      </div>
    </button>
  )
}
