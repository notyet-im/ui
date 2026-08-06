import type { ReactNode } from 'react'
import { createContext, useContext, useId, useMemo } from 'react'
import './Field.css'

/* Field -------------------------------------------------------------------- */

interface FieldControl {
  /** The id the control must adopt, so the `Label`'s `htmlFor` resolves. */
  id: string | undefined
  /** Space-joined ids of the help and error text, for `aria-describedby`. */
  describedBy: string | undefined
  /** True when the field is showing an `error`. */
  invalid: boolean
  /** True when the field is marked required. */
  required: boolean
}

const EMPTY: FieldControl = { id: undefined, describedBy: undefined, invalid: false, required: false }

const FieldContext = createContext<FieldControl>(EMPTY)

/**
 * Reads the wiring from the nearest `Field`.
 *
 * Form controls call this and let it win over nothing — an explicit `id` or
 * `invalid` on the control itself still takes precedence. Outside a `Field` it
 * returns empty values, so a bare control renders exactly as written.
 */
export function useFieldControl(): FieldControl {
  return useContext(FieldContext)
}

export interface FieldProps {
  label?: ReactNode
  /** Guidance shown under the control. Linked via `aria-describedby`. */
  help?: ReactNode
  /** Validation message. Its presence is what makes the control invalid. */
  error?: ReactNode
  /** Marks the label and sets `required` on the control. */
  required?: boolean
  /** Overrides the generated id — for deep-linking or server-rendered forms. */
  id?: string
  children?: ReactNode
  className?: string
}

/**
 * The wrapper that makes label/control association impossible to get wrong.
 *
 * It generates one id with `useId` and hands it to both the `Label`'s `htmlFor`
 * and — through context — the control's `id`, then points the control's
 * `aria-describedby` at whichever of `help` and `error` are present. Nothing
 * here has to be repeated at the call site, which is the whole point: hand-wired
 * `htmlFor` is the single most common accessibility defect in a form.
 */
export function Field({ label, help, error, required = false, id, children, className }: FieldProps) {
  const generated = useId()
  const controlId = id ?? generated
  const helpId = `${controlId}-help`
  const errorId = `${controlId}-error`

  const control = useMemo<FieldControl>(() => {
    const described = [help != null && helpId, error != null && errorId].filter(Boolean)
    return {
      id: controlId,
      describedBy: described.length > 0 ? described.join(' ') : undefined,
      invalid: error != null,
      required,
    }
  }, [controlId, help, helpId, error, errorId, required])

  return (
    <div className={['ny-field', className].filter(Boolean).join(' ')}>
      {label != null && (
        <Label htmlFor={controlId} required={required}>
          {label}
        </Label>
      )}
      <FieldContext.Provider value={control}>{children}</FieldContext.Provider>
      {help != null && <HelpText id={helpId}>{help}</HelpText>}
      {error != null && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  )
}

/* Label -------------------------------------------------------------------- */

export interface LabelProps {
  /** `id` of the control this names. `Field` fills it in automatically. */
  htmlFor?: string
  /** Appends the required marker. Decorative — the control carries `required`. */
  required?: boolean
  children?: ReactNode
  className?: string
}

/** The name of a control. Prefer letting `Field` render it. */
export function Label({ htmlFor, required = false, children, className }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={['ny-label', className].filter(Boolean).join(' ')}>
      {children}
      {required && (
        <span className="ny-label__required" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}

/* HelpText ----------------------------------------------------------------- */

export interface HelpTextProps {
  /** Referenced by the control's `aria-describedby`. `Field` fills it in. */
  id?: string
  children?: ReactNode
  className?: string
}

/** Quiet guidance under a control — format hints, units, consequences. */
export function HelpText({ id, children, className }: HelpTextProps) {
  return (
    <p id={id} className={['ny-help-text', className].filter(Boolean).join(' ')}>
      {children}
    </p>
  )
}

/* ErrorText ---------------------------------------------------------------- */

export interface ErrorTextProps {
  /** Referenced by the control's `aria-describedby`. `Field` fills it in. */
  id?: string
  children?: ReactNode
  className?: string
}

/**
 * The validation message for a control.
 *
 * Deliberately not `role="alert"`: a server-rendered form arrives with its
 * errors already on the page, and an alert role would make every one of them
 * announce on load. The message reaches assistive tech through the control's
 * `aria-describedby` and `aria-invalid`, which is what a screen reader user is
 * actually listening for when they focus the field.
 */
export function ErrorText({ id, children, className }: ErrorTextProps) {
  return (
    <p id={id} className={['ny-error-text', className].filter(Boolean).join(' ')}>
      {children}
    </p>
  )
}
