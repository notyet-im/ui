import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { TableSort } from './Table'
import { Table } from './Table'

interface FlowRow {
  id: string
  market: string
  sector: string
  net: number
  share: number
}

const ROWS: ReadonlyArray<FlowRow> = [
  { id: 'kr-semis', market: 'KR', sector: 'Semiconductors', net: 1240, share: 31.4 },
  { id: 'tw-hardware', market: 'TW', sector: 'Hardware', net: 802, share: 20.3 },
  { id: 'jp-autos', market: 'JP', sector: 'Autos', net: -415, share: 10.5 },
  { id: 'hk-financials', market: 'HK', sector: 'Financials', net: -168, share: 4.3 },
  { id: 'sg-reits', market: 'SG', sector: 'REITs', net: 96, share: 2.4 },
]

const signed = (value: number) => `${value < 0 ? '−' : '+'}${Math.abs(value)}m`

const COLUMNS = [
  { key: 'market', header: 'Market', width: '5rem' },
  { key: 'sector', header: 'Sector' },
  { key: 'net', header: 'Net flow', numeric: true, render: (row: FlowRow) => signed(row.net) },
  { key: 'share', header: 'Share', numeric: true, render: (row: FlowRow) => `${row.share.toFixed(1)}%` },
]

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          'A real `<table>` with a `<caption>` and `<th scope="col">`, generic over its row type. Below a narrow **container** width — not viewport width — each row reflows into a label/value list, so a table dropped into a sidebar never overflows it.',
      },
    },
  },
  args: {
    columns: COLUMNS,
    rows: ROWS,
    rowKey: (row: FlowRow) => row.id,
    caption: 'Net institutional flow by market and sector, 15 sessions',
  },
} satisfies Meta<typeof Table<FlowRow>>

export default meta
type Story = StoryObj<typeof meta>

function SortableExample() {
  const [sort, setSort] = useState<TableSort>({ key: 'net', direction: 'desc' })

  const rows = [...ROWS].sort((a, b) => {
    const factor = sort.direction === 'asc' ? 1 : -1
    const left = sort.key === 'net' ? a.net : sort.key === 'share' ? a.share : `${a[sort.key as 'market']}`
    const right = sort.key === 'net' ? b.net : sort.key === 'share' ? b.share : `${b[sort.key as 'market']}`
    return left < right ? -factor : left > right ? factor : 0
  })

  return (
    <Table
      columns={COLUMNS}
      rows={rows}
      rowKey={(row) => row.id}
      caption="Sortable — activate a header to change the order"
      sort={sort}
      onSortChange={(key, direction) => setSort({ key, direction })}
    />
  )
}

export const Default: Story = {}

export const Sorted: Story = {
  render: () => <SortableExample />,
}

export const Numeric: Story = {
  name: 'Numeric columns',
  render: () => (
    <Table
      density="compact"
      rows={ROWS}
      rowKey={(row) => row.id}
      caption="Numeric columns get tabular figures and right alignment"
      columns={[
        { key: 'market', header: 'Market' },
        { key: 'net', header: 'Net flow', numeric: true, render: (row) => signed(row.net) },
        { key: 'share', header: 'Share', numeric: true, render: (row) => `${row.share.toFixed(1)}%` },
        {
          key: 'avg',
          header: 'Avg / session',
          numeric: true,
          render: (row) => signed(Math.round(row.net / 15)),
        },
      ]}
    />
  ),
}

export const Empty: Story = {
  args: {
    rows: [],
    caption: 'No flow above the reporting threshold',
    empty: 'Nothing cleared the US$50m threshold in this window.',
  },
}

export const Narrow: Story = {
  name: 'Narrow container (stacked reflow)',
  render: () => (
    <div style={{ width: 360 }}>
      <Table
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(row) => row.id}
        caption="Same table, 360px container — the rows stack"
      />
    </div>
  ),
}
