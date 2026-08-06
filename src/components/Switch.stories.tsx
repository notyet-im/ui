import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Switch } from './Switch'

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          'An immediate on/off toggle — the setting applies the moment it moves, with no Save step. A `<button role="switch">`, so Space and Enter operate it; use `Checkbox` when the value is committed on form submit instead.',
      },
    },
  },
  args: {
    label: 'Live updates',
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

function ControlledExample() {
  const [live, setLive] = useState(true)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Switch label="Live updates" checked={live} onChange={setLive} />
      <span style={{ color: 'var(--ny-text-muted)', fontSize: 13 }}>
        Streaming is {live ? 'on' : 'paused'}
      </span>
    </div>
  )
}

export const Default: Story = {}

export const Controlled: Story = {
  render: () => <ControlledExample />,
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Switch size="sm" label="Compact (sm)" defaultChecked />
      <Switch size="md" label="Default (md)" defaultChecked />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Switch label="Unavailable" disabled />
      <Switch label="Locked on" defaultChecked disabled />
    </div>
  ),
}
