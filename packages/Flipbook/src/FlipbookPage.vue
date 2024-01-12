<template>
  <img
    class="page fixed"
    :style="{
      width: width + 'px',
      height: height + 'px',
      left: left + 'px',
      top: top + 'px'
    }"
    :src="src"
    @load="$emit('load')"
  />
</template>

<script lang="ts">
export default {
  props: {
    width: Number,
    height: Number,
    left: Number,
    top: Number,
    src: String
  }
}
</script>
