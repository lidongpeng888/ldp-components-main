// 基础类型定义文件
import type { App } from 'vue'
import type {
  ModalProps as AntModalProps,
  TableProps as AntTableProps,
  FormProps as AntFormProps,
  SelectProps as AntSelectProps,
  UploadProps as AntUploadProps,
  EmptyProps as AntEmptyProps,
  TabsProps as AntTabsProps,
  SpinProps as AntSpinProps,
  MessageArgsProps as AntMessageProps,
  PopoverProps as AntPopoverProps,
  DatePickerProps as AntDatePickerProps,
  CascaderProps as AntCascaderProps,
  DropdownProps as AntDropdownProps,
  ImageProps as AntImageProps,
  TourProps as AntTourProps,
  SkeletonProps as AntSkeletonProps
} from 'ant-design-vue'

// 组件安装接口
export interface ComponentInstaller {
  install(app: App): void
}

// 尺寸类型
export type ComponentSize = 'small' | 'middle' | 'large'

// 状态类型
export type ComponentStatus = 'success' | 'warning' | 'error' | 'info'

// 位置类型
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

// Ant Design Vue 类型继承工具函数
export type InheritAntProps<T> = T & {
  [K in keyof T]: T[K]
}

// 扩展属性工具类型
export type ExtendProps<T, U> = T & U

// 事件处理器类型
export type EventHandler<T = Event> = (event: T) => void

// 异步事件处理器类型
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>

// 组件实例类型工具
export type ComponentInstance<T> = T extends new (...args: any[]) => infer R ? R : never

// 插槽类型
export type SlotFunction<T = any> = (props?: T) => any

// 自定义渲染函数类型
export type CustomRender<T = any> = (props: T) => any

// Modal 组件类型
export interface ModalProps extends InheritAntProps<AntModalProps> {
  size?: 'small' | 'default' | 'large' | 'fullscreen'
  draggable?: boolean
  resizable?: boolean
}

// Table 组件类型
export interface TableProps<T = any> extends InheritAntProps<AntTableProps<T>> {
  virtual?: boolean
  exportable?: boolean
  searchable?: boolean
  columnSettings?: boolean
  autoHeight?: boolean
}

// Form 组件类型
export interface FormProps extends InheritAntProps<AntFormProps> {
  columns?: number
  collapsed?: boolean
  autoSubmit?: boolean
}

// QueryPanel 组件类型
export interface QueryPanelProps extends InheritAntProps<AntFormProps> {
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  collapsed?: boolean
  collapsedRows?: number
  showResetButton?: boolean
  showSearchButton?: boolean
}

// FileUpload 组件类型
export interface FileUploadProps extends InheritAntProps<AntUploadProps> {
  dragUpload?: boolean
  pasteUpload?: boolean
  cameraUpload?: boolean
  imagePreview?: boolean
  imageCrop?: boolean
  chunkUpload?: boolean
}

// Empty 组件类型
export interface EmptyProps extends InheritAntProps<AntEmptyProps> {
  type?: 'noData' | 'networkError' | 'noPermission' | 'searchEmpty'
  showRetry?: boolean
  retryText?: string
  onRetry?: () => void
}

// Tabs 组件类型
export interface TabsProps extends InheritAntProps<AntTabsProps> {
  draggable?: boolean
  keepAlive?: boolean
  routerIntegration?: boolean
  closable?: boolean
}

// Loading 组件类型
export interface LoadingProps extends InheritAntProps<AntSpinProps> {
  type?: 'spin' | 'dots' | 'bars' | 'wave'
  global?: boolean
  delay?: number
}

// Message 组件类型
export interface MessageProps extends InheritAntProps<AntMessageProps> {
  queue?: boolean
  preventDuplicate?: boolean
  richContent?: boolean
  mobileAdapt?: boolean
}

// Cascader 组件类型
export interface CascaderProps extends InheritAntProps<AntCascaderProps> {
  dynamicLoad?: boolean
  leafOnly?: boolean
  showPath?: boolean
  modalMode?: boolean
}

// Dropdown 组件类型
export interface DropdownProps extends InheritAntProps<AntDropdownProps> {
  contextMenu?: boolean
  followMouse?: boolean
  autoAdjust?: boolean
}

// LazyImage 组件类型
export interface LazyImageProps extends InheritAntProps<AntImageProps> {
  threshold?: number
  preload?: boolean
  priority?: number
  fadeIn?: boolean
}

// DatePicker 组件类型
export interface DatePickerProps extends InheritAntProps<AntDatePickerProps> {
  multiSelect?: boolean
  weekSelect?: boolean
  quarterSelect?: boolean
  customFormat?: string
}

// Popover 组件类型
export interface PopoverProps extends InheritAntProps<AntPopoverProps> {
  richContent?: boolean
  autoAdjust?: boolean
  nested?: boolean
  animation?: boolean
}

// Tour 组件类型
export interface TourProps extends InheritAntProps<AntTourProps> {
  spotlight?: boolean
  crossPage?: boolean
  multimedia?: boolean
  conditional?: boolean
}

// Skeleton 组件类型
export interface SkeletonProps extends InheritAntProps<AntSkeletonProps> {
  template?: 'text' | 'card' | 'list' | 'table' | 'form'
  shimmer?: boolean
  customStructure?: SkeletonStructure[]
}

// 骨架屏结构类型
export interface SkeletonStructure {
  type: 'rect' | 'circle' | 'text'
  width?: number | string
  height?: number | string
  className?: string
}

// 导出所有类型
export * from './global'

// 导出类型工具
export * from '../src/types/utils'
export * from '../src/types/validation'
export * from '../src/types/docs'
