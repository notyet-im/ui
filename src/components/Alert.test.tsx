import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Alert } from './Alert'
import { ThemeProvider } from './ThemeProvider'

describe('Alert', () => {
  it('renders the title and the message', () => {
    render(
      <ThemeProvider>
        <Alert title="Upload rejected">Rows 12 and 19 reference unknown accounts.</Alert>
      </ThemeProvider>,
    )

    expect(screen.getByText('Upload rejected')).toBeInTheDocument()
    expect(screen.getByText('Rows 12 and 19 reference unknown accounts.')).toBeInTheDocument()
  })

  it('announces danger and warning assertively, via role="alert"', () => {
    render(
      <ThemeProvider>
        <Alert tone="danger">Connection lost</Alert>
        <Alert tone="warning">Drift over threshold</Alert>
      </ThemeProvider>,
    )

    expect(screen.getAllByRole('alert')).toHaveLength(2)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('announces info and success politely, via role="status"', () => {
    render(
      <ThemeProvider>
        <Alert tone="info">Positions are delayed</Alert>
        <Alert tone="success">Rebalance queued</Alert>
      </ThemeProvider>,
    )

    expect(screen.getAllByRole('status')).toHaveLength(2)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders a dismiss control only when onDismiss is given, and calls it on click', async () => {
    const user = userEvent.setup()
    let dismissed = 0

    const { rerender } = render(
      <ThemeProvider>
        <Alert tone="success">Rebalance queued</Alert>
      </ThemeProvider>,
    )
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument()

    rerender(
      <ThemeProvider>
        <Alert tone="success" onDismiss={() => (dismissed += 1)}>
          Rebalance queued
        </Alert>
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(dismissed).toBe(1)
  })

  it('hides a decorative icon from assistive technology', () => {
    const { container } = render(
      <ThemeProvider>
        <Alert tone="warning" title="Drift" icon={<svg aria-hidden="true" />}>
          Two sleeves are off target.
        </Alert>
      </ThemeProvider>,
    )

    expect(container.querySelector('.ny-alert__icon')).toHaveAttribute('aria-hidden', 'true')
  })

  it('has no axe violations across every tone, with and without a dismiss control', async () => {
    const { container } = render(
      <ThemeProvider>
        <Alert tone="info" title="Delayed">
          Feeds are behind.
        </Alert>
        <Alert tone="success" title="Queued">
          14 orders staged.
        </Alert>
        <Alert tone="warning" title="Drift" onDismiss={() => {}}>
          Two sleeves are off target.
        </Alert>
        <Alert tone="danger" title="Rejected" onDismiss={() => {}}>
          Two rows are invalid.
        </Alert>
      </ThemeProvider>,
    )

    await expectNoAxeViolations(container)
  })
})
