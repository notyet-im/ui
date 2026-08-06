import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { ThemeName } from '../tokens'
import { Select } from './Controls'
import { PageHeader } from './PageHeader'
import { SegmentedControl } from './SegmentedControl'
import { ThemeToggle } from './ThemeToggle'

const meta = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  args: { title: 'Where the hot money went' },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    kicker: 'Cross-border equity flows',
    title: 'Where the hot money went',
    subtitle: 'Net institutional + ETF flow across US · EU · JP · KR · TW · HK · SG',
  },
}

function WithControls() {
  const [range, setRange] = useState('15D')
  const [lang, setLang] = useState('en')
  const [theme, setTheme] = useState<ThemeName>('dark')
  return (
    <PageHeader
      kicker="Cross-border equity flows"
      title="Where the hot money went"
      subtitle={
        <>
          Net institutional + ETF flow across US · EU · JP · KR · TW · HK · SG —{' '}
          <span style={{ fontFamily: 'var(--cf-font-mono)' }}>3 Aug 2026 · 17:00 HKT</span>
        </>
      }
      actions={
        <>
          <SegmentedControl
            variant="mono"
            label="Lookback"
            value={range}
            onChange={setRange}
            items={['1D', '5D', '15D', '30D'].map((key) => ({ value: key, label: key }))}
          />
          <Select
            label="Language"
            value={lang}
            onChange={setLang}
            options={[
              { value: 'en', label: 'English' },
              { value: 'zh', label: '中文' },
            ]}
          />
          <ThemeToggle theme={theme} onChange={setTheme} />
        </>
      }
    />
  )
}

export const WithActions: Story = {
  render: () => <WithControls />,
}
