import type { Meta, StoryObj } from '@storybook/react-vite'
import { formatDelta } from '../lib/format'
import { walkSeries } from '../lib/series'
import { MomentumCard } from './Details'

const meta = {
  title: 'UI/MomentumCard',
  component: MomentumCard,
  parameters: {
    docs: {
      description: {
        component:
          'A clickable tile pairing a headline figure with its path over time. The whole card is the button — use it when the tile is a drill-down, not just a readout.',
      },
    },
  },
  args: {
    name: 'Tech & Internet',
    value: '+$7.5B',
    share: '+33.2% of flow',
    tone: 7500,
    trend: walkSeries('Tech & Internet', 22, 7500),
  },
} satisfies Meta<typeof MomentumCard>

export default meta
type Story = StoryObj<typeof meta>

export const Inflow: Story = {}

export const Outflow: Story = {
  args: {
    name: 'Semiconductors',
    value: '−$7.0B',
    share: '−30.8% of flow',
    tone: -7000,
    trend: walkSeries('Semiconductors', 22, -7000),
  },
}

export const Grid: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 14,
        gridTemplateColumns: 'repeat(auto-fit, minmax(158px, 1fr))',
        maxWidth: 700,
      }}
    >
      {(
        [
          ['Semiconductors', -7000, '−30.8% of flow'],
          ['Tech & Internet', 7500, '+33.2% of flow'],
          ['Financials', 1600, '+7.1% of flow'],
          ['Industrials', 3300, '+14.5% of flow'],
        ] as const
      ).map(([name, value, share]) => (
        <MomentumCard
          key={name}
          name={name}
          value={formatDelta(value, true)}
          share={share}
          tone={value}
          trend={walkSeries(name, 22, value)}
        />
      ))}
    </div>
  ),
}
