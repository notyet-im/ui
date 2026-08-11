import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ThemeProvider } from '../components/ThemeProvider'

/**
 * Renders `ui` inside the provider that every component needs.
 *
 * Nothing in the system resolves a colour outside `ThemeProvider` — it is what
 * defines the `--ny-*` properties and sets `data-theme` — so every suite has to
 * wrap. Doing that inline produced 132 copies of the same two lines and seven
 * separately-named local helpers (`renderInTheme`, `renderLayout`,
 * `renderSkeleton`, …) that had already drifted over whether to pass `theme`
 * explicitly. This is that wrapper, once.
 *
 * `theme` defaults to `dark`, matching `ThemeProvider`'s own default; pass
 * `light` only in a suite that is specifically about the light theme.
 */
export function renderInTheme(ui: ReactNode, theme: 'dark' | 'light' = 'dark') {
  return render(themed(ui, theme))
}

/**
 * The same wrapper as an element rather than a render.
 *
 * `rerender` has to be handed the whole tree again, provider included, or the
 * component unmounts and remounts and the test stops testing an update.
 */
export function themed(ui: ReactNode, theme: 'dark' | 'light' = 'dark') {
  return <ThemeProvider theme={theme}>{ui}</ThemeProvider>
}
