import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme } from '../test/render'
import { Pagination, paginationRange } from './Pagination'

describe('paginationRange', () => {
  it('lists every page while they all fit', () => {
    expect(paginationRange(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(paginationRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('truncates only the far end near the start', () => {
    expect(paginationRange(1, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10])
    expect(paginationRange(3, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10])
  })

  it('truncates only the near end near the finish', () => {
    expect(paginationRange(10, 10)).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10])
    expect(paginationRange(8, 10)).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10])
  })

  it('truncates both ends in the middle', () => {
    expect(paginationRange(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10])
    expect(paginationRange(60, 120)).toEqual([1, 'ellipsis', 59, 60, 61, 'ellipsis', 120])
  })

  it('keeps a fixed slot count of 2 * siblingCount + 5 once truncated', () => {
    for (const page of [1, 2, 5, 40, 119, 120]) {
      expect(paginationRange(page, 120, 1)).toHaveLength(7)
      expect(paginationRange(page, 120, 2)).toHaveLength(9)
      expect(paginationRange(page, 120, 0)).toHaveLength(5)
    }
  })

  it('always keeps the first, last and current page, and never doubles a marker', () => {
    for (const page of [1, 2, 3, 47, 118, 119, 120]) {
      const items = paginationRange(page, 120, 2)
      expect(items[0]).toBe(1)
      expect(items[items.length - 1]).toBe(120)
      expect(items).toContain(page)
      for (let index = 1; index < items.length; index++) {
        expect(items[index] === 'ellipsis' && items[index - 1] === 'ellipsis').toBe(false)
      }
    }
  })

  it('widens the visible run with siblingCount', () => {
    expect(paginationRange(60, 120, 0)).toEqual([1, 'ellipsis', 60, 'ellipsis', 120])
    expect(paginationRange(60, 120, 2)).toEqual([1, 'ellipsis', 58, 59, 60, 61, 62, 'ellipsis', 120])
  })

  it('handles degenerate inputs without producing pages that do not exist', () => {
    expect(paginationRange(1, 0)).toEqual([])
    expect(paginationRange(1, 1)).toEqual([1])
    expect(paginationRange(-4, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10])
    expect(paginationRange(99, 10)).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10])
  })
})

describe('Pagination', () => {
  it('is a nav wrapping a list, with a spelled-out name per page', () => {
    renderInTheme(<Pagination page={1} pageCount={5} onChange={() => {}} />)

    const nav = screen.getByRole('navigation', { name: 'Pagination' })
    expect(nav.querySelector('ul')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument()
  })

  it('marks the current page with aria-current', () => {
    renderInTheme(<Pagination page={3} pageCount={5} onChange={() => {}} />)

    expect(screen.getByRole('button', { name: 'Go to page 3' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Go to page 2' })).not.toHaveAttribute('aria-current')
  })

  it('disables previous on the first page and next on the last', () => {
    const first = renderInTheme(<Pagination page={1} pageCount={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeEnabled()
    first.unmount()

    renderInTheme(<Pagination page={5} pageCount={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled()
  })

  it('reports the page the user asked for', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderInTheme(<Pagination page={3} pageCount={10} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Go to page 4' }))
    expect(onChange).toHaveBeenLastCalledWith(4)

    await user.click(screen.getByRole('button', { name: 'Go to next page' }))
    expect(onChange).toHaveBeenLastCalledWith(4)

    await user.click(screen.getByRole('button', { name: 'Go to previous page' }))
    expect(onChange).toHaveBeenLastCalledWith(2)
  })

  it('renders the truncation markers outside the accessibility tree', () => {
    const { container } = renderInTheme(<Pagination page={60} pageCount={120} onChange={() => {}} />)

    const markers = container.querySelectorAll('.ny-pagination__ellipsis')
    expect(markers).toHaveLength(2)
    for (const marker of markers) expect(marker).toHaveAttribute('aria-hidden', 'true')
  })

  it('is axe clean', async () => {
    const { container } = renderInTheme(<Pagination page={60} pageCount={120} onChange={() => {}} />)

    await expectNoAxeViolations(container)
  })
})
