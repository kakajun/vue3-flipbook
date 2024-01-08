/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

import { fileURLToPath, URL } from 'node:url'
const config = {
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
  },
  async viteFinal(config, { configType }) {
    if (configType === 'DEVELOPMENT') {
      // Your development configuration goes here
    }
    if (configType === 'PRODUCTION') {
      // Your production configuration goes here.
    }
    return mergeConfig(config, {
      // Your environment configuration here
    })
  }
}
export default config
