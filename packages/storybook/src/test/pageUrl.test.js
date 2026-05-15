import { expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Flipbook from 'vue3-flipbook'
import 'vue3-flipbook/dist/vue3-flipbook.css'
test('returns high resolution page URL when hiRes is true and zoom is greater than 1', () => {
  const wrapper = mount(Flipbook, {
    props: {
      pages: ['page1.jpg', 'page2.jpg'],
      pagesHiRes: ['page1_hi_res.jpg', 'page2_hi_res.jpg'],
      zooms: [2],
      zooming: false
    }
  })
  expect(wrapper.vm.pageUrl(0, true)).toBe('page1_hi_res.jpg')
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
  expect(wrapper.vm.pageUrl(0, true)).toBe('page1.jpg')
  expect(wrapper.vm.pageUrl(0, false)).toBe('page1.jpg')
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
  expect(wrapper.vm.pageUrl(2, true)).toBe(null)
})

test('fixed right page updates to next page when flip starts', async () => {
  const wrapper = mount(Flipbook, {
    props: {
      pages: [null, 'page1.jpg', 'page2.jpg', 'page3.jpg', 'page4.jpg'],
      pagesHiRes: [],
      startPage: 1,
      singlePage: false,
      forwardDirection: 'right',
      clickToZoom: false
    },
    attachTo: document.body
  })

  // 等待挂载及初始计算完成
  await new Promise((r) => setTimeout(r, 50))

  // 初始状态：pages[0]=null 不显示左页，右页为 pages[1]='page1.jpg'
  const fixedImgsBefore = wrapper.findAll('img.page.fixed')
  expect(fixedImgsBefore.length).toBe(1)
  expect(fixedImgsBefore[0].attributes('src')).toBe('page1.jpg')

  // 触发点击右翻
  await wrapper.find('.click-to-flip.right').trigger('click')
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  await new Promise((r) => setTimeout(r, 50))

  // flipStart 会同步更新 secondPage = currentPage(0) + 1 + displayedPages(2) = 3
  // 因此固定右页应显示 pages[3] = 'page3.jpg'
  const fixedImgsAfter = wrapper.findAll('img.page.fixed')
  expect(fixedImgsAfter.length).toBe(1)
  expect(fixedImgsAfter[0].attributes('src')).toBe('page3.jpg')
})

test('four different pages are visible during flip animation', async () => {
  const wrapper = mount(Flipbook, {
    props: {
      pages: ['page1.jpg', 'page2.jpg', 'page3.jpg', 'page4.jpg'],
      pagesHiRes: [],
      startPage: 1,
      singlePage: false,
      forwardDirection: 'right',
      clickToZoom: false
    },
    attachTo: document.body
  })

  await new Promise((r) => setTimeout(r, 50))

  // 初始双页：左 page1.jpg，右 page2.jpg
  const fixedImgsBefore = wrapper.findAll('img.page.fixed')
  expect(fixedImgsBefore.length).toBe(2)
  expect(fixedImgsBefore[0].attributes('src')).toBe('page1.jpg')
  expect(fixedImgsBefore[1].attributes('src')).toBe('page2.jpg')

  // 点击右翻
  await wrapper.find('.click-to-flip.right').trigger('click')
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  await new Promise((r) => setTimeout(r, 50))

  // 翻页开始后应该同时出现 4 个页面：
  // - 左固定：page1.jpg
  // - polygon front（旧右页）：page2.jpg
  // - polygon back（背面）：page3.jpg
  // - 右固定（露出的新页）：page4.jpg
  const fixedImgsAfter = wrapper.findAll('img.page.fixed')
  expect(fixedImgsAfter.length).toBe(2)
  expect(fixedImgsAfter[0].attributes('src')).toBe('page1.jpg')
  expect(fixedImgsAfter[1].attributes('src')).toBe('page4.jpg')

  // polygon 中应同时包含 page2.jpg（front）和 page3.jpg（back）
  const polygons = wrapper.findAll('.polygon')
  const frontExists = polygons.some((p) => p.attributes('data-img') === 'page2.jpg')
  const backExists = polygons.some((p) => p.attributes('data-img') === 'page3.jpg')
  expect(frontExists).toBe(true)
  expect(backExists).toBe(true)
})
