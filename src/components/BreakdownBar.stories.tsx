import type { Meta, StoryObj } from '@storybook/react-vite'
import { formatDelta } from '../lib/format'
import { BreakdownBar } from './Details'
import { Panel } from './Panel'

const meta = {
  title: 'Charts/BreakdownBar',
  component: BreakdownBar,
  parameters: {
    docs: {
      description: {
        component:
          'A labelled proportion bar. `fraction` is length relative to the largest sibling (0–1), not a share of a total — so the biggest row always fills the track and the rest read against it.',
      },
    },
  },
  args: { label: 'Platforms', value: '+$3.7B', fraction: 1, tone: 1 },
} satisfies Meta<typeof BreakdownBar>

export default meta
type Story = StoryObj<typeof meta>

export const Inflow: Story = {
  args: { label: 'Platforms', value: '+$3.7B', fraction: 1, tone: 1 },
}

export const Outflow: Story = {
  args: { label: 'Foundry', value: '−$2.4B', fraction: 1, tone: -1 },
}

export const Partial: Story = {
  args: { label: 'E-commerce', value: '+$1.1B', fraction: 0.3, tone: 1 },
}

export const Stack: Story = {
  args: { label: '', value: '', fraction: 0 },
  render: () => (
    <Panel style={{ maxWidth: 336 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(
          [
            ['Platforms', 3700, 1],
            ['Software', 3400, 0.92],
            ['Gaming', 2500, 0.68],
            ['E-commerce', 1100, 0.3],
          ] as const
        ).map(([name, value, fraction]) => (
          <BreakdownBar
            key={name}
            label={name}
            value={formatDelta(value, true)}
            fraction={fraction}
            tone={value}
          />
        ))}
      </div>
    </Panel>
  ),
}
