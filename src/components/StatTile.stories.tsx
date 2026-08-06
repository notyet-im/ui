import type { Meta, StoryObj } from '@storybook/react-vite'
import { MacroStrip, StatTile } from './MacroStrip'
import { walkSeries } from '../lib/series'

const meta = {
  title: 'Data display/StatTile',
  component: StatTile,
  parameters: {
    docs: {
      description: {
        component:
          'One reading: label, figure, change, trend. It does not format for you — pass pre-formatted `value` and `change`, plus the signed `changeValue` that picks the accent colour. Always render inside a `MacroStrip`, which supplies the tile background.',
      },
    },
  },
  args: {
    label: 'USD/JPY',
    value: '145.9',
    change: '+0.5%',
    changeValue: 0.5,
    trend: walkSeries('USD/JPY', 14, 0.5),
  },
} satisfies Meta<typeof StatTile>

export default meta
type Story = StoryObj<typeof meta>

export const Rising: Story = {
  render: (args) => (
    <MacroStrip style={{ maxWidth: 260 }}>
      <StatTile {...args} />
    </MacroStrip>
  ),
}

export const Falling: Story = {
  args: {
    label: 'DXY',
    value: '96.8',
    change: '−0.7%',
    changeValue: -0.7,
    trend: walkSeries('DXY', 14, -0.7),
  },
  render: (args) => (
    <MacroStrip style={{ maxWidth: 260 }}>
      <StatTile {...args} />
    </MacroStrip>
  ),
}

export const WithoutTrend: Story = {
  args: { label: 'US 10Y', value: '4.08%', change: '−0.4%', changeValue: -0.4, trend: undefined },
  render: (args) => (
    <MacroStrip style={{ maxWidth: 260 }}>
      <StatTile {...args} />
    </MacroStrip>
  ),
}
