/**
 * Joins class names, dropping anything falsy.
 *
 * Internal — not exported from the barrel. Consumers never assemble `.ny-*`
 * class names themselves; they pass a `className` and the component merges it.
 *
 * This existed 43 times as `[…].filter(Boolean).join(' ')` before it had a
 * name, which is a lot of repetitions of the single most-repeated line in the
 * codebase — and the class name is what `styles.contract.test.ts` calls the seam
 * between a component's two halves, so it is worth assembling one way.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
