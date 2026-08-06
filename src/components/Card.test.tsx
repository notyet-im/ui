import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Card } from './Card'
import { ThemeProvider } from './ThemeProvider'

describe('Card', () => {
  it('renders the header, body and footer slots', () => {
    render(
      <ThemeProvider>
        <Card header="Net flow" footer="Updated 4m ago">
          Body copy
        </Card>
      </ThemeProvider>,
    )

    expect(screen.getByText('Net flow')).toBeInTheDocument()
    expect(screen.getByText('Body copy')).toBeInTheDocument()
    expect(screen.getByText('Updated 4m ago')).toBeInTheDocument()
  })

  it('omits the slots that were not passed, so no empty dividers render', () => {
    const { container } = render(
      <ThemeProvider>
        <Card>Body only</Card>
      </ThemeProvider>,
    )

    expect(container.querySelector('.ny-card__header')).toBeNull()
    expect(container.querySelector('.ny-card__footer')).toBeNull()
    expect(container.querySelector('.ny-card__body')).not.toBeNull()
  })

  it('carries the padding and interactive modifiers, and merges className', () => {
    const { container } = render(
      <ThemeProvider>
        <Card padding="compact" interactive className="custom">
          Body
        </Card>
      </ThemeProvider>,
    )

    const card = container.querySelector('.ny-card')
    expect(card).toHaveClass('ny-card--compact')
    expect(card).toHaveClass('ny-card--interactive')
    expect(card).toHaveClass('custom')
  })

  it('is not itself a control when interactive — the real control lives inside', () => {
    render(
      <ThemeProvider>
        <Card interactive header={<a href="#kr">KR · Semiconductors</a>}>
          Body
        </Card>
      </ThemeProvider>,
    )

    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByRole('link', { name: 'KR · Semiconductors' })).toBeInTheDocument()
  })

  it('is axe clean', async () => {
    const { container } = render(
      <ThemeProvider>
        <Card interactive header={<a href="#kr">KR · Semiconductors</a>} footer="+US$1.2bn">
          Third consecutive session of net buying.
        </Card>
      </ThemeProvider>,
    )

    await expectNoAxeViolations(container)
  })
})
