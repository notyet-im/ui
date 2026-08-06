import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { ThemeProvider } from './ThemeProvider'
import { Tooltip } from './Tooltip'

/**
 * jsdom implements no part of the popover API — no `showPopover`, no top layer,
 * no `:popover-open`. The component guards on that, so without the stubs below
 * the show path would never run at all.
 *
 * The inline `display` matters: jsdom *does* ship the UA rule
 * `[popover]:not(:popover-open) { display: none }`, and since `:popover-open`
 * can never match there, every popover would be permanently hidden — invisible
 * to `getByRole` and skipped by axe. Setting it inline is the smallest way to
 * model what `showPopover()` actually does. Whether the browser then paints it
 * in the top layer is verified in Chromium by design-sync, not here.
 */
beforeEach(() => {
  HTMLElement.prototype.showPopover = function showPopover() {
    this.style.display = 'block'
  }
  HTMLElement.prototype.hidePopover = function hidePopover() {
    this.style.display = 'none'
  }
})

function renderTooltip(props: { delay?: number; defaultOpen?: boolean } = {}) {
  return render(
    <ThemeProvider theme="dark">
      <Tooltip content="Net of ETF creations." delay={0} {...props}>
        <button type="button">Net flow</button>
      </Tooltip>
    </ThemeProvider>,
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
