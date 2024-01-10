<template>
  <div class="vue3-flipbook">
    <slot
      v-bind="{
        canFlipLeft,
        canFlipRight,
        canZoomIn,
        canZoomOut,
        page,
        numPages,
        flipLeft,
        flipRight,
        zoomIn,
        zoomOut
      }"
    />
    <div
      ref="refViewport"
      class="viewport"
      :class="viewportClass"
      :style="viewportStyle"
      @touchmove="onTouchMove"
      @pointermove="onPointerMove"
      @mousemove="onMouseMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @mouseup="onMouseUp"
      @wheel="onWheel($event, hasTouchEvents)"
    >
      <div class="flipbook-container" :style="{ transform: `scale(${zoom})` }">
        <div
          class="click-to-flip left"
          :style="{ cursor: canFlipLeft ? 'pointer' : 'auto' }"
          @click="flipLeft"
        />
        <div
          class="click-to-flip right"
          :style="{ cursor: canFlipRight ? 'pointer' : 'auto' }"
          @click="flipRight"
        />
        <div :style="{ transform: `translateX(${centerOffsetSmoothed}px)` }">
          <img
            v-if="showLeftPage"
            class="page fixed"
            :style="{
              width: pageWidth + 'px',
              height: pageHeight + 'px',
              left: xMargin + 'px',
              top: yMargin + 'px'
            }"
            :src="pageUrlLoading(leftPage, true)"
            @load="didLoadImage($event)"
          />
          <img
            v-if="showRightPage"
            class="page fixed"
            :style="{
              width: pageWidth + 'px',
              height: pageHeight + 'px',
              left: viewWidth / 2 + 'px',
              top: yMargin + 'px'
            }"
            :src="pageUrlLoading(rightPage, true)"
            @load="didLoadImage($event)"
          />

          <div :style="{ opacity: flip.opacity }">
            <div
              v-for="[key, bgImage, lighting, bgPos, transform, z] in polygonArray"
              :key="key"
              class="polygon"
              :class="{ blank: !bgImage }"
              :style="{
                backgroundImage: bgImage && `url(${loadImage(bgImage)})`,
                backgroundSize: polygonBgSize,
                backgroundPosition: bgPos,
                width: polygonWidth,
                height: polygonHeight,
                transform: transform,
                zIndex: z
              }"
            >
              <div
                v-show="lighting.length"
                class="lighting"
                :style="{ backgroundImage: lighting }"
              />
            </div>
          </div>
          <div
            class="bounding-box"
            :style="{
              left: boundingLeft + 'px',
              top: yMargin + 'px',
              width: boundingRight - boundingLeft + 'px',
              height: pageHeight + 'px',
              cursor: cursor
            }"
            @touchstart="onTouchStart"
            @pointerdown="onPointerDown"
            @mousedown="onMouseDown"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Matrix from './matrix'
import spinner from './spinner.svg'
import { calculatePageRotation, easeInOut } from './utils.js'
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import useZoom from './useZoom'
import useImageLoad from './useImageLoad'
import flipbookprops from './props'
const emit = defineEmits<{
  'flip-left-start': [value: string]
  'flip-left-end': [value: string]
  'flip-right-start': [value: string]
  'flip-right-end': [value: string]
  'zoom-start': [value: string]
  'zoom-end': [value: string]
}>()

const props = defineProps(flipbookprops)
const viewWidth = ref<number>(0)
const viewHeight = ref<number>(0)
const displayedPages = ref<number>(1)
const currentPage = ref<number>(0)
const firstPage = ref<number>(0)
const secondPage = ref<number>(1)
const touchStartX = ref<number | null>(null)
const touchStartY = ref<number | null>(null)
const maxMove = ref<number>(0)
const activeCursor = ref<string | null>(null)
const hasTouchEvents = ref<boolean>(false)
const hasPointerEvents = ref<boolean>(false)
const minX = ref<number>(Infinity)
const maxX = ref<number>(-Infinity)
const refViewport = ref<HTMLElement | null>(null)
const flip = reactive({
  progress: 0,
  direction: null,
  frontImage: null,
  backImage: null,
  auto: false,
  opacity: 1
})

const currentCenterOffset = ref<number | null>(null)
const animatingCenter = ref<boolean>(false)
const startScrollLeft = ref<number>(0)
const startScrollTop = ref<number>(0)

