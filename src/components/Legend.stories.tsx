import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legend } from './Controls'
import { flowColors } from '../tokens'

const meta = {
  title: 'Controls/Legend',
  component: Legend,
  parameters: {
    docs: {
      description: {
        component:
          'Colour key for a chart. The optional `note` is trailing text with no swatch — use it for a running total or scope caveat.',
      },
    },
  },
  args: {
    items: [
      { color: flowColors.inflow, label: 'inflow' },
      { color: flowColors.outflow, label: 'outflow' },
    ],
  },
} satisfies Meta<typeof Legend>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithNote: Story = {
  args: { note: '$23B rotated' },
}

export const ThreeSeries: Story = {
  args: {
    items: [
      { color: flowColors.inflow, label: 'inflow' },
      { color: flowColors.outflow, label: 'outflow' },
      { color: flowColors.neutral, label: 'unattributed' },
    ],
  },
}
