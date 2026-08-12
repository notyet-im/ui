import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { InlineAction } from './Controls'
import { Tooltip } from './Tooltip'

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          'A short label for the control it hangs off, opening on hover **and** on focus so keyboard users get it too. Rendered in the browser top layer via `popover="manual"`, so no ancestor `overflow` can clip it. The moment the content holds something the user must reach — a link, a field — use `Popover` instead.',
      },
    },
  },
  args: {
    content: 'Institutional flow, net of ETF creations.',
    children: <InlineAction>Net flow</InlineAction>,
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

const infoIcon = (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5v.01" />
  </svg>
)

/**
 * Overlays start open on the canvas and closed on the docs page.
 *
 * Open is right for a card capture and for browsing one story. On the docs page
 * every story renders at once, and these live in the top layer, so several of
 * them float over the prose and the props table at whatever position their
 * trigger happened to land. Closed, the reader gets the trigger and can hover
 * or focus it — which is what the component actually does.
 */
const openOnCanvas = (viewMode: string) => viewMode !== 'docs'

export const Open: Story = {
  name: 'Open (no interaction)',
  args: { defaultOpen: true },
  render: (args, { viewMode }) => <Tooltip {...args} defaultOpen={openOnCanvas(viewMode)} />,
}

export const OnHover: Story = {
  name: 'On hover or focus',
}

export const Placements: Story = {
  args: { defaultOpen: true, content: 'Flow, net of creations.' },
  render: (args, { viewMode }) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 56,
        padding: 56,
        justifyItems: 'center',
      }}
    >
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Tooltip key={placement} {...args} defaultOpen={openOnCanvas(viewMode)} placement={placement}>
          <InlineAction>{placement}</InlineAction>
        </Tooltip>
      ))}
    </div>
  ),
}

export const OnButton: Story = {
  name: 'On an icon button',
  args: { content: 'How this figure is derived', placement: 'right' },
  render: (args) => (
    <Tooltip {...args}>
      <Button iconOnly label="About this figure">
        {infoIcon}
      </Button>
    </Tooltip>
  ),
}
