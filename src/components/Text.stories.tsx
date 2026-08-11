import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from './Text'

const meta = {
  title: 'UI/Text',
  component: Text,
  parameters: {
    docs: {
      description: {
        component:
          'Body text at a chosen step of the type scale. The system ships no composite text tokens and no utility classes, so this is the supported way to set type — each `size` binds a font-size to the line-height it was drawn against. Use `Heading` for anything that belongs in the document outline, and `Eyebrow` for the uppercase monospace section label.',
      },
    },
  },
  args: { children: 'Net institutional flow turned positive in the last five sessions.' },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'flex', flexDirection: 'column', gap: 12 } as const

export const Default: Story = {
  args: { as: 'p' },
}

export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      <Text as="p" size="lg">
        lg · 16px — lead-in copy at the top of a section
      </Text>
      <Text as="p" size="md">
        md · 14px — body copy, the default
      </Text>
      <Text as="p" size="sm">
        sm · 13px — dense body and control labels
      </Text>
      <Text as="p" size="xs">
        xs · 12px — captions and help text
      </Text>
      <Text as="p" size="2xs">
        2xs · 11px — micro copy, matrix cells, annotations
      </Text>
    </div>
  ),
}

export const Tones: Story = {
  render: () => (
    <div style={stack}>
      <Text as="p" tone="default">
        default — primary reading colour
      </Text>
      <Text as="p" tone="muted">
        muted — subtitles and captions
      </Text>
      <Text as="p" tone="subtle">
        subtle — units, timestamps, the quietest readable step
      </Text>
      <Text as="p" tone="positive">
        positive — a value that went up, teal in both themes
      </Text>
      <Text as="p" tone="negative">
        negative — a value that went down, rust in both themes
      </Text>
      <Text as="p" tone="accent">
        accent — one figure pulled forward, never a whole paragraph
      </Text>
      <Text as="p" tone="danger">
        danger — something is wrong; a validation message, not a number that fell
      </Text>
    </div>
  ),
}

export const FieldMessages: Story = {
  name: 'Field messages',
  parameters: {
    docs: {
      description: {
        story:
          'What `Field` renders under a control. These were `HelpText` and `ErrorText` until their stylesheets turned out to be `.ny-text` plus `.ny-text--size-xs` exactly, leaving a colour as the only difference between them.',
      },
    },
  },
  render: () => (
    <div style={stack}>
      <Text as="p" size="xs" tone="muted">
        Position size in millions of dollars.
      </Text>
      <Text as="p" size="xs" tone="danger">
        Exceeds the mandate cap of $900m.
      </Text>
    </div>
  ),
}

export const NumericColumn: Story = {
  name: 'Numeric (tabular figures)',
  render: () => (
    <div style={{ ...stack, gap: 6, width: 260 }}>
      <Text size="xs" tone="subtle" weight="medium">
        Net flow, $B
      </Text>
      {[
        { label: 'Semiconductors', value: '+1,284.05', tone: 'positive' as const },
        { label: 'Energy', value: '−92.40', tone: 'negative' as const },
        { label: 'Financials', value: '+7.10', tone: 'positive' as const },
      ].map((row) => (
        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <Text size="sm" tone="muted">
            {row.label}
          </Text>
          <Text size="sm" tone={row.tone} numeric weight="medium" align="end">
            {row.value}
          </Text>
        </div>
      ))}
    </div>
  ),
}

export const Truncated: Story = {
  render: () => (
    <div style={{ ...stack, width: 280 }}>
      <div style={{ display: 'flex', gap: 12, minWidth: 0 }}>
        <Text size="sm" tone="subtle">
          KR
        </Text>
        {/* The flex child needs min-width: 0 — otherwise the text sets the track width. */}
        <div style={{ minWidth: 0 }}>
          <Text size="sm" truncate>
            Samsung Electronics preferred — cross-border institutional net purchase
          </Text>
        </div>
      </div>
      <Text as="p" size="xs" tone="subtle">
        Same string without `truncate`, for comparison:
      </Text>
      <Text as="p" size="sm">
        Samsung Electronics preferred — cross-border institutional net purchase
      </Text>
    </div>
  ),
}
