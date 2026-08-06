import type { ReactNode } from 'react'
import { formatFlow } from '../lib/format'
import type { RingNodeInput, RingPairInput } from '../lib/ring'
import { ringLayout } from '../lib/ring'
import { flowColor, flowColors } from '../tokens'
import './FlowChart.css'

export interface RotationRingProps {
  /** Ring members, in the order they should appear clockwise from the top. */
  nodes: RingNodeInput[]
  /** Directional volumes between members. */
  pairs: RingPairInput[]
  /** Measured pixel width of the container. */
  width: number
  height?: number
  /** Member id to highlight. */
  selectedId?: string | null
  onSelect?: (id: string) => void
  renderLabel?: (id: string) => ReactNode
  formatValue?: (value: number) => ReactNode
  className?: string
}

const DIMMED = 0.06
const FOCUSED = 0.55
const RESTING = 0.3

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
  formatValue = (value) => formatFlow(value, true),
  className,
}: RotationRingProps) {
  const layout = ringLayout(nodes, pairs, { width, height })

  return (
    <div className={['cf-flow', className].filter(Boolean).join(' ')} style={{ height }}>
      {/* Decorative: the accessible representation is the label buttons below,
          which carry each node's name and value and are keyboard-reachable. */}
      <svg width="100%" height={height} className="cf-flow__svg" aria-hidden="true">
        {layout.chords.map((chord) => {
          const unrelated = selectedId != null && chord.from !== selectedId && chord.to !== selectedId
          const color =
            chord.to === selectedId
              ? flowColors.inflow
              : chord.from === selectedId
                ? flowColors.outflow
                : flowColors.neutral
          return (
            <path
              key={chord.key}
              d={chord.d}
              fill="none"
              stroke={color}
              strokeWidth={chord.width.toFixed(1)}
              opacity={unrelated ? DIMMED : selectedId ? FOCUSED : RESTING}
              strokeLinecap="round"
              className="cf-flow__ribbon"
            />
          )
        })}
        {layout.nodes.map((node) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: redundant mouse affordance inside an aria-hidden svg; the keyboard path is the label button
          <circle
            key={node.key}
            cx={node.x.toFixed(1)}
            cy={node.y.toFixed(1)}
            r={node.r.toFixed(1)}
            fill={flowColor(node.net)}
            opacity={0.9}
            className="cf-flow__bubble"
            onClick={() => onSelect?.(node.id)}
          />
        ))}
      </svg>

      {layout.labels.map((label) => (
        <button
          type="button"
          key={label.key}
          className="cf-flow__label"
          onClick={() => onSelect?.(label.id)}
          style={{
            maxWidth: label.maxWidth,
            left: label.left,
            top: label.top,
            transform: label.transform,
            textAlign: label.textAlign,
          }}
        >
          <div className="cf-flow__label-name cf-flow__label-name--ring">{renderLabel(label.id)}</div>
          <div
            className="cf-flow__label-value cf-flow__label-value--ring"
            style={{ color: flowColor(label.net) }}
          >
            {formatValue(label.net)}
          </div>
        </button>
      ))}
    </div>
  )
}
