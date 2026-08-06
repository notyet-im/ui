import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { REGION_CODES, SECTOR_KEYS } from '../tracker/data'
import { LOCALES } from '../tracker/i18n'
import { bucketNets, buildEdges } from '../tracker/model'
import { HeatGrid } from './HeatGrid'
import { Panel } from './Panel'

const meta = {
  title: 'Data display/HeatGrid',
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
    rows: REGION_CODES.map((code) => ({ key: code, code, name: LOCALES.en.reg[code] })),
    columns: SECTOR_KEYS.map((key) => ({ key, label: LOCALES.en.sshort[key] })),
    value: () => 0,
  },
} satisfies Meta<typeof HeatGrid>

export default meta
type Story = StoryObj<typeof meta>

const edges = buildEdges('15D', 'combined')
const nets = bucketNets(edges)
const locale = LOCALES.en

function GridExample({ narrow = false }: { narrow?: boolean }) {
  const [selected, setSelected] = useState<string | null>('HK|TECH')
  return (
    <Panel padding="chart" style={{ maxWidth: narrow ? 380 : 900 }}>
      <HeatGrid
        rows={REGION_CODES.map((code) => ({ key: code, code, name: narrow ? undefined : locale.reg[code] }))}
        columns={SECTOR_KEYS.map((key) => ({ key, label: locale.sshort[key] }))}
        value={(row, column) => nets[`${row}|${column}`] ?? 0}
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
      <HeatGrid
        rows={REGION_CODES.map((code) => ({ key: code, code, name: locale.reg[code] }))}
        columns={SECTOR_KEYS.map((key) => ({ key, label: locale.sshort[key] }))}
        value={(row, column) => nets[`${row}|${column}`] ?? 0}
        minHeight={452}
      />
    </Panel>
  ),
}
