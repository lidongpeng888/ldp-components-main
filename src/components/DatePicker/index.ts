/**
 * DatePicker 日期选择器组件导出文件
 */

import DatePicker from './DatePicker.vue'
import type { App } from 'vue'

DatePicker.install = (app: App) => {
  app.component(DatePicker.name || 'CustomDatePicker', DatePicker)
}

export default DatePicker
export * from './types'
export * from './hooks' 