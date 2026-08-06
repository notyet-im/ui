import type { ReactNode } from 'react'
import { deltaColor } from '../tokens'
import { Sparkline } from './Sparkline'
import './Details.css'

/* Breakdown bar ----------------------------------------------------------- */

export interface BreakdownBarProps {
  label: ReactNode
  /** Pre-formatted figure shown at the right of the label row. */
  value: ReactNode
  /** Bar length as a fraction of the largest sibling, 0–1. */
  fraction: number
  /** Signed magnitude; picks the bar colour. */
  tone?: number
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
  align = 'start',
  className,
}: BreakdownBarProps) {
  const color = deltaColor(tone)
  const width = `${(Math.max(0, Math.min(1, fraction)) * 100).toFixed(0)}%`
  return (
    <div className={['ny-breakdown', className].filter(Boolean).join(' ')}>
      <div className="ny-breakdown__head">
        <span>{label}</span>
        <span className="ny-breakdown__value" style={{ color }}>
          {value}
        </span>
      </div>
      <div className={`ny-breakdown__track${align === 'end' ? ' ny-breakdown__track--end' : ''}`}>
        <div className="ny-breakdown__fill" style={{ width, background: color }} />
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
    <div className={['ny-data-row', `ny-data-row--${layout}`, className].filter(Boolean).join(' ')}>
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
    <div className={['ny-narrative', className].filter(Boolean).join(' ')}>
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
  onClick?: () => void
  className?: string
}

/** A clickable tile pairing a headline figure with its path over time. */
export function MomentumCard({ name, value, share, tone, trend, onClick, className }: MomentumCardProps) {
  const color = deltaColor(tone)
  return (
    <button type="button" onClick={onClick} className={['ny-momentum', className].filter(Boolean).join(' ')}>
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
