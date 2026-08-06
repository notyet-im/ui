import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Skeleton } from './Skeleton'
import { ThemeProvider } from './ThemeProvider'

function renderSkeleton(element: ReactElement) {
  const { container } = render(<ThemeProvider>{element}</ThemeProvider>)
  const root = container.querySelector('.ny-skeleton')
  if (root == null) throw new Error('skeleton did not render')
  return { container, root }
}

describe('Skeleton', () => {
  it('is hidden from the accessibility tree — the container owns the loading semantics', () => {
    const { root } = renderSkeleton(<Skeleton />)

    expect(root).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders one bar by default, with no short-line modifier', () => {
    const { root } = renderSkeleton(<Skeleton />)

    expect(root.querySelectorAll('.ny-skeleton__line')).toHaveLength(1)
    expect(root.querySelector('.ny-skeleton__line--last')).toBeNull()
  })

  it('renders `lines` bars and shortens only the last one', () => {
    const { root } = renderSkeleton(<Skeleton lines={4} />)

    const bars = root.querySelectorAll('.ny-skeleton__line')
    expect(bars).toHaveLength(4)
    expect(bars[3]).toHaveClass('ny-skeleton__line--last')
    expect(bars[0]).not.toHaveClass('ny-skeleton__line--last')
  })

  it('draws rect and circle as a single element sized by width and height', () => {
    const { root } = renderSkeleton(<Skeleton shape="rect" width={160} height="4rem" />)

    expect(root).toHaveClass('ny-skeleton--rect')
    expect(root.querySelectorAll('.ny-skeleton__line')).toHaveLength(0)
    expect(root).toHaveStyle({ width: '160px' })
    // Asserted on the attribute rather than through `toHaveStyle`: jsdom resolves
    // `4rem` to `64px`, which would hide whether the string was passed through.
    expect(root.getAttribute('style')).toContain('height: 4rem')
  })

  it('has no axe violations for any shape', async () => {
    const { container } = render(
      <ThemeProvider>
        <Skeleton lines={3} />
        <Skeleton shape="rect" />
        <Skeleton shape="circle" />
      </ThemeProvider>,
    )

    await expectNoAxeViolations(container)
  })
})
