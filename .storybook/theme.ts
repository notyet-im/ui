import { create } from 'storybook/theming/create'
import type { ThemeName } from '../src/tokens'
import { accent, fonts, surfaces } from '../src/tokens'

/**
 * Storybook's own chrome, themed from the design system's tokens.
 *
 * The manager (sidebar, toolbar, tab bar) renders **outside** the preview
 * iframe, and the docs container takes plain strings too, so neither can read
 * the `--ny-*` custom properties. Building both from `src/tokens.ts` rather than
 * pasting hexes is what stops this becoming a second copy of the palette that
 * silently drifts; `tokens.parity.test.ts` already pins those values to
 * `tokens.css`.
 *
 * `src/tokens.ts` is pure data with no imports, so it is safe to pull into the
 * manager bundle — importing anything that touches CSS or React would not be.
 */

/**
 * The brand lockup.
 *
 * `brandTitle` is injected with `dangerouslySetInnerHTML` whenever `brandImage`
 * is unset, so a string of markup buys an inline mark without the network
 * request a `brandImage` URL would cost — and without giving up the wordmark,
 * which `brandImage` would replace rather than sit beside.
 *
 * The mark is the system in miniature: a rising series inside a panel, which is
 * what every one of the six charts ultimately draws.
 */
function brandLockup(border: string): string {
  return `<span style="display:inline-flex;align-items:center;gap:8px">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="19" height="19" rx="5" stroke="${border}" />
      <path
        d="M4 13.5 L8 9.5 L11 12 L15.5 6.5"
        stroke="${accent.base}"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="15.5" cy="6.5" r="1.75" fill="${accent.base}" />
    </svg>
    <span style="font-weight:600;letter-spacing:-0.02em">NotYet UI</span>
  </span>`
}

/** Builds the chrome theme for one of the system's two palettes. */
export function chromeTheme(name: ThemeName) {
  const palette = surfaces[name]

  return create({
    base: name,

    brandTitle: brandLockup(palette.border),
    brandUrl: '/',
    brandTarget: '_self',

    colorPrimary: accent.base,
    colorSecondary: accent.base,

    // Chrome surfaces
    appBg: palette.bg,
    appContentBg: palette.surface,
    appPreviewBg: palette.bg,
    appHoverBg: palette.surfaceHover,
    appBorderColor: palette.border,
    appBorderRadius: 8, // --ny-radius-lg

    // Text
    textColor: palette.text,
    textInverseColor: palette.bg,
    textMutedColor: palette.textMuted,

    // Toolbar
    barTextColor: palette.textMuted,
    barSelectedColor: accent.base,
    barHoverColor: accent.hover,
    barBg: palette.surface,

    // Form controls in the addons panel
    inputBg: palette.surfaceSunken,
    inputBorder: palette.border,
    inputTextColor: palette.text,
    inputBorderRadius: 6, // --ny-radius-md
    buttonBg: palette.surfaceSunken,
    buttonBorder: palette.border,
    booleanBg: palette.surfaceSunken,
    booleanSelectedBg: palette.surfaceSelected,

    fontBase: fonts.sans,
    fontCode: fonts.mono,
  })
}

/**
 * Both palettes, built once.
 *
 * The manager swaps between them at runtime and the docs container picks one per
 * render, so they are memoised here rather than rebuilt on every globals change.
 */
export const chromeThemes = {
  dark: chromeTheme('dark'),
  light: chromeTheme('light'),
} as const
