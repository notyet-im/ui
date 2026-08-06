import type { Meta, StoryObj } from '@storybook/react-vite'
import { walkSeries } from '../lib/series'
import { deltaColors } from '../tokens'
import { Sparkline } from './Sparkline'

const meta = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  parameters: {
    docs: {
      description: {
        component:
          'A compact trend line. The vertical domain always spans zero, so an all-positive series still reads as entirely above the baseline.',
      },
    },
  },
  args: { values: walkSeries('default', 14, 1200) },
} satisfies Meta<typeof Sparkline>

export default meta
type Story = StoryObj<typeof meta>

export const Rising: Story = {
  args: { values: walkSeries('rising', 14, 4200) },
}

export const Falling: Story = {
  args: { values: walkSeries('falling', 14, -3100) },
}

export const WithArea: Story = {
  args: {
    values: walkSeries('area', 22, 7500),
    width: 140,
    height: 32,
    pad: 4,
    area: true,
    strokeWidth: 1.5,
  },
}

export const WithBaseline: Story = {
  name: 'With zero baseline',
  args: {
    values: walkSeries('baseline', 30, 6600),
    width: 330,
    height: 74,
    pad: 8,
    area: true,
    areaOpacity: 0.12,
    strokeWidth: 1.7,
    baseline: true,
    color: deltaColors.positive,
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Sparkline values={walkSeries('a', 14, 900)} />
      <Sparkline values={walkSeries('b', 22, -1400)} width={140} height={32} pad={4} area />
      <Sparkline values={walkSeries('c', 30, 3300)} width={330} height={74} pad={8} area baseline />
    </div>
  ),
}
