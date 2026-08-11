import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme } from '../test/render'
import { stubPopoverApi } from '../test/top-layer'
import { Tooltip } from './Tooltip'

stubPopoverApi()

function renderTooltip(props: { delay?: number; defaultOpen?: boolean } = {}) {
  return renderInTheme(
    <Tooltip content="Net of ETF creations." delay={0} {...props}>
      <button type="button">Net flow</button>
    </Tooltip>,
  )
}

describe('Tooltip', () => {
  it('opens on hover', async () => {
    const user = userEvent.setup()
    renderTooltip()

    expect(screen.queryByRole('tooltip')).toBeNull()
    await user.hover(screen.getByRole('button', { name: 'Net flow' }))

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Net of ETF creations.')
  })

  it('opens on focus as well, so keyboard users get the label', async () => {
    const user = userEvent.setup()
    renderTooltip()

    await user.tab()

    expect(screen.getByRole('button', { name: 'Net flow' })).toHaveFocus()
    expect(await screen.findByRole('tooltip')).toBeInTheDocument()
  })

  it('closes again when the pointer leaves', async () => {
    const user = userEvent.setup()
    renderTooltip()
    const trigger = screen.getByRole('button', { name: 'Net flow' })

    await user.hover(trigger)
    await screen.findByRole('tooltip')
    await user.unhover(trigger)

    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull())
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    renderTooltip({ defaultOpen: true })
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull())
  })

  it('describes the trigger while open, and only while open', async () => {
    const user = userEvent.setup()
    renderTooltip()
    const trigger = screen.getByRole('button', { name: 'Net flow' })

    expect(trigger).not.toHaveAttribute('aria-describedby')
    await user.hover(trigger)
    const tooltip = await screen.findByRole('tooltip')

    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id)
  })

  it('shows itself through the popover API rather than a z-index', () => {
    const showPopover = vi.spyOn(HTMLElement.prototype, 'showPopover')
    renderTooltip({ defaultOpen: true })

    expect(screen.getByRole('tooltip')).toHaveAttribute('popover', 'manual')
    expect(showPopover).toHaveBeenCalled()
  })

  it('has no axe violations while open', async () => {
    const { container } = renderTooltip({ defaultOpen: true })

    await expectNoAxeViolations(container)
  })
})
