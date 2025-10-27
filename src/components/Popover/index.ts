/**
 * Popover 气泡组件导出文件
 */

import Popover from './Popover.vue'
import type { App } from 'vue'

Popover.install = (app: App) => {
  app.component(Popover.name || 'CustomPopover', Popover)
}

export default Popover
export * from './types'
export * from './hooks' 