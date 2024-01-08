<template>
  <div id="app" :class="{ 'has-mouse': hasMouse }" @touchstart="hasMouse = false">
    <Ribbon />
    <Flipbook
      v-slot="flipbook"
      ref="flipbookref"
      class="flipbook"
      :pages="pages"
      :pages-hi-res="pagesHiRes"
      :start-page="pageNum"
      @flip-left-start="onFlipLeftStart"
      @flip-left-end="onFlipLeftEnd"
      @flip-right-start="onFlipRightStart"
      @flip-right-end="onFlipRightEnd"
      @zoom-start="onZoomStart"
      @zoom-end="onZoomEnd"
    >
      <div class="action-bar">
        <left-icon
          class="btn left"
          :class="{ disabled: !flipbook.canFlipLeft }"
          @click="flipbook.flipLeft"
        />
        <plus-icon
          class="btn plus"
          :class="{ disabled: !flipbook.canZoomIn }"
          @click="flipbook.zoomIn"
        />
        <span class="page-num"> Page {{ flipbook.page }} of {{ flipbook.numPages }} </span>
        <minus-icon
          class="btn minus"
          :class="{ disabled: !flipbook.canZoomOut }"
          @click="flipbook.zoomOut"
        />
        <right-icon
          class="btn right"
          :class="{ disabled: !flipbook.canFlipRight }"
          @click="flipbook.flipRight"
        />
      </div>
    </Flipbook>
    <p class="credit">
      Photos from
      <a href="https://unsplash.com/" target="_blank">Unsplash</a>.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'vue-material-design-icons/styles.css'
import LeftIcon from 'vue-material-design-icons/ChevronLeftCircle.vue'
import RightIcon from 'vue-material-design-icons/ChevronRightCircle.vue'
import PlusIcon from 'vue-material-design-icons/PlusCircle.vue'
import MinusIcon from 'vue-material-design-icons/MinusCircle.vue'
import Flipbook from './Flipbook.vue'
import Ribbon from './Ribbon.vue'

const flipbookref = ref(null)
const pages = ref([])
const pagesHiRes = ref([])
const hasMouse = ref(true)
const pageNum = ref(null)

const onFlipLeftStart = (page) => {
  console.log('flip-left-start', page)
}
const onFlipLeftEnd = (page) => {
  console.log('flip-left-end', page)
  window.location.hash = '#' + page
}
const onFlipRightStart = (page) => {
  console.log('flip-right-start', page)
}
const onFlipRightEnd = (page) => {
  console.log('flip-right-end', page)
  window.location.hash = '#' + page
}
const onZoomStart = (zoom) => {
  console.log('zoom-start', zoom)
}
const onZoomEnd = (zoom) => {
  console.log('zoom-end', zoom)
}
const setPageFromHash = () => {
  const n = parseInt(window.location.hash.slice(1), 10)
  if (isFinite(n)) pageNum.value = n
}

onMounted(async () => {
  window.addEventListener('keydown', (ev) => {
    const flipbook = flipbookref.value
    if (!flipbook) return
    if (ev.key === 'ArrowLeft' && flipbook.canFlipLeft) flipbook.flipLeft()
    if (ev.key === 'ArrowRight' && flipbook.canFlipRight) flipbook.flipRight()
  })
  getPages()
  window.addEventListener('hashchange', setPageFromHash)
  setPageFromHash()
})

const getPages = async () => {
  const importAll = async (r) => {
    const images = []
    for (const path in r) {
      images.push((await r[path]()).default)
    }
    return images
  }
  const images = import.meta.glob('@/assets/images/*.jpg')
  const imagesLarge = import.meta.glob('@/assets/images-large/*.jpg')
  pages.value = [null, ...(await importAll(images))]
  pagesHiRes.value = [null, ...(await importAll(imagesLarge))]
}

</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333;
  color: #ccc;
  overflow: hidden;
}

a {
  color: inherit;
}

.action-bar {
  width: 100%;
  height: 30px;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-bar .btn {
  font-size: 30px;
  color: #999;
}

.action-bar .btn svg {
  bottom: 0;
}

.action-bar .btn:not(:first-child) {
  margin-left: 10px;
}

.has-mouse .action-bar .btn:hover {
  color: #ccc;
  filter: drop-shadow(1px 1px 5px #000);
  cursor: pointer;
}

.action-bar .btn:active {
  filter: none !important;
}

.action-bar .btn.disabled {
  color: #666;
  pointer-events: none;
}

.action-bar .page-num {
  font-size: 12px;
  margin-left: 10px;
}

.flipbook .viewport {
  width: 90vw !important;
  height: calc(100vh - 50px - 40px) !important;
}

.flipbook .bounding-box {
  box-shadow: 0 0 20px #000;
}

.credit {
  font-size: 12px;
  line-height: 20px;
  margin: 10px;
}
</style>
