import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme, themed } from '../test/render'
import { stubPopoverApi } from '../test/top-layer'
import type { ToastProps } from './Toast'
import { Toast, ToastViewport } from './Toast'

stubPopoverApi()

function renderToast(props: Partial<ToastProps> = {}) {
  return renderInTheme(
    <ToastViewport>
      <Toast
        open
        onClose={() => {}}
        duration={0}
        title="Rebalance queued"
        description="Settles at the close."
        {...props}
      />
    </ToastViewport>,
  )
}

describe('Toast', () => {
  it('announces itself through a polite live region', () => {
    renderToast()
    const toast = screen.getByRole('status')

    expect(toast).toHaveAttribute('aria-live', 'polite')
    expect(toast).toHaveTextContent('Rebalance queued')
    expect(toast).toHaveTextContent('Settles at the close.')
  })

  it('closes from the dismiss button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderToast({ onClose })

    await user.click(screen.getByRole('button', { name: 'Dismiss' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('dismisses itself once the duration is up', async () => {
    const onClose = vi.fn()
    renderToast({ onClose, duration: 20 })

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })

  it('stays put when the duration is 0', async () => {
    const onClose = vi.fn()
    renderToast({ onClose, duration: 0 })

    await new Promise((resolve) => setTimeout(resolve, 30))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not run the countdown while closed', async () => {
    const onClose = vi.fn()
    renderToast({ onClose, open: false, duration: 20 })

    await new Promise((resolve) => setTimeout(resolve, 40))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('marks the open state, which is what hides it without the popover API', () => {
    const { container, rerender } = renderToast()
    expect(screen.getByRole('status')).toHaveAttribute('data-open')

    rerender(
      themed(
        <ToastViewport>
          <Toast open={false} onClose={() => {}} duration={0} title="Rebalance queued" />
        </ToastViewport>,
      ),
    )

    // Queried through the container, not by role: the stylesheet now hides it,
    // which is the point — a hidden toast is out of the accessibility tree.
    expect(container.querySelector('.ny-toast')).not.toHaveAttribute('data-open')
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('puts the viewport in the top layer rather than on a z-index', () => {
    const showPopover = vi.spyOn(HTMLElement.prototype, 'showPopover')
    const { container } = renderToast()

    expect(container.querySelector('.ny-toast-viewport')).toHaveAttribute('popover', 'manual')
    expect(showPopover).toHaveBeenCalled()
  })

  it('has no axe violations', async () => {
    const { container } = renderToast({ tone: 'success' })

    await expectNoAxeViolations(container)
  })
})
