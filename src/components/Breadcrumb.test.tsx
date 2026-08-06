import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Breadcrumb } from './Breadcrumb'
import { ThemeProvider } from './ThemeProvider'

const ITEMS = [
  { label: 'Markets', href: '#markets' },
  { label: 'Asia Pacific', href: '#apac' },
  { label: 'KR · Semiconductors' },
]

describe('Breadcrumb', () => {
  it('is a nav wrapping an ordered list', () => {
    const { container } = render(
      <ThemeProvider>
        <Breadcrumb items={ITEMS} />
      </ThemeProvider>,
    )

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(nav).toBeInTheDocument()
    expect(nav.querySelector('ol')).not.toBeNull()
    expect(container.querySelectorAll('li')).toHaveLength(3)
  })

  it('marks the last item as the current page and does not link it', () => {
    render(
      <ThemeProvider>
        <Breadcrumb items={ITEMS} />
      </ThemeProvider>,
    )

    const current = screen.getByText('KR · Semiconductors')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current.tagName).toBe('SPAN')
    expect(screen.queryByRole('link', { name: 'KR · Semiconductors' })).toBeNull()

    const links = screen.getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(['Markets', 'Asia Pacific'])
  })

  it('renders an item with only an onClick as a button and calls it', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <ThemeProvider>
        <Breadcrumb items={[{ label: 'Markets', onClick }, { label: 'Asia Pacific' }]} />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Markets' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('uses the supplied accessible name for the nav', () => {
    render(
      <ThemeProvider>
        <Breadcrumb items={ITEMS} label="Flow drill-down" />
      </ThemeProvider>,
    )

    expect(screen.getByRole('navigation', { name: 'Flow drill-down' })).toBeInTheDocument()
  })

  it('is axe clean', async () => {
    const { container } = render(
      <ThemeProvider>
        <Breadcrumb items={ITEMS} />
      </ThemeProvider>,
    )

    await expectNoAxeViolations(container)
  })
})
