/**
 * Diverging heat scale for flow cells.
 *
 * Teal = accumulation, rust = distribution, and an empty cell falls back to the
 * panel surface rather than a washed-out tint — so "no data" never reads as
 * "small positive".
 */

import { deltaColors } from '../tokens'

export interface HeatStyle {
  /** CSS colour for the cell background. */
  background: string
  /** CSS colour for the cell's text, chosen for contrast against `background`. */
  color: string
}

/**
 * `#rrggbb` → `r,g,b`, for dropping into `rgba()`.
 *
 * The ramp is derived from `deltaColors`, never transcribed. Hard-coding the
 * triples here would give the delta palette a third home that nothing pins to
 * the other two, so retuning the data colour would move every chart and leave
 * every heat cell behind.
 */
function rgbTriple(hex: string): string {
  const n = Number.parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}

const INFLOW_RGB = rgbTriple(deltaColors.positive)
const OUTFLOW_RGB = rgbTriple(deltaColors.negative)

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
