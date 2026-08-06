import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Stack } from './Layout'

/** A visible child, so the gap between items can be read off the render. */
function Item({ children, tall = false }: { children: ReactNode; tall?: boolean }) {
  return (
    <div
      style={{
        background: 'var(--ny-surface-sunken)',
        border: '1px solid var(--ny-border)',
        borderRadius: 'var(--ny-radius-sm)',
        padding: 'var(--ny-space-8)',
        paddingBlockEnd: tall ? 'var(--ny-space-32)' : 'var(--ny-space-8)',
        fontSize: 'var(--ny-font-size-xs)',
        color: 'var(--ny-text-muted)',
      }}
    >
      {children}
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 'var(--ny-font-size-xs)',
        color: 'var(--ny-text-subtle)',
        letterSpacing: 'var(--ny-tracking-wide)',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  )
}

const meta = {
  title: 'UI/Stack',
  component: Stack,
  parameters: {
    docs: {
      description: {
        component:
          'One-dimensional flow with a consistent gap — the answer to "these two things need a bit of space between them". There is no `Spacer` component: use `gap`, which takes a spacing step or a `Responsive` object and defaults to `--ny-stack` (12px). `direction`, `align`, `justify` and `wrap` are static modifiers, so only the gap costs an inline custom property.',
      },
    },
  },
  args: {
    gap: 12,
    children: (
      <>
        <Item>First</Item>
        <Item>Second</Item>
        <Item>Third</Item>
      </>
    ),
  },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

export const Column: Story = {}

export const Row: Story = {
  render: () => (
    <Stack direction="row" gap={8}>
      <Item>1D</Item>
      <Item>5D</Item>
      <Item>15D</Item>
      <Item>30D</Item>
    </Stack>
  ),
}

export const Gaps: Story = {
  name: 'Gaps (the last one is responsive)',
  render: () => (
    <Stack gap={24}>
      <Stack gap={8}>
        <Label>gap 4</Label>
        <Stack direction="row" gap={4}>
          <Item>a</Item>
          <Item>b</Item>
          <Item>c</Item>
        </Stack>
      </Stack>
      <Stack gap={8}>
        <Label>gap 32</Label>
        <Stack direction="row" gap={32}>
          <Item>a</Item>
          <Item>b</Item>
          <Item>c</Item>
        </Stack>
      </Stack>
      <Stack gap={8}>
        <Label>gap 4 → 24 at 768 — resize the preview</Label>
        <Stack direction="row" gap={{ base: 4, md: 24 }}>
          <Item>a</Item>
          <Item>b</Item>
          <Item>c</Item>
        </Stack>
      </Stack>
    </Stack>
  ),
}

export const AlignAndJustify: Story = {
  render: () => (
    <Stack gap={24}>
      <Stack gap={8}>
        <Label>row · align center</Label>
        <Stack direction="row" gap={8} align="center">
          <Item tall>tall</Item>
          <Item>short</Item>
          <Item>short</Item>
        </Stack>
      </Stack>
      <Stack gap={8}>
        <Label>row · justify between</Label>
        <Stack direction="row" gap={8} justify="between">
          <Item>left</Item>
          <Item>middle</Item>
          <Item>right</Item>
        </Stack>
      </Stack>
      <Stack gap={8}>
        <Label>column · align start (children stop stretching)</Label>
        <Stack gap={8} align="start">
          <Item>one</Item>
          <Item>two</Item>
        </Stack>
      </Stack>
    </Stack>
  ),
}

export const Wrap: Story = {
  render: () => (
    <Stack direction="row" gap={8} wrap>
      {['Equities', 'Credit', 'Rates', 'FX', 'Commodities', 'Cash', 'Crypto', 'Real assets'].map((name) => (
        <Item key={name}>{name}</Item>
      ))}
    </Stack>
  ),
}
