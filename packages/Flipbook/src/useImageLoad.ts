import { ref, Ref } from 'vue'
import type { FlipProps } from './flipProps.ts'

interface UseImageLoad {
  imageWidth: Ref<number | null>
  imageHeight: Ref<number | null>
  pageUrl: (page: number, hiRes?: boolean) => string
  loadImage: (url: string) => string
  pageUrlLoading: (page: number, hiRes: boolean) => string | undefined
  // onImageLoad: (trigger: number, cb: () => void) => void
  didLoadImage: (ev: Event) => void
}
export default function useImageLoad(
  props: FlipProps,
  preloadImages: () => void, // Add the missing type annotation here
  zoom: Ref<number>,
  zooming: Ref<boolean>
): UseImageLoad {
  const loadedImages = ref<Record<string, boolean>>({})
  const nImageLoad = ref<number>(0)
  const nImageLoadTrigger = ref<number>(0)
  const imageLoadCallback = ref<() => void | null>()
  const imageWidth = ref<number | null>(null)
  const imageHeight = ref<number | null>(null)

  const pageUrl = (page: number, hiRes = false): string => {
    if (hiRes && zoom.value > 1 && !zooming.value) {
      return (page < props.pagesHiRes!.length ? props.pagesHiRes?.[page] : '') || ''
    } else {
      return (page < props.pages!.length ? props.pages?.[page] : '') || ''
    }
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
        return props.loadingImage || ''
      }
    }
  }

  const pageUrlLoading = (page: number, hiRes = false): string | undefined => {
    const url = pageUrl(page, hiRes)
    if (hiRes && zoom.value > 1 && !zooming.value) {
      return url
    }
    return url && loadImage(url)
  }

  // const onImageLoad = (trigger: number, cb: Function): void => {
  //   nImageLoad.value = 0
  //   nImageLoadTrigger.value = trigger
  //   imageLoadCallback.value = cb
  // }

  const didLoadImage = (ev: Event) => {
    if (imageWidth.value === null) {
      imageWidth.value = (ev.target as HTMLImageElement).naturalWidth
      imageHeight.value = (ev.target as HTMLImageElement).naturalHeight
      preloadImages()
    }
    if (!imageLoadCallback.value) return
    if (++nImageLoad.value >= nImageLoadTrigger.value) {
      imageLoadCallback.value!()
    }
    imageLoadCallback.value = undefined
  }

  return {
    imageWidth,
    imageHeight,
    pageUrl,
    loadImage,
    pageUrlLoading,
    // onImageLoad,
    didLoadImage
  }
}
