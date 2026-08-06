import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './Spinner'

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component:
          'An indeterminate progress mark for waits with no measurable percentage. Reach for `Skeleton` instead when the shape of the incoming content is known and the layout should be held.',
      },
    },
  },
  args: {
    size: 'md',
    label: 'Loading',
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 16, alignItems: 'center' } as const

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div style={row}>
      <Spinner size="sm" label="Fetching flows" />
      <span style={{ color: 'var(--ny-text-muted)', fontSize: 13 }}>Fetching flows…</span>
    </div>
  ),
}

export const OnASurface: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: 140,
        background: 'var(--ny-surface)',
        border: '1px solid var(--ny-border)',
        borderRadius: 8,
      }}
    >
      <Spinner size="lg" label="Loading positions" />
    </div>
  ),
}
