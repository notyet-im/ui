import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

/**
 * An inline data URI rather than a hosted file: design-sync captures run without
 * network access, and a story that renders a broken image is not a story.
 */
const PORTRAIT =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
  '<rect width="64" height="64" fill="%232fbfa8"/>' +
  '<circle cx="32" cy="25" r="11" fill="%2306201c"/>' +
  '<path d="M6 64c5-15 13-21 26-21s21 6 26 21z" fill="%2306201c"/></svg>'

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          'A person or organisation at a glance. `name` is required because it is both the accessible name and the source of the initials fallback — a missing or broken `src` degrades to initials, never to a broken-image glyph.',
      },
    },
  },
  args: {
    name: 'Ada Lovelace',
    size: 'md',
    shape: 'circle',
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' } as const

export const Default: Story = {
  args: { src: PORTRAIT },
}

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Avatar size="sm" name="Ada Lovelace" src={PORTRAIT} />
      <Avatar size="md" name="Ada Lovelace" src={PORTRAIT} />
      <Avatar size="lg" name="Ada Lovelace" src={PORTRAIT} />
    </div>
  ),
}

export const Shapes: Story = {
  render: () => (
    <div style={row}>
      <Avatar shape="circle" name="Ada Lovelace" />
      <Avatar shape="square" name="Bridgewater Associates" />
      <Avatar shape="square" size="lg" name="Bridgewater Associates" src={PORTRAIT} />
    </div>
  ),
}

export const Fallback: Story = {
  render: () => (
    <div style={row}>
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace" />
      <Avatar name="Katherine Coleman Goble Johnson" />
      {/* A deliberately undecodable data URI, not a bad URL: it triggers the
          same `onError` fallback while making no network request at all. A
          remote URL here fired an [ASSETS_BLOCKED] warning on every capture
          forever, which is exactly how a real egress failure gets ignored. */}
      <Avatar name="Ada Lovelace" src="data:image/png;base64,not-a-real-image" />
    </div>
  ),
}

export const Stack: Story = {
  render: () => (
    <div style={{ ...row, gap: 8 }}>
      <Avatar size="sm" name="Ada Lovelace" src={PORTRAIT} />
      <Avatar size="sm" name="Grace Hopper" />
      <Avatar size="sm" name="Katherine Johnson" />
      <span style={{ color: 'var(--ny-text-muted)', fontSize: 13 }}>+4 others</span>
    </div>
  ),
}
