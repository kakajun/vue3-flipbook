import { App, Plugin } from 'vue'
import Flipbook from './Flipbook.vue'

Flipbook.install = (app: App) => {
  app.component(Flipbook.name, Flipbook)
  return app
}

export default Flipbook as typeof Flipbook & Plugin
