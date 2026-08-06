import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { FormEvent } from 'react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Button } from './Button'
import { ThemeProvider } from './ThemeProvider'

describe('Button', () => {
  it('calls onClick when pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ThemeProvider>
        <Button onClick={onClick}>Rebalance</Button>
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Rebalance' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(
      <ThemeProvider>
        <Button>Rebalance</Button>
      </ThemeProvider>,
    )

    expect(screen.getByRole('button', { name: 'Rebalance' })).toHaveAttribute('type', 'button')
  })

  it('submits its form when type is submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault())
    render(
      <ThemeProvider>
        <form onSubmit={onSubmit}>
          <Button type="submit">Save</Button>
        </form>
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('blocks clicks when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ThemeProvider>
        <Button disabled onClick={onClick}>
          Rebalance
        </Button>
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Rebalance' }))

    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Rebalance' })).toBeDisabled()
  })

  it('blocks clicks and announces busy while loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ThemeProvider>
        <Button loading onClick={onClick}>
          Fetching flows
        </Button>
      </ThemeProvider>,
    )

    const button = screen.getByRole('button', { name: 'Fetching flows' })
    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('exposes the underlying element through ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <ThemeProvider>
        <Button ref={ref}>Rebalance</Button>
      </ThemeProvider>,
    )

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('keeps icons out of the accessible name', () => {
    render(
      <ThemeProvider>
        <Button iconStart={<svg aria-hidden="true" />} iconEnd={<svg aria-hidden="true" />}>
          Download
        </Button>
      </ThemeProvider>,
    )

    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument()
  })

  it('is axe clean across every variant, including disabled and loading', async () => {
    const { container } = render(
      <ThemeProvider>
        <Button variant="primary">Rebalance</Button>
        <Button variant="secondary">Compare</Button>
        <Button variant="ghost">Reset</Button>
        <Button variant="danger">Delete</Button>
        <Button disabled>Locked</Button>
        <Button loading>Fetching</Button>
      </ThemeProvider>,
    )

    await expectNoAxeViolations(container)
  })
})
