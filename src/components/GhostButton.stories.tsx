import type { Meta, StoryObj } from '@storybook/react-vite'
import { GhostButton } from './Controls'

const meta = {
  title: 'Controls/GhostButton',
  component: GhostButton,
  parameters: {
    docs: {
      description: {
        component:
          'Low-emphasis inline action — "clear", "reset" and friends. Set in monospace so it sits quietly beside data rather than competing with it.',
      },
    },
  },
  args: { children: '✕ clear' },
} satisfies Meta<typeof GhostButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: '✕ clear' },
}

export const Reset: Story = {
  args: { children: 'reset filters' },
}
