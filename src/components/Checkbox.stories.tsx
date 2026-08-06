import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'A real `<input type="checkbox">` with `appearance: none`, so it submits in a `<form>` and is announced natively. Leave `checked` off for uncontrolled use, or pass `checked` + `onChange` to drive it. Use `RadioGroup` when the options are mutually exclusive.',
      },
    },
  },
  args: {
    label: 'Include ETF flows',
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

const SOURCES = ['Institutional', 'ETF', 'Retail'] as const

function PartialSelectionExample() {
  const [selected, setSelected] = useState<ReadonlyArray<string>>(['ETF'])
  const all = selected.length === SOURCES.length
  const some = selected.length > 0 && !all

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox
        label="All sources"
        checked={all}
        indeterminate={some}
        onChange={(checked) => setSelected(checked ? SOURCES : [])}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 24 }}>
        {SOURCES.map((source) => (
          <Checkbox
            key={source}
            label={source}
            checked={selected.includes(source)}
            onChange={(checked) =>
              setSelected((previous) =>
                checked ? [...previous, source] : previous.filter((item) => item !== source),
              )
            }
          />
        ))}
      </div>
    </div>
  )
}

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Indeterminate: Story = {
  name: 'Indeterminate (mixed parent)',
  render: () => <PartialSelectionExample />,
}

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Unavailable" disabled />
      <Checkbox label="Locked on" defaultChecked disabled />
    </div>
  ),
}

export const RichLabel: Story = {
  args: {
    label: (
      <span>
        Net flows only
        <span style={{ display: 'block', fontSize: 12, color: 'var(--ny-text-muted)' }}>
          Subtracts outflows before charting
        </span>
      </span>
    ),
  },
}
