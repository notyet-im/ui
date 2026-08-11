import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import './Toast.css'
import { useTopLayer } from '../hooks'
import { Button } from './Button'
import { CloseIcon } from './icons'

export interface ToastViewportProps {
  /** Which edge the stack grows from. Default `bottom`. */
  placement?: 'top' | 'bottom'
  /** `Toast` elements. Newest last. */
  children?: ReactNode
  className?: string
}

/**
 * The corner the toasts stack in, and the one element of the pair that lives in
 * the browser top layer.
 *
 * `Toast` must be rendered inside one of these. The viewport carries
 * `popover="manual"` and is shown for the lifetime of the component, which puts
 * the whole stack above every stacking context on the page — including an open
 * `Dialog` — with no z-index anywhere.
 *
 * The popover sits here rather than on each `Toast` because a top-layer element
 * is forced to `position: absolute` against the viewport and leaves its
 * parent's flow (measured in Chromium), so N sibling popovers pile up on one
 * another instead of stacking. One top-layer container with in-flow children
 * lays out exactly as written and keeps the same top-layer guarantee.
 */
export function ToastViewport({ placement = 'bottom', children, className }: ToastViewportProps) {
  const ref = useRef<HTMLDivElement>(null)

  useTopLayer(ref)

  return (
    <div
      ref={ref}
      popover="manual"
      className={['ny-toast-viewport', `ny-toast-viewport--${placement}`, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export interface ToastProps {
  /** Whether the toast is showing. */
  open: boolean
  /** Called by the dismiss button and when `duration` runs out. */
  onClose: () => void
  /** Colours the accent rule. Default `info`. */
  tone?: 'info' | 'success' | 'warning' | 'danger'
  title?: ReactNode
  description?: ReactNode
  /** Auto-dismiss delay in ms. Pass 0 to make it stay until dismissed. Default 5000. */
  duration?: number
  /** Accessible name for the dismiss button. Default `Dismiss`. */
  closeLabel?: string
  className?: string
}

/**
 * A brief, self-dismissing message about something that already happened.
 *
 * Render inside `ToastViewport` — that is what places the stack in the top
 * layer and positions it. Announced politely through `role="status"`, so it
 * never interrupts what a screen reader is already saying.
 *
 * Use `Toast` for confirmation the user does not have to act on. If they must
 * act, or the message is the answer to something they just asked for, use
 * `Dialog` — a toast that times out is the wrong place for anything required.
 */
export function Toast({
  open,
  onClose,
  tone = 'info',
  title,
  description,
  duration = 5000,
  closeLabel = 'Dismiss',
  className,
}: ToastProps) {
  // Held in a ref so an inline `onClose` arrow — the normal way to write one —
  // does not restart the countdown on every render of the owning screen.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open || duration <= 0) return
    const timer = setTimeout(() => onCloseRef.current(), duration)
    return () => clearTimeout(timer)
  }, [open, duration])

  return (
    <div
      role="status"
      aria-live="polite"
      data-open={open ? '' : undefined}
      className={['ny-toast', `ny-tone--${tone}`, className].filter(Boolean).join(' ')}
    >
      <div className="ny-toast__body">
        {title != null && <div className="ny-toast__title">{title}</div>}
        {description != null && <div className="ny-toast__description">{description}</div>}
      </div>
      <Button iconOnly label={closeLabel} variant="ghost" size="sm" onClick={onClose}>
        <CloseIcon />
      </Button>
    </div>
  )
}
