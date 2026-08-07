import { create } from 'storybook/theming/create'
import { accent, fonts, surfaces } from '../src/tokens'

/**
 * Storybook's own chrome, themed from the design system's tokens.
 *
 * The manager (sidebar, toolbar, tab bar) renders **outside** the preview
 * iframe, so it cannot read the `--ny-*` custom properties — Storybook's theme
 * API takes plain strings. Building it from `src/tokens.ts` rather than pasting
 * hexes is what stops this becoming a second copy of the palette that silently
 * drifts; `tokens.parity.test.ts` already pins those values to `tokens.css`.
 *
 * `src/tokens.ts` is pure data with no imports, so it is safe to pull into the
 * manager bundle — importing anything that touches CSS or React would not be.
 */

const dark = surfaces.dark

export const managerTheme = create({
  base: 'dark',

  brandTitle: 'NotYet UI',
  brandUrl: '/',
  brandTarget: '_self',

  colorPrimary: accent.base,
  colorSecondary: accent.base,

  // Chrome surfaces
  appBg: dark.bg,
  appContentBg: dark.surface,
  appPreviewBg: dark.bg,
  appBorderColor: dark.border,
  appBorderRadius: 8, // --ny-radius-lg

  // Text
  textColor: dark.text,
  textInverseColor: dark.bg,
  textMutedColor: dark.textMuted,

  // Toolbar
  barTextColor: dark.textMuted,
  barSelectedColor: accent.base,
  barHoverColor: accent.hover,
  barBg: dark.surface,

  // Form controls in the addons panel
  inputBg: dark.surfaceSunken,
  inputBorder: dark.border,
  inputTextColor: dark.text,
  inputBorderRadius: 6, // --ny-radius-md

  fontBase: fonts.sans,
  fontCode: fonts.mono,
})
