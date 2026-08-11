import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface Measurements {
  /** Measured content width of the observed element, in CSS pixels. 0 until first measure. */
  width: number
}

/**
 * Measures an element's content width.
 *
 * The flow charts lay themselves out in real pixels rather than a scaled
 * viewBox — labels are HTML, so they must not scale with the drawing — which
 * means they need a measured width before they can draw anything.
 */
export function useMeasure<T extends HTMLElement>(): [RefObject<T | null>, Measurements] {
  const ref = useRef<T>(null)
  const [measurements, setMeasurements] = useState<Measurements>({ width: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const measure = () => {
      const width = element.clientWidth
      setMeasurements((previous) => (previous.width === width ? previous : { width }))
    }

    measure()

    // Only the element. Observing `document.body` as well fired every live
    // instance's callback on any reflow that changed page height — a DOM read
    // per instance for nothing, since the element observer already covers the
    // element's own width.
    //
    // The `resize` listener is the fallback, not a companion: where
    // ResizeObserver exists, any viewport change that moves this element's
    // width already fires the observer, so listening to both just measured
    // twice per resize.
    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure)
      observer.observe(element)
    } else {
      window.addEventListener('resize', measure)
    }

    return () => {
      window.removeEventListener('resize', measure)
      observer?.disconnect()
    }
  }, [])

  return [ref, measurements]
}

/** Runs `handler` when Escape is pressed, while `active` is true. */
export function useEscapeKey(active: boolean, handler: () => void): void {
  useEffect(() => {
    if (!active) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handler()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, handler])
}

/**
 * Supports both controlled and uncontrolled use from one implementation.
 *
 * The house rule is controlled-first — `Tabs`, `SegmentedControl` and `Select`
 * all require `value` + `onChange`, and stay that way. Form controls are the
 * deliberate exception: native `<form>` submission only works uncontrolled, and
 * a strictly-controlled `<Input value="">` with no `onChange` renders read-only
 * and logs a React warning on every design-sync capture.
 *
 * Pass `controlled` as `undefined` to opt into internal state.
 */
export function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue)
  const isControlled = controlled !== undefined

  const set = useCallback(
    (value: T) => {
      if (!isControlled) setUncontrolled(value)
      onChange?.(value)
    },
    [isControlled, onChange],
  )

  return [isControlled ? controlled : uncontrolled, set]
}

export interface RovingFocusOptions {
  /** How many items the group holds. */
  count: number
  /** Index of the currently active item — the only one in the tab order. */
  activeIndex: number
  /** Called with the index the user moved to. */
  onMove: (index: number) => void
  /** Which arrow keys navigate. Default `horizontal`. */
  orientation?: 'horizontal' | 'vertical' | 'both'
  /** Wrap from last to first. Default true, per the WAI-ARIA APG. */
  loop?: boolean
}

export interface RovingFocus {
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void
  /** Spread onto each item: only the active one is tabbable. */
  getItemProps: (index: number) => { tabIndex: 0 | -1; 'data-roving-item': '' }
}

/**
 * Arrow-key roving focus for a composite widget — the interaction half of
 * `radiogroup`, `tablist` and friends.
 *
 * The library previously shipped the ARIA roles without this, which the APG
 * treats as incomplete: a radiogroup is expected to be one tab stop that arrow
 * keys move within, not N separate tab stops.
 *
 * Items are found by their `data-roving-item` attribute within the container
 * the handler is attached to, so the hook needs no refs and works with any
 * markup shape.
 */
