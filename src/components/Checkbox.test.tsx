import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Checkbox } from './Checkbox'
import { ThemeProvider } from './ThemeProvider'

describe('Checkbox', () => {
  it('toggles when uncontrolled', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <Checkbox label="Include ETF flows" />
      </ThemeProvider>,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Include ETF flows' })
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('toggles when its label is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ThemeProvider>
        <Checkbox label="Include ETF flows" onChange={onChange} />
      </ThemeProvider>,
    )

    await user.click(screen.getByText('Include ETF flows'))

    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('respects the checked prop when controlled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ThemeProvider>
        <Checkbox label="Include ETF flows" checked={false} onChange={onChange} />
      </ThemeProvider>,
    )

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(onChange).toHaveBeenCalledWith(true)
    // The owner did not move `checked`, so the control must not move either.
    expect(checkbox).not.toBeChecked()
  })

  it('exposes indeterminate as the DOM property and as aria-checked="mixed"', () => {
    render(
      <ThemeProvider>
        <Checkbox label="All sources" indeterminate />
      </ThemeProvider>,
    )

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    expect(checkbox).toBePartiallyChecked()
  })

  it('drops aria-checked once it is no longer mixed', () => {
    const { rerender } = render(
      <ThemeProvider>
        <Checkbox label="All sources" indeterminate />
      </ThemeProvider>,
    )

    rerender(
      <ThemeProvider>
        <Checkbox label="All sources" checked />
      </ThemeProvider>,
    )

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.indeterminate).toBe(false)
    expect(checkbox).not.toHaveAttribute('aria-checked')
    expect(checkbox).toBeChecked()
  })

  it('blocks interaction when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ThemeProvider>
        <Checkbox label="Unavailable" disabled onChange={onChange} />
      </ThemeProvider>,
    )

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(checkbox).not.toBeChecked()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <Checkbox label="Include ETF flows" defaultChecked />
        <Checkbox label="All sources" indeterminate />
        <Checkbox label="Unavailable" disabled />
      </ThemeProvider>,
    )

    await expectNoAxeViolations(container)
  })
})
