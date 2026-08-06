import type { Meta, StoryObj } from '@storybook/react-vite'
import { Eyebrow } from './Controls'

const meta = {
  title: 'Controls/Eyebrow',
  component: Eyebrow,
  parameters: {
    docs: {
      description: {
        component:
          'Small uppercase monospace label — the system\'s quietest text role. Pick the variant by where it sits: `kicker` above a page title, `label` above a panel section, `tile` inside a compact stat tile.',
      },
    },
  },
  args: { children: 'Counterparties' },
} satisfies Meta<typeof Eyebrow>

export default meta
type Story = StoryObj<typeof meta>

export const Label: Story = {
  args: { variant: 'label', children: 'Counterparties' },
}

export const Kicker: Story = {
  args: { variant: 'kicker', children: 'Cross-border equity flows' },
}

export const Tile: Story = {
  args: { variant: 'tile', children: 'USD/JPY' },
}

export const AllVariants: Story = {
  args: { children: '' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Eyebrow variant="kicker">Cross-border equity flows</Eyebrow>
      <Eyebrow variant="label">Counterparties</Eyebrow>
      <Eyebrow variant="tile">USD/JPY</Eyebrow>
    </div>
  ),
}
