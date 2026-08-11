import type { ReactNode } from 'react'
import { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from 'react'
import { useAnchoredPosition, useEscapeKey, useTopLayer } from '../hooks'
import './Tooltip.css'

export interface TooltipProps {
  /** The label. Keep it to a phrase — anything longer belongs in a `Popover`. */
  content: ReactNode
  /** Preferred side. Flips automatically when there is no room. Default `top`. */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Hover delay in ms. Focus always opens immediately — see below. Default 150. */
  delay?: number
  /** Start open. For docs and visual tests; it still closes on leave, blur or Escape. */
  defaultOpen?: boolean
  /** The trigger. Anything focusable — a button, a link, a form control. */
  children: ReactNode
  className?: string
}

/**
 * A short, non-interactive label describing the element it hangs off.
 *
 * Use `Tooltip` for a phrase that explains a control — an icon button's name, a
 * truncated value in full. Use `Popover` the moment the content holds anything
 * the user has to reach: a link, a field, a button. A tooltip is not reachable,
 * because it closes the instant focus moves.
 *
 * Opens on hover **and** on focus, so a keyboard user gets the same label a
 * mouse user does. The delay applies to hover only; on focus the intent is
 * already explicit. Rendered in the browser top layer via `popover="manual"`,
 * so no ancestor's `overflow` can clip it and no z-index is involved.
 *
 * `aria-describedby` is cloned onto the trigger, which requires the trigger to
 * pass the prop through to its DOM node. Plain elements always do; a wrapper
 * component only does if it accepts the prop.
 */
export function Tooltip({
  content,
  placement = 'top',
  delay = 150,
  defaultOpen = false,
  children,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(defaultOpen)
  const anchorRef = useRef<HTMLSpanElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const tooltipId = useId()

  const clearTimer = useCallback(() => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current)
      timerRef.current = undefined
    }
  }, [])

  const close = useCallback(() => {
    clearTimer()
    setOpen(false)
  }, [clearTimer])

  useEffect(() => clearTimer, [clearTimer])
  useEscapeKey(open, close)

  const openAfterDelay = () => {
    clearTimer()
    timerRef.current = setTimeout(() => setOpen(true), delay)
  }

  const openNow = () => {
    clearTimer()
    setOpen(true)
  }

  // Must be declared *above* `useAnchoredPosition`: effects run in hook order,
  // and a popover is `display: none` until `showPopover()`, so measuring first
  // would size the tooltip at 0×0 and place it in the wrong spot.
  useTopLayer(floatingRef, open)

  const position = useAnchoredPosition(anchorRef, floatingRef, { placement, open })

  // A description only counts on the element it is attached to, so the id has to
  // land on the trigger itself. Set only while open — a `display: none` tooltip
  // is no use as a description.
  const trigger = isValidElement<{ 'aria-describedby'?: string }>(children)
    ? cloneElement(children, { 'aria-describedby': open ? tooltipId : undefined })
    : children

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: the wrapper is not the
      interactive element — the trigger inside it is. Listening here rather than
      cloning the handlers onto that trigger is what lets any child work, including
      components that expose a curated prop list and so would silently drop them. */}
      <span
        ref={anchorRef}
        className="ny-floating__anchor"
        onPointerEnter={openAfterDelay}
        onPointerLeave={close}
        onFocus={openNow}
        onBlur={close}
      >
        {trigger}
      </span>
      {open && (
        <div
          ref={floatingRef}
          id={tooltipId}
          role="tooltip"
          popover="manual"
          data-placement={position.placement}
          className={['ny-popover-reset', 'ny-raised', 'ny-floating', 'ny-tooltip', className]
            .filter(Boolean)
            .join(' ')}
          style={{ left: position.x, top: position.y }}
        >
          {content}
        </div>
      )}
    </>
  )
}
