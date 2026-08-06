import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Field } from './Field'
import { Input, Textarea } from './Input'

const meta = {
  title: 'UI/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          'The wrapper that makes label/control association impossible to get wrong. One `useId` feeds the label `htmlFor`, the control `id`, and the `aria-describedby` that points at the help and error text — none of it is repeated at the call site, because hand-wired `htmlFor` is the most common accessibility defect in a form. An `error` is what makes the control `aria-invalid`.',
      },
    },
  },
  args: { label: 'Ticker' },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

const Column = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 340 }}>{children}</div>
)

export const Default: Story = {
  render: () => (
    <Column>
      <Field label="Ticker">
        <Input defaultValue="NVDA" />
      </Field>
    </Column>
  ),
}

export const WithHelp: Story = {
  render: () => (
    <Column>
      <Field label="Allocation" help="Position size in millions of dollars.">
        <Input type="number" defaultValue="250" prefix="$" suffix="m" />
      </Field>
      <Field label="Analyst note" help="Shown on the desk summary the next morning.">
        <Textarea defaultValue="Semis outflow accelerating." rows={2} />
      </Field>
    </Column>
  ),
}

export const Required: Story = {
  render: () => (
    <Column>
      <Field label="Ticker" required help="The marker is decorative; the control carries `required`.">
        <Input placeholder="AAPL" />
      </Field>
    </Column>
  ),
}

/** `error` alone sets `aria-invalid` on the control and links the message to it. */
export const Invalid: Story = {
  render: () => (
    <Column>
      <Field label="Ticker" error="No instrument matches that symbol.">
        <Input defaultValue="AAPLL" />
      </Field>
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
      <Field label="Ticker" help="Locked while the model is running.">
        <Input defaultValue="NVDA" disabled />
      </Field>
      <Field label="Analyst note" help="Locked while the model is running.">
        <Textarea defaultValue="Semis outflow accelerating." rows={2} disabled />
      </Field>
    </Column>
  ),
}
