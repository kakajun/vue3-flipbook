import { ref, computed, watch } from 'vue'
import { easeInOut } from './utils.js'

export default function useZoom(props, emit, refViewport, preloadImages) {
  const zoom = ref(1)
  const zoomIndex = ref(0)

  const zooming = ref(false)
  const scrollLeft = ref(0)
  const scrollTop = ref(0)
  const zoomIn = (zoomAt = null) => {
    if (!canZoomIn.value) return
    zoomIndex.value += 1
    zoomTo(props.zooms[zoomIndex.value], zoomAt)
  }

  const zoomOut = (zoomAt = null) => {
    if (!canZoomOut.value) return
    zoomIndex.value -= 1
    zoomTo(props.zooms[zoomIndex.value], zoomAt)
  }

  const zoomTo = (pzoom, zoomAt = null) => {
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
        ratio = ratio > 1 || ratio
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

  const zoomAt = (zoomAt) => {
    zoomIndex.value = (zoomIndex.value + 1) % props.zooms.length
    zoomTo(props.zooms[zoomIndex.value], zoomAt)
  }
  const canZoomIn = computed(() => !zooming.value && zoomIndex.value < props.zooms.length - 1)

  const canZoomOut = computed(() => !zooming.value && zoomIndex.value > 0)

  const onWheel = (ev, hasTouchEvents) => {
    if (props.wheel === 'scroll' && zoom.value > 1 && !hasTouchEvents.value) {
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
