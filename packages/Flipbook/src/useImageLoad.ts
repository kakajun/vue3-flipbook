import { ref, Ref } from 'vue'
import useZoom from './useZoom'
import type {UseZoom} from './useZoom'
import type { flipbookProps } from './index-types'

interface UseImageLoad {
  imageWidth: Ref<number>
  imageHeight: Ref<number>
  pageUrl: (page: number, hiRes: boolean) => string | null
  loadImage: (page: number, hiRes: boolean) => string | null
  pageUrlLoading: (page: number, hiRes: boolean) => string | null
  onImageLoad: (trigger: number, cb: () => void) => void
  didLoadImage: (page: number, hiRes: boolean) => string | null
}

export default function useImageLoad(props: flipbookProps, preloadImages: any): UseImageLoad {
  const { zoom, zooming } = useZoom(props)

  const loadedImages = ref<object>({})
  const nImageLoad = ref<number>(0)
  const nImageLoadTrigger = ref<number>(0)
  const imageLoadCallback = ref<Function | null>(null)
  const imageWidth = ref<number>()
  const imageHeight = ref<number>()

  const pageUrl = (page: number, hiRes = false): string | null => {
    if (hiRes && zoom.value > 1 && !zooming.value) {
      const url = props.pagesHiRes[page]
      return url ? url : null
    }
    return props.pages[page] || null
  }

  const loadImage = (url: string): string => {
    if (imageWidth.value === null) {
      return url
    } else {
      if (loadedImages.value[url]) {
        return url
      } else {
        const img = new Image()
        img.onload = () => {
          loadedImages.value[url] = true
        }
        img.src = url
        return props.loadingImage
      }
    }
  }

  const pageUrlLoading = (page: number, hiRes = false): string | null => {
    const url = pageUrl(page, hiRes)
    if (hiRes && zoom.value > 1 && !zooming.value) {
      return url
    }
    return url && loadImage(url)
  }

  const onImageLoad = (trigger: number, cb: Function): void => {
    nImageLoad.value = 0
    nImageLoadTrigger.value = trigger
    imageLoadCallback.value = cb
  }

  const didLoadImage = (ev: MouseEvent): void => {
    if (imageWidth.value === null) {
      imageWidth.value = (ev.target || ev.path[0]).naturalWidth
      imageHeight.value = (ev.target || ev.path[0]).naturalHeight
      preloadImages()
    }
    if (!imageLoadCallback.value) return
    if (++nImageLoad.value >= nImageLoadTrigger.value) {
      imageLoadCallback.value()
      imageLoadCallback.value = null
    }
  }

  return {
    imageWidth,
    imageHeight,
    pageUrl,
    loadImage,
    pageUrlLoading,
    onImageLoad,
    didLoadImage
  }
}
