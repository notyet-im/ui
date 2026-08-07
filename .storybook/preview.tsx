import type { DocsContainerProps } from '@storybook/addon-docs/blocks'
import { DocsContainer } from '@storybook/addon-docs/blocks'
import type { Preview } from '@storybook/react-vite'
import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events'
import { ThemeProvider } from '../src/components/ThemeProvider'
import type { ThemeName } from '../src/tokens'
import { chromeThemes } from './theme'
import '../src/styles/tokens.css'

/** Narrows whatever the `theme` global currently holds to a palette name. */
function themeFrom(globals: { theme?: unknown } | undefined): ThemeName {
  return globals?.theme === 'light' ? 'light' : 'dark'
}

/**
 * The docs page chrome, themed and kept in step with the toolbar toggle.
 *
 * `addon-docs` renders `<Container context theme={parameters.docs.theme}>`, and
 * that theme defaults to Storybook's light one — which is why 55 autodocs pages
 * were paper-white inside otherwise dark chrome. A static `parameters.docs.theme`
 * would fix the colour but freeze it, so the container is replaced instead: the
 * docs context hands over the preview channel, and the same two globals events
 * the manager listens to drive the swap here.
 *
 * The initial value has to be read rather than assumed — a deep link into a docs
 * page can arrive with the light palette already selected, and `SET_GLOBALS` may
 * have fired before this mounted.
 */
function ThemedDocsContainer({ context, children }: PropsWithChildren<DocsContainerProps>) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    try {
      return themeFrom(context.getStoryContext(context.storyById()).globals)
    } catch {
      // An unattached docs entry has no primary story to read globals from.
      return 'dark'
    }
  })

  useEffect(() => {
    const sync = ({ globals }: { globals?: { theme?: unknown } }) => setTheme(themeFrom(globals))
    context.channel.on(SET_GLOBALS, sync)
    context.channel.on(GLOBALS_UPDATED, sync)
    return () => {
      context.channel.off(SET_GLOBALS, sync)
      context.channel.off(GLOBALS_UPDATED, sync)
    }
  }, [context])

  return (
    <DocsContainer context={context} theme={chromeThemes(theme)}>
      {children}
    </DocsContainer>
  )
}

/**
 * A story, plus the palette mirrored onto the preview iframe's root element.
 *
 * `ThemeProvider` scopes the `--ny-*` properties to its own div, which is only
 * as tall as the story it wraps. Everything below it is the UA canvas, painted
 * from `color-scheme` — and `tokens.css` declares `color-scheme: dark` on
 * `:root`, so a light story sat on a black slab for the rest of the viewport.
 * Invisible in the dark palette, which is why it survived this long.
 *
 * Repeating `data-theme` on `<html>` fixes it without touching `src/styles`:
 * `preview-head.html` can then paint the canvas `--ny-bg`. The attribute
 * selector and `:root` have equal specificity, so the light block — declared
 * second in `tokens.css` — wins on source order, as it is written to.
 */
function ThemedStory({ theme, children }: PropsWithChildren<{ theme: ThemeName }>) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <ThemeProvider theme={theme} style={{ padding: 24 }}>
      {children}
    </ThemeProvider>
  )
}

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    // The DS paints its own background; Storybook's would fight it.
    backgrounds: { disabled: true },
    docs: { container: ThemedDocsContainer },
    options: {
      /**
       * Reads as an argument rather than an alphabet: the vocabulary first, then
       * the two halves that spend it, then everything assembled. Storybook sorts
       * unlisted siblings by declaration order, so the stories inside each
       * component keep the sequence their file sets.
       */
      storySort: { order: ['Foundations', 'UI', 'Charts', 'Showcase'] },
    },
  },
  globalTypes: {
    theme: {
      description: 'Design system palette',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [
    (Story, context) => (
      <ThemedStory theme={(context.globals.theme as ThemeName) ?? 'dark'}>
        <Story />
      </ThemedStory>
    ),
  ],
}

/**
 * Autodocs for every component.
 *
 * 53 of the 55 story files already carry a `parameters.docs.description`
 * blurb; without this they render nowhere. design-sync ignores docs entries
 * (`source-storybook.mjs` skips `type === 'docs'`), so the component roster is
 * unaffected.
 */
export const tags = ['autodocs']

export default preview
