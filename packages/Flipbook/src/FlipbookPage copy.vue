<template>
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
    @load="didLoadImage"
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
    @load="didLoadImage"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const showLeftPage = computed(() => pageUrl(leftPage.value))

const showRightPage = computed(() => pageUrl(rightPage.value) && displayedPages.value === 2)
</script>
