<template>
  <div>
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
      class="viewport"
      ref="viewport"
      :class="{
        zoom: zooming || zoom > 1,
        'drag-to-scroll': dragToScroll
      }"
      :style="{ cursor: cursor == 'grabbing' ? 'grabbing' : 'auto' }"
      @touchmove="onTouchMove"
      @pointermove="onPointerMove"
      @mousemove="onMouseMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @mouseup="onMouseUp"
      @wheel="onWheel"
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
            class="page fixed"
            :style="{
              width: pageWidth + 'px',
              height: pageHeight + 'px',
              left: xMargin + 'px',
              top: yMargin + 'px'
            }"
            :src="pageUrlLoading(leftPage, true)"
            v-if="showLeftPage"
            @load="didLoadImage($event)"
          />
          <img
            class="page fixed"
            :style="{
              width: pageWidth + 'px',
              height: pageHeight + 'px',
              left: viewWidth / 2 + 'px',
              top: yMargin + 'px'
            }"
            v-if="showRightPage"
            :src="pageUrlLoading(rightPage, true)"
            @load="didLoadImage($event)"
          />

          <div :style="{ opacity: flip.opacity }">
            <div
              v-for="[key, bgImage, lighting, bgPos, transform, z] in polygonArray"
              class="polygon"
              :key="key"
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
                class="lighting"
                v-show="lighting.length"
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

<script setup>
import Matrix from './matrix'
import spinner from './spinner.svg'
import { ref, reactive, computed, onMounted, onBeforeUnmount,watch } from 'vue'
const easeIn = (x) => Math.pow(x, 2);
const easeOut = (x) => 1 - easeIn(1 - x);
const easeInOut = (x) => {
  if (x < 0.5) {
    return easeIn(x * 2) / 2;
  } else {
    return 0.5 + easeOut((x - 0.5) * 2) / 2;
  }
};

