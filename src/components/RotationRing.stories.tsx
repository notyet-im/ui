import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { REGION_CODES } from '../tracker/data'
import { LOCALES } from '../tracker/i18n'
import { buildEdges, regionAggregates } from '../tracker/model'
import { Panel } from './Panel'
import { RotationRing } from './RotationRing'

const meta = {
  title: 'Charts/RotationRing',
  component: RotationRing,
  parameters: {
    docs: {
      description: {
        component:
          'Circular rotation view — bubble size is net position change, chord thickness is gross flow between a pair. Use this when the question is "which markets traded with which"; use `SankeyFlow` when it is "where did this money go".',
      },
    },
  },
  args: { nodes: [], pairs: [], width: 880 },
} satisfies Meta<typeof RotationRing>

export default meta
type Story = StoryObj<typeof meta>

const regions = regionAggregates(buildEdges('15D', 'combined'))
const nodes = REGION_CODES.map((code) => ({ id: code, net: regions.nets[code] }))
const pairs = REGION_CODES.flatMap((from) =>
  REGION_CODES.map((to) => ({ from, to, value: regions.pairs[from][to] })),
)

function Example({ initial = null }: { initial?: string | null }) {
  const [selected, setSelected] = useState<string | null>(initial)
  return (
    <Panel padding="chart" style={{ width: 916 }}>
      <RotationRing
        nodes={nodes}
        pairs={pairs}
        width={880}
        selectedId={selected}
        onSelect={(id) => setSelected((current) => (current === id ? null : id))}
        renderLabel={(id) => LOCALES.en.reg[id as (typeof REGION_CODES)[number]]}
      />
    </Panel>
  )
}

export const Default: Story = {
  render: () => <Example />,
}

export const Selected: Story = {
  name: 'With a selection',
  render: () => <Example initial="HK" />,
}
