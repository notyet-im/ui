import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel, PanelHeading } from './Panel'

const meta = {
  title: 'UI/PanelHeading',
  component: PanelHeading,
  parameters: {
    docs: {
      description: {
        component:
          'Title/subtitle pair for the top of a `Panel`. `inline` pushes the subtitle to the far edge — for wide panels where a stacked heading would waste a line.',
      },
    },
  },
  args: { title: 'Ticker-level extremes', subtitle: 'Largest single-name net flow, 15 days' },
} satisfies Meta<typeof PanelHeading>

export default meta
type Story = StoryObj<typeof meta>

export const Stacked: Story = {
  render: (args) => (
    <Panel style={{ maxWidth: 420 }}>
      <PanelHeading {...args} />
    </Panel>
  ),
}

export const Inline: Story = {
  args: {
    inline: true,
    title: 'Sector momentum, all markets',
    subtitle: 'cumulative net flow path over 15 days · click to focus',
  },
  render: (args) => (
    <Panel>
      <PanelHeading {...args} />
    </Panel>
  ),
}

export const TitleOnly: Story = {
  args: { title: 'Region rotation matrix', subtitle: undefined },
  render: (args) => (
    <Panel style={{ maxWidth: 420 }}>
      <PanelHeading {...args} />
    </Panel>
  ),
}
