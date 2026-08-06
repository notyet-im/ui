import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

export interface Measurements {
  /** Measured content width of the observed element, in CSS pixels. 0 until first measure. */
  width: number
  /** Current `window.innerWidth`, for viewport-level breakpoints. */
  viewportWidth: number
}

/**
 * Measures an element and the viewport.
 *
 * The flow charts lay themselves out in real pixels rather than a scaled
 * viewBox — labels are HTML, so they must not scale with the drawing — which
 * means they need a measured width before they can draw anything.
 */
export function useMeasure<T extends HTMLElement>(): [RefObject<T | null>, Measurements] {
  const ref = useRef<T>(null)
  const [measurements, setMeasurements] = useState<Measurements>({ width: 0, viewportWidth: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const measure = () => {
      const width = element.clientWidth
      const viewportWidth = window.innerWidth
      setMeasurements((previous) =>
        previous.width === width && previous.viewportWidth === viewportWidth
          ? previous
          : { width, viewportWidth },
      )
    }

    measure()
    window.addEventListener('resize', measure)

    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure)
      observer.observe(element)
      observer.observe(document.body)
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
