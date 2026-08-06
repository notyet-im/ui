/**
 * Money formatting.
 *
 * Note the minus sign: this system uses U+2212 MINUS SIGN (−), not a hyphen.
 * In IBM Plex Mono the true minus aligns with the plus sign, so signed columns
 * stay optically flush. Keep it.
 */

const MINUS = '−'

/**
 * Formats a value in millions as `$1.2B` / `$340M`.
 *
 * @param value  Amount in millions.
 * @param signed When true, positive values are prefixed with `+`.
 */
export function formatFlow(value: number, signed = false): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? MINUS : signed ? '+' : ''
  if (abs >= 1000) {
    const billions = abs / 1000
    return `${sign}$${billions.toFixed(billions >= 10 ? 0 : 1)}B`
  }
  return `${sign}$${Math.round(abs)}M`
}

/**
 * Formats a value in millions as a bare signed number of billions — for dense
 * grid cells where a `$` and a `B` on every cell would be noise.
 */
export function formatBillions(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? MINUS : ''
  const abs = Math.abs(value)
  return sign + (abs / 1000).toFixed(abs >= 9950 ? 0 : 1)
}

/** Formats a signed percentage, e.g. `+4.2%`. */
export function formatPercent(value: number, digits = 1, suffix = '%'): string {
  const sign = value >= 0 ? '+' : MINUS
  return `${sign}${Math.abs(value).toFixed(digits)}${suffix}`
}

export { MINUS }
