import { ref } from 'vue'
import { expect, test } from 'vitest'
import Flipbook from '@/views/Flipbook.vue'

test('updates viewWidth and viewHeight on resize', () => {
  const instance = Flipbook.setup()
  instance.$refs = ref({
    viewport: {
      clientWidth: 800,
      clientHeight: 600
    }
  })
  instance.onResize()
  expect(instance.viewWidth.value).toBe(800)
  expect(instance.viewHeight.value).toBe(600)
})

test('updates displayedPages on resize', () => {
  const instance = Flipbook.setup()
  instance.$refs = ref({
    viewport: {
      clientWidth: 800,
      clientHeight: 600
    }
  })
  instance.singlePage.value = false
  instance.onResize()
  expect(instance.displayedPages.value).toBe(2)
})

test('updates currentPage on resize', () => {
  const instance = Flipbook.setup()
  instance.$refs = ref({
    viewport: {
      clientWidth: 800,
      clientHeight: 600
    }
  })
  instance.singlePage.value = false
  instance.currentPage.value = 3
  instance.onResize()
  expect(instance.currentPage.value).toBe(2)
})

test('updates minX and maxX on resize', () => {
  const instance = Flipbook.setup()
  instance.$refs = ref({
    viewport: {
      clientWidth: 800,
      clientHeight: 600
    }
  })
  instance.onResize()
  expect(instance.minX.value).toBe(Infinity)
  expect(instance.maxX.value).toBe(-Infinity)
})
