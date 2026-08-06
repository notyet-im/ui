import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { GhostButton } from './Controls'
import { Toast, ToastViewport } from './Toast'

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
      <GhostButton onClick={() => setOpen(true)}>Queue rebalance</GhostButton>
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

export const Open: Story = {
  name: 'Open (no interaction)',
  render: (args) => (
    <ToastViewport>
      <Toast {...args} />
    </ToastViewport>
  ),
}

export const Tones: Story = {
  render: (args) => (
    <ToastViewport>
      <Toast {...args} tone="info" title="Tape reconnected" description="Resumed at 09:31:04." />
      <Toast {...args} tone="success" title="Rebalance queued" description="Settles at the close." />
      <Toast {...args} tone="warning" title="Stale quotes" description="KR feed is 42s behind." />
      <Toast {...args} tone="danger" title="Order rejected" description="Desk limit exceeded." />
    </ToastViewport>
  ),
}

export const TopPlacement: Story = {
  name: 'Top placement',
  render: (args) => (
    <ToastViewport placement="top">
      <Toast {...args} tone="warning" title="Stale quotes" description="KR feed is 42s behind." />
    </ToastViewport>
  ),
}

export const AutoDismiss: Story = {
  name: 'Auto-dismiss (stateful)',
  render: () => <TriggerExample />,
}
