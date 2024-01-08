import Flipbook from '@/view/Flipbook.vue'

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
  return isHi ? [null, ...(await importAll(images))] : [null, ...(await importAll(imagesLarge))]
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'flipDuration',
  component: Flipbook,
  tags: ['autodocs'],
  argTypes: {
    pages: async () => await getPages(),
    pagesHiRes: async () => await getPages(true),
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
  args: {
    flipDuration: 3000
  }
}

export const MiddleOne = {
  args: {
    flipDuration: 2000
  }
}

export const FastOne = {
  args: {
    flipDuration: 1000
  }
}
