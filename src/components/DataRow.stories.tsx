import type { Meta, StoryObj } from '@storybook/react-vite'
import { flowColors } from '../tokens'
import { DataRow } from './Details'
import { Panel } from './Panel'

const meta = {
  title: 'Data display/DataRow',
  component: DataRow,
  parameters: {
    docs: {
      description: {
        component:
          'One line of a ranked list: identity on the left, figure on the right. `inline` puts the caption beside the label; `stacked` puts it below, for ticker lists where the symbol leads.',
      },
    },
  },
  args: { label: 'from KR · Semiconductors', value: '+$5.3B', tone: 1 },
} satisfies Meta<typeof DataRow>

export default meta
type Story = StoryObj<typeof meta>

export const Inflow: Story = {
  args: { leading: '←', label: 'from KR · Semiconductors', value: '+$5.3B', tone: 1 },
}

export const Outflow: Story = {
  args: { leading: '→', label: 'to US · Tech & Internet', value: '−$3.6B', tone: -1 },
}

export const Stacked: Story = {
  args: {
    layout: 'stacked',
    monoLabel: true,
    label: '9988.HK',
    caption: 'Alibaba',
    value: '$2.1B',
    valueColor: flowColors.inflow,
  },
}

export const Counterparties: Story = {
  args: { label: '', value: '' },
  render: () => (
    <Panel style={{ maxWidth: 336 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <DataRow leading="←" label="from KR · Semiconductors" value="+$5.3B" tone={1} />
        <DataRow leading="←" label="from HK · Property" value="+$1.3B" tone={1} />
        <DataRow leading="→" label="to US · Tech & Internet" value="−$3.6B" tone={-1} />
      </div>
    </Panel>
  ),
}

export const TickerList: Story = {
  args: { label: '', value: '' },
  render: () => (
    <Panel style={{ maxWidth: 260 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <DataRow
          layout="stacked"
          monoLabel
          label="9988.HK"
          caption="Alibaba"
          value="$2.1B"
          valueColor={flowColors.inflow}
        />
        <DataRow
          layout="stacked"
          monoLabel
          label="0700.HK"
          caption="Tencent"
          value="$2.0B"
          valueColor={flowColors.inflow}
        />
        <DataRow
          layout="stacked"
          monoLabel
          label="3690.HK"
          caption="Meituan"
          value="$1.3B"
          valueColor={flowColors.inflow}
        />
      </div>
    </Panel>
  ),
}
