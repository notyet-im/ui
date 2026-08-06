import type { Meta, StoryObj } from '@storybook/react-vite'
import { deltaColors } from '../tokens'
import { Legend } from './Controls'

const meta = {
  title: 'UI/Legend',
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
      { color: deltaColors.positive, label: 'inflow' },
      { color: deltaColors.negative, label: 'outflow' },
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
      { color: deltaColors.positive, label: 'inflow' },
      { color: deltaColors.negative, label: 'outflow' },
      { color: deltaColors.neutral, label: 'unattributed' },
    ],
  },
}
