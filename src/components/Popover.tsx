import type { MouseEvent, ReactNode, ToggleEvent } from 'react'
import { cloneElement, isValidElement, useCallback, useEffect, useId, useRef } from 'react'
import { useAnchoredPosition, useControllableState, useEscapeKey } from '../hooks'
import './Popover.css'

export interface PopoverProps {
  /** Controlled open state. Leave undefined to let the component own it. */
  open?: boolean
  /** Initial open state when uncontrolled. Default false. */
  defaultOpen?: boolean
  /** Fires for every open and close, including the browser's own light dismiss. */
  onOpenChange?: (open: boolean) => void
  /** What goes in the panel. Interactive content is fine here — that is the point. */
  content: ReactNode
  /** Preferred side. Flips automatically when there is no room. Default `bottom`. */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** The trigger. A single element — it is cloned to carry `aria-expanded`. */
  children: ReactNode
  className?: string
}

/**
 * A panel anchored to a trigger, holding content the user can reach.
 *
 * Use `Popover` for anything interactive — a filter form, a link list, a
 * secondary action. Use `Tooltip` for a passive phrase describing a control,
 * and `Dialog` when the rest of the page must be blocked until the user is
 * done.
 *
 * Built on `popover="auto"`, so the browser provides light dismiss (a click
 * outside, Escape) and the top layer. Nothing here portals or sets a z-index.
 * Note that only one `auto` popover can be open at a time — opening a second
 * closes the first, which is the browser's behaviour, not this component's.
 *
 * `aria-expanded` is cloned onto the trigger, which requires the trigger to pass
 * the prop through to its DOM node. Plain elements always do; a wrapper
 * component only does if it accepts the prop.
 */
export function Popover({
  open,
  defaultOpen = false,
  onOpenChange,
  content,
  placement = 'bottom',
  children,
  className,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useControllableState(open, defaultOpen, onOpenChange)
  const anchorRef = useRef<HTMLSpanElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)
  const openAtPressRef = useRef(false)
  const contentId = useId()

  const close = useCallback(() => setIsOpen(false), [setIsOpen])

  // Belt and braces: `popover="auto"` already closes on Escape, but only where
  // the popover API exists, and only while the panel itself holds focus.
  useEscapeKey(isOpen, close)

  // Declared above `useAnchoredPosition` on purpose — effects run in hook order,
  // and the panel has no measurable size until `showPopover()` has run.
  useEffect(() => {
    const element = floatingRef.current
    // jsdom implements no part of the popover API, so guard rather than crash.
    if (!isOpen || !element || typeof element.showPopover !== 'function') return
    element.showPopover()
    return () => {
      if (element.isConnected && element.matches(':popover-open')) element.hidePopover()
    }
  }, [isOpen])

  const position = useAnchoredPosition(anchorRef, floatingRef, { placement, open: isOpen })

  // The browser can close an `auto` popover on its own — light dismiss, or
  // another popover opening. Mirror that back so the two never disagree.
  const handleToggle = (event: ToggleEvent<HTMLDivElement>) => {
    const next = event.newState === 'open'
    if (next !== isOpen) setIsOpen(next)
  }

  // Light dismiss runs on pointerdown, so by the time `click` fires the panel is
  // already closed and toggling off `isOpen` would immediately reopen it.
  // Snapshot the state from before the browser got involved.
  const handlePointerDown = () => {
    openAtPressRef.current = isOpen
  }

  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    // A keyboard activation reports `detail === 0` and never light dismisses, so
    // there the live state is the honest one.
    setIsOpen(!(event.detail > 0 ? openAtPressRef.current : isOpen))
  }

  const trigger = isValidElement<{ 'aria-expanded'?: boolean; 'aria-controls'?: string }>(children)
    ? cloneElement(children, {
        'aria-expanded': isOpen,
        // Only while open: the panel is not in the DOM to point at otherwise.
        'aria-controls': isOpen ? contentId : undefined,
      })
    : children

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: the
      wrapper is not the interactive element — the trigger inside it is, and it already handles
      Enter and Space natively, which is exactly what produces this click. Listening here rather
      than cloning the handlers onto that trigger is what lets any child work, including
      components that expose a curated prop list and so would silently drop them. */}
      <span
        ref={anchorRef}
        className="ny-popover__anchor"
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        {trigger}
      </span>
      {isOpen && (
        <div
          ref={floatingRef}
          id={contentId}
          popover="auto"
          data-placement={position.placement}
          className={['ny-popover', className].filter(Boolean).join(' ')}
          style={{ left: position.x, top: position.y }}
          onToggle={handleToggle}
        >
          {content}
        </div>
      )}
    </>
  )
}
