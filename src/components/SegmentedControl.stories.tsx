import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SegmentedControl } from './SegmentedControl'

const meta = {
  title: 'UI/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    docs: {
      description: {
        component:
          'Pick exactly one of a small set. Use `SegmentedControl` for filters that change *what the data is*; use `Tabs` for switching views of the same data.',
      },
    },
  },
  args: {
    items: [
      { value: 'inst', label: 'Institutional' },
      { value: 'etf', label: 'ETF' },
      { value: 'combined', label: 'Combined' },
    ],
    value: 'combined',
    onChange: () => {},
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

function MetricExample() {
  const [value, setValue] = useState('combined')
  return (
    <SegmentedControl
      label="Flow source"
      value={value}
      onChange={setValue}
      items={[
        { value: 'inst', label: 'Institutional' },
        { value: 'etf', label: 'ETF' },
        { value: 'combined', label: 'Combined' },
      ]}
    />
  )
}

function RangeExample() {
  const [value, setValue] = useState('15D')
  return (
    <SegmentedControl
      label="Lookback"
      variant="mono"
      value={value}
      onChange={setValue}
      items={['1D', '5D', '15D', '30D'].map((key) => ({ value: key, label: key }))}
    />
  )
}

export const Text: Story = {
  render: () => <MetricExample />,
}

export const Mono: Story = {
  name: 'Mono (code-like labels)',
  render: () => <RangeExample />,
}

export const Together: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <MetricExample />
      <RangeExample />
    </div>
  ),
}
