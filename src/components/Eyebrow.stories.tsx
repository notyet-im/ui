import type { Meta, StoryObj } from '@storybook/react-vite'
import { Eyebrow } from './Controls'

const meta = {
  title: 'UI/Eyebrow',
  component: Eyebrow,
  parameters: {
    docs: {
      description: {
        component:
          "Small uppercase monospace label — the system's quietest text role. Pick the variant by where it sits: `label` above a page title or a panel section, `tile` inside a compact stat tile, where the tighter box wants tighter tracking.",
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

export const Tile: Story = {
  args: { variant: 'tile', children: 'USD/JPY' },
}

export const AllVariants: Story = {
  args: { children: '' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Eyebrow>Cross-border equity flows</Eyebrow>
      <Eyebrow variant="label">Counterparties</Eyebrow>
      <Eyebrow variant="tile">USD/JPY</Eyebrow>
    </div>
  ),
}
