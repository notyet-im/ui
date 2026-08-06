import type { CSSProperties, ReactNode } from 'react'
import './Card.css'

/** Props for {@link Card}. */
export interface CardProps {
  /**
   * `default` — the standard inset, matching `Panel`.
   * `compact` — for dense stacks of cards in a grid.
   * `none` — for a card whose body brings its own insets, such as a `Table`
   * that should sit flush against the card's edges.
   */
  padding?: 'none' | 'compact' | 'default'
  /**
   * Adds the hover affordance — a lift on `--ny-shadow-sm` plus a raised
   * surface — for a card that is itself a target.
   *
   * It does **not** make the card a control: there is no `onClick`, because a
   * `<div onClick>` is not keyboard reachable and a `<button>` wrapper cannot
   * legally contain the links a composed card usually holds. Put the real
   * control inside — typically a link in the `header` — and let it span the
   * card with a `::after` overlay.
   */
  interactive?: boolean
  /** Top slot, divided from the body by a hairline. Usually a heading + action. */
  header?: ReactNode
  /** Bottom slot, divided from the body by a hairline. Usually metadata or actions. */
  footer?: ReactNode
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * A composed surface: header / body / footer, with optional hover lift.
 *
 * **Card vs `Panel`.** `Panel` is the plain surface every block of content sits
 * on — one border, one padding scale, no slots and no states. `Card` is its
 * interactive, composed sibling: it adds the divided `header`/`footer` slots
 * and the `interactive` hover lift, and it sits on `--ny-surface-raised` rather
 * than `--ny-surface` so a card reads as sitting *on* the page rather than
 * *being* it. Reach for `Panel` when you are laying out a dashboard region;
 * reach for `Card` when the thing is a discrete, often clickable object in a
 * list or grid.
 */
export function Card({
  padding = 'default',
  interactive = false,
  header,
  footer,
  children,
  className,
  style,
}: CardProps) {
  const classes = ['ny-card', `ny-card--${padding}`, interactive && 'ny-card--interactive', className].filter(
    Boolean,
  )

  return (
    <div className={classes.join(' ')} style={style}>
      {header != null && <div className="ny-card__header">{header}</div>}
      {children != null && <div className="ny-card__body">{children}</div>}
      {footer != null && <div className="ny-card__footer">{footer}</div>}
    </div>
  )
}
