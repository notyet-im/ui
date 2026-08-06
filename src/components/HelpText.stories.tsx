import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Field, HelpText } from './Field'
import { Input } from './Input'

const meta = {
  title: 'UI/HelpText',
  component: HelpText,
  parameters: {
    docs: {
      description: {
        component:
          'Quiet guidance under a control — a format hint, a unit, a consequence. Inside a `Field` it is rendered and linked automatically through `aria-describedby`; rendered on its own it needs an `id` that something points at, or a screen reader will never reach it.',
      },
    },
  },
  args: { children: 'Position size in millions of dollars.' },
} satisfies Meta<typeof HelpText>

export default meta
type Story = StoryObj<typeof meta>

const Column = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 340 }}>{children}</div>
)

export const Default: Story = {
  render: () => (
    <Column>
      <HelpText>Position size in millions of dollars.</HelpText>
      <HelpText>Flows are settled T+1, so today is always provisional.</HelpText>
    </Column>
  ),
}

/** How it is meant to be used: `Field` renders it and wires `aria-describedby`. */
export const InAField: Story = {
  render: () => (
    <Column>
      <Field label="Allocation" help="Position size in millions of dollars.">
        <Input type="number" defaultValue="250" prefix="$" suffix="m" />
      </Field>
    </Column>
  ),
}

/** Help and error stack; the control is described by both, in that order. */
export const Invalid: Story = {
  render: () => (
    <Column>
      <Field
        label="Allocation"
        help="Position size in millions of dollars."
        error="Exceeds the mandate cap of $500m."
      >
        <Input type="number" defaultValue="900" prefix="$" suffix="m" />
      </Field>
    </Column>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Column>
      <Field label="Allocation" help="Locked while the model is running.">
        <Input type="number" defaultValue="250" prefix="$" suffix="m" disabled />
      </Field>
    </Column>
  ),
}
