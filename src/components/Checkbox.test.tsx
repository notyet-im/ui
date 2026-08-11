import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme, themed } from '../test/render'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('toggles when uncontrolled', async () => {
    const user = userEvent.setup()
    renderInTheme(<Checkbox label="Include ETF flows" />)

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
    renderInTheme(<Checkbox label="Include ETF flows" onChange={onChange} />)

    await user.click(screen.getByText('Include ETF flows'))

    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('respects the checked prop when controlled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderInTheme(<Checkbox label="Include ETF flows" checked={false} onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(onChange).toHaveBeenCalledWith(true)
    // The owner did not move `checked`, so the control must not move either.
    expect(checkbox).not.toBeChecked()
  })

  it('exposes indeterminate as the DOM property and as aria-checked="mixed"', () => {
    renderInTheme(<Checkbox label="All sources" indeterminate />)

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    expect(checkbox).toBePartiallyChecked()
  })

  it('drops aria-checked once it is no longer mixed', () => {
    const { rerender } = renderInTheme(<Checkbox label="All sources" indeterminate />)

    rerender(themed(<Checkbox label="All sources" checked />))

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.indeterminate).toBe(false)
    expect(checkbox).not.toHaveAttribute('aria-checked')
    expect(checkbox).toBeChecked()
  })

  it('blocks interaction when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderInTheme(<Checkbox label="Unavailable" disabled onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(checkbox).not.toBeChecked()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('has no axe violations', async () => {
    const { container } = renderInTheme(
      <>
        <Checkbox label="Include ETF flows" defaultChecked />
        <Checkbox label="All sources" indeterminate />
        <Checkbox label="Unavailable" disabled />
      </>,
    )

    await expectNoAxeViolations(container)
  })
})
