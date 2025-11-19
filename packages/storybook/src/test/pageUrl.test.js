import { expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Flipbook from 'vue3-flipbook'
import 'vue3-flipbook/dist/style.css'
test('returns high resolution page URL when hiRes is true and zoom is greater than 1', () => {
  const wrapper = mount(Flipbook, {
    props: {
      pages: ['page1.jpg', 'page2.jpg'],
      pagesHiRes: ['page1_hi_res.jpg', 'page2_hi_res.jpg'],
      zooms: [2],
      zooming: false
    }
  })
  expect(wrapper.vm.$.setupState.pageUrl(0, true)).toBe('page1_hi_res.jpg')
})

test('returns normal resolution page URL when hiRes is false or zoom is not greater than 1', () => {
  const wrapper = mount(Flipbook, {
    props: {
      pages: ['page1.jpg', 'page2.jpg'],
      pagesHiRes: ['page1_hi_res.jpg', 'page2_hi_res.jpg'],
      zoom: 1,
      zooming: false
    }
  })
  expect(wrapper.vm.$.setupState.pageUrl(0, true)).toBe('page1.jpg')
  expect(wrapper.vm.$.setupState.pageUrl(0, false)).toBe('page1.jpg')
})

test('returns null when page does not exist', () => {
  const wrapper = mount(Flipbook, {
    props: {
      pages: ['page1.jpg', 'page2.jpg'],
      pagesHiRes: ['page1_hi_res.jpg', 'page2_hi_res.jpg'],
      zoom: 2,
      zooming: false
    }
  })
  expect(wrapper.vm.$.setupState.pageUrl(2, true)).toBe(null)
})
