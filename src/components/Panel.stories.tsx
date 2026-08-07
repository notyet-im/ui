import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel, PanelHeading } from './Panel'

const meta = {
  title: 'UI/Panel',
  component: Panel,
  parameters: {
    docs: {
      description: {
        component:
          'The surface every block of content sits on. Pick the padding variant by what the panel holds — `chart` trims the bottom so a plot can breathe.',
      },
    },
  },
} satisfies Meta<typeof Panel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Standard panel padding — 16px on every side, from --ny-inset.',
  },
}

export const WithHeading: Story = {
  render: () => (
    <Panel style={{ maxWidth: 420 }}>
      <PanelHeading title="Ticker-level extremes" subtitle="Largest single-name net flow, 15 days" />
      <div style={{ fontSize: 'var(--ny-font-size-sm)' }}>Panel body follows the heading.</div>
    </Panel>
  ),
}

export const InlineHeading: Story = {
  render: () => (
    <Panel>
      <PanelHeading
        inline
        title="Sector momentum, all markets"
        subtitle="cumulative net flow path over 15 days · click to focus"
      />
      <div style={{ fontSize: 'var(--ny-font-size-sm)' }}>
        The inline variant pushes the subtitle to the far edge — for wide panels where a stacked heading would
        waste a line.
      </div>
    </Panel>
  ),
}

export const PaddingVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <Panel padding="default">default</Panel>
      <Panel padding="chart">chart</Panel>
      <Panel padding="compact">compact</Panel>
      <Panel padding="none">
        <div style={{ padding: 8 }}>none</div>
      </Panel>
    </div>
  ),
}

export const Slots: Story = {
  name: 'Header and footer',
  render: () => (
    <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(2, 1fr)' }}>
      <Panel header="Position limits" footer="Updated 17:00 HKT">
        Supplying either slot divides the panel and moves the padding onto the regions — this is the shape
        usually called a card.
      </Panel>
      <Panel interactive header="Sector momentum">
        An interactive panel lifts on hover, for a surface that is itself a link or click target.
      </Panel>
    </div>
  ),
}
