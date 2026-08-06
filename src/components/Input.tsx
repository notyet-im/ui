import type { ReactNode, Ref } from 'react'
import { useCallback, useLayoutEffect, useRef } from 'react'
import { useControllableState } from '../hooks'
import { useFieldControl } from './Field'
import './Input.css'

/**
 * Joins the ids a control is described by, dropping the empty ones.
 *
 * A `Field` contributes its help and error ids; the caller may add more. An
 * empty result must be `undefined`, not `''` — `aria-describedby=""` points at
 * nothing and axe flags it.
 */
function describedBy(...ids: Array<string | undefined>): string | undefined {
  const present = ids.filter(Boolean)
  return present.length > 0 ? present.join(' ') : undefined
}

export interface InputProps {
  /**
   * `text` — the default.
   * `email` / `tel` / `url` — same box, different keyboard and validation.
   * `password` — obscured.
   * `search` — the browser's clear affordance.
   * `number` — pairs with `min` / `max` / `step`.
   */
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number'
  /** Controlled value. Omit to let the input keep its own state. */
  value?: string
  /** Starting value when uncontrolled. */
  defaultValue?: string
  /** Domain-typed: the value, not the event. */
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  /** Sets `aria-invalid`. Inside a `Field` with an `error`, this is implied. */
  invalid?: boolean
  /**
   * `sm` — 28px, for dense filter rows.
   * `md` — 34px, the system default.
   * `lg` — 44px, for touch-first surfaces.
   */
  size?: 'sm' | 'md' | 'lg'
  /** Static adornment at the leading edge — a currency mark, a search glyph. */
  prefix?: ReactNode
  /** Static adornment at the trailing edge — a unit, a character counter. */
  suffix?: ReactNode
  name?: string
  /** Overrides the id a wrapping `Field` supplies. */
  id?: string
  autoComplete?: string
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url' | 'search' | 'none'
  maxLength?: number
  min?: number
  max?: number
  step?: number
  onBlur?: () => void
  onFocus?: () => void
  /** Extra description ids, merged with the ones a `Field` supplies. */
  'aria-describedby'?: string
  /** Accessible name for an input with no visible `Label`. */
  'aria-label'?: string
  ref?: Ref<HTMLInputElement>
  className?: string
}

/**
 * A single-line text control.
 *
 * Works controlled or uncontrolled — the deliberate exception to the house
 * controlled-first rule, because native `<form>` submission needs the
 * uncontrolled mode. See `useControllableState`.
 *
 * Prefer wrapping it in a `Field`, which supplies the id, the label association
 * and the `aria-describedby` wiring for free.
 */
export function Input({
  type = 'text',
  value,
  defaultValue = '',
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  required,
  invalid,
  size = 'md',
  prefix,
  suffix,
  name,
  id,
  autoComplete,
  inputMode,
  maxLength,
  min,
  max,
  step,
  onBlur,
  onFocus,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  ref,
  className,
}: InputProps) {
  const field = useFieldControl()
  const [current, setCurrent] = useControllableState(value, defaultValue, onChange)
  const isInvalid = invalid ?? field.invalid

  const classes = [
    'ny-input',
    `ny-input--${size}`,
    prefix != null && 'ny-input--with-prefix',
    suffix != null && 'ny-input--with-suffix',
    className,
  ]

  return (
    <span className="ny-input-group">
      {prefix != null && (
        <span className="ny-input-group__affix ny-input-group__affix--start" aria-hidden="true">
          {prefix}
        </span>
      )}
      <input
        ref={ref}
        type={type}
        id={id ?? field.id}
        name={name}
        value={current}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required ?? field.required}
        aria-invalid={isInvalid || undefined}
        aria-describedby={describedBy(field.describedBy, ariaDescribedBy)}
        aria-label={ariaLabel}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        min={min}
        max={max}
        step={step}
        onChange={(event) => setCurrent(event.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        className={classes.filter(Boolean).join(' ')}
      />
      {suffix != null && (
        <span className="ny-input-group__affix ny-input-group__affix--end" aria-hidden="true">
          {suffix}
        </span>
      )}
    </span>
  )
}

/* Textarea ----------------------------------------------------------------- */

export interface TextareaProps {
  /** Controlled value. Omit to let the textarea keep its own state. */
  value?: string
  /** Starting value when uncontrolled. */
  defaultValue?: string
  /** Domain-typed: the value, not the event. */
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  /** Sets `aria-invalid`. Inside a `Field` with an `error`, this is implied. */
  invalid?: boolean
  /**
   * `sm` — dense, 12px text.
   * `md` — the system default.
   * `lg` — for long-form entry.
   */
  size?: 'sm' | 'md' | 'lg'
  /** Starting height in lines. Default 3. */
  rows?: number
  /** Grow to fit the content instead of scrolling. Disables manual resizing. */
  autoGrow?: boolean
  name?: string
  /** Overrides the id a wrapping `Field` supplies. */
  id?: string
  autoComplete?: string
  maxLength?: number
  onBlur?: () => void
  onFocus?: () => void
  /** Extra description ids, merged with the ones a `Field` supplies. */
  'aria-describedby'?: string
  /** Accessible name for a textarea with no visible `Label`. */
  'aria-label'?: string
  ref?: Ref<HTMLTextAreaElement>
  className?: string
}

/**
 * A multi-line text control.
 *
 * `autoGrow` measures `scrollHeight` after every value change, so the box
 * tracks the content instead of stranding the user in a 3-line window.
 */
export function Textarea({
  value,
  defaultValue = '',
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  required,
  invalid,
  size = 'md',
  rows = 3,
  autoGrow = false,
  name,
  id,
  autoComplete,
  maxLength,
  onBlur,
  onFocus,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  ref,
  className,
}: TextareaProps) {
  const field = useFieldControl()
  const [current, setCurrent] = useControllableState(value, defaultValue, onChange)
  const isInvalid = invalid ?? field.invalid
  const node = useRef<HTMLTextAreaElement | null>(null)

  // `ref` is a plain prop in React 19, so it has to be forwarded by hand to
  // leave the internal one free for the autoGrow measurement.
  const attachRef = useCallback(
    (element: HTMLTextAreaElement | null) => {
      node.current = element
      if (typeof ref === 'function') ref(element)
      else if (ref) ref.current = element
    },
    [ref],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: `current` is the trigger, not a read — the box has to be re-measured every time the value changes
  useLayoutEffect(() => {
    const element = node.current
    if (!element || !autoGrow) return
    element.style.height = 'auto'
    element.style.height = `${element.scrollHeight}px`
  }, [autoGrow, current])

  const classes = ['ny-textarea', `ny-textarea--${size}`, autoGrow && 'ny-textarea--auto-grow', className]

  return (
    <textarea
      ref={attachRef}
      id={id ?? field.id}
      name={name}
      value={current}
      rows={rows}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required ?? field.required}
      aria-invalid={isInvalid || undefined}
      aria-describedby={describedBy(field.describedBy, ariaDescribedBy)}
      aria-label={ariaLabel}
      autoComplete={autoComplete}
      maxLength={maxLength}
      onChange={(event) => setCurrent(event.target.value)}
      onBlur={onBlur}
      onFocus={onFocus}
      className={classes.filter(Boolean).join(' ')}
    />
  )
}
