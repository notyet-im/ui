import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { useId } from 'react'
import { Label } from './Field'
import { Input } from './Input'

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    docs: {
      description: {
        component:
          'The name of a control. Prefer letting `Field` render it — `Field` generates the id and fills in `htmlFor` for you. Reach for `Label` directly only when the layout puts the label somewhere `Field` cannot. The required marker is decorative (`aria-hidden`); the control itself carries `required`.',
      },
    },
  },
  args: { children: 'Ticker' },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

const Column = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 320 }}>{children}</div>
)

/** Hand-wired pairing — what `Field` does for you. */
function Pair({
  text,
  required = false,
  disabled = false,
  invalid = false,
}: {
  text: string
  required?: boolean
  disabled?: boolean
  invalid?: boolean
}) {
  const id = useId()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Label htmlFor={id} required={required}>
        {text}
      </Label>
      <Input id={id} defaultValue="NVDA" required={required} disabled={disabled} invalid={invalid} />
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <Column>
      <Pair text="Ticker" />
    </Column>
  ),
}

export const Required: Story = {
  render: () => (
    <Column>
      <Pair text="Ticker" required />
    </Column>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Column>
      <Pair text="Ticker" invalid required />
    </Column>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Column>
      <Pair text="Ticker" disabled />
    </Column>
  ),
}
