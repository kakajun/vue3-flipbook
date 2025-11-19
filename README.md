# vue3-flipbook

[![npm version](https://badge.fury.io/js/vue3-flipbook.svg)](https://www.npmjs.com/package/vue3-flipbook) ![deploy](https://github.com/kakajun/vue3-flipbook/actions/workflows/deploy.yaml/badge.svg)

一个用于 Vue 3 的 3D 翻页组件，用于将图片数组以书本翻页的效果展示。

## 在线演示

- Storybook: https://kakajun.github.io/vue3-flipbook/

## 安装

- 使用 pnpm：`pnpm add vue3-flipbook`
- 使用 npm：`npm i -S vue3-flipbook`
- 使用 yarn：`yarn add vue3-flipbook`

注意：本组件将 `vue` 作为 `peerDependencies`，请确保项目中已安装 Vue `^3.3`。

## 使用

```vue
<template>
  <Flipbook class="flipbook" :pages="pages" :pagesHiRes="pagesHiRes" />
  <!-- pages 为图片 URL 数组；如果首元素为 null，则第二张作为封面单页显示 -->
</template>

<script setup>
import Flipbook from 'vue3-flipbook'
import 'vue3-flipbook/dist/vue3-flipbook.css'

const pages = [null, '/images/p1.jpg', '/images/p2.jpg']
const pagesHiRes = [null, '/images-large/p1.jpg', '/images-large/p2.jpg']
</script>

<style>
.flipbook .viewport { /* 建议设置视口尺寸 */
  width: 90vw !important;
  height: 90vh !important;
}
</style>
```

也可以按插件方式全局注册：

```ts
import { createApp } from 'vue'
import Flipbook from 'vue3-flipbook'
import 'vue3-flipbook/dist/vue3-flipbook.css'

const app = createApp(App)
app.use(Flipbook)
app.mount('#app')
```

## 常用 Props

- `pages: (string | null)[]` 图片 URL 数组；若首元素为 `null`，第二张作为封面单页显示
- `pagesHiRes: string[]` 放大时使用的高清图片 URL 数组
- `flipDuration: number` 翻页动画时长（毫秒），默认 `1000`
- `zoomDuration: number` 缩放动画时长（毫秒），默认 `500`
- `zooms: number[]` 可选的缩放倍率数组，默认 `[1, 2, 4]`
- `nPolygons: number` 单页水平分割的矩形数量，越高质量越好但性能开销更大
- `singlePage: boolean` 强制单页模式
- `forwardDirection: 'left' | 'right'` 阅读方向（默认 `right`）

## 事件

- `@flip-left-start(page: number)` / `@flip-left-end(page: number)`
- `@flip-right-start(page: number)` / `@flip-right-end(page: number)`
- `@zoom-start(zoom: number)` / `@zoom-end(zoom: number)`

## 插槽暴露

组件默认插槽会暴露以下属性与方法：`canFlipLeft`、`canFlipRight`、`canZoomIn`、`canZoomOut`、`page`、`numPages`、`flipLeft`、`flipRight`、`zoomIn`、`zoomOut`。

## 样式与内部类

- `.viewport`：承载翻页与交互的容器，建议设置尺寸（如上例）
- `.bounding-box`：当前页面的近似外包围盒，可用于添加阴影

## 本地开发与演示

Monorepo 结构：库包在 `packages/Flipbook`，演示/测试在 `packages/storybook`。

- 安装依赖：`pnpm install`
- 启动演示（Storybook）：`pnpm -C packages/storybook storybook`
- 运行测试：`pnpm -C packages/storybook test -- --run`
- 构建库：`pnpm -C packages/Flipbook build`

Storybook 中提供了两个示例故事：

- `FlipDemo`：完整交互示例（支持左右方向键翻页）
- `FlipPerf`：测速示例，统计翻页时长与 P95 等性能指标

## 变更说明（近期）

- 统一 rematrix 变换为 3D，修复翻页过程中 2D/3D 矩阵混用导致的异常
- 修正样式路径：使用 `vue3-flipbook/dist/vue3-flipbook.css`
- 将 `vue` 移至 `peerDependencies`，库构建不再打包宿主框架

## License

MIT

## quote
https://ts1.github.io/flipbook-vue/ Takeshi Sone.
