import type { ExtractPropTypes } from 'vue'

export const flipProps = {
  pages: {
    type: Array as PropType<string[]>,
    required: true
  },
  pagesHiRes: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  flipDuration: {
    type: Number,
    default: 1000
  },
  zoomDuration: {
    type: Number,
    default: 500
  },
  zooms: {
    type: Array as PropType<number[]>,
    default: () => [1, 2, 4]
  },
  perspective: {
    type: Number,
    default: 2400
  },
  nPolygons: {
    type: Number,
    default: 10
  },
  ambient: {
    type: Number,
    default: 0.4
  },
  gloss: {
    type: Number,
    default: 0.6
  },
  swipeMin: {
    type: Number,
    default: 3
  },
  singlePage: {
    type: Boolean,
    default: false
  },
  forwardDirection: {
    validator: (val: string) => val === 'right' || val === 'left',
    default: 'right'
  },
  centering: {
    type: Boolean,
    default: true
  },
  startPage: {
    type: Number,
    default: null
  },
  loadingImage: {
    type: String,
    default: 'spinner'
  },
  clickToZoom: {
    type: Boolean,
    default: true
  },
  dragToFlip: {
    type: Boolean,
    default: true
  },
  wheel: {
    type: String,
    default: 'scroll'
  }
}

export declare type FlipProps = Partial<ExtractPropTypes<typeof flipProps>>
