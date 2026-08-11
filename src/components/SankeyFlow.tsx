import type { ReactNode } from 'react'
import { formatDelta } from '../lib/format'
import type { FlowLink } from '../lib/sankey'
import { sankeyLayout } from '../lib/sankey'
import { deltaColors } from '../tokens'
import { edgeColor, edgeOpacity, FlowField, FlowLabel } from './FlowChart'
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
  return (
    <FlowField width={width} height={height} className={className}>
      {(resolvedWidth) => {
        const layout = sankeyLayout(links, {
          width: resolvedWidth,
          height: fieldHeight,
          narrow: narrow ?? resolvedWidth < 560,
        })
        return (
          <>
            {/* Decorative: the accessible representation is the label buttons
                below, which carry each node's name and value and are
                keyboard-reachable. */}
            <svg width="100%" height={height} className="ny-flow__svg" aria-hidden="true">
              {layout.ribbons.map((ribbon) => (
                <path
                  key={ribbon.key}
                  d={ribbon.d}
                  fill="none"
                  stroke={edgeColor(selectedId, ribbon.from, ribbon.to)}
                  strokeWidth={ribbon.width.toFixed(1)}
                  opacity={edgeOpacity(selectedId, ribbon.from, ribbon.to)}
                  className="ny-flow__ribbon"
                />
              ))}
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

            {layout.labels.map((label) => (
              <FlowLabel
                key={label.key}
                placement={label}
                onClick={() => onSelect?.(label.id)}
                value={formatValue(label.value)}
                valueColor={label.side === 'source' ? deltaColors.negative : deltaColors.positive}
              >
                {renderLabel(label.id)}
              </FlowLabel>
            ))}

            {startCaption != null && (
              <div className="ny-flow__caption ny-flow__caption--start">{startCaption}</div>
            )}
            {endCaption != null && <div className="ny-flow__caption ny-flow__caption--end">{endCaption}</div>}
          </>
        )
      }}
    </FlowField>
  )
}
