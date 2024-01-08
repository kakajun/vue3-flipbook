import Flipbook from '@/views/Flipbook.vue'

const getPages = async (isHi) => {
  const importAll = async (r) => {
    const images = []
    for (const path in r) {
      images.push((await r[path]()).default)
    }
    return images
  }
  const images = import.meta.glob('@/assets/images/*.jpg')
  const imagesLarge = import.meta.glob('@/assets/images-large/*.jpg')
  console.log(images, 'images')
  return isHi ? [null, ...(await importAll(images))] : [null, ...(await importAll(imagesLarge))]
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'flipDuration',
  component: Flipbook,
  tags: ['autodocs'],
  argTypes: {
    flipDuration: {
      control: {
        type: 'select'
      },
      options: [1000, 2000, 3000]
    }
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SlowOne = {
  render: (args, { loaded: { pages, pagesHiRes } }) => ({
    components: { Flipbook },
    setup() {
      return { args, pages, pagesHiRes }
    },
    template: '<Flipbook class="flipbook" :pages="pages" :pagesHiRes="pagesHiRes" />'
  }),
  loaders: [
    async () => ({
      pages: await getPages(),
      pagesHiRes: await getPages(true)
    })
  ],
  args: {
    flipDuration: 3000
  }
}

// export const MiddleOne = {
//   pages: async () => {
//     const a = await getPages()
//     console.log(a, 'a')
//     return {
//       type: 'object',
//       defaultValue: a
//     }
//   },
//   pagesHiRes: async () => await getPages(true),
//   args: {
//     flipDuration: 2000
//   }
// }

// export const FastOne = {
//   pages: async () => {
//     const a = await getPages()
//     console.log(a, 'a')
//     return {
//       type: 'object',
//       defaultValue: a
//     }
//   },
//   pagesHiRes: async () => await getPages(true),
//   args: {
//     flipDuration: 1000
//   }
// }
