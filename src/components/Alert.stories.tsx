import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Alert } from './Alert'

const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          'A block message about the page or the operation that just ran. `danger` and `warning` announce assertively (`role="alert"`); `info` and `success` announce politely (`role="status"`), so good news never interrupts a screen reader mid-sentence.',
      },
    },
  },
  args: {
    tone: 'info',
    title: 'Positions are delayed',
    children: 'Custody feeds are running about 15 minutes behind. Numbers will settle on their own.',
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 520 } as const

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 3l9 16H3z" />
      <path d="M12 10v4M12 17.5v.01" />
    </svg>
  )
}

function Dismissible() {
  const [open, setOpen] = useState(true)
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}>
        Bring it back
      </button>
    )
  }
  return (
    <Alert tone="success" title="Rebalance queued" onDismiss={() => setOpen(false)}>
      14 orders will be staged for approval at the next window.
    </Alert>
  )
}

export const Default: Story = {}

export const Tones: Story = {
  render: () => (
    <div style={stack}>
      <Alert tone="info" title="Positions are delayed">
        Custody feeds are running about 15 minutes behind.
      </Alert>
      <Alert tone="success" title="Rebalance queued">
        14 orders will be staged for approval at the next window.
      </Alert>
      <Alert tone="warning" title="Drift over threshold">
        Two sleeves are more than 3% from target and will breach at Friday's close.
      </Alert>
      <Alert tone="danger" title="Upload rejected">
        Rows 12 and 19 reference accounts that do not exist.
      </Alert>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div style={stack}>
      <Alert tone="warning" title="Drift over threshold" icon={<WarningIcon />}>
        Two sleeves are more than 3% from target and will breach at Friday's close.
      </Alert>
    </div>
  ),
}

export const TitleOnly: Story = {
  render: () => (
    <div style={stack}>
      <Alert tone="info" title="Read-only until 09:30." />
      <Alert tone="danger">Connection to the pricing service was lost.</Alert>
    </div>
  ),
}

export const WithDismiss: Story = {
  render: () => (
    <div style={stack}>
      <Dismissible />
    </div>
  ),
}
