import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Field } from './Field'
import { Input } from './Input'

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'A single-line text control. Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`) — the deliberate exception to the controlled-first house rule, because native form submission needs the uncontrolled mode. Wrap it in a `Field` to get the label, the id and the `aria-describedby` wiring for free.',
      },
    },
  },
  args: { placeholder: 'AAPL', 'aria-label': 'Ticker' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

const Column = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>{children}</div>
)

function ControlledExample() {
  const [value, setValue] = useState('AAPL')
  return (
    <Field label="Ticker" help={`${value.length}/8 characters`}>
      <Input value={value} onChange={setValue} maxLength={8} placeholder="AAPL" />
    </Field>
  )
}

export const Default: Story = {
  render: () => (
    <Column>
      <Field label="Ticker" help="Uncontrolled — the input keeps its own value.">
        <Input defaultValue="NVDA" />
      </Field>
      <ControlledExample />
    </Column>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Column>
      <Input size="sm" aria-label="Small" placeholder="sm — 28px" />
      <Input size="md" aria-label="Medium" placeholder="md — 34px" />
      <Input size="lg" aria-label="Large" placeholder="lg — 44px" />
    </Column>
  ),
}

/** Affixes are decorative and click-through — they never steal focus from the control. */
export const WithAffixes: Story = {
  render: () => (
    <Column>
      <Field label="Allocation">
        <Input type="number" defaultValue="250" prefix="$" suffix="m" inputMode="decimal" />
      </Field>
      <Field label="Threshold">
        <Input type="number" defaultValue="4.5" suffix="%" step={0.1} />
      </Field>
    </Column>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Column>
      <Field label="Ticker" error="No instrument matches that symbol.">
        <Input defaultValue="AAPLL" />
      </Field>
      <Input aria-label="Standalone invalid" defaultValue="AAPLL" invalid />
    </Column>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Column>
      <Field label="Ticker" help="Locked while the model is running.">
        <Input defaultValue="NVDA" disabled />
      </Field>
      <Field label="Book" help="Read-only: selectable, but not editable.">
        <Input defaultValue="Institutional" readOnly />
      </Field>
    </Column>
  ),
}
