/**
 * Internal icons — not exported from the barrel, so they never become their own
 * design-system card. Components draw their own one-off glyphs inline; this file
 * is only for a shape that genuinely appears in more than one of them.
 */

/** The dismiss glyph, shared by Dialog, Toast and Alert. */
export function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
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