const preloadImages = (hiRes: boolean = false) => {
  for (let i = currentPage.value - 3; i <= currentPage.value + 3; i++) {
    pageUrlLoading(i) // this preloads image
  }
  if (hiRes) {
    for (let i = currentPage.value; i < currentPage.value + displayedPages.value; i++) {
      const src = props.pagesHiRes[i]
      if (src && typeof src === 'string') {
        new Image().src = src
      }
    }
  }
}
const {
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
} = useZoom(props, emit, refViewport, preloadImages)
const { imageWidth, imageHeight, pageUrl, loadImage, pageUrlLoading, onImageLoad, didLoadImage } =
  useImageLoad(props, preloadImages)

const viewportClass = computed(() => ({
  zoom: zooming.value || zoom.value > 1,
  'drag-to-scroll': !hasTouchEvents.value
}))

const viewportStyle = computed(() => ({
  cursor: cursor.value == 'grabbing' ? 'grabbing' : 'auto'
}))

const canFlipLeft = computed(() => {
  return props.forwardDirection === 'left' ? canGoForward.value : canGoBack.value
})

const canFlipRight = computed(() => {
  return props.forwardDirection === 'right' ? canGoForward.value : canGoBack.value
})

const numPages = computed(() => {
  return props.pages[0] === null ? props.pages.length - 1 : props.pages.length
})

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

const leftPage = computed(() => {
  return props.forwardDirection === 'right' || displayedPages.value === 1
    ? firstPage.value
    : secondPage.value
})

const rightPage = computed(() => {
  return props.forwardDirection === 'right' || displayedPages.value === 1
    ? secondPage.value
    : firstPage.value
})

const showLeftPage = computed(() => pageUrl(leftPage.value))

const showRightPage = computed(() => pageUrl(rightPage.value) && displayedPages.value === 2)

const cursor = computed(() => {
  if (activeCursor.value) {
    return activeCursor.value
  } else if (props.clickToZoom && canZoomIn.value) {
    return 'zoom-in'
  } else if (props.clickToZoom && canZoomOut.value) {
    return 'zoom-out'
  } else if (props.dragToFlip) {
    return 'grab'
  } else {
    return 'auto'
  }
})

const xMargin = computed(() => (viewWidth.value - pageWidth.value * displayedPages.value) / 2)
const yMargin = computed(() => (viewHeight.value - pageHeight.value) / 2)

const polygonWidth = computed(() => {
  let w = pageWidth.value / props.nPolygons
  w = Math.ceil(w + 1 / zoom.value)
  return w + 'px'
})

const polygonHeight = computed(() => pageHeight.value + 'px')

const polygonBgSize = computed(() => `${pageWidth.value}px ${pageHeight.value}px`)

const polygonArray = computed(() => makePolygonArray('front').concat(makePolygonArray('back')))
const boundingLeft = computed(() => {
  if (displayedPages.value === 1) {
    return xMargin.value
  } else {
    let x
    if (pageUrl(leftPage.value)) {
      x = xMargin.value
    } else {
      x = viewWidth.value / 2
    }
    if (x < minX.value) {
      return x
    } else {
      return minX.value
    }
  }
})

const boundingRight = computed(() => {
  if (displayedPages.value === 1) {
    return viewWidth.value - xMargin.value
  } else {
    let x = pageUrl(rightPage.value) ? viewWidth.value - xMargin.value : viewWidth.value / 2
    return x > maxX.value ? x : maxX.value
  }
})

const centerOffset = computed(() => {
  let retval = props.centering
    ? Math.round(viewWidth.value / 2 - (boundingLeft.value + boundingRight.value) / 2)
    : 0
  if (currentCenterOffset.value === null && imageWidth.value !== null) {
    currentCenterOffset.value = retval
  }
  return retval
})

const centerOffsetSmoothed = computed(() => Math.round(currentCenterOffset.value))

const scrollLeftMin = computed(() => {
  let w = (boundingRight.value - boundingLeft.value) * zoom.value
  if (w < viewWidth.value) {
    return (
      (boundingLeft.value + centerOffsetSmoothed.value) * zoom.value - (viewWidth.value - w) / 2
    )
  } else {
    return (boundingLeft.value + centerOffsetSmoothed.value) * zoom.value
  }
})

