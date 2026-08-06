import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Spinner } from './Spinner'
import { ThemeProvider } from './ThemeProvider'

describe('Spinner', () => {
  it('exposes a polite live region named "Loading" by default', () => {
    render(
      <ThemeProvider>
        <Spinner />
      </ThemeProvider>,
    )

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  it('uses the given label for both the name and the announced text', () => {
    render(
      <ThemeProvider>
        <Spinner label="Fetching flows" />
      </ThemeProvider>,
    )

    const spinner = screen.getByRole('status', { name: 'Fetching flows' })
    expect(spinner).toHaveTextContent('Fetching flows')
  })

  it('keeps the label readable by screen readers while hiding it visually', () => {
    const { container } = render(
      <ThemeProvider>
        <Spinner />
      </ThemeProvider>,
    )

    expect(container.querySelector('.ny-visually-hidden')).toHaveTextContent('Loading')
    expect(container.querySelector('.ny-spinner__ring')).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies the size modifier', () => {
    const { container } = render(
      <ThemeProvider>
        <Spinner size="lg" />
      </ThemeProvider>,
    )

    expect(container.querySelector('.ny-spinner')).toHaveClass('ny-spinner--lg')
  })

  it('has no axe violations at any size', async () => {
    const { container } = render(
      <ThemeProvider>
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" label="Loading positions" />
      </ThemeProvider>,
    )

    await expectNoAxeViolations(container)
  })
})
