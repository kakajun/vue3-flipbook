import Flipbook from './Flipbook.vue'
if (window.Vue?.component) {
  // for Vue 2
  Vue.component('Flipbook', Flipbook)
} else {
  // for Vue 3
  window.Flipbook = Flipbook
}
