import { ref, reactive, defineEmits, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import useZoom from './useZoom'

export default function useImageLoad(props, currentPage, displayedPages) {
  const { zoom, zooming } = useZoom(props)

  const loadedImages = ref({})
  const nImageLoad = ref(0)
  const nImageLoadTrigger = ref(0)
  const imageLoadCallback = ref(null)
  const imageWidth = ref(null)
  const imageHeight = ref(null)

  const pageUrl = (page, hiRes = false) => {
    if (hiRes && zoom.value > 1 && !zooming.value) {
      const url = props.pagesHiRes[page]
      return url ? url : null
    }
    return props.pages[page] || null
  }

  const loadImage = (url) => {
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

  const pageUrlLoading = (page, hiRes = false) => {
    const url = pageUrl(page, hiRes)
    if (hiRes && zoom.value > 1 && !zooming.value) {
      return url
    }
    return url && loadImage(url)
  }

  const preloadImages = (hiRes = false) => {
    for (let i = currentPage.value - 3; i <= currentPage.value + 3; i++) {
      pageUrlLoading(i) // this preloads image
    }
    if (hiRes) {
      for (let i = currentPage.value; i < currentPage.value + displayedPages.value; i++) {
        const src = props.pagesHiRes[i]
        if (src) {
          new Image().src = src
        }
      }
    }
  }

  const onImageLoad = (trigger, cb) => {
    nImageLoad.value = 0
    nImageLoadTrigger.value = trigger
    imageLoadCallback.value = cb
  }

  const didLoadImage = (ev) => {
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
    preloadImages,
    pageUrlLoading,
    onImageLoad,
    didLoadImage
  }
}
