import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  features: {
    /**
     * The onboarding checklist ("Publish your Storybook", "Install Vitest
     * addon") takes the top ~150px of the sidebar in every dev session. This is
     * a component catalogue people scroll, not a project being set up, and one
     * of its three prompts is an addon that was explicitly declined — so it is
     * pure noise here. The widget and its Guide settings page are gated on these
     * two flags and nothing else.
     */
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
}

export default config
