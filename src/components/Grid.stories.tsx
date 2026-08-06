import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Grid, GridItem, Stack } from './Layout'

/** A visible cell, so the tracks and the gaps can be read off the render. */
function Cell({ children, tall = false }: { children: ReactNode; tall?: boolean }) {
  return (
    <div
      style={{
        background: 'var(--ny-surface-sunken)',
        border: '1px solid var(--ny-border)',
        borderRadius: 'var(--ny-radius-sm)',
        padding: 'var(--ny-space-8)',
        paddingBlockEnd: tall ? 'var(--ny-space-40)' : 'var(--ny-space-8)',
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
  title: 'UI/Grid',
  component: Grid,
  parameters: {
    docs: {
      description: {
        component:
          'The built-in grid — 12 columns by default. `columns`, `gap`, `columnGap` and `rowGap` each take a scalar or a `Responsive` object (`{ base, sm, md, lg, xl }`). Responsive values are written as inline custom properties and read back by four static media queries at 480 / 768 / 1024 / 1280px, so no per-breakpoint class names are generated and the markup is SSR-safe.',
      },
    },
  },
  args: {
    columns: 12,
    gap: 16,
    children: Array.from({ length: 12 }, (_, index) => String(index + 1)).map((column) => (
      <GridItem key={column}>
        <Cell>{column}</Cell>
      </GridItem>
    )),
  },
} satisfies Meta<typeof Grid>

export default meta
type Story = StoryObj<typeof meta>

export const TwelveColumns: Story = {}

export const Responsive: Story = {
  name: 'Responsive (resize the preview)',
  render: () => (
    <Stack gap={8}>
      <Label>1 up · 2 up at 480 · 3 up at 768 · 4 up at 1024</Label>
      <Grid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={{ base: 8, md: 24 }}>
        {['Equities', 'Credit', 'Rates', 'FX', 'Commodities', 'Cash', 'Crypto', 'Real assets'].map((name) => (
          <GridItem key={name}>
            <Cell>{name}</Cell>
          </GridItem>
        ))}
      </Grid>
    </Stack>
  ),
}

export const Gaps: Story = {
  render: () => (
    <Stack gap={24}>
      <Stack gap={8}>
        <Label>gap 0</Label>
        <Grid columns={4} gap={0}>
          {['a', 'b', 'c', 'd'].map((key) => (
            <GridItem key={key}>
              <Cell>{key}</Cell>
            </GridItem>
          ))}
        </Grid>
      </Stack>
      <Stack gap={8}>
        <Label>columnGap 32 · rowGap 8</Label>
        <Grid columns={4} columnGap={32} rowGap={8}>
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((key) => (
            <GridItem key={key}>
              <Cell>{key}</Cell>
            </GridItem>
          ))}
        </Grid>
      </Stack>
    </Stack>
  ),
}

export const Align: Story = {
  render: () => (
    <Stack gap={24}>
      <Stack gap={8}>
        <Label>align stretch (default)</Label>
        <Grid columns={3} gap={16}>
          <GridItem>
            <Cell tall>tall</Cell>
          </GridItem>
          <GridItem>
            <Cell>short</Cell>
          </GridItem>
          <GridItem>
            <Cell>short</Cell>
          </GridItem>
        </Grid>
      </Stack>
      <Stack gap={8}>
        <Label>align center</Label>
        <Grid columns={3} gap={16} align="center">
          <GridItem>
            <Cell tall>tall</Cell>
          </GridItem>
          <GridItem>
            <Cell>short</Cell>
          </GridItem>
          <GridItem>
            <Cell>short</Cell>
          </GridItem>
        </Grid>
      </Stack>
    </Stack>
  ),
}
