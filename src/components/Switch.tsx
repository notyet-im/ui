import type { ReactNode, Ref } from 'react'
import { useControllableState } from '../hooks'
import './Switch.css'
import { cx } from '../lib/cx'

export interface SwitchProps {
  /** On/off state. Pass it to control the switch; omit for uncontrolled use. */
  checked?: boolean
  /** Starting state when uncontrolled. Default `false`. */
  defaultChecked?: boolean
  /** Called with the new state after every user toggle. */
  onChange?: (checked: boolean) => void
  disabled?: boolean
  /** Visible label, rendered inside the control so clicking it toggles. */
  label?: ReactNode
  /** `sm` for dense toolbars, `md` (default) everywhere else. */
  size?: 'sm' | 'md'
  id?: string
  ref?: Ref<HTMLButtonElement>
  className?: string
}

/**
 * An immediate on/off toggle — the setting takes effect the moment it moves,
 * with no Save step. Use `Checkbox` when the value is only committed on submit.
 *
 * A `<button role="switch">` rather than a restyled checkbox input: the sliding
 * thumb needs a track and a moving part, which a replaced `<input>` cannot
 * express cleanly, and `button` brings Space/Enter activation and the disabled
 * semantics along for free. The trade is that it does not submit in a form —
 * that is what `Checkbox` is for.
 *
 * Works controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`).
 */
export function Switch({
  checked,
  defaultChecked,
  onChange,
  disabled,
  label,
  size = 'md',
  id,
  ref,
  className,
}: SwitchProps) {
  const [isChecked, setChecked] = useControllableState(checked, defaultChecked ?? false, onChange)

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      id={id}
      disabled={disabled}
      aria-checked={isChecked}
      className={cx('ny-switch', `ny-switch--${size}`, className)}
      onClick={() => setChecked(!isChecked)}
    >
      <span className="ny-switch__track" aria-hidden="true">
        <span className="ny-switch__thumb" />
      </span>
      {label != null && <span className="ny-switch__label">{label}</span>}
    </button>
  )
}
