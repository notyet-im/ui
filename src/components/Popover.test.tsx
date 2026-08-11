import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme } from '../test/render'
import { stubPopoverApi } from '../test/top-layer'
import { Popover } from './Popover'

stubPopoverApi()

function renderPopover(props: { defaultOpen?: boolean; onOpenChange?: (open: boolean) => void } = {}) {
  return renderInTheme(
    <Popover content={<a href="#method">How this is derived</a>} {...props}>
      <button type="button">Method</button>
    </Popover>,
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
