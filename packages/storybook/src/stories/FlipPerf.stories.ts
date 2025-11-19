import Flipbook from 'vue3-flipbook'
import type { StoryObj } from '@storybook/vue3'
import 'vue3-flipbook/dist/vue3-flipbook.css'

type Story = StoryObj<typeof Flipbook>

export default {
  title: 'FlipPerf',
  component: Flipbook,
  tags: ['autodocs'],
  args: {
    zoomDuration: 500,
    flipDuration: 800,
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
    clickToZoom: false,
    dragToFlip: true,
    wheel: 'scroll'
  }
}

export const MeasureFlip: Story = {
  render: (args: any, { loaded: { pages, pagesHiRes } }: any) => ({
    components: { Flipbook },
    setup() {
      const samples: number[] = []
      let rafCount = 0
      let start = 0
      let running = false
      const onFlipStart = () => {
        if (running) return
        rafCount = 0
        start = performance.now()
        running = true
        const tick = () => {
          if (!running) return
          rafCount++
          requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
      const onFlipEnd = () => {
        const end = performance.now()
        running = false
        samples.push(end - start)
      }
      const summary = () => {
        if (!samples.length) return 'No data'
        const avg = samples.reduce((a, b) => a + b, 0) / samples.length
        const sorted = [...samples].sort((a, b) => a - b)
        const p95 = sorted[Math.floor(sorted.length * 0.95)]
        return `count=${samples.length}, avg=${avg.toFixed(1)}ms, p95=${p95.toFixed(1)}ms, raf=${rafCount}`
      }
      return { args, pages, pagesHiRes, onFlipStart, onFlipEnd, summary }
    },
    template: `<div>
      <Flipbook class="flipbook"
        :pages="pages"
        :pagesHiRes="pagesHiRes"
        v-on="{
          'flip-left-start': onFlipStart,
          'flip-right-start': onFlipStart,
          'flip-left-end': onFlipEnd,
          'flip-right-end': onFlipEnd
        }"
        v-bind="args" />
      <div style="color:#ccc;margin-top:12px">{{ summary() }}</div>
    </div>`
  }),
  loaders: [
    async () => {
      const importAll = async (r: Record<string, () => Promise<{ default: string }>>) => {
        const images: string[] = []
        for (const path in r) images.push((await r[path]()).default)
        return images
      }
      const images = import.meta.glob('@/assets/images/*.jpg') as Record<string, () => Promise<{ default: string }>>
      const imagesLarge = import.meta.glob('@/assets/images-large/*.jpg') as Record<string, () => Promise<{ default: string }>>
      return {
        pages: [null, ...(await importAll(images))],
        pagesHiRes: [null, ...(await importAll(imagesLarge))]
      }
    }
  ]
}