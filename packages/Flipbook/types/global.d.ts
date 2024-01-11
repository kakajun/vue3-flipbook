/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VNodeChild, PropType as VuePropType } from 'vue'

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
      dependencies: Recordable<string>
      devDependencies: Recordable<string>
    }
    lastBuildTime: string
  }

  // vue
  declare type PropType<T> = VuePropType<T>
  declare type VueNode = VNodeChild | JSX.Element
}
