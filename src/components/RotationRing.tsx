import type { ReactNode } from 'react'
import { formatDelta } from '../lib/format'
import type { RingNodeInput, RingPairInput } from '../lib/ring'
import { ringLayout } from '../lib/ring'
import { deltaColor } from '../tokens'
import { edgeColor, edgeOpacity, FlowField, FlowLabel } from './FlowChart'
import './FlowChart.css'

export interface RotationRingProps {
  /** Ring members, in the order they should appear clockwise from the top. */
  nodes: RingNodeInput[]
  /** Directional volumes between members. */
  pairs: RingPairInput[]
  /**
   * Pixel width to draw at. **Omit it and the chart measures its own
   * container**, which is what you almost always want — a hardcoded width
   * overflows any container narrower than it.
   *
   * It needs a real number either way: the labels are HTML and must not scale
   * with the drawing, so the layout is computed in CSS pixels.
   */
  width?: number
  height?: number
  /** Member id to highlight. */
  selectedId?: string | null
  onSelect?: (id: string) => void
  renderLabel?: (id: string) => ReactNode
  formatValue?: (value: number) => ReactNode
  className?: string
}

/**
 * Circular rotation view: bubble size is net position change, chord thickness
 * is gross flow between a pair.
 *
 * Use this when the question is "which markets traded with which", and the
 * Sankey when the question is "where did this money go".
 */
export function RotationRing({
  nodes,
  pairs,
  width,
  height = 472,
  selectedId = null,
  onSelect,
  renderLabel = (id) => id,
  formatValue = (value) => formatDelta(value, true),
  className,
}: RotationRingProps) {
  return (
    <FlowField width={width} height={height} className={className}>
      {(resolvedWidth) => {
        const layout = ringLayout(nodes, pairs, { width: resolvedWidth, height })
        return (
          <>
            {/* Decorative: the accessible representation is the label buttons
                below, which carry each node's name and value and are
                keyboard-reachable. */}
            <svg width="100%" height={height} className="ny-flow__svg" aria-hidden="true">
              {layout.chords.map((chord) => (
                <path
                  key={chord.key}
                  d={chord.d}
                  fill="none"
                  stroke={edgeColor(selectedId, chord.from, chord.to)}
                  strokeWidth={chord.width.toFixed(1)}
                  opacity={edgeOpacity(selectedId, chord.from, chord.to)}
                  strokeLinecap="round"
                  className="ny-flow__ribbon"
                />
              ))}
              {layout.nodes.map((node) => (
                // biome-ignore lint/a11y/noStaticElementInteractions: redundant mouse affordance inside an aria-hidden svg; the keyboard path is the label button
                <circle
                  key={node.key}
                  cx={node.x.toFixed(1)}
                  cy={node.y.toFixed(1)}
                  r={node.r.toFixed(1)}
                  fill={deltaColor(node.net)}
                  opacity={0.9}
                  className="ny-flow__bubble"
                  onClick={() => onSelect?.(node.id)}
                />
              ))}
            </svg>

            {layout.labels.map((label) => (
              <FlowLabel
                key={label.key}
                dense
                placement={label}
                onClick={() => onSelect?.(label.id)}
                value={formatValue(label.net)}
                valueColor={deltaColor(label.net)}
              >
                {renderLabel(label.id)}
              </FlowLabel>
            ))}
          </>
        )
      }}
    </FlowField>
  )
}
