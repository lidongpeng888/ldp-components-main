/**
 * 类型工具函数
 * 提供类型继承、扩展、验证等功能
 */

import type { DefineComponent, ComponentPublicInstance } from 'vue'
import type { ComponentProps, ComponentEmits, ComponentSlots } from 'vue'

/**
 * 组件属性提取工具
 */
export type ExtractComponentProps<T> = T extends DefineComponent<infer P, any, any, any, any, any, any, any>
  ? P
  : never

/**
 * 组件事件提取工具
 */
export type ExtractComponentEmits<T> = T extends DefineComponent<any, any, any, any, any, any, any, infer E>
  ? E
  : never

/**
 * 组件插槽提取工具
 */
export type ExtractComponentSlots<T> = T extends DefineComponent<any, any, any, any, any, any, infer S, any>
  ? S
  : never

/**
 * 组件实例类型提取工具
 */
export type ExtractComponentInstance<T> = T extends DefineComponent<any, any, any, any, any, any, any, any, any, infer I>
  ? I
  : ComponentPublicInstance

/**
 * Ant Design Vue 组件属性继承工具
 */
export type InheritAntdProps<T> = T & {
  // 保留所有原生属性
  [K in keyof T]: T[K]
}

/**
 * 扩展组件属性工具
 */
export type ExtendComponentProps<Base, Extension> = Base & Extension & {
  // 确保扩展属性不会覆盖基础属性的类型
  [K in keyof Base]: K extends keyof Extension ? Extension[K] : Base[K]
}

/**
 * 可选属性工具
 */
export type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * 必需属性工具
 */
export type RequiredProps<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * 深度只读工具
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/**
 * 深度可写工具
 */
export type DeepWritable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepWritable<T[P]> : T[P]
}

/**
 * 函数参数类型提取
 */
export type ExtractFunctionArgs<T> = T extends (...args: infer A) => any ? A : never

/**
 * 函数返回值类型提取
 */
export type ExtractFunctionReturn<T> = T extends (...args: any[]) => infer R ? R : never

/**
 * Promise 值类型提取
 */
export type ExtractPromiseValue<T> = T extends Promise<infer V> ? V : T

/**
 * 数组元素类型提取
 */
export type ExtractArrayElement<T> = T extends (infer U)[] ? U : never

/**
 * 对象值类型联合
 */
export type ValueOf<T> = T[keyof T]

/**
 * 对象键类型联合
 */
export type KeyOf<T> = keyof T

/**
 * 条件类型工具
 */
export type If<C extends boolean, T, F> = C extends true ? T : F

/**
 * 非空类型工具
 */
export type NonNullable<T> = T extends null | undefined ? never : T

/**
 * 可空类型工具
 */
export type Nullable<T> = T | null | undefined

/**
 * 数组或单值类型
 */
export type Arrayable<T> = T | T[]

/**
 * 同步或异步类型
 */
export type MaybePromise<T> = T | Promise<T>

/**
 * 函数类型工具
 */
export type AnyFunction = (...args: any[]) => any
export type VoidFunction = () => void
export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>

/**
 * 事件处理器类型
 */
export type EventHandler<T = Event> = (event: T) => void
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>

/**
 * 组件尺寸类型
 */
export type ComponentSize = 'small' | 'middle' | 'large'

/**
 * 组件状态类型
 */
export type ComponentStatus = 'success' | 'warning' | 'error' | 'info' | 'default'

/**
 * 位置类型
 */
export type PlacementType =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom'

/**
 * 触发方式类型
 */
export type TriggerType = 'hover' | 'click' | 'focus' | 'contextmenu'

/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 响应式断点类型
 */
export type BreakpointType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

/**
 * 组件变体类型
 */
export type ComponentVariant = 'default' | 'outlined' | 'filled' | 'text'

/**
 * 动画类型
 */
export type AnimationType = 'fade' | 'slide' | 'zoom' | 'bounce' | 'none'

/**
 * 加载状态类型
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * 排序方向类型
 */
export type SortDirection = 'asc' | 'desc'

/**
 * 对齐方式类型
 */
