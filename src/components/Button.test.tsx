import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { FormEvent } from 'react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme } from '../test/render'
import { Button } from './Button'

describe('Button', () => {
  it('calls onClick when pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderInTheme(<Button onClick={onClick}>Rebalance</Button>)

    await user.click(screen.getByRole('button', { name: 'Rebalance' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('defaults to type="button" so it never submits a form by accident', () => {
    renderInTheme(<Button>Rebalance</Button>)

    expect(screen.getByRole('button', { name: 'Rebalance' })).toHaveAttribute('type', 'button')
  })

  it('submits its form when type is submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault())
    renderInTheme(
      <form onSubmit={onSubmit}>
        <Button type="submit">Save</Button>
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('blocks clicks when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderInTheme(
      <Button disabled onClick={onClick}>
        Rebalance
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: 'Rebalance' }))

    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Rebalance' })).toBeDisabled()
  })

  it('blocks clicks and announces busy while loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderInTheme(
      <Button loading onClick={onClick}>
        Fetching flows
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Fetching flows' })
    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('exposes the underlying element through ref', () => {
    const ref = createRef<HTMLButtonElement>()
    renderInTheme(<Button ref={ref}>Rebalance</Button>)

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('keeps icons out of the accessible name', () => {
    renderInTheme(
      <Button iconStart={<svg aria-hidden="true" />} iconEnd={<svg aria-hidden="true" />}>
        Download
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument()
  })

  it('is axe clean across every variant, including disabled and loading', async () => {
    const { container } = renderInTheme(
      <>
        <Button variant="primary">Rebalance</Button>
        <Button variant="secondary">Compare</Button>
        <Button variant="ghost">Reset</Button>
        <Button variant="danger">Delete</Button>
        <Button disabled>Locked</Button>
        <Button loading>Fetching</Button>
      </>,
    )

    await expectNoAxeViolations(container)
  })
})
