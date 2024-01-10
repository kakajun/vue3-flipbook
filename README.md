# vue3-flipbook

[![npm version](https://badge.fury.io/js/vue3-flipbook.svg)](https://badge.fury.io/js/vue3-flipbook.svg) ![deploy](https://github.com/kakajun/vue3-flipbook/actions/workflows/deploy.yaml/badge.svg)

`vue3-flipbook` is a Vue component that displays images in 3D page flip effect.

<p align="middle">
    <a href="https://kakajun.github.io/vue3-flipbook/" target="_blank"><strong>Storybook</strong></a>
</p>

## Installation

Install as a module:

```
npm i -S vue3-flipbook
```

or

```
yarn add vue3-flipbook
```

or

```
pnpm add vue3-flipbook
```

Or include in html:

````html
## Usage ```html
<template>
  <flipbook class="flipbook" :pages="['array', 'of', 'image', 'URLs']"></flipbook>
</template>

<style>
  .flipbook {
    width: 90vw;
    height: 90vh;
  }
</style>
````

If installed as a module, with Vue 3.x,

```html
<script>
  import Flipbook from 'vue3-flipbook'
  export default {
    components: { Flipbook }
  }
</script>
```

## CSS API

You may need to specify the size of view port in your style sheet, directly to `<flipbook>` element, or to `.viewport` sub-element of flipbook.

If the size is horizontally long and `singlePage` prop is `false` (default), it displays two pages spread, suitable for desktop browsers. If it's vertically long, it displays single pages, suitable for smartphones.

There are some internal classes.

### `.viewport`

A `<div>` element that contains everything but `<slot>`. `<slot>` is placed above `.viewport`.

### `.bounding-box`

Approximate bounding box of the displayed images. Suitable to give `box-shadow`.

## Browser support

Supports modern browsers and IE 11.

## Development

To start development server with demo pages:

```
cd examples/demo
pnpm i
pnpm serve
```

To package for npm:

```
pnpm dist
```

## Credits

- vivekKodira: README correction
- siderisng: `dragToFlip`
- MaikoTan: TypeScript support

## License

MIT

quote https://ts1.github.io/flipbook-vue/ Takeshi Sone.
