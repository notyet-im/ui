import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading, Text } from './Text'

const meta = {
  title: 'UI/Heading',
  component: Heading,
  parameters: {
    docs: {
      description: {
        component:
          '`as` and `size` are independent on purpose. The level is document structure — what screen-reader users navigate by — and must follow the outline; the size is visual. `<Heading as="h3" size="2xl">` is a correct third-level heading that happens to be large, which is exactly what stops people from picking the wrong tag to get the look they want.',
      },
    },
  },
  args: { children: 'Where the hot money went' },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'flex', flexDirection: 'column', gap: 16 } as const

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      <Heading size="4xl">4xl · 36px — display</Heading>
      <Heading size="3xl">3xl · 28px — page title</Heading>
      <Heading size="2xl">2xl · 22px — major section</Heading>
      <Heading size="xl">xl · 18px — panel and dialog titles</Heading>
      <Heading size="lg">lg · 16px — heading inside dense content</Heading>
    </div>
  ),
}

export const LevelAndSizeAreIndependent: Story = {
  name: 'Level and size are independent',
  render: () => (
    <div style={stack}>
      <div>
        <Heading as="h1" size="3xl">
          Cross-border equity flows
        </Heading>
        <Text as="p" size="xs" tone="subtle">
          h1 at 3xl — the page title, first in the outline
        </Text>
      </div>
      <div>
        <Heading as="h2" size="lg">
          Ticker-level extremes
        </Heading>
        <Text as="p" size="xs" tone="subtle">
          h2 at lg — a section that needs the level but not the scale
        </Text>
      </div>
      <div>
        <Heading as="h3" size="2xl">
          −$92.4B out of Energy
        </Heading>
        <Text as="p" size="xs" tone="subtle">
          h3 at 2xl — a callout that is large without jumping the outline
        </Text>
      </div>
    </div>
  ),
}

export const Tones: Story = {
  render: () => (
    <div style={stack}>
      <Heading tone="default">default — primary reading colour</Heading>
      <Heading tone="muted">muted — stepped back from the content below</Heading>
      <Heading tone="subtle">subtle — the quietest readable step</Heading>
      <Heading tone="positive">positive — names a value that went up</Heading>
      <Heading tone="negative">negative — names a value that went down</Heading>
      <Heading tone="accent">accent — one heading pulled forward</Heading>
    </div>
  ),
}

export const Truncated: Story = {
  render: () => (
    <div style={{ ...stack, width: 320, gap: 8 }}>
      <Heading size="xl" truncate>
        Samsung Electronics preferred — cross-border institutional net purchase
      </Heading>
      <Text as="p" size="xs" tone="subtle">
        Single line with an ellipsis. The parent must be able to shrink — inside a flex or grid child that
        means `min-width: 0` on the parent.
      </Text>
    </div>
  ),
}
