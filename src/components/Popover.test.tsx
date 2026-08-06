import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Popover } from './Popover'
import { ThemeProvider } from './ThemeProvider'

/**
 * jsdom implements no part of the popover API — no `showPopover`, no top layer,
 * no light dismiss. The component guards on that, so without the stubs below the
 * show path would never run at all.
 *
 * The inline `display` matters: jsdom *does* ship the UA rule
 * `[popover]:not(:popover-open) { display: none }`, and since `:popover-open`
 * can never match there, every popover would be permanently hidden — invisible
 * to `getByRole` and skipped by axe. The browser half (light dismiss, top-layer
 * paint order) is verified in Chromium by design-sync, not here.
 */
beforeEach(() => {
  HTMLElement.prototype.showPopover = function showPopover() {
    this.style.display = 'block'
  }
  HTMLElement.prototype.hidePopover = function hidePopover() {
    this.style.display = 'none'
  }
})

function renderPopover(props: { defaultOpen?: boolean; onOpenChange?: (open: boolean) => void } = {}) {
  return render(
    <ThemeProvider theme="dark">
      <Popover content={<a href="#method">How this is derived</a>} {...props}>
        <button type="button">Method</button>
      </Popover>
    </ThemeProvider>,
  )
}

describe('Popover', () => {
  it('opens from the trigger and reports the change', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    renderPopover({ onOpenChange })

    expect(screen.queryByRole('link')).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Method' }))

    expect(await screen.findByRole('link', { name: 'How this is derived' })).toBeInTheDocument()
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    renderPopover({ defaultOpen: true })
    expect(screen.getByRole('link')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('link')).toBeNull())
  })

  it('follows the browser when it light-dismisses itself', async () => {
    const onOpenChange = vi.fn()
    const { container } = renderPopover({ defaultOpen: true, onOpenChange })
    const panel = container.querySelector('[popover]')
    expect(panel).not.toBeNull()

    // What Chromium fires when a click outside dismisses an `auto` popover.
    const toggle = new Event('toggle')
    Object.assign(toggle, { oldState: 'open', newState: 'closed' })
    panel?.dispatchEvent(toggle)

    await waitFor(() => expect(screen.queryByRole('link')).toBeNull())
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('marks the trigger expanded and points it at the panel', async () => {
    const user = userEvent.setup()
    const { container } = renderPopover()
    const trigger = screen.getByRole('button', { name: 'Method' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger.getAttribute('aria-controls')).toBe(container.querySelector('[popover]')?.id)
  })

  it('uses an auto popover, which is what buys light dismiss', () => {
    const showPopover = vi.spyOn(HTMLElement.prototype, 'showPopover')
    const { container } = renderPopover({ defaultOpen: true })

    expect(container.querySelector('[popover]')).toHaveAttribute('popover', 'auto')
    expect(showPopover).toHaveBeenCalled()
  })

  it('has no axe violations while open', async () => {
    const { container } = renderPopover({ defaultOpen: true })

    await expectNoAxeViolations(container)
  })
})
