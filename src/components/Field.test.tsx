import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme } from '../test/render'
import { ErrorText, Field, HelpText, Label } from './Field'
import { Input, Textarea } from './Input'

describe('Field', () => {
  it('associates the label with the control it wraps', () => {
    renderInTheme(
      <Field label="Ticker">
        <Input defaultValue="NVDA" />
      </Field>,
    )

    expect(screen.getByLabelText('Ticker')).toHaveValue('NVDA')
  })

  it('focuses the control when the label is clicked', async () => {
    const user = userEvent.setup()
    renderInTheme(
      <Field label="Ticker">
        <Input defaultValue="NVDA" />
      </Field>,
    )

    await user.click(screen.getByText('Ticker'))

    expect(screen.getByLabelText('Ticker')).toHaveFocus()
  })

  it('works the same for a textarea', () => {
    renderInTheme(
      <Field label="Analyst note">
        <Textarea defaultValue="Semis outflow." />
      </Field>,
    )

    expect(screen.getByLabelText('Analyst note')).toHaveValue('Semis outflow.')
  })

  it('points aria-describedby at the help text', () => {
    renderInTheme(
      <Field label="Allocation" help="In millions of dollars.">
        <Input defaultValue="250" />
      </Field>,
    )

    expect(screen.getByLabelText('Allocation')).toHaveAccessibleDescription('In millions of dollars.')
  })

  it('points aria-describedby at both the help and the error text', () => {
    renderInTheme(
      <Field label="Allocation" help="In millions of dollars." error="Exceeds the cap.">
        <Input defaultValue="900" />
      </Field>,
    )

    const input = screen.getByLabelText('Allocation')
    const ids = (input.getAttribute('aria-describedby') ?? '').split(' ')

    expect(ids).toHaveLength(2)
    expect(document.getElementById(ids[0])).toHaveTextContent('In millions of dollars.')
    expect(document.getElementById(ids[1])).toHaveTextContent('Exceeds the cap.')
  })

  it('leaves aria-describedby off when there is nothing to describe', () => {
    renderInTheme(
      <Field label="Ticker">
        <Input />
      </Field>,
    )

    expect(screen.getByLabelText('Ticker')).not.toHaveAttribute('aria-describedby')
  })

  it('makes the control invalid when an error is present', () => {
    renderInTheme(
      <Field label="Ticker" error="No instrument matches that symbol.">
        <Input defaultValue="AAPLL" />
      </Field>,
    )

    expect(screen.getByLabelText('Ticker')).toHaveAttribute('aria-invalid', 'true')
  })

  it('marks the control required without letting the marker into its name', () => {
    renderInTheme(
      <Field label="Ticker" required>
        <Input />
      </Field>,
    )

    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
    expect(input).toHaveAccessibleName('Ticker')
  })

  it('lets an explicit Field id win over the generated one', () => {
    renderInTheme(
      <Field label="Ticker" id="ticker-field" help="Uppercase symbols only.">
        <Input />
      </Field>,
    )

    const input = screen.getByLabelText('Ticker')
    expect(input).toHaveAttribute('id', 'ticker-field')
    expect(input).toHaveAttribute('aria-describedby', 'ticker-field-help')
  })

  it('lets an explicit control id win over the Field id', () => {
    renderInTheme(
      <Field label="Ticker" id="ticker-field">
        <Input id="ticker-input" aria-label="Ticker input" />
      </Field>,
    )

    expect(screen.getByLabelText('Ticker input')).toHaveAttribute('id', 'ticker-input')
  })

  it('gives two fields on one page distinct ids', () => {
    renderInTheme(
      <>
        <Field label="Ticker">
          <Input />
        </Field>
        <Field label="Book">
          <Input />
        </Field>
      </>,
    )

    const first = screen.getByLabelText('Ticker').getAttribute('id')
    const second = screen.getByLabelText('Book').getAttribute('id')

    expect(first).toBeTruthy()
    expect(first).not.toBe(second)
  })

  it('is axe clean', async () => {
    const { container } = renderInTheme(
      <>
        <Field label="Ticker" help="Uppercase symbols only." required>
          <Input defaultValue="NVDA" />
        </Field>
        <Field label="Allocation" error="Exceeds the cap.">
          <Input defaultValue="900" />
        </Field>
        <Field label="Analyst note" help="Shown on the desk summary.">
          <Textarea defaultValue="Semis outflow." disabled />
        </Field>
      </>,
    )

    await expectNoAxeViolations(container)
  })
})

/* Label, HelpText, ErrorText ------------------------------------------------ */

describe('Label', () => {
  it('names the control it points at', () => {
    renderInTheme(
      <>
        <Label htmlFor="ticker">Ticker</Label>
        <input id="ticker" defaultValue="NVDA" />
      </>,
    )

    expect(screen.getByLabelText('Ticker')).toHaveValue('NVDA')
  })

  it('keeps the required marker out of the accessible name', () => {
    renderInTheme(
      <>
        <Label htmlFor="ticker" required>
          Ticker
        </Label>
        <input id="ticker" />
      </>,
    )

    expect(screen.getByRole('textbox')).toHaveAccessibleName('Ticker')
  })
})

describe('HelpText and ErrorText', () => {
  it('can be referenced by a control on their own', () => {
    renderInTheme(
      <>
        <Input aria-label="Ticker" aria-describedby="hint" />
        <HelpText id="hint">Uppercase symbols only.</HelpText>
      </>,
    )

    expect(screen.getByLabelText('Ticker')).toHaveAccessibleDescription('Uppercase symbols only.')
  })

  it('does not announce itself on mount', () => {
    renderInTheme(<ErrorText>No instrument matches that symbol.</ErrorText>)

    expect(screen.getByText('No instrument matches that symbol.')).not.toHaveAttribute('role', 'alert')
  })
})
