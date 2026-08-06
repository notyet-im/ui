import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SankeyFlow } from './SankeyFlow'
import { Panel } from './Panel'
import { buildEdges, makeLabeller } from '../tracker/model'
import { LOCALES } from '../tracker/i18n'

const meta = {
  title: 'Charts/SankeyFlow',
  component: SankeyFlow,
  parameters: {
    docs: {
      description: {
        component:
          'Two-column flow diagram. Selecting a bucket recolours every ribbon touching it — teal where the selection is receiving, rust where it is sending — and fades the rest. The chart draws in CSS pixels, so it needs a measured `width`; pair it with `useMeasure`.',
      },
    },
  },
  args: {
    links: buildEdges('15D', 'combined')
      .slice(0, 9)
      .map((edge) => ({ from: edge.from, to: edge.to, value: edge.value })),
    width: 880,
  },
} satisfies Meta<typeof SankeyFlow>

export default meta
type Story = StoryObj<typeof meta>

const links = buildEdges('15D', 'combined')
  .slice(0, 9)
  .map((edge) => ({ from: edge.from, to: edge.to, value: edge.value }))

const { label, shortLabel } = makeLabeller(LOCALES.en)

function Example({ width = 880, narrow = false }: { width?: number; narrow?: boolean }) {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <Panel padding="chart" style={{ width: width + 36 }}>
      <SankeyFlow
        links={links}
        width={width}
        narrow={narrow}
        selectedId={selected}
        onSelect={(id) => setSelected((current) => (current === id ? null : id))}
        renderLabel={narrow ? shortLabel : label}
        startCaption="SOLD DOWN"
        endCaption="BOUGHT INTO"
      />
    </Panel>
  )
}

export const Default: Story = {
  render: () => <Example />,
}

export const Selected: Story = {
  name: 'With a selection',
  render: () => {
    const [selected, setSelected] = useState<string | null>('HK|TECH')
    return (
      <Panel padding="chart" style={{ width: 916 }}>
        <SankeyFlow
          links={links}
          width={880}
          selectedId={selected}
          onSelect={(id) => setSelected((current) => (current === id ? null : id))}
          renderLabel={label}
          startCaption="SOLD DOWN"
          endCaption="BOUGHT INTO"
        />
      </Panel>
    )
  },
}

export const Narrow: Story = {
  name: 'Narrow (abbreviated labels)',
  render: () => <Example width={340} narrow />,
}
