import type { CSSProperties, ReactNode } from 'react'
import './Panel.css'

export interface PanelProps {
  /**
   * `default` — standard card padding.
   * `chart` — trims the bottom padding for plots that carry their own axis gap.
   * `none` — for panels that manage their own insets, like the macro strip.
   */
  padding?: 'default' | 'chart' | 'none'
  /** Lay the panel out as a flex column, so children can stretch to fill it. */
  column?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/** The surface every block of content sits on. */
export function Panel({ padding = 'default', column = false, children, className, style }: PanelProps) {
  const classes = ['cf-panel', `cf-panel--${padding}`, column && 'cf-panel--column', className]
  return (
    <div className={classes.filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  )
}

export interface PanelHeadingProps {
  title: ReactNode
  subtitle?: ReactNode
  /** Put the subtitle on the same line, pushed to the far edge. */
  inline?: boolean
  className?: string
}

/** Title/subtitle pair used at the top of a `Panel`. */
export function PanelHeading({ title, subtitle, inline = false, className }: PanelHeadingProps) {
  const classes = ['cf-panel-heading', inline && 'cf-panel-heading--inline', className]
  return (
    <div className={classes.filter(Boolean).join(' ')}>
      <div className="cf-panel-heading__title">{title}</div>
      {subtitle != null && <div className="cf-panel-heading__subtitle">{subtitle}</div>}
    </div>
  )
}
