import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'
import { Table } from './Table'

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          'A composed surface with optional `header` and `footer` slots. Use `Card` for a discrete object in a list or grid — especially one you can click; use `Panel` for a plain dashboard region.',
      },
    },
  },
  args: {
    header: 'Net institutional flow',
    children: 'Aggregated across US · EU · JP · KR · TW · HK · SG over the last 15 sessions.',
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithFooter: Story = {
  args: {
    footer: 'Updated 4 minutes ago',
  },
}

export const Interactive: Story = {
  args: {
    interactive: true,
    header: <a href="#kr-semis">KR · Semiconductors</a>,
    children: 'Third consecutive session of net buying, led by two offshore funds.',
    footer: '+US$1.2bn · 15D',
  },
}

export const Densities: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      <Card padding="compact" header="Compact">
        For dense grids where the cards are the density.
      </Card>
      <Card padding="default" header="Default">
        The standard inset, matching Panel.
      </Card>
    </div>
  ),
}

export const Flush: Story = {
  name: 'Flush (padding none)',
  render: () => (
    <Card padding="none" header={<span style={{ padding: 16, display: 'block' }}>Top movers</span>}>
      <Table
        density="compact"
        rowKey={(row) => row.code}
        columns={[
          { key: 'code', header: 'Market' },
          { key: 'net', header: 'Net', numeric: true },
        ]}
        rows={[
          { code: 'KR', net: '+1.2bn' },
          { code: 'TW', net: '+0.8bn' },
          { code: 'JP', net: '−0.4bn' },
        ]}
      />
    </Card>
  ),
}
