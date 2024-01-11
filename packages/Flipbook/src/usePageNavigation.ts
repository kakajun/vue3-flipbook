import { ref, computed, Ref, ComputedRef } from 'vue'
import useImageLoad from './useImageLoad.js'
import { easeInOut } from './utils.js'
import type { emitEvents } from './index-types'
import type { FlipProps } from './flipProps.ts'
interface UsePageNavigation {
  page: Ref<number>
  canFlipLeft: ComputedRef<boolean>
  canFlipRight: ComputedRef<boolean>
  flipStart: void
  flipAuto: void
  flipRevert: void
}

export default function usePageNavigation(
  props: FlipProps,
  emit: emitEvents,
  currentPage,
  displayedPages,
  flip,
  firstPage,
  secondPage
): UsePageNavigation {
  const { pageUrl, onImageLoad } = useImageLoad(props, currentPage)

  const page = computed(() => {
    return props.pages[0] !== null ? currentPage.value + 1 : Math.max(1, currentPage.value)
  })

  const canGoForward = computed(
    () => !flip.direction && currentPage.value < props.pages.length - displayedPages.value
  )

  const canGoBack = computed(
    () =>
      !flip.direction &&
      currentPage.value >= displayedPages.value &&
      !(displayedPages.value === 1 && !pageUrl(firstPage.value - 1))
  )

  const canFlipLeft = computed(() => {
    return props.forwardDirection === 'left' ? canGoForward.value : canGoBack.value
  })

  const canFlipRight = computed(() => {
    return props.forwardDirection === 'right' ? canGoForward.value : canGoBack.value
  })

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
  return {
    flipStart,
    flipAuto,
    flipRevert,
    canFlipLeft,
    canFlipRight,
    page
  }
}
