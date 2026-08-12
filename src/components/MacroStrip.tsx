import type { CSSProperties, ReactNode } from 'react'
import { deltaColor } from '../tokens'
import { Eyebrow } from './Controls'
import { Sparkline } from './Sparkline'
import './MacroStrip.css'
import { cx } from '../lib/cx'

export interface StatTileProps {
  label: ReactNode
  /** Pre-formatted headline figure — the tile does not format for you. */
  value: ReactNode
  /** Pre-formatted change, e.g. `+1.1%`. */
  change?: ReactNode
  /** Signed magnitude behind `change`; picks the accent colour. */
  changeValue?: number
  /** Trend values for the inline sparkline. Omit to hide it. */
  trend?: number[]
  className?: string
}

/** One reading in the macro strip: label, figure, change, trend. */
export function StatTile({ label, value, change, changeValue = 0, trend, className }: StatTileProps) {
  const accent = deltaColor(changeValue)
  return (
    <div className={cx('ny-stat-tile', className)}>
      <div className="ny-stat-tile__body">
        <Eyebrow variant="tile">{label}</Eyebrow>
        <div className="ny-stat-tile__figures">
          <span className="ny-stat-tile__value">{value}</span>
          {change != null && (
            <span className="ny-stat-tile__change" style={{ color: accent }}>
              {change}
            </span>
          )}
        </div>
      </div>
      {/* No length check: `Sparkline` renders nothing below two points. */}
      {trend && (
        <Sparkline
          values={trend}
          color={accent}
          width={60}
          height={24}
          pad={3}
          className="ny-stat-tile__spark"
        />
      )}
    </div>
  )
}

export interface MacroStripProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/** Edge-to-edge row of `StatTile`s divided by hairlines. */
export function MacroStrip({ children, className, style }: MacroStripProps) {
  return (
    <div className={cx('ny-macro-strip', className)} style={style}>
      {children}
    </div>
  )
}
