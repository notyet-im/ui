import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Container, Grid, GridItem, Stack } from './Layout'

/** Fills the measure so the container's width and gutter are both visible. */
function Fill({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--ny-surface-sunken)',
        border: '1px solid var(--ny-border)',
        borderRadius: 'var(--ny-radius-md)',
        padding: 'var(--ny-space-12)',
        fontSize: 'var(--ny-font-size-xs)',
        color: 'var(--ny-text-muted)',
      }}
    >
      {children}
    </div>
  )
}

/** Dashed edge marking where the container itself starts and stops. */
const edge = { outline: '1px dashed var(--ny-border-strong)', outlineOffset: '0' }

const meta = {
  title: 'UI/Container',
  component: Container,
  parameters: {
    docs: {
      description: {
        component:
          'The centred page measure. Caps content at 720 / 960 / 1280px and applies `--ny-gutter` as inline padding — 24px, tightening to 16px below 768px. It also opens a container-query context named `ny-panel`, so components inside can reflow against the container width instead of the viewport.',
      },
    },
  },
  args: {
    size: 'lg',
    children: <Fill>Container</Fill>,
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <Stack gap={16}>
      <Container size="sm" style={edge}>
        <Fill>sm — 720px</Fill>
      </Container>
      <Container size="md" style={edge}>
        <Fill>md — 960px</Fill>
      </Container>
      <Container size="lg" style={edge}>
        <Fill>lg — 1280px (default)</Fill>
      </Container>
      <Container size="full" style={edge}>
        <Fill>full — no cap, still gutters</Fill>
      </Container>
    </Stack>
  ),
}

export const Gutter: Story = {
  name: 'Gutter (resize below 768px)',
  render: () => (
    <Container size="md" style={edge}>
      <Fill>
        The gap between the dashed edge and this box is `--ny-gutter`. It drops from 24px to 16px below 768px
        — the one spacing token in the system that moves with the viewport.
      </Fill>
    </Container>
  ),
}

export const AsPageShell: Story = {
  render: () => (
    <Container size="md" style={edge}>
      <Stack gap={16}>
        <Fill>Header</Fill>
        <Grid columns={{ base: 1, md: 12 }} gap={16}>
          <GridItem span={{ base: 1, md: 8 }}>
            <Fill>Main</Fill>
          </GridItem>
          <GridItem span={{ base: 1, md: 4 }}>
            <Fill>Aside</Fill>
          </GridItem>
        </Grid>
        <Fill>Footer</Fill>
      </Stack>
    </Container>
  ),
}
