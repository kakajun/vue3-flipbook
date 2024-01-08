import Flipbook from '@/views/Flipbook.vue'

const description = `
The Phaser.Game instance is the main controller for the entire Phaser game.
It is responsible for handling the boot process, parsing the configuration values, creating the renderer, and setting-up all of the global Phaser systems, such as sound and input.
Once that is complete it will start the Scene Manager and then begin the main game loop.

You should generally avoid accessing any of the systems created by Game, and instead use those made available to you via the Phaser.Scene Systems class instead.

\`\`\`html
<Game :config="gameConfig">
  <Scene name="SceneName1" />
  <Scene name="SceneName2" />
</Game>
\`\`\`

See also: [Phaser.Game](https://newdocs.phaser.io/docs/Phaser.Game)
`

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
  parameters: {
    docs: {
      description: {
        component: description
      }
    }
  },
  component: Flipbook,
  tags: ['autodocs'],
  args: {
    zoomDuration: 2500
  },
  argTypes: {
    flipDuration: {
      name: ':flipDuration',
      description:
        'The configuration object for your Phaser Game instance.<br>See: [Phaser.Types.Core.GameConfig](https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig)',
      control: {
        type: 'select'
      },
      options: [1000, 3000, 5000]
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
    template: `<Flipbook class="flipbook"
       :pages="pages"
       :flipDuration="args.flipDuration"
       :pagesHiRes="pagesHiRes"
       :zoomDuration="args.zoomDuration"
       />`
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
