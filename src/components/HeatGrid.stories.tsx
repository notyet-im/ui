import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { CELL_MAX, cellValue, MARKETS, SECTORS } from './chart-fixtures'
import { HeatGrid } from './HeatGrid'
import { Panel } from './Panel'

const meta = {
  title: 'Charts/HeatGrid',
  component: HeatGrid,
  parameters: {
    docs: {
      description: {
        component:
          'Dense signed-value grid on a diverging teal/rust ramp. Cells are buttons — this is a drill-down control, not just a readout. An empty cell falls back to the panel surface so "no data" never reads as "small positive".',
      },
    },
  },
  args: {
    label: 'Net flow by market and sector',
    rows: MARKETS,
    columns: SECTORS,
    value: cellValue,
    max: CELL_MAX,
  },
} satisfies Meta<typeof HeatGrid>

export default meta
type Story = StoryObj<typeof meta>

function GridExample({ narrow = false }: { narrow?: boolean }) {
  const [selected, setSelected] = useState<string | null>('HK|TECH')
  return (
    <Panel padding="chart" style={{ maxWidth: narrow ? 380 : 900 }}>
      <HeatGrid
        label="Net flow by market and sector"
        rows={narrow ? MARKETS.map(({ key, code }) => ({ key, code })) : MARKETS}
        columns={SECTORS}
        value={cellValue}
        max={CELL_MAX}
        selectedKey={selected}
        onSelect={(key) => setSelected((current) => (current === key ? null : key))}
        rowLabelWidth={narrow ? 30 : 92}
        minHeight={narrow ? 380 : 452}
      />
    </Panel>
  )
}

export const Default: Story = {
  render: () => <GridExample />,
}

export const Narrow: Story = {
  name: 'Narrow (codes only)',
  render: () => <GridExample narrow />,
}

export const Unselected: Story = {
  name: 'No selection',
  render: () => (
    <Panel padding="chart" style={{ maxWidth: 900 }}>
      <HeatGrid rows={MARKETS} columns={SECTORS} value={cellValue} minHeight={452} />
    </Panel>
  ),
}
