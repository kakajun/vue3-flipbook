import Demo from '@/views/demo.vue'
import type { StoryObj } from '@storybook/vue3'
export default {
  title: 'FlipDemo',
  component: Demo,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  render: (args: any) => ({
    // Components used in your story `template` are defined in the `components` object
    components: {
      Demo
    },
    // The story's `args` need to be mapped into the template through the `setup()` method
    setup() {
      // Story args can be spread into the returned object
      return {
        ...args
      }
    },
    // Then, the spread values can be accessed directly in the template
    template: '<Demo  />'
  })
}

export const FlipDemo: StoryObj = {
  args: {}
}
