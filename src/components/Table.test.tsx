import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import type { TableColumn, TableSort } from './Table'
import { Table } from './Table'
import { ThemeProvider } from './ThemeProvider'

interface FlowRow {
  id: string
  market: string
  net: number
}

const ROWS: ReadonlyArray<FlowRow> = [
  { id: 'kr', market: 'KR', net: 1240 },
  { id: 'tw', market: 'TW', net: 802 },
  { id: 'jp', market: 'JP', net: -415 },
]

const COLUMNS: ReadonlyArray<TableColumn<FlowRow>> = [
  { key: 'market', header: 'Market' },
  { key: 'net', header: 'Net flow', numeric: true },
]

function SortableTable() {
  const [sort, setSort] = useState<TableSort>({ key: 'market', direction: 'asc' })
  return (
    <Table
      columns={COLUMNS}
      rows={ROWS}
      rowKey={(row) => row.id}
      caption="Net flow"
      sort={sort}
      onSortChange={(key, direction) => setSort({ key, direction })}
    />
  )
}

describe('Table', () => {
  it('renders real table semantics: caption, column headers and rows', () => {
    render(
      <ThemeProvider>
        <Table columns={COLUMNS} rows={ROWS} rowKey={(row) => row.id} caption="Net flow by market" />
      </ThemeProvider>,
    )

    const table = screen.getByRole('table', { name: 'Net flow by market' })
    expect(table.tagName).toBe('TABLE')
    expect(table.querySelector('caption')).toHaveTextContent('Net flow by market')

    const headers = within(table).getAllByRole('columnheader')
    expect(headers.map((header) => header.textContent)).toEqual(['Market', 'Net flow'])
    for (const header of headers) expect(header).toHaveAttribute('scope', 'col')

    // One header row plus one row per datum.
    expect(within(table).getAllByRole('row')).toHaveLength(ROWS.length + 1)
    expect(screen.getByText('1240')).toBeInTheDocument()
  })

  it('reads row[key] when a column has no render, and marks numeric columns', () => {
    const { container } = render(
      <ThemeProvider>
        <Table
          columns={[
            { key: 'market', header: 'Market' },
            { key: 'net', header: 'Net flow', numeric: true, render: (row) => `${row.net}m` },
          ]}
          rows={ROWS}
          rowKey={(row) => row.id}
        />
      </ThemeProvider>,
    )

    expect(screen.getByText('KR')).toBeInTheDocument()
    expect(screen.getByText('1240m')).toBeInTheDocument()
    expect(container.querySelectorAll('.ny-table__cell--numeric')).toHaveLength(ROWS.length)
    expect(container.querySelectorAll('.ny-table__cell--end')).toHaveLength(ROWS.length)
  })

  it('shows the empty state instead of the body when rows is empty', () => {
    render(
      <ThemeProvider>
        <Table
          columns={COLUMNS}
          rows={[]}
          rowKey={(row: FlowRow) => row.id}
          empty="Nothing cleared the threshold."
        />
      </ThemeProvider>,
    )

    expect(screen.getByText('Nothing cleared the threshold.')).toBeInTheDocument()
    expect(screen.queryByText('KR')).toBeNull()
    // Header row plus the single empty row.
    expect(screen.getAllByRole('row')).toHaveLength(2)
  })

  it('has no sort buttons and no aria-sort without onSortChange', () => {
    render(
      <ThemeProvider>
        <Table columns={COLUMNS} rows={ROWS} rowKey={(row) => row.id} />
      </ThemeProvider>,
    )

    expect(screen.queryByRole('button')).toBeNull()
    for (const header of screen.getAllByRole('columnheader')) {
      expect(header).not.toHaveAttribute('aria-sort')
    }
  })

  it('flips aria-sort on the th when its header button is activated', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <SortableTable />
      </ThemeProvider>,
    )

    const [market, net] = screen.getAllByRole('columnheader')
    expect(market).toHaveAttribute('aria-sort', 'ascending')
    expect(net).toHaveAttribute('aria-sort', 'none')

    // Same column: toggles direction.
    await user.click(within(market).getByRole('button', { name: 'Market' }))
    expect(market).toHaveAttribute('aria-sort', 'descending')

    // Different column: starts at ascending and clears the old one.
    await user.click(within(net).getByRole('button', { name: 'Net flow' }))
    expect(net).toHaveAttribute('aria-sort', 'ascending')
    expect(market).toHaveAttribute('aria-sort', 'none')
  })

  it('reports the column key and next direction to onSortChange', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()

    render(
      <ThemeProvider>
        <Table
          columns={COLUMNS}
          rows={ROWS}
          rowKey={(row) => row.id}
          sort={{ key: 'net', direction: 'asc' }}
          onSortChange={onSortChange}
        />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Net flow' }))
    expect(onSortChange).toHaveBeenCalledWith('net', 'desc')

    await user.click(screen.getByRole('button', { name: 'Market' }))
    expect(onSortChange).toHaveBeenLastCalledWith('market', 'asc')
  })

  it('hides the per-cell reflow labels from assistive tech', () => {
    const { container } = render(
      <ThemeProvider>
        <Table columns={COLUMNS} rows={ROWS} rowKey={(row) => row.id} />
      </ThemeProvider>,
    )

    const labels = container.querySelectorAll('.ny-table__label')
    expect(labels).toHaveLength(ROWS.length * COLUMNS.length)
    for (const label of labels) expect(label).toHaveAttribute('aria-hidden', 'true')
  })

  it('is axe clean, sorted and empty alike', async () => {
    const sorted = render(
      <ThemeProvider>
        <SortableTable />
      </ThemeProvider>,
    )
    await expectNoAxeViolations(sorted.container)

    const empty = render(
      <ThemeProvider>
        <Table columns={COLUMNS} rows={[]} rowKey={(row: FlowRow) => row.id} caption="Net flow" />
      </ThemeProvider>,
    )
    await expectNoAxeViolations(empty.container)
  })
})
