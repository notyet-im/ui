import type { ReactNode } from 'react'
import { deltaColor } from '../tokens'
import { Sparkline } from './Sparkline'
import './Details.css'
import { cx } from '../lib/cx'

/* Breakdown bar ----------------------------------------------------------- */

export interface BreakdownBarProps {
  label: ReactNode
  /** Pre-formatted figure shown at the right of the label row. */
  value: ReactNode
  /** Bar length as a fraction of the largest sibling, 0–1. */
  fraction: number
  /** Signed magnitude; picks the bar colour. */
  tone?: number
  /**
   * Explicit colour, overriding `tone` — as on `DataRow`.
   *
   * It exists for the same reason it does there: a panel can hold two
   * quantities that must not share the delta scale, and painting one of them
   * off it is the only way to say so. Without this, a consumer's only route was
   * an `!important` rule against this component's internal class names, since
   * the colour below is written inline and no stylesheet outranks that.
   */
  color?: string
  /**
   * Explicit colour for the figure alone, overriding `tone` and `color` — the
   * name `DataRow` uses. A monochrome bar often still wants its number at full
   * reading contrast while the 5px fill stays quiet.
   */
  valueColor?: string
  /** Grow the bar from the right instead of the left. */
  align?: 'start' | 'end'
  className?: string
}

/** A labelled proportion bar, sized relative to its largest sibling. */
export function BreakdownBar({
  label,
  value,
  fraction,
  tone = 1,
  color: explicitColor,
  valueColor,
  align = 'start',
  className,
}: BreakdownBarProps) {
  const fill = explicitColor ?? deltaColor(tone)
  const figure = valueColor ?? fill
  const width = `${(Math.max(0, Math.min(1, fraction)) * 100).toFixed(0)}%`
  return (
    <div className={cx('ny-breakdown', className)}>
      <div className="ny-breakdown__head">
        <span>{label}</span>
        <span className="ny-breakdown__value" style={{ color: figure }}>
          {value}
        </span>
      </div>
      <div className={`ny-breakdown__track${align === 'end' ? ' ny-breakdown__track--end' : ''}`}>
        <div className="ny-breakdown__fill" style={{ width, background: fill }} />
      </div>
    </div>
  )
}

/* Data row ---------------------------------------------------------------- */

export interface DataRowProps {
  /** Leading glyph — a direction arrow, a bullet, an icon. */
  leading?: ReactNode
  label: ReactNode
  /** Secondary text: beside the label when inline, beneath it when stacked. */
  caption?: ReactNode
  /** Pre-formatted figure, right-aligned in monospace. */
  value: ReactNode
  /** Signed magnitude behind `value`; picks its colour. */
  tone?: number
  /** Explicit colour, overriding `tone`. */
  valueColor?: string
  /** Render the label in monospace — for tickers and codes. */
  monoLabel?: boolean
  /** `inline` puts the caption beside the label, `stacked` puts it below. */
  layout?: 'inline' | 'stacked'
  className?: string
}

/** One line of a ranked list: identity on the left, figure on the right. */
export function DataRow({
  leading,
  label,
  caption,
  value,
  tone,
  valueColor,
  monoLabel = false,
  layout = 'inline',
  className,
}: DataRowProps) {
  const color = valueColor ?? (tone === undefined ? undefined : deltaColor(tone))
  return (
    <div className={cx('ny-data-row', `ny-data-row--${layout}`, className)}>
      <span className="ny-data-row__main">
        {leading != null && (
          <span className="ny-data-row__leading" style={{ color }}>
            {leading}
          </span>
        )}
        <span className={`ny-data-row__label${monoLabel ? ' ny-data-row__label--mono' : ''}`}>{label}</span>
        {caption != null && <span className="ny-data-row__caption">{caption}</span>}
      </span>
      <span className="ny-data-row__value" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

/* Narrative --------------------------------------------------------------- */

export interface NarrativeItemProps {
  title: ReactNode
  /** Pre-formatted figure shown beside the title. */
  value?: ReactNode
  children?: ReactNode
  /** Signed magnitude; picks the rail and figure colour. */
  tone?: number
  /** Explicit colour, overriding `tone`. */
  color?: string
  className?: string
}

/** A plain-language annotation with a coloured rail. */
export function NarrativeItem({ title, value, children, tone = 1, color, className }: NarrativeItemProps) {
  const accent = color ?? deltaColor(tone)
  return (
    <div className={cx('ny-narrative', className)}>
      <div className="ny-narrative__rail" style={{ background: accent }} />
      <div className="ny-narrative__body">
        <div className="ny-narrative__head">
          <span className="ny-narrative__title">{title}</span>
          {value != null && (
            <span className="ny-narrative__value" style={{ color: accent }}>
              {value}
            </span>
          )}
        </div>
        <div className="ny-narrative__text">{children}</div>
      </div>
    </div>
  )
}

/* Momentum card ----------------------------------------------------------- */

export interface MomentumCardProps {
  name: ReactNode
  /** Pre-formatted headline figure. */
  value: ReactNode
  /** Pre-formatted secondary figure, e.g. share of total flow. */
  share?: ReactNode
  /** Signed magnitude; picks the accent colour. */
  tone: number
  /** Trend values for the card's area chart. */
  trend: number[]
  /**
   * Marks the card as the current choice — sets `aria-pressed` and the ring.
   *
   * A consumer cannot do this with `className` alone: the ring has to out-rank
   * `:hover`, and `aria-pressed` is not a style at all. `HeatGrid` has
   * `selectedKey` and `RotationRing` has `selectedId`; this is the same idea for
   * a card.
   */
  selected?: boolean
  onClick?: () => void
  className?: string
}

/** A clickable tile pairing a headline figure with its path over time. */
export function MomentumCard({
  name,
  value,
  share,
  tone,
  trend,
  selected,
  onClick,
  className,
}: MomentumCardProps) {
  const color = deltaColor(tone)
  return (
    <button
      type="button"
      onClick={onClick}
      // Undefined omits the attribute, which is the point: a card that is not
      // selectable should say nothing rather than claim `aria-pressed="false"`.
      aria-pressed={selected}
      className={cx('ny-momentum', selected && 'ny-momentum--selected', className)}
    >
      <div className="ny-momentum__name">{name}</div>
      <div className="ny-momentum__figures">
        <span className="ny-momentum__value" style={{ color }}>
          {value}
        </span>
        {share != null && <span className="ny-momentum__share">{share}</span>}
      </div>
      <Sparkline
        values={trend}
        width={140}
        height={32}
        pad={4}
        color={color}
        area
        areaOpacity={0.13}
        strokeWidth={1.5}
        fluid
      />
    </button>
  )
}
