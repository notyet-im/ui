import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const TONES = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          'A one-word state marker for the row, card or heading it sits in. Use `Badge` when the status needs no explanation; use `Alert` when it needs a sentence, a title or a dismiss control.',
      },
    },
  },
  args: {
    tone: 'success',
    children: 'Active',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } as const
const stack = { display: 'flex', flexDirection: 'column', gap: 12 } as const

export const Default: Story = {}

export const Tones: Story = {
  render: () => (
    <div style={row}>
      {TONES.map((tone) => (
        <Badge key={tone} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={stack}>
      {(['subtle', 'solid', 'outline'] as const).map((variant) => (
        <div key={variant} style={row}>
          {TONES.map((tone) => (
            <Badge key={tone} tone={tone} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Badge size="sm" tone="info">
        sm
      </Badge>
      <Badge size="md" tone="info">
        md
      </Badge>
      <Badge size="sm" tone="danger" variant="solid">
        3 failed
      </Badge>
      <Badge size="md" tone="danger" variant="solid">
        3 failed
      </Badge>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div style={{ ...row, fontSize: 14 }}>
      <span>Q3 rebalance</span>
      <Badge tone="warning" size="sm">
        Needs review
      </Badge>
      <span style={{ color: 'var(--ny-text-muted)' }}>· updated 2h ago</span>
    </div>
  ),
}
