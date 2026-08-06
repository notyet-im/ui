import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconButton } from './Controls'

const meta = {
  title: 'Controls/IconButton',
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component:
          'A square 34px button holding a single icon. `label` is required — the button has no text, so it needs an explicit accessible name.',
      },
    },
  },
  args: { label: 'Refresh' },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

/* Decorative — IconButton supplies the accessible name via its `label` prop. */
const RefreshIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    aria-hidden="true"
  >
    <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    aria-hidden="true"
  >
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Default: Story = {
  args: { label: 'Refresh', children: <RefreshIcon /> },
}

export const Group: Story = {
  args: { label: '' },
  render: () => (
    <div style={{ display: 'flex', gap: 10 }}>
      <IconButton label="Refresh">
        <RefreshIcon />
      </IconButton>
      <IconButton label="Download">
        <DownloadIcon />
      </IconButton>
    </div>
  ),
}
