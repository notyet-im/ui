import { hash, rnd } from './prng'

/**
 * Generates a deterministic random walk of `length` points that lands exactly
 * on `endValue`.
 *
 * The walk is seeded from `key`, so a given bucket always draws the same shape;
 * scaling the whole walk (rather than clamping it) keeps the path's character
 * while making the endpoint agree with the real net figure shown beside it.
 */
export function walkSeries(key: string, length: number, endValue: number): number[] {
  const seed = hash(key)
  const out: number[] = []
  let cursor = 0
  for (let i = 0; i < length; i++) {
    cursor += (rnd(seed + i * 17) - 0.42) * 2
    out.push(cursor)
  }
  const last = out[length - 1] || 1
  const k = endValue / (last === 0 ? 1 : last)
  return out.map((v) => v * (Number.isFinite(k) ? k : 1))
}

export interface SeriesPath {
  /** `M…L…` polyline through every point. */
  line: string
  /** The line closed to `closeAt`, for a fill. */
  area: string
  /** Y coordinate of the zero baseline, in the same user space. */
  zeroY: number
}

export interface SeriesPathOptions {
  /**
   * Where the fill closes. `zero` bounds it at the zero baseline, so the fill
   * reads as signed area; `floor` bounds it at the bottom of the plot, so it
   * reads as magnitude under the curve.
   *
   * Only close at `zero` when the zero line is actually drawn. Otherwise the
   * fill stops at a height nothing on screen explains — and for an all-negative
   * series zero is the *top* of the plot, so the fill appears above the curve.
   *
   * Default `zero`.
   */
  closeAt?: 'zero' | 'floor'
}

/**
 * Projects a value series into SVG path data.
 *
 * The vertical domain always includes zero so that a baseline is meaningful
 * even for an all-positive or all-negative series.
 */
export function seriesPath(
  values: number[],
  width: number,
  height: number,
  pad: number,
  { closeAt = 'zero' }: SeriesPathOptions = {},
): SeriesPath {
  // One pass rather than `Math.min(0, ...values)`. This is exported API over a
  // caller's array, and spread-as-arguments throws `RangeError` past roughly
  // 130k elements — a hard ceiling, not a slow path.
  let min = 0
  let max = 0
  for (const v of values) {
    if (v < min) min = v
    if (v > max) max = v
  }
  const span = max - min || 1
  const y = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2)

  const line = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width
      return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y(v).toFixed(1)}`
    })
    .join(' ')

  const zeroY = y(0)
  const closeY = closeAt === 'floor' ? height - pad : zeroY
  return {
    line,
    area: `${line} L${width} ${closeY.toFixed(1)} L0 ${closeY.toFixed(1)} Z`,
    zeroY,
  }
}