const scrollLeftMax = computed(() => {
  let w = (boundingRight.value - boundingLeft.value) * zoom.value
  if (w < viewWidth.value) {
    return (
      (boundingLeft.value + centerOffsetSmoothed.value) * zoom.value - (viewWidth.value - w) / 2
    )
  } else {
    return (boundingRight.value + centerOffsetSmoothed.value) * zoom.value - viewWidth.value
  }
})
const scrollTopMin = computed(() => {
  let h = pageHeight.value * zoom.value
  if (h < viewHeight.value) {
    return yMargin.value * zoom.value - (viewHeight.value - h) / 2
  } else {
    return yMargin.value * zoom.value
  }
})

const scrollTopMax = computed(() => {
  let h = pageHeight.value * zoom.value
  if (h < viewHeight.value) {
    return yMargin.value * zoom.value - (viewHeight.value - h) / 2
  } else {
    return (yMargin.value + pageHeight.value) * zoom.value - viewHeight.value
  }
})

onMounted(() => {
  window.addEventListener('resize', onResize, {
    passive: true
  })
  onResize()
  zoom.value = props.zooms[0]
  goToPage(props.startPage)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize, {
    passive: true
  })
})

const pageScale = computed(() => {
  const vw = viewWidth.value / displayedPages.value
  const xScale = vw / imageWidth.value
  const yScale = viewHeight.value / imageHeight.value
  const scale = xScale < yScale ? xScale : yScale
  if (scale < 1) {
    return scale
  } else {
    return 1
  }
})

const pageWidth = computed(() => Math.round(imageWidth.value * pageScale.value))

const pageHeight = computed(() => Math.round(imageHeight.value * pageScale.value))

const onResize = () => {
  const viewport = refViewport.value
  if (!viewport) return
  viewWidth.value = viewport.clientWidth
  viewHeight.value = viewport.clientHeight
  displayedPages.value = viewWidth.value > viewHeight.value && !props.singlePage ? 2 : 1
  if (displayedPages.value === 2) {
    currentPage.value &= ~1
  }
  fixFirstPage()
  minX.value = Infinity
  maxX.value = -Infinity
}

const fixFirstPage = () => {
  if (displayedPages.value === 1 && currentPage.value === 0 && props.pages.length && !pageUrl(0)) {
    currentPage.value++
  }
}

const flipLeft = () => {
  if (canFlipLeft.value) {
    flipStart('left', true)
  }
}

const flipRight = () => {
  if (canFlipRight.value) {
    flipStart('right', true)
  }
}

// 计算页面X坐标和原点位置
const calculatePageXAndOrigin = (face, direction) => {
  let pageX = xMargin.value
  let originRight = false
  if (displayedPages.value === 1) {
    if (props.forwardDirection === 'right') {
      if (face === 'back') {
        originRight = true
        pageX = xMargin.value - pageWidth.value
      }
    } else {
      if (direction === 'left') {
        if (face === 'back') {
          pageX = pageWidth.value - xMargin.value
        } else {
          originRight = true
        }
      } else {
        if (face === 'front') {
          pageX = pageWidth.value - xMargin.value
        } else {
          originRight = true
        }
      }
    }
  } else {
    if (direction === 'left') {
      if (face === 'back') {
        pageX = viewWidth.value / 2
      } else {
        originRight = true
      }
    } else {
      if (face === 'front') {
        pageX = viewWidth.value / 2
      } else {
        originRight = true
      }
    }
  }
  return {
    pageX,
    originRight
  }
}

// 计算页面矩阵
const calculatePageMatrix = (pageX, originRight, pageRotation) => {
  const pageMatrix = new Matrix()
  pageMatrix.translate(viewWidth.value / 2)
  pageMatrix.perspective(props.perspective)
  pageMatrix.translate(-viewWidth.value / 2)
  pageMatrix.translate(pageX, yMargin.value)

  if (pageRotation) {
    if (originRight) {
      pageMatrix.translate(pageWidth.value)
    }
    pageMatrix.rotateY(pageRotation)
    if (originRight) {
      pageMatrix.translate(-pageWidth.value)
    }
  }

  return pageMatrix
}

const calculateThetaAndRadius = (progress) => {
  let theta
  if (progress < 0.5) theta = progress * 2 * Math.PI
  else theta = (1 - (progress - 0.5) * 2) * Math.PI
  if (theta == 0) theta = 1e-9

  const radius = pageWidth.value / theta

  return {
    theta,
    radius
  }
}

