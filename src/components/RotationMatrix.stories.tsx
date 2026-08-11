import type { Meta, StoryObj } from '@storybook/react-vite'
import { MARKET_CODES, PAIR_MAX, pairValue } from './chart-fixtures'
import { RotationMatrix } from './HeatGrid'
import { Panel, PanelHeading } from './Panel'

const meta = {
  title: 'Charts/RotationMatrix',
  component: RotationMatrix,
  parameters: {
    docs: {
      description: {
        component:
          'Square from→to matrix. The diagonal is deliberately blanked — a market rotating with itself is not a cross-border flow. Read it as: row sold, column bought.',
      },
    },
  },
  args: { label: 'Market rotation', codes: MARKET_CODES, value: pairValue, max: PAIR_MAX },
} satisfies Meta<typeof RotationMatrix>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Panel style={{ maxWidth: 460 }}>
      <RotationMatrix label="Market rotation" codes={MARKET_CODES} value={pairValue} max={PAIR_MAX} />
    </Panel>
  ),
}

export const WithHeading: Story = {
  render: () => (
    <Panel style={{ maxWidth: 460 }}>
      <PanelHeading title="Region rotation matrix" subtitle="Row sold → column bought, $B" />
      <RotationMatrix label="Market rotation" codes={MARKET_CODES} value={pairValue} max={PAIR_MAX} />
    </Panel>
  ),
}
