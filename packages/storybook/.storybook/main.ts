import type { StorybookConfig } from '@storybook/vue3-vite'


import { fileURLToPath, URL } from 'node:url'
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-storysource'
  ],
  alias: {
    '@': fileURLToPath(new URL('../src', import.meta.url))
  },
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
}
export default config
