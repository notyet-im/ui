import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Panel, PanelHeading } from './Panel'
import { ThemeProvider } from './ThemeProvider'

describe('Panel', () => {
  it('renders its children on a surface', () => {
    render(
      <ThemeProvider>
        <Panel>content</Panel>
      </ThemeProvider>,
    )
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <Panel header="Alerts" footer="2 open">
          <PanelHeading title="Region rotation" subtitle="Row sold to column bought" />
        </Panel>
      </ThemeProvider>,
    )
    await expectNoAxeViolations(container)
  })
})

/**
 * Folded in from the deleted `Card`, which duplicated Panel's surface — same
 * border, radius and min-width — and had no consumers anywhere in the repo.
 * These cover the behaviour that came across with it.
 */
describe('Panel slots', () => {
  it('renders header and footer as divided regions', () => {
    render(
      <ThemeProvider>
        <Panel header="Alerts" footer="2 open">
          body
        </Panel>
      </ThemeProvider>,
    )
    expect(screen.getByText('Alerts')).toBeInTheDocument()
    expect(screen.getByText('body')).toBeInTheDocument()
    expect(screen.getByText('2 open')).toBeInTheDocument()
  })

  it('lays out as a column whenever a slot is present, without asking for it', () => {
    const { container } = render(
      <ThemeProvider>
        <Panel header="Alerts">body</Panel>
      </ThemeProvider>,
    )
    expect(container.querySelector('.ny-panel--column')).not.toBeNull()
  })

  it('wraps children in a body element only when slotted', () => {
    const { container: plain } = render(
      <ThemeProvider>
        <Panel>body</Panel>
      </ThemeProvider>,
    )
    expect(plain.querySelector('.ny-panel__body')).toBeNull()

    const { container: slotted } = render(
      <ThemeProvider>
        <Panel footer="x">body</Panel>
      </ThemeProvider>,
    )
    expect(slotted.querySelector('.ny-panel__body')).not.toBeNull()
  })

  it('marks an interactive panel so it can lift on hover', () => {
    const { container } = render(
      <ThemeProvider>
        <Panel interactive>body</Panel>
      </ThemeProvider>,
    )
    expect(container.querySelector('.ny-panel--interactive')).not.toBeNull()
  })
})
