import { ref, computed, Ref } from 'vue'
import { easeInOut } from './utils.js'
import type { flipbookProps, emitEvents } from './index-types.ts'
import { Ref } from 'vue'
import { flipbookProps, emitEvents } from './index-types.ts'

export interface UseZoom {
  zoom: Ref<number>
  zooming: Ref<boolean>
  canZoomIn: Ref<boolean>
  canZoomOut: Ref<boolean>
  zoomIn: (ev: MouseEvent) => void
  zoomOut: (ev: MouseEvent) => void
  zoomAt: (ev: MouseEvent) => void
  onWheel: (ev: WheelEvent, hasTouchEvents: boolean) => void
  scrollLeft: Ref<number>
  scrollTop: Ref<number>

export default function useZoom(
  props: flipbookProps,
  emit: emitEvents,
  refViewport: Ref<{ scrollLeft: number; scrollTop: number }> | undefined,
  preloadImages: (arg0: boolean) => void | undefined
  refViewport?: { value: { scrollLeft: number; scrollTop: number } } | undefined,
  preloadImages?: ((arg0: boolean) => void) | undefined
): UseZoom {
  const zoom = ref<number>(1)
  const zoomIndex = ref<number>(0)

  const zooming = ref<boolean>(false)
  const scrollLeft = ref<number>(0)
  const scrollTop = ref<number>(0)
  const zoomIn = (zoomAt: MouseEvent): void => {
    if (!canZoomIn.value) return
    zoomIndex.value += 1
    if (props.zooms) {
      zoomTo(props.zooms[zoomIndex.value], zoomAt)
    }
  }

  const zoomOut = (zoomAt: MouseEvent) => {
    if (!canZoomOut.value) return
    zoomIndex.value -= 1
    if (props.zooms) {
      zoomTo(props.zooms[zoomIndex.value], zoomAt)
    }
  }

  const zoomTo = (pzoom: number, zoomAt: MouseEvent) => {
    const viewport = refViewport.value
    let fixedX, fixedY
    if (zoomAt) {
      const rect = viewport.getBoundingClientRect()
      fixedX = zoomAt.pageX - rect.left
      fixedY = zoomAt.pageY - rect.top
    } else {
      fixedX = viewport.clientWidth / 2
      fixedY = viewport.clientHeight / 2
    }
    const start = zoom.value
    const end = pzoom
    const startX = viewport.scrollLeft
    const startY = viewport.scrollTop
    const containerFixedX = fixedX + startX
    const containerFixedY = fixedY + startY
    const endX = (containerFixedX / start) * end - fixedX
    const endY = (containerFixedY / start) * end - fixedY
    const t0 = Date.now()
    zooming.value = true
    emit('zoom-start', pzoom)
    const animate = () => {
      requestAnimationFrame(() => {
        const t = Date.now() - t0
        let ratio = t / props.zoomDuration
        ratio = ratio > 1 ? 1 : ratio
        ratio = easeInOut(ratio)
        zoom.value = start + (end - start) * ratio
        scrollLeft.value = startX + (endX - startX) * ratio
        scrollTop.value = startY + (endY - startY) * ratio
        if (t < props.zoomDuration) {
          animate()
        } else {
          emit('zoom-end', pzoom)
          zooming.value = false
          zoom.value = pzoom
          scrollLeft.value = endX
          scrollTop.value = endY
        }
      })
    }
    animate()
    if (end > 1) {
      preloadImages(true)
    }
  }

  const zoomAt = (zoomAtv: MouseEvent) => {
    zoomIndex.value = (zoomIndex.value + 1) % props.zooms.length
    zoomTo(props.zooms[zoomIndex.value], zoomAtv)
  }
  const canZoomIn = computed(() => !zooming.value && zoomIndex.value < props.zooms.length - 1)

  const canZoomOut = computed(() => !zooming.value && zoomIndex.value > 0)

  const onWheel = (ev: WheelEvent, hasTouchEvents: boolean): void => {
    if (props.wheel === 'scroll' && zoom.value > 1 && !hasTouchEvents) {
      scrollLeft.value = refViewport.value.scrollLeft + ev.deltaX
      scrollTop.value = refViewport.value.scrollTop + ev.deltaY
      if (ev.cancelable) {
        ev.preventDefault()
      }
    }

    if (props.wheel === 'zoom') {
      if (ev.deltaY >= 100) {
        zoomOut(ev)
        ev.preventDefault()
      } else if (ev.deltaY <= -100) {
        zoomIn(ev)
        ev.preventDefault()
      }
    }
  }

  return {
    zoom,
    zooming,
    canZoomIn,
    canZoomOut,
    zoomIn,
    zoomOut,
    zoomAt,
    onWheel,
    scrollLeft,
    scrollTop
  }
}
