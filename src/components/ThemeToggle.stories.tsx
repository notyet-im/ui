import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { ThemeName } from '../tokens'
import { ThemeToggle } from './ThemeToggle'

const meta = {
  title: 'Theme/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    docs: {
      description: {
        component:
          'The icon shows the *current* theme — a sun while dark, a moon while light. Its accessible name describes the result of pressing it.',
      },
    },
  },
  args: { theme: 'dark', onChange: () => {} },
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

function Example({ initial }: { initial: ThemeName }) {
  const [theme, setTheme] = useState<ThemeName>(initial)
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ThemeToggle theme={theme} onChange={setTheme} />
      <span style={{ fontSize: 'var(--ny-font-size-sm)', color: 'var(--ny-text-muted)' }}>
        local state: {theme} (the surrounding page keeps the Storybook toolbar theme)
      </span>
    </div>
  )
}

export const Dark: Story = {
  render: () => <Example initial="dark" />,
}

export const Light: Story = {
  render: () => <Example initial="light" />,
}
