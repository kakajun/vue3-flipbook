<template>
  <div class="github-ribbon">
    <a
target="_blank"
href="https://github.com/ts1/flipbook-vue"
>Fork me on GitHub</a>
  </div>
</template>

<style scoped>
.github-ribbon {
  position: fixed;
  right: 0;
  top: 0;
  width: 150px;
  height: 150px;
  overflow: hidden;
  z-index: 99999;
}

.github-ribbon a {
  display: inline-block;
  width: 200px;
  overflow: hidden;
  padding: 6px 0;
  text-align: center;
  transform: rotate(45deg);
  text-decoration: none;
  color: rgb(255 255 255);
  position: inherit;
  top: 45px;
  right: -40px;
  font:
    700 13px 'Helvetica Neue',
    Helvetica,
    Arial,
    sans-serif;
  box-shadow: rgb(0 0 0 / 50%) 0 2px 3px 0;
  background-color: rgb(170 0 0);
  background-image: linear-gradient(rgb(0 0 0 / 0%), rgb(0 0 0 / 15%));
  border-width: 1px 0;
  border-style: dotted;
  border-color: rgb(255 255 255 / 70%);
}
</style>
