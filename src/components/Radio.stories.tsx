import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Radio, RadioGroup } from './Radio'

const meta = {
  title: 'UI/Radio',
  component: Radio,
  parameters: {
    docs: {
      description: {
        component:
          'One option of a mutually exclusive set — a real `<input type="radio">`, restyled. Render it through `RadioGroup`, which supplies the shared `name`, the checked state, the change handler and the roving `tabIndex`; a lone `Radio` has none of those and is shown here only for the visual.',
      },
    },
  },
  args: {
    value: 'etf',
    label: 'ETF',
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

function GroupExample() {
  const [source, setSource] = useState('etf')
  return (
    <RadioGroup
      label="Flow source"
      value={source}
      onChange={setSource}
      options={[
        { value: 'inst', label: 'Institutional' },
        { value: 'etf', label: 'ETF' },
        { value: 'combined', label: 'Combined' },
      ]}
    />
  )
}

export const Default: Story = {}

export const Disabled: Story = {
  args: { disabled: true },
}

export const RichLabel: Story = {
  args: {
    value: 'combined',
    label: (
      <span>
        Combined
        <span style={{ display: 'block', fontSize: 12, color: 'var(--ny-text-muted)' }}>
          Institutional and ETF, netted
        </span>
      </span>
    ),
  },
}

export const InsideRadioGroup: Story = {
  name: 'Inside a RadioGroup (the normal usage)',
  render: () => <GroupExample />,
}
