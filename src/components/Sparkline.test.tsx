import { describe, expect, it } from 'vitest'
import { seriesPath } from '../lib/series'
import { renderInTheme } from '../test/render'
import { Sparkline } from './Sparkline'

/**
 * A series too short to be a line is not an edge case a caller can be expected
 * to catch — every way of drawing one emits a `d` the SVG parser rejects, and
 * the failure surfaces as a console error from deep inside the browser rather
 * than anywhere near the component.
 *
 * `StatTile` guarded it (`trend.length > 1`); `MomentumCard` did not; the first
 * consumer to select a bucket with no history logged
 * `Expected moveto path command ('M' or 'm'), " L330 66.0 …"`.
 */
describe('seriesPath with too few points', () => {
  it('draws nothing for an empty series, rather than an unparseable area', () => {
    const path = seriesPath([], 330, 74, 8)
    expect(path.line).toBe('')
    // The defect: `L…` with no preceding `M` is invalid, and browsers say so.
    expect(path.area).toBe('')
  })

  it('draws nothing for a single point, rather than NaN coordinates', () => {
    const path = seriesPath([42], 60, 24, 3)
    expect(path.line).toBe('')
    expect(path.area).toBe('')
  })

  it('still reports a usable zero line, which the baseline rule needs', () => {
    expect(Number.isFinite(seriesPath([], 330, 74, 8).zeroY)).toBe(true)
  })

  it('draws normally from two points up', () => {
    const path = seriesPath([1, 2], 60, 24, 3)
    expect(path.line.startsWith('M')).toBe(true)
    expect(path.area.startsWith('M')).toBe(true)
    expect(path.area.endsWith('Z')).toBe(true)
  })
})

describe('Sparkline', () => {
  /*
   * Asserted as "no svg", not "every path is empty" — the latter passes
   * vacuously the moment nothing renders, so it would keep passing whatever
   * this component did.
   */
  it('renders nothing at all for a series too short to draw', () => {
    for (const values of [[], [42]]) {
      const { container } = renderInTheme(<Sparkline values={values} area baseline />)
      expect(container.querySelector('svg')).toBeNull()
    }
  })

  it('reserves no layout box when there is nothing to draw', () => {
    // Inside the theme root, not `container` itself — `renderInTheme` wraps
    // everything in a provider element, so the emptiness to check is its.
    const { container } = renderInTheme(<Sparkline values={[]} width={60} height={24} />)
    expect(container.querySelector('.ny-root')?.childElementCount).toBe(0)
  })

  it('emits parseable path data for a real one', () => {
    const { container } = renderInTheme(<Sparkline values={[0, 1, -1, 2]} area />)
    for (const path of container.querySelectorAll('path')) {
      expect(path.getAttribute('d')?.startsWith('M')).toBe(true)
      expect(path.getAttribute('d')).not.toContain('NaN')
    }
  })
})
