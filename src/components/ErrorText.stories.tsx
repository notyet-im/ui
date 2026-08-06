import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { ErrorText, Field } from './Field'
import { Input, Textarea } from './Input'

const meta = {
  title: 'UI/ErrorText',
  component: ErrorText,
  parameters: {
    docs: {
      description: {
        component:
          'The validation message for a control. Deliberately not `role="alert"`: a server-rendered form arrives with its errors already on the page, and an alert role would make every one of them announce on load. It reaches assistive tech through the control `aria-describedby` and `aria-invalid` that `Field` wires up.',
      },
    },
  },
  args: { children: 'No instrument matches that symbol.' },
} satisfies Meta<typeof ErrorText>

export default meta
type Story = StoryObj<typeof meta>

const Column = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 340 }}>{children}</div>
)

export const Default: Story = {
  render: () => (
    <Column>
      <ErrorText>No instrument matches that symbol.</ErrorText>
      <ErrorText>Exceeds the mandate cap of $500m.</ErrorText>
    </Column>
  ),
}

/** How it is meant to be used: an `error` on `Field` renders it and marks the control invalid. */
export const Invalid: Story = {
  render: () => (
    <Column>
      <Field label="Ticker" error="No instrument matches that symbol.">
        <Input defaultValue="AAPLL" />
      </Field>
      <Field label="Analyst note" error="A note must be at least 20 characters.">
        <Textarea defaultValue="Too short." rows={2} />
      </Field>
    </Column>
  ),
}

/** With help text present the control is described by both, help first. */
export const WithHelp: Story = {
  render: () => (
    <Column>
      <Field
        label="Allocation"
        help="Position size in millions of dollars."
        error="Exceeds the mandate cap of $500m."
        required
      >
        <Input type="number" defaultValue="900" prefix="$" suffix="m" />
      </Field>
    </Column>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Column>
      <Field label="Ticker" error="No instrument matches that symbol.">
        <Input defaultValue="AAPLL" disabled />
      </Field>
    </Column>
  ),
}