export type AlignType = 'left' | 'center' | 'right'

/**
 * 垂直对齐类型
 */
export type VerticalAlignType = 'top' | 'middle' | 'bottom'

/**
 * 组件引用类型工具
 */
export type ComponentRef<T = any> = {
  $el: HTMLElement
} & T

/**
 * 插槽内容类型
 */
export type SlotContent = string | number | boolean | VNode | VNode[] | (() => VNode | VNode[])

/**
 * CSS 类名类型
 */
export type CSSClass = string | string[] | Record<string, boolean>

/**
 * CSS 样式类型
 */
export type CSSStyle = string | Record<string, string | number>

/**
 * HTML 属性类型
 */
export type HTMLAttributes = Record<string, any>

/**
 * 数据源类型
 */
export type DataSource<T = any> = T[] | (() => T[]) | (() => Promise<T[]>)

/**
 * 选项类型
 */
export interface Option<T = any> {
  label: string
  value: T
  disabled?: boolean
  children?: Option<T>[]
  [key: string]: any
}

/**
 * 树形数据类型
 */
export interface TreeNode<T = any> {
  key: string | number
  title: string
  value?: T
  disabled?: boolean
  children?: TreeNode<T>[]
  [key: string]: any
}

/**
 * 表格列类型
 */
export interface TableColumn<T = any> {
  key: string
  title: string
  dataIndex?: string
  width?: number | string
  fixed?: 'left' | 'right'
  sorter?: boolean | ((a: T, b: T) => number)
  filters?: { text: string; value: any }[]
  render?: (value: any, record: T, index: number) => SlotContent
  [key: string]: any
}

/**
 * 表单字段类型
 */
export interface FormField {
  name: string
  label: string
  type: string
  required?: boolean
  rules?: any[]
  props?: Record<string, any>
  [key: string]: any
}

/**
 * 验证规则类型
 */
export interface ValidationRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  min?: number
  max?: number
  validator?: (rule: any, value: any) => Promise<void> | void
  [key: string]: any
}

/**
 * 分页配置类型
 */
export interface PaginationConfig {
  current?: number
  pageSize?: number
  total?: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: (total: number, range: [number, number]) => string
  [key: string]: any
}

/**
 * 文件类型
 */
export interface FileItem {
  uid: string
  name: string
  status: 'uploading' | 'done' | 'error' | 'removed'
  url?: string
  thumbUrl?: string
  size?: number
  type?: string
  [key: string]: any
}

/**
 * 上传配置类型
 */
export interface UploadConfig {
  action?: string
  method?: 'POST' | 'PUT' | 'PATCH'
  headers?: Record<string, string>
  data?: Record<string, any>
  accept?: string
  multiple?: boolean
  maxCount?: number
  maxSize?: number
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  onChange?: (info: { file: FileItem; fileList: FileItem[] }) => void
  [key: string]: any
}

/**
 * 主题配置类型
 */
export interface ThemeToken {
  colorPrimary?: string
  colorSuccess?: string
  colorWarning?: string
  colorError?: string
  colorInfo?: string
  colorText?: string
  colorBgBase?: string
  borderRadius?: number
  fontSize?: number
  fontFamily?: string
  [key: string]: any
}

/**
 * 组件主题配置类型
 */
export interface ComponentTheme {
  [componentName: string]: Record<string, any>
}

/**
 * 完整主题配置类型
 */
export interface ThemeConfig {
  token?: ThemeToken
  components?: ComponentTheme
  algorithm?: any
  [key: string]: any
}

/**
 * 国际化配置类型
 */
export interface LocaleConfig {
  locale: string
  messages: Record<string, string>
  dateFormat?: string
  timeFormat?: string
  [key: string]: any
}

/**
 * 组件配置类型
 */
export interface ComponentConfig {
  size?: ComponentSize
  theme?: ThemeConfig
  locale?: LocaleConfig
  [key: string]: any
}

/**
 * 全局配置类型
 */
export interface GlobalConfig extends ComponentConfig {
  prefix?: string
  namespace?: string
  [key: string]: any
}

// 导入 VNode 类型
import type { VNode } from 'vue'