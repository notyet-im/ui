import type { Meta, StoryObj } from '@storybook/react-vite'
import { walkSeries } from '../lib/series'
import { MacroStrip, StatTile } from './MacroStrip'

const meta = {
  title: 'Data display/MacroStrip',
  component: MacroStrip,
  parameters: {
    docs: {
      description: {
        component:
          'Edge-to-edge row of readings. The hairlines between tiles come from a 1px grid gap over a `--cf-line` background, so they never double up.',
      },
    },
  },
} satisfies Meta<typeof MacroStrip>

export default meta
type Story = StoryObj<typeof meta>

const READINGS: Array<[string, string, number]> = [
  ['DXY', '96.8', -0.7],
  ['USD/JPY', '145.9', 0.5],
  ['US 10Y', '4.08%', -0.4],
  ['USD/KRW', '1,338', -0.6],
  ['Gold', '$3,412', 1.1],
]

export const Default: Story = {
  render: () => (
    <MacroStrip>
      {READINGS.map(([label, value, change]) => (
        <StatTile
          key={label}
          label={label}
          value={value}
          change={`${change >= 0 ? '+' : '−'}${Math.abs(change).toFixed(1)}%`}
          changeValue={change}
          trend={walkSeries(label, 14, change)}
        />
      ))}
    </MacroStrip>
  ),
}

export const SingleTile: Story = {
  render: () => (
    <MacroStrip style={{ maxWidth: 260 }}>
      <StatTile
        label="USD/JPY"
        value="145.9"
        change="+0.5%"
        changeValue={0.5}
        trend={walkSeries('USD/JPY', 14, 0.5)}
      />
    </MacroStrip>
  ),
}

export const WithoutTrend: Story = {
  render: () => (
    <MacroStrip style={{ maxWidth: 260 }}>
      <StatTile label="US 10Y" value="4.08%" change="−0.4%" changeValue={-0.4} />
    </MacroStrip>
  ),
}