const calculateXAndZ = (rad, radius, originRight, face) => {
  let x = Math.sin(rad) * radius
  if (originRight) {
    x = pageWidth.value - x
  }
  let z = (1 - Math.cos(rad)) * radius
  if (face === 'back') {
    z = -z
  }

  return { x, z }
}

const makePolygonArray = (face) => {
  if (!flip.direction) return []

  let progress = flip.progress
  let direction = flip.direction

  if (displayedPages.value === 1 && direction !== props.forwardDirection) {
    progress = 1 - progress
    direction = props.forwardDirection
  }

  flip.opacity = displayedPages.value === 1 && progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1

  let image = face === 'front' ? flip.frontImage : flip.backImage
  const polyWidth = pageWidth.value / props.nPolygons
  const { pageX, originRight } = calculatePageXAndOrigin(face, direction)
  const pageRotation = calculatePageRotation(progress, direction, face)
  const pageMatrix = calculatePageMatrix(pageX, originRight, pageRotation)
  const { theta, radius } = calculateThetaAndRadius(progress)

  let radian = 0
  let dRadian = theta / props.nPolygons
  let rotate = originRight
    ? (-theta / Math.PI) * 180 + (dRadian / 2 / Math.PI) * 180
    : (dRadian / 2 / Math.PI) * 180

  let dRotate = (dRadian / Math.PI) * 180
  if (face === 'back') {
    rotate = -rotate
    dRotate = -dRotate
  }

  minX.value = Infinity
  maxX.value = -Infinity
  const polygonArray = []
  const xValues = []
  for (let i = 0; i < props.nPolygons; i++) {
    const bgPos = `${(i / (props.nPolygons - 1)) * 100}% 0px`
    const transformMatrix = pageMatrix.clone()
    const rad = originRight ? theta - radian : radian
    const { x, z } = calculateXAndZ(rad, radius, originRight, face)
    transformMatrix.translate3d(x, 0, z)
    transformMatrix.rotateY(-rotate)

    const x0 = transformMatrix.transformX(0)
    const x1 = transformMatrix.transformX(polyWidth)
    xValues.push(x0, x1)
    const lighting = computeLighting(pageRotation - rotate, dRotate)
    radian += dRadian
    rotate += dRotate
    polygonArray.push([
      `${face}${i}`,
      image,
      lighting,
      bgPos,
      transformMatrix.toString(),
      Math.abs(Math.round(z))
    ])
  }
  maxX.value = Math.max(...xValues)
  minX.value = Math.min(...xValues)
  return polygonArray
}

const computeLighting = (rot, dRotate) => {
  const gradients = []
  const lightingPoints = [-0.5, -0.25, 0, 0.25, 0.5]
  if (props.ambient < 1) {
    const blackness = 1 - props.ambient
    const diffuse = lightingPoints.map(
      (d) => (1 - Math.cos(((rot - dRotate * d) / 180) * Math.PI)) * blackness
    )
    gradients.push(
      `linear-gradient(to right, rgba(0, 0, 0, ${diffuse[0]}), rgba(0, 0, 0, ${diffuse[1]}) 25%, rgba(0, 0, 0, ${diffuse[2]}) 50%, rgba(0, 0, 0, ${diffuse[3]}) 75%, rgba(0, 0, 0, ${diffuse[4]}))`
    )
  }

  if (props.gloss > 0) {
    const DEG = 30
    const POW = 200
    const specular = lightingPoints.map((d) =>
      Math.max(
        Math.cos(((rot + DEG - dRotate * d) / 180) * Math.PI) ** POW,
        Math.cos(((rot - DEG - dRotate * d) / 180) * Math.PI) ** POW
      )
    )
    gradients.push(
      `linear-gradient(to right, rgba(255, 255, 255, ${
        specular[0] * props.gloss
      }), rgba(255, 255, 255, ${specular[1] * props.gloss}) 25%, rgba(255, 255, 255, ${
        specular[2] * props.gloss
      }) 50%, rgba(255, 255, 255, ${specular[3] * props.gloss}) 75%, rgba(255, 255, 255, ${
        specular[4] * props.gloss
      }))`
    )
  }

  return gradients.join(',')
}

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

