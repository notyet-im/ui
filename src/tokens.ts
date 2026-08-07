/**
 * JS mirror of `styles/tokens.css`.
 *
 * Only values that geometry code genuinely needs at runtime live here — SVG
 * strokes and fills can't read a CSS custom property through an attribute, so
 * chart colours must be real strings. Anything a stylesheet can express stays
 * in CSS.
 *
 * `tokens.parity.test.ts` asserts every value below still matches its CSS twin.
 * Change one, change both.
 */

export const deltaColors = {
  /** Value moved up. */
  positive: '#2fbfa8',
  /** Value moved down. */
  negative: '#e0703f',
  /** Unselected, unattributed, or exactly flat. */
  neutral: '#7f8a99',
} as const

export type DeltaDirection = 'positive' | 'negative'

/** Picks the delta colour for a signed value. Zero counts as positive. */
export function deltaColor(value: number): string {
  return value >= 0 ? deltaColors.positive : deltaColors.negative
}

/**
 * The brand accent and its interaction states.
 *
 * Separate from `deltaColors.positive` on purpose, and now visibly so: the
 * accent darkened to carry a white label while the data teal stayed bright.
 * Mirrored here because Storybook's manager chrome renders outside the preview
 * iframe and so cannot read the `--ny-*` custom properties.
 */
export const accent = {
  base: '#1b7062',
  hover: '#218474',
  active: '#165b50',
} as const

/**
 * The theme-dependent chrome colours, mirrored for the same reason as `accent`:
 * Storybook's manager renders outside the preview iframe and its docs container
 * takes plain strings, so neither can read a `--ny-*` custom property.
 *
 * `surfaceHover` and `surfaceSelected` exist for exactly that consumer — the
 * sidebar's 55 hoverable rows and the addon panel's toggles.
 */
export const surfaces = {
  dark: {
    bg: '#0b0c0e',
    surface: '#14161a',
    surfaceSunken: '#1b1e23',
    surfaceHover: '#21252c',
    surfaceSelected: '#12302c',
    border: '#252a32',
    text: '#e9ebee',
    textMuted: '#8b929e',
    textSubtle: '#5f6672',
  },
  light: {
    bg: '#f7f6f3',
    surface: '#ffffff',
    surfaceSunken: '#f2f1ec',
    surfaceHover: '#ecebe4',
    surfaceSelected: '#dff3ef',
    border: '#e4e1d9',
    text: '#191b1e',
    textMuted: '#6c727c',
    textSubtle: '#9aa0a8',
  },
} as const

export type ThemeName = keyof typeof surfaces

export const fonts = {
  sans: "'IBM Plex Sans', 'Noto Sans SC', 'Noto Sans JP', 'Noto Sans KR', Helvetica, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
} as const

export const motion = {
  easeStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  durationFast: '150ms',
  durationBase: '300ms',
  durationSlow: '500ms',
} as const

/**
 * Breakpoints in CSS pixels.
 *
 * These exist for JS-side decisions and documentation. They cannot be used in
 * `@media` conditions — a custom property there is invalid CSS and fails
 * silently — so stylesheets hardcode these same four numbers.
 */
export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

export type Breakpoint = keyof typeof breakpoints

/**
 * Layer stack. Dialog, Popover, Tooltip and Toast are absent on purpose: they
 * render in the browser top layer via `<dialog>` and the `popover` attribute,
 * so they sit above all of this without competing for a number.
 */
export const zIndex = {
  base: 0,
  sticky: 100,
  dropdown: 200,
  toast: 300,
} as const

/** The spacing scale, in CSS pixels. Each key is the value it holds. */
export const space = {
  0: 0,
  px: 1,
  2: 2,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  64: 64,
} as const

export type SpaceToken = keyof typeof space