export function useRovingFocus({
  count,
  activeIndex,
  onMove,
  orientation = 'horizontal',
  loop = true,
}: RovingFocusOptions): RovingFocus {
  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      const horizontal = orientation === 'horizontal' || orientation === 'both'
      const vertical = orientation === 'vertical' || orientation === 'both'

      let next: number | null = null
      if ((horizontal && event.key === 'ArrowRight') || (vertical && event.key === 'ArrowDown')) {
        next = activeIndex + 1
      } else if ((horizontal && event.key === 'ArrowLeft') || (vertical && event.key === 'ArrowUp')) {
        next = activeIndex - 1
      } else if (event.key === 'Home') {
        next = 0
      } else if (event.key === 'End') {
        next = count - 1
      }
      if (next === null || count === 0) return

      if (next < 0) next = loop ? count - 1 : 0
      if (next >= count) next = loop ? 0 : count - 1
      if (next === activeIndex) return

      event.preventDefault()
      onMove(next)

      // Selection follows focus in these patterns, so move the DOM focus too.
      const items = event.currentTarget.querySelectorAll<HTMLElement>('[data-roving-item]')
      items[next]?.focus()
    },
    [activeIndex, count, loop, onMove, orientation],
  )

  const getItemProps = useCallback(
    (index: number) => ({
      tabIndex: (index === activeIndex ? 0 : -1) as 0 | -1,
      'data-roving-item': '' as const,
    }),
    [activeIndex],
  )

  return { onKeyDown, getItemProps }
}

export type Placement = 'top' | 'bottom' | 'left' | 'right'

/** Module scope, not inside `place()` — it is fixed, and `place()` is hot. */
const OPPOSITE: Record<Placement, Placement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

export interface AnchoredPosition {
  x: number
  y: number
  /** Where it actually landed — may differ from the request after flipping. */
  placement: Placement
}

/**
 * Positions a floating element against an anchor, flipping when it would leave
 * the viewport.
 *
 * Deliberately hand-rolled at ~50 lines rather than pulling in floating-ui:
 * this package ships zero runtime dependencies and that is worth keeping. CSS
 * anchor positioning would be smaller still, but Firefox does not support it.
 *
 * Overlays render in the browser top layer (`<dialog>`, `popover`), so this only
 * has to compute coordinates — not manage stacking or focus.
 */
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  {
    placement = 'bottom',
    gap = 8,
    open = true,
  }: { placement?: Placement; gap?: number; open?: boolean } = {},
): AnchoredPosition {
  const [position, setPosition] = useState<AnchoredPosition>({ x: 0, y: 0, placement })

  useEffect(() => {
    if (!open) return
    const anchor = anchorRef.current
    const floating = floatingRef.current
    if (!anchor || !floating) return

    const place = () => {
      const a = anchor.getBoundingClientRect()
      const f = floating.getBoundingClientRect()
      const room = {
        top: a.top,
        bottom: window.innerHeight - a.bottom,
        left: a.left,
        right: window.innerWidth - a.right,
      }

      const needed = placement === 'top' || placement === 'bottom' ? f.height + gap : f.width + gap
      const actual =
        room[placement] < needed && room[OPPOSITE[placement]] >= needed ? OPPOSITE[placement] : placement

      let x: number
      let y: number
      if (actual === 'top' || actual === 'bottom') {
        x = a.left + a.width / 2 - f.width / 2
        y = actual === 'top' ? a.top - f.height - gap : a.bottom + gap
      } else {
        x = actual === 'left' ? a.left - f.width - gap : a.right + gap
        y = a.top + a.height / 2 - f.height / 2
      }

      // Keep it on screen along the cross axis.
      x = Math.max(gap, Math.min(x, window.innerWidth - f.width - gap))
      y = Math.max(gap, Math.min(y, window.innerHeight - f.height - gap))

      setPosition((previous) =>
        previous.x === x && previous.y === y && previous.placement === actual
          ? previous
          : { x, y, placement: actual },
      )
    }

    /**
     * Coalesced to one placement per frame.
     *
     * The scroll listener is on `window` in the capture phase, so it fires for
     * every scroller in the document — and each pass reads `getBoundingClientRect`
     * after the previous pass wrote new inline `left`/`top`, which makes the read
     * a *forced synchronous reflow* rather than a cached one. At scroll rate that
     * is a read-write-read thrash whose cost scales with the whole page's layout
     * tree. One `place()` per frame caps it regardless of event volume.
     */
    let frame = 0
    const schedule = () => {
      if (frame !== 0) return
      frame = requestAnimationFrame(() => {
        frame = 0
        place()
      })
    }

    place()
    window.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
    }
  }, [anchorRef, floatingRef, placement, gap, open])

  return position
}
