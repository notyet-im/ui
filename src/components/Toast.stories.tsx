import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { InlineAction } from './Controls'
import { Toast, type ToastProps, ToastViewport } from './Toast'

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    docs: {
      description: {
        component:
          'A brief, self-dismissing message about something that already happened, announced politely via `role="status"`. Always render inside `ToastViewport` — that is the element carrying `popover="manual"`, which puts the whole stack in the browser top layer with no z-index. If the user has to act, use `Dialog` instead.',
      },
    },
  },
  args: {
    open: true,
    onClose: () => {},
    duration: 0,
    title: 'Rebalance queued',
    description: 'Four positions settle at the 16:00 close.',
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

function TriggerExample() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <InlineAction onClick={() => setOpen(true)}>Queue rebalance</InlineAction>
      <ToastViewport>
        <Toast
          open={open}
          onClose={() => setOpen(false)}
          tone="success"
          title="Rebalance queued"
          description="Dismisses itself after 5s."
        />
      </ToastViewport>
    </>
  )
}

type ToastSpec = Omit<ToastProps, 'open' | 'onClose'>

/**
 * Holds real state per toast, and gives the docs page a way to summon the stack.
 *
 * `meta.args` pairs `open: true` with a no-op `onClose` and `duration: 0`, which
 * is a toast that can never leave by any route — the dismiss button calls
 * nothing and the timer never runs. On the canvas that is what the card capture
 * needs. On the docs page it meant a stack of them floating in the top layer
 * over the props table, permanently.
 */
function ToastDemo({
  startOpen,
  toasts,
  placement,
}: {
  startOpen: boolean
  toasts: ToastSpec[]
  placement?: 'top' | 'bottom'
}) {
  const all = toasts.map((_, index) => index)
  const [visible, setVisible] = useState(() => (startOpen ? all : []))

  return (
    <div style={{ minHeight: 32 }}>
      <InlineAction onClick={() => setVisible(all)}>Show the toasts</InlineAction>
      <ToastViewport placement={placement}>
        {toasts.map((toast, index) => (
          <Toast
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed story fixtures, never reordered
            key={index}
            {...toast}
            open={visible.includes(index)}
            onClose={() => setVisible((current) => current.filter((i) => i !== index))}
          />
        ))}
      </ToastViewport>
    </div>
  )
}

export const Open: Story = {
  name: 'Open (no interaction)',
  render: ({ open: _open, onClose: _onClose, ...args }, { viewMode }) => (
    <ToastDemo startOpen={viewMode !== 'docs'} toasts={[args]} />
  ),
}

export const Tones: Story = {
  render: ({ open: _open, onClose: _onClose, ...args }, { viewMode }) => (
    <ToastDemo
      startOpen={viewMode !== 'docs'}
      toasts={[
        { ...args, tone: 'info', title: 'Tape reconnected', description: 'Resumed at 09:31:04.' },
        { ...args, tone: 'success', title: 'Rebalance queued', description: 'Settles at the close.' },
        { ...args, tone: 'warning', title: 'Stale quotes', description: 'KR feed is 42s behind.' },
        { ...args, tone: 'danger', title: 'Order rejected', description: 'Desk limit exceeded.' },
      ]}
    />
  ),
}

export const TopPlacement: Story = {
  name: 'Top placement',
  render: ({ open: _open, onClose: _onClose, ...args }, { viewMode }) => (
    <ToastDemo
      startOpen={viewMode !== 'docs'}
      placement="top"
      toasts={[{ ...args, tone: 'warning', title: 'Stale quotes', description: 'KR feed is 42s behind.' }]}
    />
  ),
}

export const AutoDismiss: Story = {
  name: 'Auto-dismiss (stateful)',
  render: () => <TriggerExample />,
}
