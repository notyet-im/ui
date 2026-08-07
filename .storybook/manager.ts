import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events'
import { addons } from 'storybook/manager-api'
import type { ThemeName } from '../src/tokens'
import { chromeThemes } from './theme'

addons.setConfig({
  theme: chromeThemes.dark,
  sidebar: {
    // The four categories are the system's shape; showing them expanded means
    // the split is the first thing you see rather than something you unfold.
    showRoots: true,
  },
})

/**
 * Makes the manager chrome follow the preview's `theme` toolbar global.
 *
 * The received wisdom is that this is impossible: `addons.setConfig` looks like
 * load-time-only configuration, and the manager cannot import the preview's
 * React context. Neither objection survives reading the source. The manager
 * renders `<ThemeProvider theme={ensure(state.theme)}>` from *manager state*,
 * and `setConfig` emits `SET_CONFIG`, whose handler re-reads `provider.getConfig()`
 * — which is this same addon store — and pushes the result back into that state.
 * So calling `setConfig` again after boot really does re-theme the chrome.
 *
 * The globals are already mirrored into the manager over the channel, so the
 * toggle's two events are all that is needed to drive it. `SET_GLOBALS` covers
 * the initial sync (including a deep link that carries `globals=theme:light`);
 * `GLOBALS_UPDATED` covers every later flip of the toolbar control.
 */
addons.register('notyet/chrome-theme', () => {
  const channel = addons.getChannel()
  let current: ThemeName = 'dark'

  const sync = ({ globals }: { globals?: { theme?: unknown } }) => {
    const next: ThemeName = globals?.theme === 'light' ? 'light' : 'dark'
    // `setOptions` shallow-merges the theme and re-renders the whole manager, so
    // repeating a no-op swap on every globals change would be wasteful.
    if (next === current) return
    current = next
    addons.setConfig({ theme: chromeThemes[next] })
  }

  channel.on(SET_GLOBALS, sync)
  channel.on(GLOBALS_UPDATED, sync)
})
