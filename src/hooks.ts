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
 *
 * Pass `enabled: false` when the width is already known. A caller that supplies
 * an explicit width still has to attach the ref (the element is the same one it
 * draws into), so without this flag the observer runs and its result is thrown
 * away on every frame of a resize — which is precisely the cost the caller was
 * trying to avoid by measuring once itself.
 */
export function useMeasure<T extends HTMLElement>(enabled = true): [RefObject<T | null>, Measurements] {
  const ref = useRef<T>(null)
  const [measurements, setMeasurements] = useState<Measurements>({ width: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element || !enabled) return

    const measure = () => {
      const width = element.clientWidth
      setMeasurements((previous) => (previous.width === width ? previous : { width }))
    }

    /**
     * Coalesced to one measurement per frame, for the same reason
     * `useAnchoredPosition` coalesces `place()`.
     *
     * `measure()` reads `clientWidth`, and the state it sets drives inline
     * style writes on every chart label. A second read in the same frame lands
     * after those writes and is a forced synchronous reflow rather than a
     * cached one, so bursts of observer callbacks must not each get their own
     * read.
     */
    let frame = 0
    const schedule = () => {
      if (frame !== 0) return
      frame = requestAnimationFrame(() => {
        frame = 0
        measure()
      })
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
      observer = new ResizeObserver(schedule)
      observer.observe(element)
    } else {
      window.addEventListener('resize', schedule)
    }

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame)
      window.removeEventListener('resize', schedule)
      observer?.disconnect()
    }
  }, [enabled])

  return [ref, measurements]
}

/**
 * Shows an element in the browser top layer while `open`, and takes it back out
 * on the way past.
 *
 * Every popover-based component needs exactly this, and each had written it out:
 * the same nine lines in Tooltip, Popover and Toast, down to the guard comment.
 * The two halves are less symmetric than they look — `showPopover()` throws if
 * the element is already open, and `hidePopover()` throws if it is already
 * closed or detached — so the cleanup has to check both `isConnected` and
 * `:popover-open`, which is precisely the kind of detail that rots when it lives
 * in three places.
 */
export function useTopLayer(ref: RefObject<HTMLElement | null>, open = true): void {
  useEffect(() => {
    const element = ref.current
    // jsdom implements no part of the popover API, so guard rather than crash.
    if (!open || !element || typeof element.showPopover !== 'function') return
    element.showPopover()
    return () => {
      if (element.isConnected && element.matches(':popover-open')) element.hidePopover()
    }
  }, [ref, open])
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

export interface RovingGridCell {
  row: number
  column: number
}

export interface RovingGridOptions {
  rows: number
  columns: number
  /** The cell currently in the tab order. */
  active: RovingGridCell
  onMove: (cell: RovingGridCell) => void
}

export interface RovingGrid {
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void
  /** Spread onto each cell's focusable element. */
  getCellProps: (
    row: number,
    column: number,
  ) => { tabIndex: 0 | -1; 'data-roving-cell': string; onFocus: () => void }
}

/**
 * Module scope, not rebuilt per keystroke — they are fixed, and this is the
 * keydown path. The four arrows differ only by which axis moves and by which
 * direction, so a step table says that once instead of four times; adding
 * PageUp/PageDown later is a row here rather than another branch below.
 */
const ARROW_STEPS: Record<string, RovingGridCell> = {
  ArrowUp: { row: -1, column: 0 },
  ArrowDown: { row: 1, column: 0 },
  ArrowLeft: { row: 0, column: -1 },
  ArrowRight: { row: 0, column: 1 },
}

function clampAxis(value: number, length: number): number {
  return Math.max(0, Math.min(length - 1, value))
}

/**
 * Two-dimensional roving focus for a `role="grid"` — one tab stop that arrow
 * keys move within, per the WAI-ARIA APG grid pattern.
 *
 * `useRovingFocus` is the one-dimensional version and cannot stand in: a grid
 * needs row *and* column movement, and Home/End have to mean the ends of a row
 * rather than the ends of a flat list.
 *
 * ── Arrows CLAMP; they do not wrap. ────────────────────────────────────────
 * The 1-D hook wraps, which is right for a tablist, where the items are peers
 * in a ring. In a grid both axes carry meaning, so wrapping off the end of a
 * row crosses a row boundary AND a column boundary on one keystroke, and reads
 * as a glitch rather than as navigation. Ctrl+Home and Ctrl+End are the
 * deliberate jumps to either end of the grid, as the APG specifies.
 *
 * Cells are found by `data-roving-cell` within the container the handler is
 * attached to, so the hook needs no refs and works with any markup shape.
 */
export function useRovingGrid({ rows, columns, active, onMove }: RovingGridOptions): RovingGrid {
  /*
   * Clamped here, once, rather than by each caller. `rows`/`columns` belong to
   * the consumer and can shrink under a stored index, and only the cell that
   * matches `active` is tabbable — so an out-of-range one takes the whole grid
   * out of the tab order. Both `onKeyDown` and `getCellProps` read the clamped
   * pair, which is what makes that a guarantee of the hook rather than
   * something every consumer has to know to restate.
   */
  const activeRow = clampAxis(active.row, rows)
  const activeColumn = clampAxis(active.column, columns)

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (rows === 0 || columns === 0) return

      const step = ARROW_STEPS[event.key]
      let next: RovingGridCell | null = null
      if (step) {
        next = {
          row: clampAxis(activeRow + step.row, rows),
          column: clampAxis(activeColumn + step.column, columns),
        }
      } else if (event.key === 'Home') {
        next = event.ctrlKey ? { row: 0, column: 0 } : { row: activeRow, column: 0 }
      } else if (event.key === 'End') {
        next = event.ctrlKey
          ? { row: rows - 1, column: columns - 1 }
          : { row: activeRow, column: columns - 1 }
      } else {
        // Not ours — Tab in particular has to leave the grid.
        return
      }

      event.preventDefault()
      if (next.row === activeRow && next.column === activeColumn) return
      onMove(next)

      const selector = `[data-roving-cell="${next.row}-${next.column}"]`
      event.currentTarget.querySelector<HTMLElement>(selector)?.focus()
    },
    [activeColumn, activeRow, columns, onMove, rows],
  )

  const getCellProps = useCallback(
    (row: number, column: number) => ({
      tabIndex: (row === activeRow && column === activeColumn ? 0 : -1) as 0 | -1,
      'data-roving-cell': `${row}-${column}`,
      /*
       * Focus is the source of truth, not just an effect of arrowing.
       *
       * Without this the active cell only ever moves via `onKeyDown`, so a
       * click — which moves real DOM focus — leaves the two disagreeing, and
       * the next arrow key jumps back to wherever the keyboard last was. The
       * guard keeps `onMove` from firing on the focus this hook itself causes.
       */
      onFocus: () => {
        if (row !== activeRow || column !== activeColumn) onMove({ row, column })
      },
    }),
    [activeColumn, activeRow, onMove],
  )

  return { onKeyDown, getCellProps }
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
