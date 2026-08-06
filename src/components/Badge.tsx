import type { ReactNode } from 'react'
import './Badge.css'

export interface BadgeProps {
  /**
   * `neutral` — no judgement attached: a count, a category, a tag.
   * `accent` — the brand tone, for "new" and other product-level marks.
   * `success` — a settled, good end state.
   * `warning` — needs attention but is not broken.
   * `danger` — failed, rejected, over limit.
   * `info` — neutral-but-notable status, e.g. "in review".
   */
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
  /**
   * `subtle` — tinted background, the default; quiet enough to sit in a table cell.
   * `solid` — filled with the tone itself, for the one badge that must be seen first.
   * `outline` — hairline only, when a filled chip would add too much weight to a dense row.
   */
  variant?: 'subtle' | 'solid' | 'outline'
  /**
   * `sm` — inside dense rows and table cells.
   * `md` — the default, for standalone use next to body text.
   */
  size?: 'sm' | 'md'
  children: ReactNode
  className?: string
}

/**
 * A small inline chip that labels the *state of the thing next to it*.
 *
 * Use `Badge` when the status belongs to a row, a card or a heading and needs no
 * explanation — "Active", "3 pending", "Failed". Use `Alert` instead when the
 * message is about the page rather than about one object, or when it needs a
 * title, a sentence of explanation, or a way to be dismissed.
 *
 * A badge is decorative markup around live text: it is announced as its content
 * and carries no role, so the surrounding text must still make sense with the
 * badge read inline.
 */
export function Badge({
  tone = 'neutral',
  variant = 'subtle',
  size = 'md',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={['ny-badge', `ny-badge--${tone}`, `ny-badge--${variant}`, `ny-badge--${size}`, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}
