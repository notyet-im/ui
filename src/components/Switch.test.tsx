import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme } from '../test/render'
import { Switch } from './Switch'

describe('Switch', () => {
  it('toggles when uncontrolled and reports the new state', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderInTheme(<Switch label="Live updates" onChange={onChange} />)

    const control = screen.getByRole('switch', { name: 'Live updates' })
    expect(control).toHaveAttribute('aria-checked', 'false')

    await user.click(control)
    expect(control).toHaveAttribute('aria-checked', 'true')
    expect(onChange).toHaveBeenLastCalledWith(true)

    await user.click(control)
    expect(control).toHaveAttribute('aria-checked', 'false')
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('is operable with Space and Enter', async () => {
    const user = userEvent.setup()
    renderInTheme(<Switch label="Live updates" />)

    const control = screen.getByRole('switch')
    await user.tab()
    expect(control).toHaveFocus()

    await user.keyboard(' ')
    expect(control).toBeChecked()

    await user.keyboard('{Enter}')
    expect(control).not.toBeChecked()
  })

  it('toggles when its label text is clicked', async () => {
    const user = userEvent.setup()
    renderInTheme(<Switch label="Live updates" />)

    await user.click(screen.getByText('Live updates'))
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('respects the checked prop when controlled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderInTheme(<Switch label="Live updates" checked={false} onChange={onChange} />)

    const control = screen.getByRole('switch')
    await user.click(control)

    expect(onChange).toHaveBeenCalledWith(true)
    // The owner did not move `checked`, so the control must not move either.
    expect(control).toHaveAttribute('aria-checked', 'false')
  })

  it('blocks interaction when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderInTheme(<Switch label="Unavailable" disabled onChange={onChange} />)

    const control = screen.getByRole('switch')
    await user.click(control)

    expect(control).toBeDisabled()
    expect(control).not.toBeChecked()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('has no axe violations', async () => {
    const { container } = renderInTheme(
      <>
        <Switch label="Live updates" defaultChecked />
        <Switch label="Compact" size="sm" />
        <Switch label="Unavailable" disabled />
      </>,
    )

    await expectNoAxeViolations(container)
  })
})
