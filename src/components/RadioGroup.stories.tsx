import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { RadioGroup } from './Radio'

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          'A mutually exclusive set of options, following the WAI-ARIA APG radiogroup pattern: the group is one tab stop, arrow keys move between options with selection following focus, and Home/End jump to the ends. Disabled options are skipped by the arrows rather than trapping them.',
      },
    },
  },
  args: {
    label: 'Flow source',
    options: [
      { value: 'inst', label: 'Institutional' },
      { value: 'etf', label: 'ETF' },
      { value: 'combined', label: 'Combined' },
    ],
    defaultValue: 'etf',
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

const RANGES = [
  { value: '1D', label: '1D' },
  { value: '5D', label: '5D' },
  { value: '30D', label: '30D' },
] as const

function HorizontalExample() {
  const [range, setRange] = useState<string>('5D')
  return (
    <RadioGroup
      label="Lookback"
      orientation="horizontal"
      value={range}
      onChange={setRange}
      options={RANGES}
    />
  )
}

export const Vertical: Story = {}

export const Horizontal: Story = {
  render: () => <HorizontalExample />,
}

export const WithDisabledOption: Story = {
  name: 'With a disabled option',
  args: {
    label: 'Settlement',
    defaultValue: 'daily',
    options: [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'intraday', label: 'Intraday (not licensed)', disabled: true },
      { value: 'monthly', label: 'Monthly' },
    ],
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'combined' },
}
