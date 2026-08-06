import type { Meta, StoryObj } from '@storybook/react-vite'
import { NarrativeItem } from './Details'
import { Panel } from './Panel'

const meta = {
  title: 'Data display/NarrativeItem',
  component: NarrativeItem,
  parameters: {
    docs: {
      description: {
        component:
          'A plain-language annotation with a coloured rail. Use it to explain a number the charts already showed — the rail ties the prose back to the flow direction.',
      },
    },
  },
  args: {
    title: 'KR · Semiconductors → HK · Tech & Internet',
    value: '$5.3B',
    tone: 1,
    children:
      'Foreign desks trimmed Korean memory after a hot 6-month run and redeployed into Hong Kong platform names on cheaper multiples and southbound buying.',
  },
} satisfies Meta<typeof NarrativeItem>

export default meta
type Story = StoryObj<typeof meta>

export const Inflow: Story = {}

export const Outflow: Story = {
  args: {
    title: 'TW · Semiconductors → US · Tech & Internet',
    value: '$3.6B',
    tone: -1,
    children:
      'Taiwan foundry weightings were cut back into strength; the money went straight back up the AI stack into US hyperscalers.',
  },
}

export const Feed: Story = {
  render: (args) => (
    <Panel style={{ maxWidth: 520 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <NarrativeItem {...args} />
        <NarrativeItem title="SG · Property → HK · Financials" value="$2.0B" tone={-1}>
          Singapore REIT positions were cut on funding costs; proceeds landed in Hong Kong financials as HIBOR
          eased.
        </NarrativeItem>
        <NarrativeItem title="US · Tech & Internet → JP · Industrials" value="$1.7B" tone={1}>
          Profit-taking in US megacap software funded a rotation into Japanese automation and capital goods.
        </NarrativeItem>
      </div>
    </Panel>
  ),
}
