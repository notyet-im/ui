import type { CSSProperties } from 'react'
import { seriesPath } from '../lib/series'
import { deltaColor } from '../tokens'

export interface SparklineProps {
  /** Raw values. The path is fitted to these, always including zero. */
  values: number[]
  /** Coordinate-space width. Default 60. */
  width?: number
  /** Coordinate-space height. Default 24. */
  height?: number
  /** Vertical inset so peaks aren't clipped. Default 3. */
  pad?: number
  /** Stroke colour. Defaults to the flow colour of the final value. */
  color?: string
  /** Fill the area between the line and the zero baseline. */
  area?: boolean
  areaOpacity?: number
  strokeWidth?: number
  /** Draw a dashed line at zero. */
  baseline?: boolean
  /** Stretch to the container width instead of rendering at intrinsic size. */
  fluid?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * A compact trend line.
 *
 * The vertical domain always spans zero, so a line that never crosses zero
 * still reads as entirely-above or entirely-below it — which is the whole point
 * when the quantity is a signed flow.
 */
export function Sparkline({
  values,
  width = 60,
  height = 24,
  pad = 3,
  color,
  area = false,
  areaOpacity = 0.13,
  strokeWidth = 1.4,
  baseline = false,
  fluid = false,
  className,
  style,
}: SparklineProps) {
  const path = seriesPath(values, width, height, pad)
  const stroke = color ?? deltaColor(values[values.length - 1] ?? 0)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={fluid ? '100%' : width}
      height={height}
      className={className}
      style={{ overflow: 'visible', display: 'block', ...style }}
      preserveAspectRatio={fluid ? 'none' : undefined}
      aria-hidden="true"
      focusable="false"
    >
      {area && <path d={path.area} fill={stroke} opacity={areaOpacity} />}
      {baseline && (
        <line
          x1="0"
          y1={path.zeroY}
          x2={width}
          y2={path.zeroY}
          stroke="var(--ny-border)"
          strokeDasharray="3 3"
        />
      )}
      <path d={path.line} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  )
}
