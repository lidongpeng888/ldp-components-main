/**
 * Selector 选择器组件导出文件
 */

import Selector from './Selector.vue'
import type { App } from 'vue'

Selector.install = (app: App) => {
  app.component(Selector.name || 'CustomSelector', Selector)
}

export default Selector
export * from './types'
export * from './hooks' 