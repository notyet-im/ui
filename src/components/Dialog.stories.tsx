import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { InlineAction } from './Controls'
import { Dialog, type DialogProps } from './Dialog'

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

/**
 * Holds real open state, so every story is dismissible and can be reopened.
 *
 * The stories that show an open dialog used to pass `open: true` with a no-op
 * `onClose`, which is the exact defect `onClose`'s own documentation warns
 * about: the browser closes the `<dialog>` on Escape while React still believes
 * it is open, leaving a story that is blank until the page reloads.
 *
 * `startOpen` is false on the docs page and true on the canvas. A modal that
 * opens itself is the right thing for a card capture and for browsing one
 * story, and the wrong thing on a documentation page, where three of them stack
 * over the prose and the props table with no way back.
 */
function DialogDemo({
  startOpen,
  children,
  ...props
}: Omit<DialogProps, 'open' | 'onClose'> & { startOpen: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(startOpen)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 32 }}>
      <InlineAction onClick={() => setOpen(true)}>Open the dialog</InlineAction>
      <Dialog {...props} open={open} onClose={() => setOpen(false)}>
        {children}
      </Dialog>
    </div>
  )
}

const BODY =
  'Institutional flow has run 3.2σ ahead of the ETF leg for six sessions. Queuing accepts the tracking error until the next reset.'

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
  render: (args, { viewMode }) => (
    <DialogDemo {...args} startOpen={viewMode !== 'docs'}>
      {BODY}
    </DialogDemo>
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
  render: (args, { viewMode }) => (
    <DialogDemo {...args} startOpen={viewMode !== 'docs'}>
      {BODY}
    </DialogDemo>
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
  render: (args, { viewMode }) => (
    <DialogDemo {...args} startOpen={viewMode !== 'docs'}>
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
    </DialogDemo>
  ),
}

export const Triggered: Story = {
  name: 'Triggered (stateful)',
  render: () => <ConfirmExample />,
}
