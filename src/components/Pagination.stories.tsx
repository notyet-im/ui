import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Pagination } from './Pagination'

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component:
          'Page navigation for a paged collection. The page list is built by the exported `paginationRange` helper, which keeps a fixed slot count once truncation starts so the control never changes width as you page through.',
      },
    },
  },
  args: {
    page: 1,
    pageCount: 10,
    onChange: () => {},
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

function PagingExample({ pageCount, siblingCount }: { pageCount: number; siblingCount?: number }) {
  const [page, setPage] = useState(1)
  return <Pagination page={page} pageCount={pageCount} siblingCount={siblingCount} onChange={setPage} />
}

export const Default: Story = {
  render: () => <PagingExample pageCount={10} />,
}

export const Short: Story = {
  name: 'Short (no truncation)',
  render: () => <PagingExample pageCount={5} />,
}

export const Long: Story = {
  name: 'Long (both markers)',
  render: () => <PagingExample pageCount={120} />,
}

export const Siblings: Story = {
  name: 'siblingCount = 2',
  render: () => <PagingExample pageCount={120} siblingCount={2} />,
}

export const Ends: Story = {
  name: 'Ends (prev/next disabled)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Pagination page={1} pageCount={10} onChange={() => {}} />
      <Pagination page={10} pageCount={10} onChange={() => {}} />
    </div>
  ),
}
