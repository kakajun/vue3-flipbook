export type emitEvents = {
  'flip-left-start': [arg2: number]
  'flip-left-end': [arg2: number]
  'flip-right-start': [arg2: number]
  'flip-right-end': [arg2: number]
  'zoom-start': [arg2: number]
  'zoom-end': [arg2: number]
}
export interface flipbookProps {
  pages: string[]
  pagesHiRes?: string[]
  flipDuration?: number
  zoomDuration?: number
  zooms?: number[]
  perspective?: number
  nPolygons?: number
  ambient?: number
  gloss?: number
  swipeMin?: number
  singlePage?: boolean
  forwardDirection?: 'left' | 'right'
  centering?: boolean
  startPage?: number
  loadingImage?: string
  clickToZoom?: boolean
  dragToFlip?: boolean
  wheel?: 'scroll' | 'zoom'
}
