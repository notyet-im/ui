/**
 * Internal icons — not exported from the barrel, so they never become their own
 * design-system card. Components draw their own one-off glyphs inline; this file
 * is only for a shape that genuinely appears in more than one of them.
 */

/**
 * The dismiss glyph, shared by Dialog, Toast and Alert.
 *
 * No width or height: it is always a `Button iconOnly` child, and `Button.css`
 * sizes those from the button size so the three cannot drift apart.
 */
export function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
