/**
 * DatePicker 日期选择器组件类型定义
 */

import type { CSSProperties } from 'vue'
import type { DatePickerProps as AntDatePickerProps } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'

// 日期选择器模式
export type DatePickerMode = 'time' | 'date' | 'month' | 'year' | 'decade'

// 日期选择器类型
export type DatePickerType = 'date' | 'week' | 'month' | 'quarter' | 'year'

// 返回值类型
export type DateValueType = 'date' | 'string' | 'timestamp'

// 继承 Ant Design Vue DatePicker 的所有 props 并扩展
export interface DatePickerProps {
  /** 绑定值 */
  modelValue?: string | number | Date | Dayjs
  /** 日期格式，同 dayjs 格式 */
  format?: string
  /** 显示的日期格式，同 dayjs 格式 */
  displayFormat?: string
  /** 选择器类型 */
  picker?: DatePickerType
  /** 面板模式 */
  mode?: DatePickerMode
  /** 是否显示时间选择 */
  showTime?: boolean | object
  /** 是否显示今天按钮 */
  showToday?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示清除按钮 */
  allowClear?: boolean
  /** 自动获取焦点 */
  autoFocus?: boolean
  /** 输入框是否只读 */
  inputReadOnly?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 占位文本 */
  placeholder?: string
  /** 时区 */
  timezone?: string
  /** 禁用日期 */
  disabledDate?: (currentDate: Dayjs) => boolean
  /** 禁用时间 */
  disabledTime?: (currentDate: Dayjs) => any
  /** 返回值类型 */
  valueType?: DateValueType
  /** 尺寸 */
  size?: 'small' | 'middle' | 'large'
  /** 快捷选项 */
  shortcuts?: { text: string; value: () => Dayjs | [Dayjs, Dayjs] }[]
  /** 国际化配置 */
  locale?: string | object
}

// DatePicker 事件类型
export interface DatePickerEmits {
  /** 值变化事件 */
  'update:modelValue': (value: any) => void
  /** 日期变化事件 */
  'change': (value: any, dateString: string) => void
  /** 确认选择事件 */
  'ok': (value: any) => void
  /** 面板打开/关闭事件 */
  'openChange': (open: boolean) => void
  /** 面板切换事件 */
  'panelChange': (value: any, mode: string) => void
  /** 获取焦点事件 */
  'focus': (event: FocusEvent) => void
  /** 失去焦点事件 */
  'blur': (event: FocusEvent) => void
}

// DatePicker 插槽类型
export interface DatePickerSlots {
  /** 自定义日期单元格内容 */
  dateRender?: (current: Dayjs) => any
  /** 自定义渲染面板 */
  renderExtraFooter?: () => any
  /** 自定义清除图标 */
  clearIcon?: () => any
  /** 自定义后缀图标 */
  suffixIcon?: () => any
  /** 自定义预览内容 */
  prevIcon?: () => any
  /** 自定义后一页图标 */
  nextIcon?: () => any
  /** 自定义后一年图标 */
  superNextIcon?: () => any
  /** 自定义前一年图标 */
  superPrevIcon?: () => any
}

// DatePicker 实例类型
export interface DatePickerInstance {
  /** 原生 DatePicker 实例 */
  $antDatePicker: any
  /** 打开日期选择器 */
  open: () => void
  /** 关闭日期选择器 */
  close: () => void
  /** 清空选择 */
  clear: () => void
  /** 获取焦点 */
  focus: () => void
  /** 失去焦点 */
  blur: () => void
} 