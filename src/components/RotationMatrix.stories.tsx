import type { Meta, StoryObj } from '@storybook/react-vite'
import { RotationMatrix } from './HeatGrid'
import { Panel } from './Panel'
import { PanelHeading } from './Panel'
import { buildEdges, regionAggregates } from '../tracker/model'
import { REGION_CODES } from '../tracker/data'

const meta = {
  title: 'Data display/RotationMatrix',
  component: RotationMatrix,
  parameters: {
    docs: {
      description: {
        component:
          'Square from→to matrix. The diagonal is deliberately blanked — a market rotating with itself is not a cross-border flow. Read it as: row sold, column bought.',
      },
    },
  },
  args: { codes: REGION_CODES, value: () => 0 },
} satisfies Meta<typeof RotationMatrix>

export default meta
type Story = StoryObj<typeof meta>

const regions = regionAggregates(buildEdges('15D', 'combined'))

export const Default: Story = {
  render: () => (
    <Panel style={{ maxWidth: 460 }}>
      <RotationMatrix
        codes={REGION_CODES}
        value={(from, to) => regions.pairs[from][to]}
        max={regions.maxPair}
      />
    </Panel>
  ),
}

export const WithHeading: Story = {
  render: () => (
    <Panel style={{ maxWidth: 460 }}>
      <PanelHeading title="Region rotation matrix" subtitle="Row sold → column bought, $B" />
      <RotationMatrix
        codes={REGION_CODES}
        value={(from, to) => regions.pairs[from][to]}
        max={regions.maxPair}
      />
    </Panel>
  ),
}
