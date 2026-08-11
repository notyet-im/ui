import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme } from '../test/render'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('exposes a polite live region named "Loading" by default', () => {
    renderInTheme(<Spinner />)

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  it('uses the given label for both the name and the announced text', () => {
    renderInTheme(<Spinner label="Fetching flows" />)

    const spinner = screen.getByRole('status', { name: 'Fetching flows' })
    expect(spinner).toHaveTextContent('Fetching flows')
  })

  it('keeps the label readable by screen readers while hiding it visually', () => {
    const { container } = renderInTheme(<Spinner />)

    expect(container.querySelector('.ny-visually-hidden')).toHaveTextContent('Loading')
    expect(container.querySelector('.ny-spinner__ring')).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies the size modifier', () => {
    const { container } = renderInTheme(<Spinner size="lg" />)

    expect(container.querySelector('.ny-spinner')).toHaveClass('ny-spinner--lg')
  })

  it('has no axe violations at any size', async () => {
    const { container } = renderInTheme(
      <>
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" label="Loading positions" />
      </>,
    )

    await expectNoAxeViolations(container)
  })
})
