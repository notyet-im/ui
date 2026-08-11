import type { CSSProperties, ReactNode } from 'react'
import './Panel.css'
import { cx } from '../lib/cx'

export interface PanelProps {
  /**
   * `default` — standard panel padding.
   * `compact` — denser, for a panel used as a list item or a small tile.
   * `chart` — trims the bottom padding for plots that carry their own axis gap.
   * `none` — for panels that manage their own insets, like the macro strip.
   */
  padding?: 'default' | 'compact' | 'chart' | 'none'
  /** Lay the panel out as a flex column, so children can stretch to fill it. */
  column?: boolean
  /**
   * Divided block above the content, for a title row or toolbar. Supplying it
   * lays the panel out as a column regardless of `column`.
   */
  header?: ReactNode
  /** Divided block below the content, for actions. Same layout note as `header`. */
  footer?: ReactNode
  /** Lifts on hover. For a panel that is itself a link or a click target. */
  interactive?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * The surface every block of content sits on.
 *
 * Supply `header` and/or `footer` for a panel with divided regions — that is
 * the shape usually called a card. `PanelHeading` is the lighter alternative
 * when you want a title but no rule across the panel.
 */
export function Panel({
  padding = 'default',
  column = false,
  header,
  footer,
  interactive = false,
  children,
  className,
  style,
}: PanelProps) {
  const slotted = header != null || footer != null
  const classes = [
    'ny-panel',
    `ny-panel--${padding}`,
    (column || slotted) && 'ny-panel--column',
    interactive && 'ny-panel--interactive',
    className,
  ]
  return (
    <div className={cx(...classes)} style={style}>
      {header != null && <div className="ny-panel__header">{header}</div>}
      {slotted ? <div className="ny-panel__body">{children}</div> : children}
      {footer != null && <div className="ny-panel__footer">{footer}</div>}
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
  const classes = ['ny-panel-heading', inline && 'ny-panel-heading--inline', className]
  return (
    <div className={cx(...classes)}>
      <div className="ny-panel-heading__title">{title}</div>
      {subtitle != null && <div className="ny-panel-heading__subtitle">{subtitle}</div>}
    </div>
  )
}
