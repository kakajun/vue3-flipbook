import { ref, reactive, defineEmits, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import useImageLoad from './useImageLoad'
export default function usePageNavigation(
  props,
  emit,
  currentPage,
  displayedPages,
  flip,
  preloadImages
) {
  const { imageWidth, imageHeight, pageUrl, loadImage, pageUrlLoading, onImageLoad, didLoadImage } =
    useImageLoad(props, currentPage)
    const hasPointerEvents = ref(false)
    
  const flipStart = (direction, auto) => {
    if (direction !== props.forwardDirection) {
      if (displayedPages.value === 1) {
        flip.frontImage = pageUrl(currentPage.value - 1)
        flip.backImage = null
      } else {
        flip.frontImage = pageUrl(firstPage.value)
        flip.backImage = pageUrl(currentPage.value - displayedPages.value + 1)
      }
    } else {
      if (displayedPages.value === 1) {
        flip.frontImage = pageUrl(currentPage.value)
        flip.backImage = null
      } else {
        flip.frontImage = pageUrl(secondPage.value)
        flip.backImage = pageUrl(currentPage.value + displayedPages.value)
      }
    }

    flip.direction = direction
    flip.progress = 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (flip.direction !== props.forwardDirection) {
          if (displayedPages.value === 2) {
            firstPage.value = currentPage.value - displayedPages.value
          }
        } else {
          if (displayedPages.value === 1) {
            firstPage.value = currentPage.value + displayedPages.value
          } else {
            secondPage.value = currentPage.value + 1 + displayedPages.value
          }
        }
        if (auto) {
          flipAuto(true)
        }
      })
    })
  }

  const flipAuto = (ease) => {
    const startTime = Date.now()
    const duration = props.flipDuration * (1 - flip.progress)
    const startRatio = flip.progress
    flip.auto = true
    emit(`flip-${flip.direction}-start`, page.value)
    const animate = () => {
      const elapsedTime = Date.now() - startTime
      let ratio = startRatio + elapsedTime / duration
      ratio = ratio > 1 ? 1 : ratio
      flip.progress = ease ? easeInOut(ratio) : ratio
      if (ratio < 1) {
        requestAnimationFrame(animate)
      } else {
        if (flip.direction !== props.forwardDirection) {
          currentPage.value -= displayedPages.value
        } else {
          currentPage.value += displayedPages.value
        }
        emit(`flip-${flip.direction}-end`, page.value)
        if (displayedPages.value === 1 && flip.direction === props.forwardDirection) {
          flip.direction = null
        } else {
          onImageLoad(1, () => {
            flip.direction = null
          })
        }
        flip.auto = false
      }
    }
    animate()
  }

  const flipRevert = () => {
    const t0 = Date.now()
    const duration = props.flipDuration * flip.progress
    const startRatio = flip.progress
    flip.auto = true
    const animate = () => {
      requestAnimationFrame(() => {
        const t = Date.now() - t0
        let ratio = startRatio - (startRatio * t) / duration
        ratio = ratio < 0 ? 0 : ratio
        flip.progress = ratio
        if (ratio > 0) {
          animate()
        } else {
          firstPage.value = currentPage.value
          secondPage.value = currentPage.value + 1
          if (displayedPages.value === 1 && flip.direction !== props.forwardDirection) {
            flip.direction = null
          } else {
            onImageLoad(1, () => {
              flip.direction = null
            })
          }
          flip.auto = false
        }
      })
    }
    animate()
  }

  const dragScroll = (x, y) => {
    scrollLeft.value = startScrollLeft.value - x
    scrollTop.value = startScrollTop.value - y
  }

  const onTouchStart = (ev) => {
    hasTouchEvents.value = true
    swipeStart(ev.changedTouches[0])
  }

  const onTouchMove = (ev) => {
    if (swipeMove(ev.changedTouches[0])) {
      ev.preventDefault()
    }
  }

  const onTouchEnd = (ev) => {
    swipeEnd(ev.changedTouches[0])
  }

  const onPointerDown = (ev) => {
    hasPointerEvents.value = true
    if (hasTouchEvents.value) return
    if (ev.which && ev.which !== 1) return // Ignore right-click
    swipeStart(ev)
    try {
      ev.target.setPointerCapture(ev.pointerId)
    } catch {
      // Handle the error silently
    }
  }

  const onPointerMove = (ev) => {
    if (!hasTouchEvents.value) {
      swipeMove(ev)
    }
  }

  const onPointerUp = (ev) => {
    if (hasTouchEvents.value) return
    swipeEnd(ev)
    try {
      ev.target.releasePointerCapture(ev.pointerId)
    } catch {
      // Handle the error silently
    }
  }

  const onMouseDown = (ev) => {
    if (hasTouchEvents.value || hasPointerEvents.value) return
    if (ev.which && ev.which !== 1) return // Ignore right-click
    swipeStart(ev)
  }

  const onMouseMove = (ev) => {
    if (!hasTouchEvents.value || !hasPointerEvents.value) {
      swipeMove(ev)
    }
  }

  const onMouseUp = (ev) => {
    if (!hasTouchEvents.value || !hasPointerEvents.value) {
      swipeEnd(ev)
    }
  }

  const goToPage = (p) => {
    if (p === null || p === page.value) return

    currentPage.value = props.pages[0] === null && displayedPages.value === 2 && p === 1 ? 0 : p - 1

    minX.value = Infinity
    maxX.value = -Infinity
    currentCenterOffset.value = centerOffset.value
  }

  return {
    flipStart,
    flipAuto,
    flipRevert,
    dragScroll,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    goToPage
  }
}
