import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { InlineAction, Select } from './Controls'
import { Popover } from './Popover'

const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          'A panel anchored to a trigger, for content the user can reach — a filter form, a link list, a secondary action. Built on `popover="auto"`, so the browser handles light dismiss and the top layer. Use `Tooltip` for a passive phrase, and `Dialog` when the page must be blocked.',
      },
    },
  },
  args: {
    content: 'Sourced from the 16:00 consolidated tape, net of ETF creations.',
    children: <InlineAction>Method</InlineAction>,
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

function FilterExample() {
  const [source, setSource] = useState('combined')
  const [open, setOpen] = useState(false)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      placement="bottom"
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 200 }}>
          <Select
            label="Flow source"
            value={source}
            onChange={setSource}
            options={[
              { value: 'inst', label: 'Institutional' },
              { value: 'etf', label: 'ETF' },
              { value: 'combined', label: 'Combined' },
            ]}
          />
          <InlineAction onClick={() => setOpen(false)}>Apply</InlineAction>
        </div>
      }
    >
      <InlineAction>Filters</InlineAction>
    </Popover>
  )
}

export const Open: Story = {
  name: 'Open (no interaction)',
  args: { defaultOpen: true },
}

export const Closed: Story = {
  name: 'Closed (click to open)',
}

export const WithControls: Story = {
  name: 'With controls (controlled)',
  render: () => <FilterExample />,
}

/**
 * One story per placement rather than four in a row: `popover="auto"` closes
 * every other open auto popover as it opens, so only the last would survive.
 */
export const Above: Story = {
  name: 'Placement: top',
  args: { defaultOpen: true, placement: 'top', content: 'Net of ETF creations.' },
  render: (args) => (
    <div style={{ paddingTop: 96 }}>
      <Popover {...args}>
        <InlineAction>Method</InlineAction>
      </Popover>
    </div>
  ),
}
