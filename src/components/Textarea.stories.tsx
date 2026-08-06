import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Field } from './Field'
import { Textarea } from './Input'

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          'The multi-line sibling of `Input`, with the same controlled/uncontrolled contract. `autoGrow` re-measures the content after every change so the box tracks the note instead of stranding the writer in a three-line window.',
      },
    },
  },
  args: { placeholder: 'Why did the flow reverse?', 'aria-label': 'Note' },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

const Column = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 380 }}>{children}</div>
)

function AutoGrowExample() {
  const [value, setValue] = useState('Institutional buyers rotated out of semis on the 14th.')
  return (
    <Field label="Analyst note" help="The box grows as you type.">
      <Textarea value={value} onChange={setValue} autoGrow rows={2} />
    </Field>
  )
}

export const Default: Story = {
  render: () => (
    <Column>
      <Field label="Analyst note" help="Plain textarea — drag the corner to resize.">
        <Textarea defaultValue="Flows turned negative three sessions running." />
      </Field>
    </Column>
  ),
}

export const AutoGrow: Story = {
  render: () => (
    <Column>
      <AutoGrowExample />
    </Column>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Column>
      <Textarea size="sm" rows={2} aria-label="Small" placeholder="sm" />
      <Textarea size="md" rows={2} aria-label="Medium" placeholder="md" />
      <Textarea size="lg" rows={2} aria-label="Large" placeholder="lg" />
    </Column>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Column>
      <Field label="Analyst note" error="A note must be at least 20 characters.">
        <Textarea defaultValue="Too short." rows={2} />
      </Field>
    </Column>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Column>
      <Field label="Analyst note" help="Locked once the report is published.">
        <Textarea defaultValue="Flows turned negative three sessions running." disabled rows={2} />
      </Field>
      <Field label="Published note" help="Read-only: selectable, but not editable.">
        <Textarea defaultValue="Flows turned negative three sessions running." readOnly rows={2} />
      </Field>
    </Column>
  ),
}
