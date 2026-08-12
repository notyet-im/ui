import './Skeleton.css'
import { cx } from '../lib/cx'

export interface SkeletonProps {
  /**
   * `text` — one or more stacked bars standing in for a run of prose.
   * `rect` — a block placeholder: a card, a chart, an image.
   * `circle` — a round placeholder, sized to match the `Avatar` it replaces.
   */
  shape?: 'text' | 'rect' | 'circle'
  /** Any CSS length; a number is treated as pixels. Defaults to the shape's own width. */
  width?: number | string
  /** Any CSS length; a number is treated as pixels. On `text`, sets the height of each line. */
  height?: number | string
  /** How many stacked bars to draw. `text` only; the last bar is drawn short. Default 1. */
  lines?: number
  className?: string
}

/**
 * A grey placeholder holding the space that real content is about to occupy.
 *
 * Use `Skeleton` when the shape of the result is known — it reserves the layout
 * so nothing jumps when the data lands. Use `Spinner` when there is no shape to
 * reserve, or the wait is too short for a skeleton to be anything but a flicker.
 *
 * The element is `aria-hidden` and announces nothing. **The loading semantics
 * belong to the container** — put `aria-busy="true"` on the region being filled,
 * or render one `Spinner` beside the skeletons, so the wait is announced once
 * rather than once per bar.
 */
export function Skeleton({ shape = 'text', width, height, lines = 1, className }: SkeletonProps) {
  const classes = cx('ny-skeleton', `ny-skeleton--${shape}`, className)

  if (shape !== 'text') {
    return <div aria-hidden="true" className={classes} style={{ width, height }} />
  }

  const count = Math.max(1, Math.floor(lines))

  return (
    <div aria-hidden="true" className={classes} style={{ width }}>
      {Array.from({ length: count }, (_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length list of identical bars, never reordered and with nothing to key on
          key={index}
          className={['ny-skeleton__line', index === count - 1 && count > 1 ? 'ny-skeleton__line--last' : '']
            .filter(Boolean)
            .join(' ')}
          style={{ height }}
        />
      ))}
    </div>
  )
}
