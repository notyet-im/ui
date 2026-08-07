import { addons } from 'storybook/manager-api'
import { managerTheme } from './theme'

addons.setConfig({
  theme: managerTheme,
  sidebar: {
    // The two categories are the system's shape; showing them expanded means
    // the split is the first thing you see rather than something you unfold.
    showRoots: true,
  },
})
