import type { ReactNode, Ref } from 'react'
import { createContext, useCallback, useContext, useId } from 'react'
import { useControllableState, useRovingFocus } from '../hooks'
import './Radio.css'

/* Radio -------------------------------------------------------------------- */

interface RadioGroupContextValue {
  /** Shared field name — what makes the inputs one native group. */
  name: string
  /** The selected value, or `undefined` when nothing is selected yet. */
  value: string | undefined
  onSelect: (value: string) => void
  /** Group-level disable, on top of each option's own `disabled`. */
  disabled: boolean
  /** Roving-focus props for this option, or `undefined` if it is not in the tab ring. */
  itemProps: (value: string) => { tabIndex: 0 | -1; 'data-roving-item': '' } | undefined
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export interface RadioProps {
  /** The value this option submits when selected. Also identifies it to `RadioGroup`. */
  value: string
  label?: ReactNode
  disabled?: boolean
  id?: string
  ref?: Ref<HTMLInputElement>
  className?: string
}

/**
 * One option of a mutually exclusive set — a real `<input type="radio">`,
 * restyled the same way `Checkbox` is.
 *
 * **Normally you do not render this directly.** `RadioGroup` renders one per
 * `option` and supplies everything a lone radio cannot know: the shared `name`,
 * which option is checked, the change handler, and the roving `tabIndex` that
 * makes the group a single tab stop. Rendered outside a group it falls back to
 * a generated `name` and native uncontrolled behaviour, which is useful for
 * documenting the visual alone and little else.
 */
export function Radio({ value, label, disabled, id, ref, className }: RadioProps) {
  const group = useContext(RadioGroupContext)
  const standaloneName = useId()
  const isDisabled = disabled === true || group?.disabled === true
  const rovingProps = group?.itemProps(value)

  return (
    <label className={['ny-radio', className].filter(Boolean).join(' ')}>
      <span className="ny-radio__control">
        <input
          ref={ref}
          type="radio"
          className="ny-radio__input"
          name={group?.name ?? standaloneName}
          value={value}
          id={id}
          disabled={isDisabled}
          checked={group ? group.value === value : undefined}
          onChange={() => group?.onSelect(value)}
          {...rovingProps}
        />
        <span className="ny-radio__dot" aria-hidden="true" />
      </span>
      {label != null && <span className="ny-radio__label">{label}</span>}
    </label>
  )
}

/* RadioGroup --------------------------------------------------------------- */

export interface RadioGroupOption<T extends string> {
  value: T
  label: ReactNode
  disabled?: boolean
}

export interface RadioGroupProps<T extends string> {
  options: ReadonlyArray<RadioGroupOption<T>>
  /** Selected value. Pass it to control the group; omit for uncontrolled use. */
  value?: T
  /** Starting selection when uncontrolled. */
  defaultValue?: T
  onChange?: (value: T) => void
  /** Shared field name for native `<form>` submission. Generated when absent. */
  name?: string
  /** Accessible name for the group. */
  label?: string
  /** Which axis the options lay out on, and which arrow keys move between them. Default `vertical`. */
  orientation?: 'horizontal' | 'vertical'
  /** Disables every option, whatever each one says. */
  disabled?: boolean
  id?: string
  className?: string
}

/**
 * A mutually exclusive set of options.
 *
 * Implements the WAI-ARIA APG radiogroup pattern rather than leaning on the
 * browser: the whole group is **one tab stop**, arrow keys move between options
 * with selection following focus, and Home/End jump to the ends. Native radios
 * sharing a `name` do some of this already, but the behaviour differs between
 * engines and falls apart as soon as `disabled` options are interleaved — so
 * `useRovingFocus` drives it explicitly over the enabled options only.
 *
 * Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 */
export function RadioGroup<T extends string>({
  options,
  value,
  defaultValue,
  onChange,
  name,
  label,
  orientation = 'vertical',
  disabled = false,
  id,
  className,
}: RadioGroupProps<T>) {
  const generatedName = useId()

  const handleChange = useCallback(
    (next: T | undefined) => {
      if (next !== undefined) onChange?.(next)
    },
    [onChange],
  )
  const [selected, select] = useControllableState<T | undefined>(value, defaultValue, handleChange)

  // The tab ring holds only the options a user can actually reach; a disabled
  // option is not focusable, so including it would strand arrow keys on it.
  const reachable = options.filter((option) => !disabled && option.disabled !== true)
  const selectedIndex = reachable.findIndex((option) => option.value === selected)

  const { onKeyDown, getItemProps } = useRovingFocus({
    count: reachable.length,
    // Nothing selected yet: the first reachable option is the tab stop, per the APG.
    activeIndex: selectedIndex === -1 ? 0 : selectedIndex,
    onMove: (index) => {
      const option = reachable[index]
      if (option) select(option.value)
    },
    orientation,
  })

  const context: RadioGroupContextValue = {
    name: name ?? generatedName,
    value: selected,
    onSelect: (next) => select(next as T),
    disabled,
    itemProps: (optionValue) => {
      const index = reachable.findIndex((option) => option.value === optionValue)
      return index === -1 ? undefined : getItemProps(index)
    },
  }

  return (
    <div
      id={id}
      className={['ny-radio-group', `ny-radio-group--${orientation}`, className].filter(Boolean).join(' ')}
      role="radiogroup"
      aria-label={label}
      aria-orientation={orientation}
      onKeyDown={onKeyDown}
    >
      <RadioGroupContext.Provider value={context}>
        {options.map((option) => (
          <Radio key={option.value} value={option.value} label={option.label} disabled={option.disabled} />
        ))}
      </RadioGroupContext.Provider>
    </div>
  )
}