const scrollLeftLimited = computed(() => {
  return Math.min(scrollLeftMax.value, Math.max(scrollLeftMin.value, scrollLeft.value))
})

const scrollTopLimited = computed(() => {
  return Math.min(scrollTopMax.value, Math.max(scrollTopMin.value, scrollTop.value))
})

watch(scrollLeftLimited, (val) => {
  refViewport.value.scrollLeft = val
})

watch(scrollTopLimited, (val) => {
  refViewport.value.scrollTop = val
})

const swipeStart = (touch) => {
  touchStartX.value = touch.pageX
  touchStartY.value = touch.pageY
  maxMove.value = 0
  if (zoom.value <= 1) {
    if (props.dragToFlip) {
      activeCursor.value = 'grab'
    }
  } else {
    startScrollLeft.value = refViewport.value.scrollLeft
    startScrollTop.value = refViewport.value.scrollTop
    activeCursor.value = 'all-scroll'
  }
}

const swipeMove = (touch) => {
  if (!touchStartX.value) return
  const x = touch.pageX - touchStartX.value
  const y = touch.pageY - touchStartY.value
  maxMove.value = Math.max(maxMove.value, Math.abs(x), Math.abs(y))
  if (zoom.value > 1) {
    dragScroll(x, y)
    return
  }
  if (!props.dragToFlip || Math.abs(y) > Math.abs(x)) return
  activeCursor.value = 'grabbing'
  const direction = x > 0 ? 'left' : 'right'
  const canFlip = x > 0 ? canFlipLeft.value : canFlipRight.value
  const swipeMin = x > 0 ? props.swipeMin : -props.swipeMin
  if (flip.direction === null && canFlip && x >= swipeMin) {
    flipStart(direction, false)
  }
  if (flip.direction === direction) {
    flip.progress = Math.abs(x) / pageWidth.value
    if (flip.progress > 1) {
      flip.progress = 1
    }
  }
  return true
}

const swipeEnd = (touch) => {
  if (!touchStartX.value) return
  if (props.clickToZoom && maxMove.value < props.swipeMin) {
    zoomAt(touch)
  }
  if (flip.direction !== null && !flip.auto) {
    if (flip.progress > 1 / 4) {
      flipAuto(false)
    } else {
      flipRevert()
    }
  }
  touchStartX.value = null
  activeCursor.value = null
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

watch(currentPage, () => {
  firstPage.value = currentPage.value
  secondPage.value = currentPage.value + 1
  preloadImages()
})

watch(centerOffset, () => {
  if (animatingCenter.value) return
  const animate = () => {
    requestAnimationFrame(() => {
      const rate = 0.1
      const diff = centerOffset.value - currentCenterOffset.value
      if (Math.abs(diff) < 0.5) {
        currentCenterOffset.value = centerOffset.value
        animatingCenter.value = false
      } else {
        currentCenterOffset.value += diff * rate
        animate()
      }
    })
  }
  animatingCenter.value = true
  animate()
})

watch(props.pages, (after, before) => {
  fixFirstPage()
  if (!before?.length && after?.length) {
    if (props.startPage > 1 && after[0] == null) {
      currentPage.value++
    }
  }
})

watch(props.startPage, (p) => {
  goToPage(p)
})
</script>

<style lang="scss">
.vue3-flipbook {
  .viewport {
    left: 0;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
  }

  .viewport.zoom {
    overflow: scroll;
  }

  .viewport.zoom.drag-to-scroll {
    overflow: hidden;
  }

  .flipbook-container {
    position: relative;
    width: 100%;
    height: 100%;
    transform-origin: top left;
    user-select: none;
  }

  .click-to-flip {
    position: absolute;
    width: 50%;
    height: 100%;
    top: 0;
    user-select: none;
  }

  .click-to-flip.left {
    left: 0;
  }

  .click-to-flip.right {
    right: 0;
  }

  .bounding-box {
    position: absolute;
    user-select: none;
  }

  .page {
    position: absolute;
    backface-visibility: hidden;
  }

  .polygon {
    position: absolute;
    top: 0;
    left: 0;
    background-repeat: no-repeat;
    backface-visibility: hidden;
    transform-origin: center left;
  }

  .polygon.blank {
    background-color: #ddd;
  }

  .polygon .lighting {
    width: 100%;
    height: 100%;
  }
}
</style>