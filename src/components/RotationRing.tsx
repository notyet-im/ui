import type { ReactNode } from 'react'
import { useMeasure } from '../hooks'
import { formatDelta } from '../lib/format'
import type { RingNodeInput, RingPairInput } from '../lib/ring'
import { ringLayout } from '../lib/ring'
import { deltaColor, deltaColors } from '../tokens'
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
  formatValue = (value) => formatDelta(value, true),
  className,
}: RotationRingProps) {
  const [ref, measured] = useMeasure<HTMLDivElement>()
  const resolvedWidth = width ?? measured.width

  // Nothing to draw until a width exists. On the measuring path that is one
  // frame; the ref must still be attached so the observer can report.
  if (resolvedWidth <= 0) {
    return <div ref={ref} className={['ny-flow', className].filter(Boolean).join(' ')} style={{ height }} />
  }

  const layout = ringLayout(nodes, pairs, { width: resolvedWidth, height })

  return (
    <div ref={ref} className={['ny-flow', className].filter(Boolean).join(' ')} style={{ height }}>
      {/* Decorative: the accessible representation is the label buttons below,
          which carry each node's name and value and are keyboard-reachable. */}
      <svg width="100%" height={height} className="ny-flow__svg" aria-hidden="true">
        {layout.chords.map((chord) => {
          const unrelated = selectedId != null && chord.from !== selectedId && chord.to !== selectedId
          const color =
            chord.to === selectedId
              ? deltaColors.positive
              : chord.from === selectedId
                ? deltaColors.negative
                : deltaColors.neutral
          return (
            <path
              key={chord.key}
              d={chord.d}
              fill="none"
              stroke={color}
              strokeWidth={chord.width.toFixed(1)}
              opacity={unrelated ? DIMMED : selectedId ? FOCUSED : RESTING}
              strokeLinecap="round"
              className="ny-flow__ribbon"
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
            fill={deltaColor(node.net)}
            opacity={0.9}
            className="ny-flow__bubble"
            onClick={() => onSelect?.(node.id)}
          />
        ))}
      </svg>

      {layout.labels.map((label) => (
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
          <div className="ny-flow__label-name ny-flow__label-name--ring">{renderLabel(label.id)}</div>
          <div
            className="ny-flow__label-value ny-flow__label-value--ring"
            style={{ color: deltaColor(label.net) }}
          >
            {formatValue(label.net)}
          </div>
        </button>
      ))}
    </div>
  )
}
