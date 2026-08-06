/**
 * JS mirror of `styles/tokens.css`.
 *
 * Only values that geometry code genuinely needs at runtime live here — SVG
 * strokes and fills can't read a CSS custom property through an attribute, so
 * chart colours must be real strings. Anything a stylesheet can express stays
 * in CSS.
 */

export const flowColors = {
  /** Capital arriving. */
  inflow: '#2fbfa8',
  /** Capital leaving. */
  outflow: '#e0703f',
  /** Unselected / unattributed flow. */
  neutral: '#7f8a99',
} as const

export type FlowDirection = 'inflow' | 'outflow'

/** Picks the flow colour for a signed value. Zero counts as inflow. */
export function flowColor(value: number): string {
  return value >= 0 ? flowColors.inflow : flowColors.outflow
}

export const surfaces = {
  dark: {
    bg: '#0b0c0e',
    panel: '#14161a',
    panel2: '#1b1e23',
    line: '#252a32',
    text: '#e9ebee',
    dim: '#8b929e',
    dim2: '#5f6672',
  },
  light: {
    bg: '#f7f6f3',
    panel: '#ffffff',
    panel2: '#f2f1ec',
    line: '#e4e1d9',
    text: '#191b1e',
    dim: '#6c727c',
    dim2: '#9aa0a8',
  },
} as const

export type ThemeName = keyof typeof surfaces

export const fonts = {
  sans: "'IBM Plex Sans', 'Noto Sans SC', 'Noto Sans JP', 'Noto Sans KR', Helvetica, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
} as const

export const motion = {
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  flow: '0.5s',
  fade: '0.3s',
} as const
