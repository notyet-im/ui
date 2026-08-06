import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { SegmentedControl } from './SegmentedControl'
import { Tabs } from './Tabs'
import { ThemeProvider } from './ThemeProvider'

/**
 * These two shipped `radiogroup` / `tablist` roles with no arrow-key handling,
 * which the WAI-ARIA APG treats as incomplete: the group is meant to be one tab
 * stop that arrows move within, not N separate tab stops.
 *
 * Worth testing rather than eyeballing — a broken roving-focus implementation
 * looks completely correct in a screenshot.
 */

const ITEMS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Bravo' },
  { value: 'c', label: 'Charlie' },
] as const

function SegmentedExample({ initial = 'a' }: { initial?: 'a' | 'b' | 'c' }) {
  const [value, setValue] = useState<'a' | 'b' | 'c'>(initial)
  return (
    <ThemeProvider>
      <SegmentedControl label="Letters" items={ITEMS} value={value} onChange={setValue} />
    </ThemeProvider>
  )
}

describe('SegmentedControl', () => {
  it('exposes exactly one tab stop', () => {
    render(<SegmentedExample />)
    const radios = screen.getAllByRole('radio')
    expect(radios.filter((r) => r.getAttribute('tabindex') === '0')).toHaveLength(1)
    expect(radios[0]).toHaveAttribute('tabindex', '0')
  })

  it('moves selection with arrow keys, and selection follows focus', async () => {
    const user = userEvent.setup()
    render(<SegmentedExample />)

    await user.tab()
    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Bravo' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Bravo' })).toHaveAttribute('aria-checked', 'true')

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveAttribute('aria-checked', 'true')
  })

  it('wraps at both ends', async () => {
    const user = userEvent.setup()
    render(<SegmentedExample />)

    await user.tab()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: 'Charlie' })).toHaveAttribute('aria-checked', 'true')

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveAttribute('aria-checked', 'true')
  })

  it('jumps to the ends with Home and End', async () => {
    const user = userEvent.setup()
    render(<SegmentedExample />)

    await user.tab()
    await user.keyboard('{End}')
    expect(screen.getByRole('radio', { name: 'Charlie' })).toHaveAttribute('aria-checked', 'true')

    await user.keyboard('{Home}')
    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveAttribute('aria-checked', 'true')
  })

  it('skips a disabled item when arrowing onto it', async () => {
    const user = userEvent.setup()
    function Example() {
      const [value, setValue] = useState<'a' | 'b' | 'c'>('a')
      return (
        <ThemeProvider>
          <SegmentedControl
            label="Letters"
            items={[
              { value: 'a', label: 'Alpha' },
              { value: 'b', label: 'Bravo', disabled: true },
              { value: 'c', label: 'Charlie' },
            ]}
            value={value}
            onChange={setValue}
          />
        </ThemeProvider>
      )
    }
    render(<Example />)

    await user.tab()
    await user.keyboard('{ArrowRight}')
    // Focus moves onto Bravo but it must not become the selected value.
    expect(screen.getByRole('radio', { name: 'Bravo' })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveAttribute('aria-checked', 'true')
  })

  it('has no axe violations', async () => {
    const { container } = render(<SegmentedExample />)
    await expectNoAxeViolations(container)
  })
})

describe('Tabs', () => {
  function TabsExample() {
    const [value, setValue] = useState<'one' | 'two'>('one')
    return (
      <ThemeProvider>
        <Tabs
          label="Views"
          panelId="panel"
          items={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
          ]}
          value={value}
          onChange={setValue}
        />
        <div id="panel" role="tabpanel">
          {value}
        </div>
      </ThemeProvider>
    )
  }

  it('moves between tabs with arrow keys', async () => {
    const user = userEvent.setup()
    render(<TabsExample />)

    await user.tab()
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
  })

  it('links each tab to the panel it controls', () => {
    render(<TabsExample />)
    for (const tab of screen.getAllByRole('tab')) {
      expect(tab).toHaveAttribute('aria-controls', 'panel')
    }
  })

  it('has no axe violations', async () => {
    const { container } = render(<TabsExample />)
    await expectNoAxeViolations(container)
  })
})
