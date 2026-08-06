/**
 * Diverging heat scale for flow cells.
 *
 * Teal = accumulation, rust = distribution, and an empty cell falls back to the
 * panel surface rather than a washed-out tint — so "no data" never reads as
 * "small positive".
 */

export interface HeatStyle {
  /** CSS colour for the cell background. */
  background: string
  /** CSS colour for the cell's text, chosen for contrast against `background`. */
  color: string
}

const INFLOW_RGB = '47,191,168'
const OUTFLOW_RGB = '224,112,63'

/** Minimum alpha for a non-zero cell, so faint values stay perceptible. */
const ALPHA_FLOOR = 0.1
const ALPHA_RANGE = 0.72

/**
 * @param value Signed flow for the cell.
 * @param max   Largest absolute value across the whole grid, for normalisation.
 */
export function heatStyle(value: number, max: number): HeatStyle {
  if (!value) {
    return { background: 'var(--ny-surface-sunken)', color: 'var(--ny-text-subtle)' }
  }
  const alpha = ALPHA_FLOOR + ALPHA_RANGE * Math.min(1, Math.abs(value) / (max || 1))
  return {
    background: `rgba(${value > 0 ? INFLOW_RGB : OUTFLOW_RGB},${alpha.toFixed(2)})`,
    color: 'var(--ny-text)',
  }
}