const props = defineProps({

  pages: {
    type: Array,
    required: true
  },
  pagesHiRes: {
    type: Array,
    default: function () {
      return [];
    }
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
    type: Array,
    default: function () {
      return [1, 2, 4];
    }
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
    validator: function (val) {
      return val === 'right' || val === 'left';
    },
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
  })
const viewWidth = ref(0)
const viewHeight = ref(0)
const imageWidth = ref(null)
const imageHeight = ref(null)
const displayedPages = ref(1)
const nImageLoad = ref(0)
const nImageLoadTrigger = ref(0)
const imageLoadCallback = ref(null)
const currentPage = ref(0)
const firstPage = ref(0)
const secondPage = ref(1)
const zoomIndex = ref(0)
const zoom = ref(1)
const zooming = ref(false)
const touchStartX = ref(null)
const touchStartY = ref(null)
const maxMove = ref(0)
const activeCursor = ref(null)
const hasTouchEvents = ref(false)
const hasPointerEvents = ref(false)
const minX = ref(Infinity)
const maxX = ref(-Infinity)
const preloadedImages = ref({})
const flip = reactive({
  progress: 0,
  direction: null,
  frontImage: null,
  backImage: null,
  auto: false,
  opacity: 1
})
const currentCenterOffset = ref(null)
const animatingCenter = ref(false)
const startScrollLeft = ref(0)
const startScrollTop = ref(0)
const scrollLeft = ref(0)
const scrollTop = ref(0)
const loadedImages = ref({})
const IE = computed(() => typeof navigator !== 'undefined' && /Trident/.test(navigator.userAgent))
const canFlipLeft = computed(() => forwardDirection.value === 'left' ? canGoForward.value : canGoBack.value)
const canFlipRight = computed(() => forwardDirection.value === 'right' ? canGoForward.value : canGoBack.value)
const canZoomIn = computed(() => !zooming.value && zoomIndex.value < zooms_.value.length - 1)
const canZoomOut = computed(() => !zooming.value && zoomIndex.value > 0)
const numPages = computed(() => pages.value[0] === null ? pages.value.length - 1 : pages.value.length)
const page = computed(() => pages.value[0] !== null ? currentPage.value + 1 : Math.max(1, currentPage.value))
const zooms_ = computed(() => zooms.value || [1])
const canGoForward = computed(() => !flip.direction && currentPage.value < pages.value.length - displayedPages.value)
const canGoBack = computed(() => !flip.direction && currentPage.value >= displayedPages.value && !(displayedPages.value === 1 && !pageUrl(firstPage.value - 1)))
const leftPage = computed(() => forwardDirection.value === 'right' || displayedPages.value === 1 ? firstPage.value : secondPage.value)
const rightPage = computed(() => forwardDirection.value === 'left' ? firstPage.value : secondPage.value)
const showLeftPage = computed(() => pageUrl(leftPage.value))
const showRightPage = computed(() => pageUrl(rightPage.value) && displayedPages.value === 2)
const cursor = computed(() => activeCursor.value || (IE.value ? 'auto' : (clickToZoom.value && canZoomIn.value ? 'zoom-in' : (clickToZoom.value && canZoomOut.value ? 'zoom-out' : (dragToFlip.value ? 'grab' : 'auto')))))
const pageScale = computed(() => {
  const vw = viewWidth.value / displayedPages.value
  const xScale = vw / imageWidth.value
  const yScale = viewHeight.value / imageHeight.value
  const scale = xScale < yScale ? xScale : yScale
  return scale < 1 ? scale : 1
})

const pageWidth = computed(() => Math.round(imageWidth.value * pageScale.value))
const pageHeight = computed(() => Math.round(imageHeight.value * pageScale.value))
const xMargin = computed(() => (viewWidth.value - pageWidth.value * displayedPages.value) / 2)
const yMargin = computed(() => (viewHeight.value - pageHeight.value) / 2)
const polygonWidth = computed(() => {
  let w = pageWidth.value / nPolygons.value
  w = Math.ceil(w + 1 / zoom.value)
  return w + 'px'
})

const polygonHeight = computed(() => pageHeight.value + 'px')
const polygonBgSize = computed(() => `${pageWidth.value}px ${pageHeight.value}px`)
const polygonArray = computed(() => makePolygonArray('front').value.concat(makePolygonArray('back').value))

onMounted(() => {
  window.addEventListener('resize', onResize, { passive: true })
  onResize()
  zoom.value = zooms_[0]
  goToPage(startPage.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize, { passive: true })
})

const viewport = ref(null)

const onResize = () => {
  if (!viewport.value) return
  viewWidth.value = viewport.value.clientWidth
  viewHeight.value = viewport.value.clientHeight
  displayedPages.value = viewWidth.value > viewHeight.value && !singlePage.value ? 2 : 1
  if (displayedPages.value === 2) {
    currentPage.value &= ~1
  }
  fixFirstPage()
  minX.value = Infinity
  maxX.value = -Infinity
}

const fixFirstPage = () => {
  if (
    displayedPages.value === 1 &&
    currentPage.value === 0 &&
    pages.value.length &&
    !pageUrl(0)
  ) {
    currentPage.value++
  }
}

const pageUrl = (page, hiRes = false) => {
  if (hiRes && zoom.value > 1 && !zooming.value) {
    const url = pagesHiRes.value[page]
    return url ? url : null
  }
  return pages.value[page] || null
}

const pageUrlLoading = (page, hiRes = false) => {
  const url = pageUrl(page, hiRes)
  if (hiRes && zoom.value > 1 && !zooming.value) {
    return url
  }
  return url && loadImage(url)
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

const makePolygonArray = (face) => {
  if (!flip.direction.value) return []

  let progress = flip.progress.value
  let direction = flip.direction.value

  if (displayedPages.value === 1 && direction !== forwardDirection.value) {
    progress = 1 - progress
    direction = forwardDirection.value
  }

  flip.opacity.value = (displayedPages.value === 1 && progress > 0.7) ? 1 - (progress - 0.7) / 0.3 : 1

  let image = (face === 'front') ? flip.frontImage.value : flip.backImage.value

  const polygonWidth = pageWidth.value / nPolygons.value

  let pageX = xMargin.value
  let originRight = false
  if (displayedPages.value === 1) {
    if (forwardDirection.value === 'right') {
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
  }
  if (displayedPages.value === 2) {
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

  const pageMatrix = new Matrix()
  pageMatrix.translate(viewWidth.value / 2)
  pageMatrix.perspective(perspective.value)
  pageMatrix.translate(-viewWidth.value / 2)
  pageMatrix.translate(pageX, yMargin.value)

  let pageRotation = 0
  if (progress > 0.5) {
    pageRotation = -(progress - 0.5) * 2 * 180
  }
  if (direction === 'left') {
    pageRotation = -pageRotation
  }
  if (face === 'back') {
    pageRotation += 180
  }

  if (pageRotation) {
    if (originRight) {
      pageMatrix.translate(pageWidth.value)
    }
    pageMatrix.rotateY(pageRotation)
    if (originRight) {
      pageMatrix.translate(-pageWidth.value)
    }
  }

  let theta
  if (progress < 0.5)
    theta = progress * 2 * Math.PI
  else
    theta = (1 - (progress - 0.5) * 2) * Math.PI
  if (theta == 0)
    theta = 1e-9

  const radius = pageWidth.value / theta

  let radian = 0
  let dRadian = theta / nPolygons.value
  let rotate = (dRadian / 2 / Math.PI) * 180
  let dRotate = (dRadian / Math.PI) * 180

  if (originRight) {
    rotate = -theta / Math.PI * 180 + dRotate / 2
  }

  if (face === 'back') {
    rotate = -rotate
    dRotate = -dRotate
  }

  minX.value = Infinity
  maxX.value = -Infinity
  const polygonArray = []
  for (let i = 0; i < nPolygons.value; i++) {
    const bgPos = `${(i / (nPolygons.value - 1)) * 100}% 0px`

    const m = pageMatrix.clone()
    const rad = originRight ? theta - radian : radian
    let x = Math.sin(rad) * radius
    if (originRight) {
      x = pageWidth.value - x
    }
    let z = (1 - Math.cos(rad)) * radius
    if (face === 'back') {
      z = -z
    }

    m.translate3d(x, 0, z)
    m.rotateY(-rotate)

    const x0 = m.transformX(0)
    const x1 = m.transformX(polygonWidth.value)
    maxX.value = Math.max(Math.max(x0, x1), maxX.value)
    minX.value = Math.min(Math.min(x0, x1), minX.value)

    const lighting = computeLighting(pageRotation - rotate, dRotate)

    radian += dRadian
    rotate += dRotate
    polygonArray.push([`${face}${i}`, image, lighting, bgPos, m.toString(), Math.abs(Math.round(z))])
  }

  return polygonArray

}

const computeLighting = (rot, dRotate) => {
  const gradients = []
  const lightingPoints = [-0.5, -0.25, 0, 0.25, 0.5]
  if (ambient.value < 1) {
    const blackness = 1 - ambient.value
    const diffuse = lightingPoints.map(d => (1 - Math.cos((rot - dRotate * d) / 180 * Math.PI)) * blackness)
    gradients.push(
      `linear-gradient(to right, rgba(0, 0, 0, ${diffuse[0]}), rgba(0, 0, 0, ${diffuse[1]}) 25%, rgba(0, 0, 0, ${diffuse[2]}) 50%, rgba(0, 0, 0, ${diffuse[3]}) 75%, rgba(0, 0, 0, ${diffuse[4]}))`
    )
  }

  if (gloss.value > 0 && !IE.value) {
    const DEG = 30
    const POW = 200
    const specular = lightingPoints.map(d =>
      Math.max(
        Math.cos((rot + DEG - dRotate * d) / 180 * Math.PI) ** POW,
        Math.cos((rot - DEG - dRotate * d) / 180 * Math.PI) ** POW
      )
    )
    gradients.push(
      `linear-gradient(to right, rgba(255, 255, 255, ${specular[0] * gloss.value}), rgba(255, 255, 255, ${specular[1] * gloss.value}) 25%, rgba(255, 255, 255, ${specular[2] * gloss.value}) 50%, rgba(255, 255, 255, ${specular[3] * gloss.value}) 75%, rgba(255, 255, 255, ${specular[4] * gloss.value}))`
    )
  }

  return gradients.join(',')
}

const flipStart = (direction, auto) => {
  if (direction !== forwardDirection.value) {
    if (displayedPages.value === 1) {
      flip.frontImage.value = pageUrl(currentPage.value - 1)
      flip.backImage.value = null
    } else {
      flip.frontImage.value = pageUrl(firstPage.value)
      flip.backImage.value = pageUrl(currentPage.value - displayedPages.value + 1)
    }
  } else {
    if (displayedPages.value === 1) {
      flip.frontImage.value = pageUrl(currentPage.value)
      flip.backImage.value = null
    } else {
      flip.frontImage.value = pageUrl(secondPage.value)
      flip.backImage.value = pageUrl(currentPage.value + displayedPages.value)
    }
  }

  flip.direction.value = direction
  flip.progress.value = 0
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (flip.direction.value !== forwardDirection.value) {
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
  const t0 = Date.now()
  const duration = flipDuration.value * (1 - flip.progress.value)
  const startRatio = flip.progress.value
  flip.auto.value = true
  emit(`flip-${flip.direction.value}-start`, page.value)
  const animate = () => {
    requestAnimationFrame(() => {
      const t = Date.now() - t0
      let ratio = startRatio + t / duration
      ratio = ratio > 1 ? 1 : ratio
      flip.progress.value = ease ? easeInOut(ratio) : ratio
      if (ratio < 1) {
        animate()
      } else {
        if (flip.direction.value !== forwardDirection.value) {
          currentPage.value -= displayedPages.value
        } else {
          currentPage.value += displayedPages.value
        }
        emit(`flip-${flip.direction.value}-end`, page.value)
        if (displayedPages.value === 1 && flip.direction.value === forwardDirection.value) {
          flip.direction.value = null
        } else {
          onImageLoad(1, () => {
            flip.direction.value = null
          })
        }
        flip.auto.value = false
      }
    })
  }
  animate()
}


const flipRevert = () => {
  const t0 = Date.now()
  const duration = flipDuration.value * flip.progress.value
  const startRatio = flip.progress.value
  flip.auto.value = true
  const animate = () => {
    requestAnimationFrame(() => {
      const t = Date.now() - t0
      let ratio = startRatio - startRatio * t / duration
      ratio = ratio < 0 ? 0 : ratio
      flip.progress.value = ratio
      if (ratio > 0) {
        animate()
      } else {
        firstPage.value = currentPage.value
        secondPage.value = currentPage.value + 1
        if (displayedPages.value === 1 && flip.direction.value !== forwardDirection.value) {
          flip.direction.value = null
        } else {
          onImageLoad(1, () => {
            flip.direction.value = null
          })
        }
        flip.auto.value = false
      }
    })
  }
  animate()
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

const zoomIn = (zoomAt = null) => {
  if (!canZoomIn.value) return
  zoomIndex.value += 1
  zoomTo(zooms_[zoomIndex.value], zoomAt)
}

const zoomOut = (zoomAt = null) => {
  if (!canZoomOut.value) return
  zoomIndex.value -= 1
  zoomTo(zooms_[zoomIndex.value], zoomAt)
}

const zoomTo = (zoom, zoomAt = null) => {
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
  const end = zoom
  const startX = viewport.scrollLeft
  const startY = viewport.scrollTop
  const containerFixedX = fixedX + startX
  const containerFixedY = fixedY + startY
  const endX = (containerFixedX / start) * end - fixedX
  const endY = (containerFixedY / start) * end - fixedY

  const t0 = Date.now()
  zooming.value = true
  emit('zoom-start', zoom)
  const animate = () => {
    requestAnimationFrame(() => {
      const t = Date.now() - t0
      let ratio = t / zoomDuration.value
      ratio = ratio > 1 || IE.value ? 1 : ratio
      ratio = easeInOut(ratio)
      zoom.value = start + (end - start) * ratio
      scrollLeft.value = startX + (endX - startX) * ratio
      scrollTop.value = startY + (endY - startY) * ratio
      if (t < zoomDuration.value) {
        animate()
      } else {
        emit('zoom-end', zoom)
        zooming.value = false
        zoom.value = zoom
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
  zoomIndex.value = (zoomIndex.value + 1) % zooms_.length
  zoomTo(zooms_[zoomIndex.value], zoomAt)
}

const swipeMove = (touch) => {
  if (!touchStartX.value) return
  const x = touch.pageX - touchStartX.value
  const y = touch.pageY - touchStartY.value
  maxMove.value = Math.max(maxMove.value, Math.abs(x))
  maxMove.value = Math.max(maxMove.value, Math.abs(y))
  if (zoom.value > 1) {
    dragScroll(x, y)
    return
  }
  if (!dragToFlip.value) return
  if (Math.abs(y) > Math.abs(x)) return
  activeCursor.value = 'grabbing'
  if (x > 0) {
    if (flip.direction.value === null && canFlipLeft.value && x >= swipeMin.value) {
      flipStart('left', false)
    }
    if (flip.direction.value === 'left') {
      flip.progress.value = x / pageWidth.value
      if (flip.progress.value > 1) {
        flip.progress.value = 1
      }
    }
  } else {
    if (flip.direction.value === null && canFlipRight.value && x <= -swipeMin.value) {
      flipStart('right', false)
    }
    if (flip.direction.value === 'right') {
      flip.progress.value = -x / pageWidth.value
      if (flip.progress.value > 1) {
        flip.progress.value = 1
      }
    }
  }
  return true
}

const swipeEnd = (touch) => {
  if (!touchStartX.value) return
  if (clickToZoom.value && maxMove.value < swipeMin.value) {
    zoomAt(touch)
  }
  if (flip.direction.value !== null && !flip.auto.value) {
    if (flip.progress.value > 1 / 4) {
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
  } catch { }
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
  } catch { }
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

const dragScroll = (x, y) => {
  scrollLeft.value = startScrollLeft.value - x
  scrollTop.value = startScrollTop.value - y
}

const onWheel = (ev) => {
  if (wheel.value === 'scroll' && zoom.value > 1 && dragToScroll.value) {
    scrollLeft.value = refViewport.value.scrollLeft + ev.deltaX
    scrollTop.value = refViewport.value.scrollTop + ev.deltaY
    if (ev.cancelable) {
      ev.preventDefault()
    }
  }

  if (wheel.value === 'zoom') {
    if (ev.deltaY >= 100) {
      zoomOut(ev)
      ev.preventDefault()
    } else if (ev.deltaY <= -100) {
      zoomIn(ev)
      ev.preventDefault()
    }
  }
}

const preloadImages = (hiRes = false) => {
  for (let i = currentPage.value - 3; i <= currentPage.value + 3; i++) {
    pageUrlLoading(i) // this preloads image
  }
  if (hiRes) {
    for (let i = currentPage.value; i < currentPage.value + displayedPages.value; i++) {
      const src = pagesHiRes.value[i]
      if (src) {
        new Image().src = src
      }
    }
  }
}

const goToPage = (p) => {
  if (p === null || p === page.value) return
  if (pages.value[0] === null) {
    if (displayedPages.value === 2 && p === 1) {
      currentPage.value = 0
    } else {
      currentPage.value = p
    }
  } else {
    currentPage.value = p - 1
  }
  minX.value = Infinity
  maxX.value = -Infinity
  currentCenterOffset.value = centerOffset.value
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
      return loadingImage.value
    }
  }
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

watch(scrollLeftLimited, (val) => {
  if (IE.value) {
    requestAnimationFrame(() => {
      refViewport.value.scrollLeft = val
    })
  } else {
    refViewport.value.scrollLeft = val
  }
})

watch(scrollTopLimited, (val) => {
  if (IE.value) {
    requestAnimationFrame(() => {
      refViewport.value.scrollTop = val
    })
  } else {
    refViewport.value.scrollTop = val
  }
})

watch(pages, (after, before) => {
  fixFirstPage()
  if (!before?.length && after?.length) {
    if (startPage.value > 1 && after[0] == null) {
      currentPage.value++
    }
  }
})

watch(startPage, (p) => {
  goToPage(p)
})
</script>

<style scoped>
.viewport {
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
</style>
