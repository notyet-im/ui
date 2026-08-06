/**
 * Deterministic pseudo-randomness.
 *
 * Every synthetic figure in this system is derived from a seed, never from
 * `Math.random()`. That is deliberate: the same inputs must always produce the
 * same chart, so a design review, a screenshot and a re-render all agree.
 */

/** mulberry32-style hash → float in [0, 1). */
export function rnd(seed: number): number {
  let t = (seed * 1013 + 0x6d2b79f5) | 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** Stable non-negative integer hash of a string, for use as an `rnd` seed. */
export function hash(text: string): number {
  let h = 7
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0
  return Math.abs(h)
}
