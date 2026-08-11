import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme } from '../test/render'
import { Input, Textarea } from './Input'

function ControlledInput({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState('NV')
  return (
    <Input
      aria-label="Ticker"
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
    />
  )
}

describe('Input', () => {
  it('updates its own value when uncontrolled', async () => {
    const user = userEvent.setup()
    renderInTheme(<Input aria-label="Ticker" defaultValue="NV" />)

    const input = screen.getByLabelText('Ticker')
    await user.type(input, 'DA')

    expect(input).toHaveValue('NVDA')
  })

  it('respects a controlled value and reports changes as a string', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderInTheme(<ControlledInput onChange={onChange} />)

    const input = screen.getByLabelText('Ticker')
    await user.type(input, 'D')

    expect(onChange).toHaveBeenCalledWith('NVD')
    expect(input).toHaveValue('NVD')
  })

  it('pins the value when controlled without an onChange', async () => {
    const user = userEvent.setup()
    renderInTheme(<Input aria-label="Ticker" value="NVDA" />)

    const input = screen.getByLabelText('Ticker')
    await user.type(input, 'XYZ')

    expect(input).toHaveValue('NVDA')
  })

  it('blocks typing when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderInTheme(<Input aria-label="Ticker" defaultValue="NVDA" disabled onChange={onChange} />)

    const input = screen.getByLabelText('Ticker')
    await user.type(input, 'XYZ')

    expect(input).toBeDisabled()
    expect(input).toHaveValue('NVDA')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('blocks typing when read-only but stays reachable', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderInTheme(<Input aria-label="Ticker" defaultValue="NVDA" readOnly onChange={onChange} />)

    const input = screen.getByLabelText('Ticker')
    await user.type(input, 'XYZ')

    expect(input).toHaveValue('NVDA')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('marks itself invalid through aria-invalid', () => {
    renderInTheme(<Input aria-label="Ticker" defaultValue="AAPLL" invalid />)

    expect(screen.getByLabelText('Ticker')).toHaveAttribute('aria-invalid', 'true')
  })

  it('leaves aria-describedby off when nothing describes it', () => {
    renderInTheme(<Input aria-label="Ticker" />)

    expect(screen.getByLabelText('Ticker')).not.toHaveAttribute('aria-describedby')
  })

  it('hides decorative affixes from assistive tech', () => {
    renderInTheme(<Input aria-label="Allocation" type="number" defaultValue="250" prefix="$" suffix="m" />)

    expect(screen.getByLabelText('Allocation')).toHaveAccessibleName('Allocation')
    expect(screen.getByText('$')).toHaveAttribute('aria-hidden', 'true')
  })

  it('reports focus and blur', async () => {
    const user = userEvent.setup()
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    renderInTheme(
      <>
        <Input aria-label="Ticker" onFocus={onFocus} onBlur={onBlur} />
        <Input aria-label="Book" />
      </>,
    )

    await user.click(screen.getByLabelText('Ticker'))
    await user.click(screen.getByLabelText('Book'))

    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('is axe clean', async () => {
    const { container } = renderInTheme(
      <>
        <Input aria-label="Ticker" defaultValue="NVDA" />
        <Input aria-label="Invalid ticker" defaultValue="AAPLL" invalid />
        <Input aria-label="Locked ticker" defaultValue="NVDA" disabled />
        <Input aria-label="Allocation" type="number" defaultValue="250" prefix="$" suffix="m" />
      </>,
    )

    await expectNoAxeViolations(container)
  })
})

/* Textarea ----------------------------------------------------------------- */

describe('Textarea', () => {
  it('updates its own value when uncontrolled', async () => {
    const user = userEvent.setup()
    renderInTheme(<Textarea aria-label="Note" defaultValue="Flows " />)

    const textarea = screen.getByLabelText('Note')
    await user.type(textarea, 'reversed')

    expect(textarea).toHaveValue('Flows reversed')
  })

  it('respects a controlled value and reports changes as a string', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderInTheme(<Textarea aria-label="Note" value="Flows" onChange={onChange} />)

    const textarea = screen.getByLabelText('Note')
    await user.type(textarea, '!')

    expect(onChange).toHaveBeenCalledWith('Flows!')
    expect(textarea).toHaveValue('Flows')
  })

  it('blocks typing when disabled', async () => {
    const user = userEvent.setup()
    renderInTheme(<Textarea aria-label="Note" defaultValue="Flows" disabled />)

    const textarea = screen.getByLabelText('Note')
    await user.type(textarea, 'XYZ')

    expect(textarea).toBeDisabled()
    expect(textarea).toHaveValue('Flows')
  })

  it('sizes itself to the content when autoGrow is on', async () => {
    const user = userEvent.setup()
    renderInTheme(<Textarea aria-label="Note" autoGrow rows={2} />)

    const textarea = screen.getByLabelText('Note')
    await user.type(textarea, 'one{enter}two{enter}three')

    // jsdom does no layout, so scrollHeight is 0 — what is assertable is that
    // the component drives the height at all rather than leaving it to CSS.
    expect(textarea.style.height).not.toBe('')
  })

  it('marks itself invalid through aria-invalid', () => {
    renderInTheme(<Textarea aria-label="Note" defaultValue="Too short." invalid />)

    expect(screen.getByLabelText('Note')).toHaveAttribute('aria-invalid', 'true')
  })

  it('is axe clean', async () => {
    const { container } = renderInTheme(
      <>
        <Textarea aria-label="Note" defaultValue="Flows reversed" />
        <Textarea aria-label="Invalid note" defaultValue="Too short." invalid />
        <Textarea aria-label="Locked note" defaultValue="Flows reversed" disabled />
      </>,
    )

    await expectNoAxeViolations(container)
  })
})
