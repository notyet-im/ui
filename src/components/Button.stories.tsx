import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Button } from './Button'

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'The general labelled action. `Button` and `InlineAction` are separate published components with their own contracts — reach for `Button` whenever the action has a text label. `loading` implies `disabled`, so a request cannot be fired twice.',
      },
    },
  },
  args: { children: 'Run analysis' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
)

/* Decorative — the label carries the accessible name. */
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <path d="M5 12h14m0 0l-5-5m5 5l-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Variants: Story = {
  render: () => (
    <Row>
      <Button variant="primary">Rebalance</Button>
      <Button variant="secondary">Compare</Button>
      <Button variant="ghost">Reset</Button>
      <Button variant="danger">Delete portfolio</Button>
    </Row>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Row>
      <Button size="sm" variant="primary">
        Small
      </Button>
      <Button size="md" variant="primary">
        Medium
      </Button>
      <Button size="lg" variant="primary" iconStart={<DownloadIcon />}>
        Large
      </Button>
      <Button size="md" iconEnd={<ArrowIcon />}>
        Next quarter
      </Button>
    </Row>
  ),
}

export const Loading: Story = {
  render: () => (
    <Row>
      <Button variant="primary" loading>
        Fetching flows
      </Button>
      <Button variant="secondary" loading>
        Fetching flows
      </Button>
    </Row>
  ),
}

/** The destructive path: `danger` for the action, `ghost` for the way out. */
export const Danger: Story = {
  render: () => (
    <Row>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger" iconStart={<DownloadIcon />}>
        Delete portfolio
      </Button>
    </Row>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Row>
      <Button variant="primary" disabled>
        Rebalance
      </Button>
      <Button variant="secondary" disabled>
        Compare
      </Button>
      <Button variant="ghost" disabled>
        Reset
      </Button>
      <Button variant="danger" disabled>
        Delete portfolio
      </Button>
    </Row>
  ),
}
