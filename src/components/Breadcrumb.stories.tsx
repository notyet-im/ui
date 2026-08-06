import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from './Breadcrumb'

const meta = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component:
          'The trail back up the hierarchy. The last item is the current page: it renders as plain text with `aria-current="page"`, never as a link.',
      },
    },
  },
  args: {
    items: [
      { label: 'Markets', href: '#markets' },
      { label: 'Asia Pacific', href: '#apac' },
      { label: 'KR · Semiconductors' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TwoLevels: Story = {
  args: {
    items: [{ label: 'Markets', href: '#markets' }, { label: 'Asia Pacific' }],
  },
}

export const Deep: Story = {
  args: {
    label: 'Flow drill-down',
    items: [
      { label: 'Markets', href: '#markets' },
      { label: 'Asia Pacific', href: '#apac' },
      { label: 'Korea', href: '#kr' },
      { label: 'Semiconductors', href: '#kr-semis' },
      { label: 'Institutional · 15D' },
    ],
  },
}

export const RouterButtons: Story = {
  name: 'Router buttons (no href)',
  args: {
    items: [
      { label: 'Markets', onClick: () => {} },
      { label: 'Asia Pacific', onClick: () => {} },
      { label: 'KR · Semiconductors' },
    ],
  },
}
