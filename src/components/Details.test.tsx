import { readFile } from 'node:fs/promises'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderInTheme } from '../test/render'
import { BreakdownBar, DataRow, MomentumCard } from './Details'

const TEAL = 'rgb(47, 191, 168)'
const RUST = 'rgb(224, 112, 63)'

/**
 * The delta scale is the system's data encoding, so painting something off it
 * has to be deliberate and explicit.
 *
 * `DataRow` has always had `valueColor` for this; `BreakdownBar` did not, and
 * its colour is written inline — which left a consumer needing to place two
 * quantities on different scales with no option but an `!important` rule
 * against `.ny-breakdown__value` and `.ny-breakdown__fill`. Reaching past a
 * component's API into its class names is the thing this prop exists to stop.
 */
describe('BreakdownBar colour', () => {
  it('derives the colour from tone by default', () => {
    const { container } = renderInTheme(
      <BreakdownBar label="Memory" value="+$1.7B" fraction={1} tone={1700} />,
    )
    expect(screen.getByText('+$1.7B').style.color).toBe(TEAL)
    expect(container.querySelector<HTMLElement>('.ny-breakdown__fill')?.style.background).toBe(TEAL)
  })

  it('follows the sign of tone', () => {
    renderInTheme(<BreakdownBar label="Memory" value="−$1.7B" fraction={1} tone={-1700} />)
    expect(screen.getByText('−$1.7B').style.color).toBe(RUST)
  })

  it('takes an explicit colour over tone, on both the figure and the fill', () => {
    const { container } = renderInTheme(
      <BreakdownBar label="Memory" value="+$1.7B" fraction={0.5} tone={1700} color="var(--ny-text)" />,
    )
    expect(screen.getByText('+$1.7B').style.color).toBe('var(--ny-text)')
    expect(container.querySelector<HTMLElement>('.ny-breakdown__fill')?.style.background).toBe(
      'var(--ny-text)',
    )
  })

  it('paints the figure apart from the fill when asked', () => {
    const { container } = renderInTheme(
      <BreakdownBar
        label="Memory"
        value="+$1.7B"
        fraction={0.5}
        tone={1700}
        color="var(--ny-text-muted)"
        valueColor="var(--ny-text)"
      />,
    )
    expect(screen.getByText('+$1.7B').style.color).toBe('var(--ny-text)')
    expect(container.querySelector<HTMLElement>('.ny-breakdown__fill')?.style.background).toBe(
      'var(--ny-text-muted)',
    )
  })

  it('matches DataRow, whose valueColor already worked this way', () => {
    renderInTheme(<DataRow label="005930.KS" value="−$1.2B" tone={-1200} valueColor="var(--ny-text)" />)
    expect(screen.getByText('−$1.2B').style.color).toBe('var(--ny-text)')
  })
})

/**
 * A selection ring the consumer draws itself loses to `:hover` on specificity,
 * and `className` cannot carry `aria-pressed` at all — so a selected card was
 * both un-announceable and un-ringed the moment a pointer touched it.
 */
describe('MomentumCard selection', () => {
  const card = { name: 'Semiconductors', value: '+$3.5B', tone: 3500, trend: [0, 1, 2] }

  it('says nothing about pressed state when selection is not modelled', () => {
    renderInTheme(<MomentumCard {...card} />)
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBeNull()
  })

  it('announces and rings the selected card', () => {
    renderInTheme(<MomentumCard {...card} selected />)
    const button = screen.getByRole('button')
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(button.classList.contains('ny-momentum--selected')).toBe(true)
  })

  it('announces the unselected state explicitly once selection is modelled', () => {
    renderInTheme(<MomentumCard {...card} selected={false} />)
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByRole('button').classList.contains('ny-momentum--selected')).toBe(false)
  })
})

/**
 * Specificity, asserted rather than assumed.
 *
 * `.ny-momentum--selected:hover` and `.ny-momentum:hover` are both (0,2,0), so
 * source order is the only thing separating them — and the first version of the
 * selected rule was declared before the hover rule and silently lost. jsdom
 * computes no stylesheet cascade, so this checks the ordering in the CSS text
 * itself, which is where the bug actually lived.
 */
describe('MomentumCard selection ring vs hover', () => {
  it('declares the selected ring after the hover rule it has to beat', async () => {
    // Repo-relative: vitest runs from the package root.
    const css = await readFile('src/components/Details.css', 'utf8')
    expect(css.indexOf('.ny-momentum--selected:hover')).toBeGreaterThan(css.indexOf('.ny-momentum:hover'))
  })
})
