import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from './Tabs'

const meta = {
  title: 'Controls/Tabs',
  component: Tabs,
  args: {
    items: [
      { value: 'flow', label: 'Flow ribbons' },
      { value: 'grid', label: 'Region × sector grid' },
      { value: 'ring', label: 'Rotation ring' },
    ],
    value: 'flow',
    onChange: () => {},
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

function Example() {
  const [value, setValue] = useState('flow')
  return (
    <Tabs
      label="Hero view"
      value={value}
      onChange={setValue}
      items={[
        { value: 'flow', label: 'Flow ribbons' },
        { value: 'grid', label: 'Region × sector grid' },
        { value: 'ring', label: 'Rotation ring' },
      ]}
    />
  )
}

export const Default: Story = {
  render: () => <Example />,
}
