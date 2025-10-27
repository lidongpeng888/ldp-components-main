/**
 * Dropdown 下拉菜单组件导出文件
 */

import Dropdown from './Dropdown.vue'
import type { App } from 'vue'

Dropdown.install = (app: App) => {
  app.component(Dropdown.name || 'CustomDropdown', Dropdown)
}

export default Dropdown
export * from './types'
export * from './hooks' 