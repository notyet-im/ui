import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Panel, PanelHeading } from '../components/Panel'
import { SegmentedControl } from '../components/SegmentedControl'
import { ThemeProvider } from '../components/ThemeProvider'
import { expectNoAxeViolations } from './axe'

/**
 * Proves the test harness itself, not the components: React 19 rendering,
 * jsdom, Testing Library queries, jest-dom matchers, CSS side-effect imports,
 * and the axe helper. If this file fails, the toolchain is broken — look here
 * before believing any other test result.
 *
 * Replaced by real per-component suites as they land; keep it until then so
 * `vitest run` never passes vacuously.
 */
describe('test harness', () => {
  it('renders a component tree inside ThemeProvider', () => {
    render(
      <ThemeProvider theme="dark">
        <Panel>
          <PanelHeading title="Harness" subtitle="toolchain check" />
        </Panel>
      </ThemeProvider>,
    )

    expect(screen.getByText('Harness')).toBeInTheDocument()
    expect(screen.getByText('toolchain check')).toBeInTheDocument()
  })

  it('applies the theme attribute that the token layer keys off', () => {
    const { container } = render(
      <ThemeProvider theme="light">
        <Panel>content</Panel>
      </ThemeProvider>,
    )

    expect(container.querySelector('[data-theme="light"]')).not.toBeNull()
  })

  it('runs axe against rendered output', async () => {
    const { container } = render(
      <ThemeProvider theme="dark">
        <SegmentedControl
          label="Flow source"
          value="combined"
          onChange={() => {}}
          items={[
            { value: 'inst', label: 'Institutional' },
            { value: 'combined', label: 'Combined' },
          ]}
        />
      </ThemeProvider>,
    )

    await expectNoAxeViolations(container)
  })
})
