import Flipbook from '@/views/Flipbook.vue'

const description = `
vue3-flipbook  is a Vue component that displays images in 3D page flip effect

Demo page is [here](https://ts1.github.io/flipbook-vue/).

\`\`\`html
<template>
  <flipbook class="flipbook" :pages="['array', 'of', 'image', 'URLs']"></flipbook>
</template>

<style>
.flipbook {
  width: 90vw;
  height: 90vh;
}
</style>

\`\`\`
## Installation

Install as a module:

npm i -S vue3-flipbook


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
    zoomDuration: 2500,
    flipDuration: 1000,
    zooms: [1, 2, 4],
    ambient: 0.4,
    gloss: 0.6,
    perspective: 2400,
    nPolygons: 10,
    singlePage: false,
    forwardDirection: 'right',
    centering: true,
    startPage: 1,
    swipeMin: 3,
    clickToZoom: true,
    dragToFlip: true,
    wheel: 'scroll'
  },
  argTypes: {
    pages: {
      description: `Array of image URLs. Required.
       All images should have the same aspect ratio.
       If the first element is null, the next element is displayed alone (as the cover page).
       All other props are optional.`,
      control: 'none'
    },
    pagesHiRes: {
      description: `Array of high resolution versions of image URLs.
      They are used when zoomed.`,
      control: 'none'
    },
    flipDuration: {
      description: `Duration of page flipping animation in milliseconds`,
      control: 'number',
      default: 1000
    },
    zoomDuration: {
      description: `Duration of zoom in/out animation in milliseconds`,
      control: 'number',
      default: 500
    },
    zooms: {
      description: `Array of possible magnifications`,
      control: {
        type: 'select'
      },
      default: '[1, 2, 4]',
      options: [
        [1, 2],
        [1, 2, 4]
      ]
    },
    ambient: {
      description: `Intensity of ambient light in 0 to 1.
      Smaller value gives more shades`,
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.1
      },
      defaultValue: 0.4
    },
    gloss: {
      description: 'Intensity of specular light in 0 to 1. Higher value gives more gloss.',
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.1
      },
      defaultValue: 0.6
    },
    perspective: {
      description:
        'Z-axis distance in pixels between the screen and the viewer. Higher value gives less effect',
      control: 'number',
      defaultValue: 2400
    },
    nPolygons: {
      description:
        'How many rectangles a single page is horizontally split into. Higher value gives higher quality rendering in exchange for performance',
      control: 'number',
      defaultValue: 10
    },
    singlePage: {
      description: 'Force single page mode regardless of viewport size. ',
      control: 'boolean',
      defaultValue: false
    },
    forwardDirection: {
      description: 'Reading direction. If your document is right-to-left, set this "left".',
      control: {
        type: 'select'
      },
      options: ['left', 'right'],
      defaultValue: 'right'
    },
    centering: {
      description: 'Enable centering of the cover pages.',
      control: 'boolean',
      defaultValue: true
    },
    startPage: {
      description: 'Page number (>= 1) to open.',
      control: 'number',
      defaultValue: 1
    },
    loadingImage: {
      description:
        'URL of an image that is displayed while page is loading. By default internal animated SVG is used.',
      control: 'text'
    },
    clickToZoom: {
      description: 'Zoom in or out on click or tap.',
      control: 'boolean',
      defaultValue: true
    },
    dragToFlip: {
      description: 'Flip page by dragging/swiping. ',
      control: 'boolean',
      defaultValue: true
    },
    wheel: {
      description:
        "When set to 'zoom', mouse wheel events zoom in/out the page. Default is 'scroll', wheel events and touch pad scroll gestures scroll the zoomed page.",
      control: {
        type: 'select'
      },
      defaultValue: 'scroll',
      options: ['zoom', 'scroll']
    },
    'flip-left-start': {
      name: '@flip-left-start',
      description: 'Fired when flip to left animation starts. Argument is page number before flip.',
      control: 'none',
      table: {
        category: 'Emits',
        type: { summary: 'function' }
      }
    },
    'flip-left-end': {
      name: '@flip-left-end',
      description: 'Fired when flip to left animation ends. Argument is page number after flip.',
      control: 'none',
      table: {
        category: 'Emits',
        type: { summary: 'function' }
      }
    },
    'flip-right-start': {
      name: '@flip-right-start',
      description:
        'Fired when flip to right animation starts. Argument is page number before flip.',
      control: 'none',
      table: {
        category: 'Emits',
        type: { summary: 'function' }
      }
    },
    'flip-right-end': {
      name: '@flip-right-end',
      description: 'Fired when flip to right animation ends. Argument is page number after flip.',
      control: 'none',
      table: {
        category: 'Emits',
        type: { summary: 'function' }
      }
    },
    'zoom-start': {
      name: '@zoom-start',
      description: 'Fired when zoom-in/out animation starts. Argument is magnification after zoom.',
      control: 'none',
      table: {
        category: 'Emits',
        type: { summary: 'function' }
      }
    },
    'zoom-end': {
      name: '@zoom-end',
      description: 'Fired when zoom-in/out animation ends. Argument is magnification after zoom.',
      control: 'none',
      table: {
        category: 'Emits',
        type: { summary: 'function' }
      }
    },
    default: {
      description: 'This component exposes some properties and methods as slot properties.',
      control: 'none'
    },
    canFlipLeft: {
      description:
        'True if it can flip to previous page. NOTE: Can return false if currently being animated.',
      control: 'none',
      table: {
        category: 'Slots',
        type: { summary: 'boolean' }
      }
    },
    canFlipRight: {
      description:
        'True if it can flip to next page. NOTE: Can return false if currently being animated.',
      control: 'none',
      table: {
        category: 'Slots',
        type: { summary: 'boolean' }
      }
    },
    canZoomIn: {
      description: 'True if it can zoom in.',
      control: 'none',
      table: {
        category: 'Slots',
        type: { summary: 'boolean' }
      }
    },
    canZoomOut: {
      description: 'True if it can zoom out.',
      control: 'none',
      table: {
        category: 'Slots',
        type: { summary: 'boolean' }
      }
    },
    page: {
      description: 'Current page number (1 to numPages).',
      control: 'none',
      table: {
        category: 'Slots',
        type: { summary: 'number' }
      }
    },
    numPages: {
      description: 'Total number of pages.',
      control: 'none',
      table: {
        category: 'Slots',
        type: { summary: 'number' }
      }
    },
    flipLeft: {
      description: 'Method to flip to previous page.',
      control: 'none',
      table: {
        category: 'Slots',
        type: { summary: 'function' }
      }
    },
    flipRight: {
      description: 'Method to flip to next page.',
      control: 'none',
      table: {
        category: 'Slots',
        type: { summary: 'function' }
      }
    },
    zoomIn: {
      description: 'Method to zoom in.',
      control: 'none',
      table: {
        category: 'Slots',
        type: { summary: 'function' }
      }
    },
    zoomOut: {
      description: 'Method to zoom out.',
      control: 'none',
      table: {
        category: 'Slots',
        type: { summary: 'function' }
      }
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
       :zooms="args.zooms"
       :ambient="args.ambient"
        :gloss="args.gloss"
        :perspective="args.perspective"
        :nPolygons="args.nPolygons"
        :singlePage="args.singlePage"
        :forwardDirection="args.forwardDirection"
        :centering="args.centering"
        :startPage="args.startPage"
        :loadingImage="args.loadingImage"
        :clickToZoom="args.clickToZoom"
        :dragToFlip="args.dragToFlip"
        :wheel="args.wheel"
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
