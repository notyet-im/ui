import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './Skeleton'

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A placeholder that holds the space incoming content will occupy, so nothing jumps when the data lands. It is `aria-hidden`: the container it fills should carry `aria-busy` — or a single `Spinner` — so the wait is announced once, not once per bar.',
      },
    },
  },
  args: {
    shape: 'text',
    lines: 3,
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

const panel = {
  maxWidth: 420,
  padding: 16,
  background: 'var(--ny-surface)',
  border: '1px solid var(--ny-border)',
  borderRadius: 8,
} as const

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Skeleton lines={3} />
    </div>
  ),
}

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', maxWidth: 420 }}>
      <Skeleton shape="circle" />
      <Skeleton shape="rect" width={160} height={64} />
      <Skeleton shape="text" width={120} />
    </div>
  ),
}

export const LoadingCard: Story = {
  render: () => (
    // The skeletons announce nothing; the region they fill is what carries the
    // busy state and the name.
    <div style={panel} role="group" aria-busy="true" aria-label="Loading account">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <Skeleton shape="circle" />
        <Skeleton shape="text" width={140} />
      </div>
      <Skeleton shape="rect" height={96} />
      <div style={{ marginTop: 16 }}>
        <Skeleton lines={3} />
      </div>
    </div>
  ),
}

export const LineCounts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 420 }}>
      <Skeleton lines={1} />
      <Skeleton lines={2} />
      <Skeleton lines={4} />
    </div>
  ),
}
