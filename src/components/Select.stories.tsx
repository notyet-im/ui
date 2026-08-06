import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Select } from './Controls'

const meta = {
  title: 'Controls/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          'A native `<select>` restyled to match the control row, with a drawn chevron. Native on purpose — it inherits the platform picker on touch devices.',
      },
    },
  },
  args: {
    options: [
      { value: 'en', label: 'English' },
      { value: 'zh', label: '中文' },
    ],
    value: 'en',
    onChange: () => {},
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'ko', label: '한국어' },
  { value: 'ja', label: '日本語' },
]

const CURRENCIES = [
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
  { value: 'jpy', label: 'JPY' },
]

function Example({ options, initial, label }: { options: typeof LANGUAGES; initial: string; label: string }) {
  const [value, setValue] = useState(initial)
  return <Select label={label} value={value} onChange={setValue} options={options} />
}

export const Language: Story = {
  render: () => <Example label="Language" options={LANGUAGES} initial="en" />,
}

export const NonLatinSelection: Story = {
  name: 'Non-Latin selection',
  render: () => <Example label="Language" options={LANGUAGES} initial="ko" />,
}

export const Currency: Story = {
  name: 'Short options',
  render: () => <Example label="Currency" options={CURRENCIES} initial="usd" />,
}
