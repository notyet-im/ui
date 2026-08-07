import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { InlineAction } from './Controls'
import { Dialog } from './Dialog'

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component:
          'A modal built on the native `<dialog>` element — the browser supplies the focus trap, Escape, the backdrop and the top layer. Use it when the task must be finished or abandoned before anything else; use `Popover` for a non-blocking panel and `Toast` for a passive message.',
      },
    },
  },
  args: {
    open: true,
    onClose: () => {},
    title: 'Rebalance the book',
    description: 'Moves 4 positions across 2 desks. Settles at the next close.',
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

function ConfirmExample() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('No rebalance queued.')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <InlineAction onClick={() => setOpen(true)}>Rebalance…</InlineAction>
      <span style={{ color: 'var(--ny-text-muted)', fontSize: 'var(--ny-font-size-xs)' }}>{status}</span>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Rebalance the book"
        description="Moves 4 positions across 2 desks. Settles at the next close."
        footer={
          <>
            <InlineAction onClick={() => setOpen(false)}>Cancel</InlineAction>
            <InlineAction
              onClick={() => {
                setStatus('Rebalance queued for 16:00.')
                setOpen(false)
              }}
            >
              Queue it
            </InlineAction>
          </>
        }
      >
        Institutional flow has run 3.2σ ahead of the ETF leg for six sessions. Queuing accepts the tracking
        error until the next reset.
      </Dialog>
    </div>
  )
}

export const Open: Story = {
  render: (args) => (
    <Dialog {...args}>
      Institutional flow has run 3.2σ ahead of the ETF leg for six sessions. Queuing accepts the tracking
      error until the next reset.
    </Dialog>
  ),
}

export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <InlineAction>Cancel</InlineAction>
        <InlineAction>Queue it</InlineAction>
      </>
    ),
  },
  render: (args) => (
    <Dialog {...args}>
      Institutional flow has run 3.2σ ahead of the ETF leg for six sessions. Queuing accepts the tracking
      error until the next reset.
    </Dialog>
  ),
}

export const Scrolling: Story = {
  name: 'Scrolling (long content)',
  args: {
    size: 'lg',
    title: 'Session log',
    description: 'Every fill routed through the desk today.',
    footer: <InlineAction>Close</InlineAction>,
  },
  render: (args) => (
    <Dialog {...args}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: 24 }, (_, index) => `09:${String(index).padStart(2, '0')}`).map((stamp) => (
          <div
            key={stamp}
            className="ny-mono"
            style={{ fontSize: 'var(--ny-font-size-xs)', color: 'var(--ny-text-muted)' }}
          >
            {`${stamp}  KR · Semiconductors  −1,240  →  TW · Foundry`}
          </div>
        ))}
      </div>
    </Dialog>
  ),
}

export const Triggered: Story = {
  name: 'Triggered (stateful)',
  render: () => <ConfirmExample />,
}
