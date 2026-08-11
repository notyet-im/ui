import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { marketName, RING_NODES, RING_PAIRS } from './chart-fixtures'
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
  args: { nodes: [], pairs: [] },
} satisfies Meta<typeof RotationRing>

export default meta
type Story = StoryObj<typeof meta>

const nodes = RING_NODES
const pairs = RING_PAIRS

function Example({ initial = null }: { initial?: string | null }) {
  const [selected, setSelected] = useState<string | null>(initial)
  return (
    <Panel padding="chart">
      <RotationRing
        nodes={nodes}
        pairs={pairs}
        selectedId={selected}
        onSelect={(id) => setSelected((current) => (current === id ? null : id))}
        renderLabel={marketName}
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
