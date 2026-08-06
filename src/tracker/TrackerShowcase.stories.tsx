import type { Meta, StoryObj } from '@storybook/react-vite'
import { TrackerShowcase } from './TrackerShowcase'

const meta = {
  title: 'Showcase/TrackerShowcase',
  component: TrackerShowcase,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The full dashboard, assembled entirely from the design system. Props seed the initial state; every one of them is then user-controllable in the page itself.',
      },
    },
  },
  // The tracker renders its own ThemeProvider, so bypass the global decorator.
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof TrackerShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const Dark: Story = {
  args: { theme: 'dark' },
}

export const Light: Story = {
  args: { theme: 'light' },
}

export const GridView: Story = {
  name: 'Region × sector grid',
  args: { heroView: 'grid' },
}

export const RingView: Story = {
  name: 'Rotation ring',
  args: { heroView: 'ring' },
}

export const Japanese: Story = {
  args: { lang: 'ja' },
}

export const Korean: Story = {
  args: { lang: 'ko' },
}

export const Chinese: Story = {
  args: { lang: 'zh' },
}

export const IntradayEtf: Story = {
  name: 'Intraday · ETF only',
  args: { initialRange: '1D', metric: 'etf' },
}
