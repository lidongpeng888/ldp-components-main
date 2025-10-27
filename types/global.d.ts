// 全局类型声明文件
import type { DefineComponent } from 'vue'
import type {
  ModalProps,
  TableProps,
  FormProps,
  QueryPanelProps,
  FileUploadProps,
  EmptyProps,
  TabsProps,
  LoadingProps,
  MessageProps,
  CascaderProps,
  DropdownProps,
  LazyImageProps,
  DatePickerProps,
  PopoverProps,
  TourProps,
  SkeletonProps
} from './index'

// 声明全局组件类型，支持 IDE 智能提示
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    // 自定义组件
    CustomModal: DefineComponent<ModalProps>
    CustomTable: DefineComponent<TableProps>
    CustomForm: DefineComponent<FormProps>
    CustomQueryPanel: DefineComponent<QueryPanelProps>
    CustomFileUpload: DefineComponent<FileUploadProps>
    CustomEmpty: DefineComponent<EmptyProps>
    CustomTabs: DefineComponent<TabsProps>
    CustomLoading: DefineComponent<LoadingProps>
    CustomMessage: DefineComponent<MessageProps>
    CustomCascader: DefineComponent<CascaderProps>
    CustomDropdown: DefineComponent<DropdownProps>
    CustomLazyImage: DefineComponent<LazyImageProps>
    CustomDatePicker: DefineComponent<DatePickerProps>
    CustomPopover: DefineComponent<PopoverProps>
    CustomTour: DefineComponent<TourProps>
    CustomSkeleton: DefineComponent<SkeletonProps>
  }
}

// 扩展 Ant Design Vue 的 ConfigProvider 类型
declare module 'ant-design-vue/es/config-provider' {
  interface ConfigProviderProps {
    customTheme?: {
      modal?: {
        dragHandleColor?: string
        resizeHandleColor?: string
      }
      table?: {
        virtualScrollBarWidth?: number
        exportButtonColor?: string
      }
      form?: {
        collapsedIconColor?: string
        autoSubmitDelay?: number
      }
      queryPanel?: {
        searchButtonType?: string
        resetButtonType?: string
      }
      fileUpload?: {
        dragAreaBorderColor?: string
        previewBackgroundColor?: string
      }
      empty?: {
        retryButtonColor?: string
        iconColor?: string
      }
      tabs?: {
        dragIndicatorColor?: string
        closeButtonColor?: string
      }
      loading?: {
        overlayColor?: string
        spinnerColor?: string
      }
      message?: {
        queueMaxCount?: number
        richContentMaxWidth?: number
      }

      cascader?: {
        dynamicLoadingColor?: string
        pathSeparator?: string
      }
      dropdown?: {
        contextMenuShadow?: string
        followMouseOffset?: number
      }
      lazyImage?: {
        placeholderColor?: string
        fadeInDuration?: number
      }
      datePicker?: {
        multiSelectColor?: string
        weekHighlightColor?: string
      }
      popover?: {
        richContentMaxWidth?: number
        animationDuration?: number
      }
      tour?: {
        spotlightColor?: string
        maskOpacity?: number
      }
      skeleton?: {
        shimmerColor?: string
        animationDuration?: number
      }
    }
  }
}

// 扩展 Window 对象类型（如果需要）
declare global {
  interface Window {
    // 组件库相关的全局变量
    __VUE_COMPONENT_LIBRARY_VERSION__?: string
    __VUE_COMPONENT_LIBRARY_DEV__?: boolean
  }
}

// CSS 模块类型声明
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// 图片资源类型声明
declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

// Vue 单文件组件类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 工具类型
export type Recordable<T = any> = Record<string, T>
export type Nullable<T> = T | null
export type NonNullable<T> = T extends null | undefined ? never : T
export type Arrayable<T> = T | T[]
export type Awaitable<T> = T | Promise<T>

// 函数类型
export type Fn<T = void> = () => T
export type AnyFn = (...args: any[]) => any

// 对象键值类型
export type KeyOf<T> = keyof T
export type ValueOf<T> = T[keyof T]

// 深度可选类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 深度必需类型
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

// 排除类型
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// 提取类型
export type Extract<T, U> = T extends U ? T : never

// 条件类型
export type If<C extends boolean, T, F> = C extends true ? T : F

export {}
