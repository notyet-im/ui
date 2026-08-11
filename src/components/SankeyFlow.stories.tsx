import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { FLOW_LINKS, flowLabel, flowLabelShort } from './chart-fixtures'
import { Panel } from './Panel'
import { SankeyFlow } from './SankeyFlow'

const meta = {
  title: 'Charts/SankeyFlow',
  component: SankeyFlow,
  parameters: {
    docs: {
      description: {
        component:
          'Two-column flow diagram. Selecting a bucket recolours every ribbon touching it — teal where the selection is receiving, rust where it is sending — and fades the rest. The chart lays out in CSS pixels because its labels are HTML and must not scale, so it measures its own container — give it a container, not a `width`.',
      },
    },
  },
  args: { links: FLOW_LINKS },
} satisfies Meta<typeof SankeyFlow>

export default meta
type Story = StoryObj<typeof meta>

const links = FLOW_LINKS
const label = flowLabel
const shortLabel = flowLabelShort

/** `maxWidth` constrains the *container*; the chart measures whatever it gets. */
function Example({ narrow = false, maxWidth }: { narrow?: boolean; maxWidth?: number }) {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <Panel padding="chart" style={maxWidth != null ? { maxWidth } : undefined}>
      <SankeyFlow
        links={links}
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
      <Panel padding="chart">
        <SankeyFlow
          links={links}
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
  render: () => <Example maxWidth={376} narrow />,
}
