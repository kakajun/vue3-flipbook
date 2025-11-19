import type { Preview } from '@storybook/vue3'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    (story) => ({
      components: { story },
      template:
        '<div style="display:flex;align-items:center;justify-content:center;width:100%;min-height:60vh;padding:16px;box-sizing:border-box"><story /></div>'
    })
  ]
}

export default preview
