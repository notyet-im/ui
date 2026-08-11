import type { ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import './Dialog.css'
import { cx } from '../lib/cx'
import { Button } from './Button'
import { CloseIcon } from './icons'

export interface DialogProps {
  /** Whether the dialog is showing. Drives `showModal()` / `close()` on the element. */
  open: boolean
  /**
   * Called when the dialog is dismissed — Escape, or the close button.
   *
   * Not optional: the browser owns Escape, so a dialog whose owner ignores this
   * call ends up closed in the DOM while React still believes it is open.
   */
  onClose: () => void
  /** Heading. Also the dialog's accessible name, via `aria-labelledby`. */
  title?: ReactNode
  /** A line under the title, wired up as `aria-describedby`. */
  description?: ReactNode
  /** Actions, end-aligned on a sunken bar under the content. */
  footer?: ReactNode
  /** Maximum width. Default `md`. */
  size?: 'sm' | 'md' | 'lg'
  /** Accessible name for the built-in close button. Default `Close`. */
  closeLabel?: string
  /** Base for the generated title/description ids. Defaults to a `useId()` value. */
  id?: string
  children?: ReactNode
  className?: string
}

/**
 * A modal dialog, built on the native `<dialog>` element.
 *
 * `showModal()` buys the focus trap, Escape-to-dismiss, inertness of the page
 * behind, the `::backdrop` scrim and the browser top layer — so this component
 * hand-rolls none of them, uses no portal, and sets no `z-index`.
 *
 * Use `Dialog` when the task must be finished or abandoned before anything else
 * can happen. For a non-blocking panel hanging off a control, use `Popover`;
 * for a passive message that dismisses itself, use `Toast`.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  closeLabel = 'Close',
  id,
  children,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const generatedId = useId()
  const baseId = id ?? generatedId
  const titleId = `${baseId}-title`
  const descriptionId = `${baseId}-description`

  // The DOM, not React, owns whether the dialog is showing — so drive it from an
  // effect rather than rendering an `open` attribute, which would produce a
  // *non-modal* dialog with no focus trap and no backdrop.
  useEffect(() => {
    const dialog = dialogRef.current
    // jsdom ships `HTMLDialogElement` with none of its methods, so guard rather
    // than crash under test. Real top-layer behaviour is verified in Chromium.
    if (!dialog || typeof dialog.showModal !== 'function') return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  // `close` fires for Escape *and* for our own `close()` above. Only the first is
  // a user dismissal: by the time the programmatic one lands `open` is already
  // false, so this guard is what keeps `onClose` from firing a second time.
  const handleNativeClose = () => {
    if (open) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      id={baseId}
      className={cx('ny-raised', 'ny-dialog', `ny-dialog--${size}`, className)}
      aria-labelledby={title != null ? titleId : undefined}
      aria-describedby={description != null ? descriptionId : undefined}
      onClose={handleNativeClose}
    >
      <div className="ny-dialog__header">
        <div className="ny-dialog__heading">
          {title != null && (
            <h2 id={titleId} className="ny-dialog__title">
              {title}
            </h2>
          )}
          {description != null && (
            <p id={descriptionId} className="ny-dialog__description">
              {description}
            </p>
          )}
        </div>
        <Button iconOnly label={closeLabel} variant="ghost" size="sm" onClick={onClose}>
          <CloseIcon />
        </Button>
      </div>
      {children != null && <div className="ny-dialog__content">{children}</div>}
      {footer != null && <div className="ny-dialog__footer">{footer}</div>}
    </dialog>
  )
}
