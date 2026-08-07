import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from '../src/components/ThemeProvider'
import type { ThemeName } from '../src/tokens'
import '../src/styles/tokens.css'

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    // The DS paints its own background; Storybook's would fight it.
    backgrounds: { disabled: true },
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
      <ThemeProvider theme={(context.globals.theme as ThemeName) ?? 'dark'} style={{ padding: 24 }}>
        <Story />
      </ThemeProvider>
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
