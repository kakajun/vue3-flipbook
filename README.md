# flipbook-vue

[![npm version](https://badge.fury.io/js/flipbook-vue.svg)](https://badge.fury.io/js/flipbook-vue) ![demo](https://github.com/ts1/flipbook-vue/workflows/demo/badge.svg)

`flipbook-vue` is a Vue component that displays images in 3D page flip effect.

Demo page is [here](https://github.com/kakajun/vue3-flipbook).

## Installation

Install as a module:

```
npm i -S flipbook-vue
```

or

```
yarn add flipbook-vue
```

or

```
pnpm add flipbook-vue
```

Or include in html:

```html



## Usage

```html
<template>
  <flipbook class="flipbook" :pages="['array', 'of', 'image', 'URLs']"></flipbook>
</template>

<style>
  .flipbook {
    width: 90vw;
    height: 90vh;
  }
</style>
```

If installed as a module, with Vue 3.x,

```html
<script>
  import Flipbook from 'flipbook-vue'
  export default {
    components: { Flipbook }
  }
</script>
```

To use with Vue 2.x,

```js
import Flipbook from 'flipbook-vue/vue2'
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
