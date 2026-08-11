import type { ReactNode, Ref } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { useControllableState } from '../hooks'
import './Checkbox.css'

export interface CheckboxProps {
  /** Checked state. Pass it to control the checkbox; omit for uncontrolled use. */
  checked?: boolean
  /** Starting state when uncontrolled. Default `false`. */
  defaultChecked?: boolean
  /** Called with the new checked state after every user toggle. */
  onChange?: (checked: boolean) => void
  /**
   * The mixed state — a parent whose children are only partly checked.
   *
   * `indeterminate` is a DOM *property* with no matching HTML attribute, so it
   * is applied through a ref after render; `aria-checked="mixed"` is what
   * carries the state to assistive technology.
   */
  indeterminate?: boolean
  disabled?: boolean
  /** Marks the field required for native `<form>` validation. */
  required?: boolean
  /** Visible label. The `<label>` wraps the input, so clicking it toggles. */
  label?: ReactNode
  /** Field name for native `<form>` submission. */
  name?: string
  /** Value submitted when checked. Defaults to the browser's `"on"`. */
  value?: string
  id?: string
  ref?: Ref<HTMLInputElement>
  className?: string
}

/**
 * A binary choice, or one row of a multi-select.
 *
 * This is a real `<input type="checkbox">` with `appearance: none`, not a `div`
 * pretending to be one — so it submits inside a `<form>`, participates in
 * validation, and needs no ARIA to be announced correctly. The tick is a
 * sibling element the input drives through `:checked` / `:indeterminate`.
 *
 * Works controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`).
 * Use `RadioGroup` instead when the options are mutually exclusive.
 */
export function Checkbox({
  checked,
  defaultChecked,
  onChange,
  indeterminate = false,
  disabled,
  required,
  label,
  name,
  value,
  id,
  ref,
  className,
}: CheckboxProps) {
  const [isChecked, setChecked] = useControllableState(checked, defaultChecked ?? false, onChange)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const attachRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label className={['ny-choice', 'ny-checkbox', className].filter(Boolean).join(' ')}>
      <span className="ny-choice__control">
        <input
          ref={attachRef}
          type="checkbox"
          className="ny-choice__input"
          checked={isChecked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          disabled={disabled}
          required={required}
          name={name}
          value={value}
          id={id}
          aria-checked={indeterminate ? 'mixed' : undefined}
        />
        <span className="ny-checkbox__box" aria-hidden="true">
          <svg className="ny-checkbox__glyph" viewBox="0 0 12 12" focusable="false" aria-hidden="true">
            <path
              className="ny-checkbox__check"
              d="M2.5 6.2 L4.9 8.6 L9.5 3.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="ny-checkbox__dash"
              d="M3 6 H9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>
      {label != null && <span className="ny-choice__label">{label}</span>}
    </label>
  )
}
