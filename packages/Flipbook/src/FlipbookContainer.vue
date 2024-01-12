<template>
  <div
    ref="refViewport"
    class="viewport"
    :class="props.viewportClass"
    :style="props.viewportStyle"
    @touchmove="$emit('touchmove')"
    @pointermove="$emit('pointermove')"
    @mousemove="$emit('mousemove')"
    @touchend="$emit('touchend')"
    @touchcancel="$emit('touchend')"
    @pointerup="$emit('pointerup')"
    @pointercancel="$emit('pointerup')"
    @mouseup="$emit('mouseup')"
    @wheel="$emit('wheel', $event)"
  >
    <div class="flipbook-container" :style="{ transform: `scale(${props.zoom})` }">
      <div
        class="click-to-flip left"
        :style="{ cursor: canFlipLeft ? 'pointer' : 'auto' }"
        @click="$emit('flipLeft')"
      />
      <div
        class="click-to-flip right"
        :style="{ cursor: canFlipRight ? 'pointer' : 'auto' }"
        @click="$emit('flipRight')"
      />
      <div :style="{ transform: `translateX(${props.centerOffsetSmoothed}px)` }">
        <slot />
        <div :style="{ opacity: flip.opacity }">
          <div
            v-for="[key, bgImage, lighting, bgPos, transform, z] in props.polygonArray"
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
            <div v-show="lighting.length" class="lighting" :style="{ backgroundImage: lighting }" />
          </div>
        </div>
        <div
          class="bounding-box"
          :style="boundingBoxStyle"
          @touchstart="$emit('touchstart')"
          @pointerdown="$emit('pointerdown')"
          @mousedown="$emit('mousedown')"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
const props = defineProps({
  viewportClass: String,
  viewportStyle: Object,
  zoom: Number,
  centerOffsetSmoothed: Number,
  flip: Object,
  loadImage: Function,
  polygonArray: Array,
  boundingBoxStyle: Object,
  canFlipLeft: Boolean,
  canFlipRight: Boolean,
  pageWidth: Number,
  pageHeight: Number,
})

const polygonWidth = computed(() => {
  let w = pageWidth.value / props.nPolygons
  w = Math.ceil(w + 1 / zoom.value)
  return w + 'px'
})

const polygonHeight = computed(() => pageHeight.value + 'px')

const polygonBgSize = computed(() => `${pageWidth.value}px ${pageHeight.value}px`)
</script>
