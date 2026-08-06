import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Radio, RadioGroup } from './Radio'
import { ThemeProvider } from './ThemeProvider'

const SOURCES = [
  { value: 'inst', label: 'Institutional' },
  { value: 'etf', label: 'ETF' },
  { value: 'combined', label: 'Combined' },
] as const

describe('RadioGroup', () => {
  it('is a single tab stop whose arrow keys move focus and selection', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ThemeProvider>
        <RadioGroup label="Flow source" options={SOURCES} defaultValue="inst" onChange={onChange} />
      </ThemeProvider>,
    )

    const [first, second, third] = screen.getAllByRole('radio')

    // One tab stop: only the selected option is in the tab order.
    expect(first).toHaveAttribute('tabindex', '0')
    expect(second).toHaveAttribute('tabindex', '-1')
    expect(third).toHaveAttribute('tabindex', '-1')

    await user.tab()
    expect(first).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(second).toHaveFocus()
    expect(second).toBeChecked()
    expect(first).not.toBeChecked()
    expect(onChange).toHaveBeenLastCalledWith('etf')

    await user.keyboard('{End}')
    expect(third).toHaveFocus()
    expect(third).toBeChecked()
    expect(onChange).toHaveBeenLastCalledWith('combined')

    await user.keyboard('{Home}')
    expect(first).toHaveFocus()
    expect(first).toBeChecked()
    expect(onChange).toHaveBeenLastCalledWith('inst')

    // Selection has moved with focus, so the tab order moved with it.
    expect(first).toHaveAttribute('tabindex', '0')
    expect(third).toHaveAttribute('tabindex', '-1')

    // …and one more Tab leaves the group entirely rather than stepping within it.
    await user.tab()
    expect(first).not.toHaveFocus()
    expect(second).not.toHaveFocus()
    expect(third).not.toHaveFocus()
  })

  it('wraps from the first option to the last', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <RadioGroup label="Flow source" options={SOURCES} defaultValue="inst" />
      </ThemeProvider>,
    )

    const radios = screen.getAllByRole('radio')
    await user.tab()
    await user.keyboard('{ArrowUp}')

    expect(radios[2]).toHaveFocus()
    expect(radios[2]).toBeChecked()
  })

  it('steps over disabled options instead of stranding focus on them', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <RadioGroup
          label="Settlement"
          defaultValue="daily"
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'intraday', label: 'Intraday', disabled: true },
            { value: 'weekly', label: 'Weekly' },
          ]}
        />
      </ThemeProvider>,
    )

    const [daily, intraday, weekly] = screen.getAllByRole('radio')
    expect(intraday).toBeDisabled()

    await user.tab()
    expect(daily).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(weekly).toHaveFocus()
    expect(weekly).toBeChecked()
    expect(intraday).not.toBeChecked()
  })

  it('selects an option when its label is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ThemeProvider>
        <RadioGroup label="Flow source" options={SOURCES} defaultValue="inst" onChange={onChange} />
      </ThemeProvider>,
    )

    await user.click(screen.getByText('Combined'))

    expect(screen.getByRole('radio', { name: 'Combined' })).toBeChecked()
    expect(onChange).toHaveBeenCalledWith('combined')
  })

  it('respects the value prop when controlled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ThemeProvider>
        <RadioGroup label="Flow source" options={SOURCES} value="inst" onChange={onChange} />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('radio', { name: 'ETF' }))

    expect(onChange).toHaveBeenCalledWith('etf')
    // The owner did not move `value`, so the selection must not move either.
    expect(screen.getByRole('radio', { name: 'Institutional' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'ETF' })).not.toBeChecked()
  })

  it('blocks interaction when the whole group is disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ThemeProvider>
        <RadioGroup label="Flow source" options={SOURCES} defaultValue="inst" disabled onChange={onChange} />
      </ThemeProvider>,
    )

    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'ETF' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('shares one generated name across the group', () => {
    render(
      <ThemeProvider>
        <RadioGroup label="Flow source" options={SOURCES} defaultValue="inst" />
      </ThemeProvider>,
    )

    const names = screen.getAllByRole('radio').map((radio) => radio.getAttribute('name'))
    expect(names[0]).toBeTruthy()
    expect(new Set(names).size).toBe(1)
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <RadioGroup
          label="Settlement"
          defaultValue="daily"
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'intraday', label: 'Intraday', disabled: true },
            { value: 'weekly', label: 'Weekly' },
          ]}
        />
      </ThemeProvider>,
    )

    await expectNoAxeViolations(container)
  })
})

describe('Radio', () => {
  it('renders a labelled native radio on its own', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <Radio value="etf" label="ETF" />
      </ThemeProvider>,
    )

    const radio = screen.getByRole('radio', { name: 'ETF' })
    expect(radio).toHaveAttribute('value', 'etf')

    await user.click(radio)
    expect(radio).toBeChecked()
  })

  it('blocks interaction when disabled', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <Radio value="etf" label="ETF" disabled />
      </ThemeProvider>,
    )

    const radio = screen.getByRole('radio', { name: 'ETF' })
    await user.click(radio)

    expect(radio).toBeDisabled()
    expect(radio).not.toBeChecked()
  })
})
