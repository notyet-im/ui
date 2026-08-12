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

// `roving` is left undefined so the component derives it, which is what the
// Default story is meant to show; the opt-out story passes it explicitly.
function GridExample({ narrow = false, roving }: { narrow?: boolean; roving?: boolean }) {
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
        roving={roving}
      />
    </Panel>
  )
}

export const Default: Story = {
  render: () => <GridExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Because the cells are selectable, the grid is a single tab stop and arrow keys ' +
          'move within it. Tab to a cell, then use the arrows; Home and End jump to the ends ' +
          'of the row, Ctrl+Home and Ctrl+End to the corners. Arrows clamp at the edges ' +
          'rather than wrapping, because wrapping off the end of a row crosses a row and a ' +
          'column boundary in one keystroke. Otherwise this 7x9 grid would be 63 tab stops.',
      },
    },
  },
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

export const PerCellTabStops: Story = {
  name: 'Per-cell tab stops (opt-out)',
  render: () => <GridExample roving={false} />,
  parameters: {
    docs: {
      description: {
        story:
          '`roving={false}` restores a tab stop per cell. This is the escape hatch, not the ' +
          'default — it is right only where each cell is genuinely its own destination and ' +
          'the grid is small enough that tabbing through it is not a wall. Compare the tab ' +
          'behaviour here with the Default story.',
      },
    },
  },
}
