import { App, Plugin } from 'vue'
import Flipbook from './Flipbook.vue'

Flipbook.install = (app: App) => {
  const name = (Flipbook as any).name ?? 'Flipbook'
  app.component(name, Flipbook)
  return app
}

export default Flipbook as typeof Flipbook & Plugin
