import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import type { DialogProps } from './Dialog'
import { Dialog } from './Dialog'
import { ThemeProvider } from './ThemeProvider'

/**
 * jsdom 30 ships `HTMLDialogElement` with no methods at all — no `showModal`,
 * no `close`, and no top layer. So none of this asserts real modality: the
 * focus trap, `::backdrop` and page inertness come from the browser and are
 * verified in Chromium by design-sync.
 *
 * What is asserted here is the wiring the component is responsible for — that
 * it calls `showModal()` / `close()` at the right moments, that it answers the
 * native `close` event, and that the ARIA ids resolve. The stubs below give the
 * element just enough behaviour for that: they flip `open` the way a browser
 * would, and `close()` fires the `close` event Escape would have fired.
 */
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close() {
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
})

function renderDialog(props: Partial<DialogProps> = {}) {
  return render(
    <ThemeProvider theme="dark">
      <Dialog
        open
        onClose={() => {}}
        title="Rebalance the book"
        description="Settles at the close."
        {...props}
      >
        Institutional flow has run ahead of the ETF leg.
      </Dialog>
    </ThemeProvider>,
  )
}

describe('Dialog', () => {
  it('calls showModal when it opens and close when it closes', () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal')
    const close = vi.spyOn(HTMLDialogElement.prototype, 'close')

    const { rerender } = render(
      <ThemeProvider theme="dark">
        <Dialog open={false} onClose={() => {}} title="Rebalance" />
      </ThemeProvider>,
    )
    expect(showModal).not.toHaveBeenCalled()

    rerender(
      <ThemeProvider theme="dark">
        <Dialog open onClose={() => {}} title="Rebalance" />
      </ThemeProvider>,
    )
    expect(showModal).toHaveBeenCalledTimes(1)

    rerender(
      <ThemeProvider theme="dark">
        <Dialog open={false} onClose={() => {}} title="Rebalance" />
      </ThemeProvider>,
    )
    expect(close).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the native close event fires, as Escape does', () => {
    const onClose = vi.fn()
    const { container } = renderDialog({ onClose })

    const dialog = container.querySelector('dialog')
    expect(dialog).not.toBeNull()
    dialog?.dispatchEvent(new Event('close'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose a second time when the owner closes it', () => {
    const onClose = vi.fn()
    const { rerender } = renderDialog({ onClose })

    // Closing from props runs `close()`, which fires the same native event a
    // user dismissal does. Only the user dismissal should reach `onClose`.
    rerender(
      <ThemeProvider theme="dark">
        <Dialog open={false} onClose={onClose} title="Rebalance the book" />
      </ThemeProvider>,
    )

    expect(onClose).not.toHaveBeenCalled()
  })

  it('names and describes itself from the rendered title and description', () => {
    const { container } = renderDialog()
    const dialog = container.querySelector('dialog')

    const labelledBy = dialog?.getAttribute('aria-labelledby')
    const describedBy = dialog?.getAttribute('aria-describedby')
    expect(labelledBy).toBeTruthy()
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(labelledBy as string)).toHaveTextContent('Rebalance the book')
    expect(document.getElementById(describedBy as string)).toHaveTextContent('Settles at the close.')
  })

  it('omits the ARIA references when there is nothing to point at', () => {
    const { container } = render(
      <ThemeProvider theme="dark">
        <Dialog open onClose={() => {}} />
      </ThemeProvider>,
    )
    const dialog = container.querySelector('dialog')

    expect(dialog).not.toHaveAttribute('aria-labelledby')
    expect(dialog).not.toHaveAttribute('aria-describedby')
  })

  it('closes from the close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderDialog({ onClose, closeLabel: 'Close' })

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('has no axe violations while open', async () => {
    const { container } = renderDialog({
      footer: <button type="button">Queue it</button>,
    })

    await expectNoAxeViolations(container)
  })
})
