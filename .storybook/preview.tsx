import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from '../src/components/ThemeProvider'
import type { ThemeName } from '../src/tokens'
import '../src/styles/tokens.css'

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    // The DS paints its own background; Storybook's would fight it.
    backgrounds: { disable: true },
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

export default preview
