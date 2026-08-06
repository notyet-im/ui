import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Grid, GridItem, Stack } from './Layout'

/** A visible cell, so a span can be read straight off the render. */
function Cell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--ny-surface-sunken)',
        border: '1px solid var(--ny-border)',
        borderRadius: 'var(--ny-radius-sm)',
        padding: 'var(--ny-space-8)',
        fontSize: 'var(--ny-font-size-2xs)',
        fontFamily: 'var(--ny-font-mono)',
        color: 'var(--ny-text-muted)',
        textAlign: 'center',
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
  title: 'UI/GridItem',
  component: GridItem,
  parameters: {
    docs: {
      description: {
        component:
          'A cell in a `Grid`. `span` says how many columns it covers and takes a scalar or a `Responsive` object; `start` pins it to a 1-based column line. Both are emitted as inline custom properties, so a responsive span costs no extra class names. Cells carry `min-width: 0`, so a long unbroken string cannot blow its column past its share.',
      },
    },
  },
  args: {
    span: 4,
    children: <Cell>span 4</Cell>,
  },
} satisfies Meta<typeof GridItem>

export default meta
type Story = StoryObj<typeof meta>

export const Spans: Story = {
  render: () => (
    <Stack gap={16}>
      <Grid gap={16}>
        <GridItem span={4}>
          <Cell>4</Cell>
        </GridItem>
        <GridItem span={4}>
          <Cell>4</Cell>
        </GridItem>
        <GridItem span={4}>
          <Cell>4</Cell>
        </GridItem>
        <GridItem span={6}>
          <Cell>6</Cell>
        </GridItem>
        <GridItem span={6}>
          <Cell>6</Cell>
        </GridItem>
        <GridItem span={8}>
          <Cell>8</Cell>
        </GridItem>
        <GridItem span={4}>
          <Cell>4</Cell>
        </GridItem>
      </Grid>
    </Stack>
  ),
}

export const ResponsiveSpan: Story = {
  name: 'Responsive span (resize the preview)',
  render: () => (
    <Stack gap={8}>
      <Label>full width · half at 768 · a third at 1024</Label>
      <Grid gap={16}>
        {['Institutional', 'ETF', 'Combined'].map((name) => (
          <GridItem key={name} span={{ base: 12, md: 6, lg: 4 }}>
            <Cell>{name}</Cell>
          </GridItem>
        ))}
      </Grid>
    </Stack>
  ),
}

export const Start: Story = {
  render: () => (
    <Stack gap={8}>
      <Label>start pins a cell to a column line; the rest flow</Label>
      <Grid gap={16}>
        <GridItem span={3} start={1}>
          <Cell>start 1 · span 3</Cell>
        </GridItem>
        <GridItem span={3} start={7}>
          <Cell>start 7 · span 3</Cell>
        </GridItem>
        <GridItem span={2} start={11}>
          <Cell>start 11 · span 2</Cell>
        </GridItem>
      </Grid>
    </Stack>
  ),
}

export const Dashboard: Story = {
  render: () => (
    <Grid gap={16}>
      <GridItem span={{ base: 12, md: 8 }}>
        <Cell>chart</Cell>
      </GridItem>
      <GridItem span={{ base: 12, md: 4 }}>
        <Cell>legend</Cell>
      </GridItem>
      {['Equities', 'Credit', 'Rates', 'FX'].map((name) => (
        <GridItem key={name} span={{ base: 6, md: 3 }}>
          <Cell>{name}</Cell>
        </GridItem>
      ))}
    </Grid>
  ),
}
