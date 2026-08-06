import type { CSSProperties, ReactNode } from 'react'
import { Eyebrow } from './Controls'
import { Sparkline } from './Sparkline'
import { flowColor } from '../tokens'
import './MacroStrip.css'

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
  const accent = flowColor(changeValue)
  return (
    <div className={['cf-stat-tile', className].filter(Boolean).join(' ')}>
      <div className="cf-stat-tile__body">
        <Eyebrow variant="tile">{label}</Eyebrow>
        <div className="cf-stat-tile__figures">
          <span className="cf-stat-tile__value">{value}</span>
          {change != null && (
            <span className="cf-stat-tile__change" style={{ color: accent }}>
              {change}
            </span>
          )}
        </div>
      </div>
      {trend && trend.length > 1 && (
        <Sparkline values={trend} color={accent} width={60} height={24} pad={3} className="cf-stat-tile__spark" />
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
    <div className={['cf-macro-strip', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  )
}
