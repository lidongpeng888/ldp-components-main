/**
 * Vue 组件库主入口文件
 */
import type { App } from 'vue'

// 导入工具函数
export * from './utils'

// 导入主题系统
export * from './theme/types'
export * from './theme/config'
export {
  ThemeProvider,
  useTheme,
  useThemeConfig,
  useThemeMode,
  useThemeToken,
  useComponentTheme
} from './theme/provider'

// 导入组件
export { default as Dropdown } from './components/Dropdown'
export type * from './components/Dropdown/types'

export { default as DatePicker } from './components/DatePicker'
export type * from './components/DatePicker/types'

export { default as Selector } from './components/Selector'
export type * from './components/Selector/types'

export { default as Popover } from './components/Popover'
export type * from './components/Popover/types'

export { default as Upload } from './components/Upload'
export type * from './components/Upload/types'

// 版本信息
export const version = '1.0.0'

// 导入组件
import Dropdown from './components/Dropdown'
import DatePicker from './components/DatePicker'
import Selector from './components/Selector'
import Popover from './components/Popover'
import Modal from './components/Modal'
// import Empty from './components/Empty'
import Loading from './components/Loading'
// import Message from './components/Message'
// import Upload from './components/Upload'

// 所有组件列表
const components = [Modal,  Loading,, Dropdown, DatePicker, Selector, Popover /*,Empty,Message,Upload*/]

// 全量安装函数
export function install(app: App): void {
  components.forEach(component => {
    if (component.install) {
      component.install(app)
    }
  })
  console.log(`Vue Component Library v${version} installed`)
}

// 默认导出
export default {
  version,
  install
}
