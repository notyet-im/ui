import type { ReactNode } from 'react'
import { useMeasure } from '../hooks'
import { formatDelta } from '../lib/format'
import type { FlowLink } from '../lib/sankey'
import { sankeyLayout } from '../lib/sankey'
import { deltaColors } from '../tokens'
import './FlowChart.css'

export interface SankeyFlowProps {
  /** Flows to draw. Order does not matter; the layout sorts by volume. */
  links: FlowLink[]
  /**
   * Pixel width to draw at. **Omit it and the chart measures its own
   * container**, which is what you almost always want — a hardcoded width
   * overflows any container narrower than it.
   *
   * It needs a real number either way: the labels are HTML and must not scale
   * with the drawing, so the layout is computed in CSS pixels rather than in a
   * scaled `viewBox`.
   */
  width?: number
  /** Overall field height, including the caption row. Default 472. */
  height?: number
  /** Height of the ribbon stack itself. Default 400. */
  fieldHeight?: number
  /**
   * Reserve less horizontal room for labels. Defaults to whether the measured
   * width is under 560px, so a chart in a narrow container gets this right
   * without the caller measuring the same box a second time. Pass it to override.
   */
  narrow?: boolean
  /** Bucket id to highlight. Everything unrelated fades back. */
  selectedId?: string | null
  onSelect?: (id: string) => void
  /** Renders a bucket id as display text. Defaults to the raw id. */
  renderLabel?: (id: string) => ReactNode
  /** Formats a node's signed total. Defaults to `formatDelta(value, true)`. */
  formatValue?: (value: number) => ReactNode
  /** Caption over the left column. */
  startCaption?: ReactNode
  /** Caption over the right column. */
  endCaption?: ReactNode
  className?: string
}

/** Opacity for ribbons unrelated to the current selection. */
const DIMMED = 0.07
const FOCUSED = 0.5
const RESTING = 0.3

/**
 * Two-column flow diagram: capital leaves the left stack and arrives in the
 * right one, with ribbon thickness proportional to volume.
 *
 * Selecting a bucket recolours every ribbon touching it — teal where the
 * selection is receiving, rust where it is sending — and fades the rest.
 */
export function SankeyFlow({
  links,
  width,
  height = 472,
  fieldHeight = 400,
  narrow,
  selectedId = null,
  onSelect,
  renderLabel = (id) => id,
  formatValue = (value) => formatDelta(value, true),
  startCaption,
  endCaption,
  className,
}: SankeyFlowProps) {
  // Only observe when the caller has not already told us the width.
  const [ref, measured] = useMeasure<HTMLDivElement>(width == null)
  const resolvedWidth = width ?? measured.width

  // Nothing to draw until a width exists. On the measuring path that is one
  // frame; the ref must still be attached so the observer can report.
  if (resolvedWidth <= 0) {
    return <div ref={ref} className={['ny-flow', className].filter(Boolean).join(' ')} style={{ height }} />
  }

  const layout = sankeyLayout(links, {
    width: resolvedWidth,
    height: fieldHeight,
    narrow: narrow ?? resolvedWidth < 560,
  })

  return (
    <div ref={ref} className={['ny-flow', className].filter(Boolean).join(' ')} style={{ height }}>
      {/* Decorative: the accessible representation is the label buttons below,
          which carry each node's name and value and are keyboard-reachable. */}
      <svg width="100%" height={height} className="ny-flow__svg" aria-hidden="true">
        {layout.ribbons.map((ribbon) => {
          const unrelated = selectedId != null && ribbon.from !== selectedId && ribbon.to !== selectedId
          const color =
            ribbon.to === selectedId
              ? deltaColors.positive
              : ribbon.from === selectedId
                ? deltaColors.negative
                : deltaColors.neutral
          return (
            <path
              key={ribbon.key}
              d={ribbon.d}
              fill="none"
              stroke={color}
              strokeWidth={ribbon.width.toFixed(1)}
              opacity={unrelated ? DIMMED : selectedId ? FOCUSED : RESTING}
              className="ny-flow__ribbon"
            />
          )
        })}
        {layout.nodes.map((node) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: redundant mouse affordance inside an aria-hidden svg; the keyboard path is the label button
          <rect
            key={node.key}
            x={node.x}
            y={node.y.toFixed(1)}
            width={layout.nodeWidth}
            height={node.height.toFixed(1)}
            rx="2"
            fill={node.side === 'source' ? deltaColors.negative : deltaColors.positive}
            className="ny-flow__node"
            onClick={() => onSelect?.(node.id)}
          />
        ))}
      </svg>

      {layout.labels.map((label) => {
        const color = label.side === 'source' ? deltaColors.negative : deltaColors.positive
        return (
          <button
            type="button"
            key={label.key}
            className="ny-flow__label"
            onClick={() => onSelect?.(label.id)}
            style={{
              maxWidth: label.maxWidth,
              left: label.left,
              top: label.top,
              transform: label.transform,
              textAlign: label.textAlign,
            }}
          >
            <div className="ny-flow__label-name">{renderLabel(label.id)}</div>
            <div className="ny-flow__label-value" style={{ color }}>
              {formatValue(label.value)}
            </div>
          </button>
        )
      })}

      {startCaption != null && <div className="ny-flow__caption ny-flow__caption--start">{startCaption}</div>}
      {endCaption != null && <div className="ny-flow__caption ny-flow__caption--end">{endCaption}</div>}
    </div>
  )
}
