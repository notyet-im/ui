import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading, Text, VisuallyHidden } from './Text'

const meta = {
  title: 'UI/VisuallyHidden',
  component: VisuallyHidden,
  parameters: {
    docs: {
      description: {
        component:
          'Text removed from the visual layout but left in the accessibility tree. For the *name* of a control that has none, prefer `aria-label` — one attribute, no DOM. Reach for this when the text is content rather than a name: the expansion of an abbreviated header, a sort annotation, a live-region message with no visual counterpart. Nothing below is visible; inspect the DOM or listen with a screen reader.',
      },
    },
  },
  args: { children: 'ascending' },
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'flex', flexDirection: 'column', gap: 12 } as const

export const Default: Story = {
  render: () => (
    <div style={stack}>
      <Text as="p">
        This sentence carries a hidden aside.
        <VisuallyHidden> Figures are in billions of US dollars.</VisuallyHidden> It reads the same on screen,
        and longer to a screen reader.
      </Text>
      <Text as="p" size="xs" tone="subtle">
        The hidden run sits between "aside." and "It reads" in the DOM.
      </Text>
    </div>
  ),
}

export const AbbreviatedHeader: Story = {
  name: 'Abbreviated column header',
  render: () => (
    <div style={{ ...stack, gap: 6, width: 260 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <Text size="xs" tone="subtle" weight="medium">
          Region
        </Text>
        <Text size="xs" tone="subtle" weight="medium">
          NF
          <VisuallyHidden> net flow, billions of US dollars</VisuallyHidden>
        </Text>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <Text size="sm" tone="muted">
          Korea
        </Text>
        <Text size="sm" tone="positive" numeric>
          +1,284.05
        </Text>
      </div>
      <Text as="p" size="xs" tone="subtle">
        The column reads "NF" on screen and "NF net flow, billions of US dollars" aloud.
      </Text>
    </div>
  ),
}

export const SectionLabel: Story = {
  name: 'Heading for a visually implicit section',
  render: () => (
    <div style={stack}>
      <VisuallyHidden as="div">
        <Heading as="h2" size="lg">
          Regional breakdown
        </Heading>
      </VisuallyHidden>
      <Text as="p">
        The panel's framing already says what this region list is, so a visible heading would repeat it — but
        the outline still needs one to be navigable.
      </Text>
      <Text as="p" size="xs" tone="subtle">
        An `h2` is present above this paragraph, hidden inside a `div`.
      </Text>
    </div>
  ),
}
