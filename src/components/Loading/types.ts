/**
 * Loading 组件类型定义
 */

import type { CSSProperties, VNode } from 'vue'
import type { SpinProps as AntSpinProps } from 'ant-design-vue'

// 加载样式类型
export type LoadingStyle = 'spin' | 'dots' | 'bars' | 'wave' | 'pulse' | 'bounce'

// 加载尺寸类型
export type LoadingSize = 'small' | 'default' | 'large'

// 加载位置类型
export type LoadingPosition = 'global' | 'container' | 'inline'

// 继承 Ant Design Vue Spin 的所有 props 并扩展
export interface LoadingProps extends AntSpinProps {
  /** 加载样式 */
  loadingStyle?: LoadingStyle
  /** 加载尺寸 */
  size?: LoadingSize
  /** 加载位置类型 */
  position?: LoadingPosition
  /** 自定义加载文本 */
  text?: string
  /** 是否显示文本 */
  showText?: boolean
  /** 延迟显示时间（毫秒） */
  delay?: number
  /** 是否全屏遮罩 */
  fullscreen?: boolean
  /** 遮罩背景色 */
  maskColor?: string
  /** 遮罩透明度 */
  maskOpacity?: number
  /** 自定义加载图标 */
  icon?: () => VNode | string
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  customStyle?: CSSProperties
  /** 是否可取消 */
  cancelable?: boolean
  /** 取消按钮文本 */
  cancelText?: string
  /** 最小显示时间（毫秒） */
  minDuration?: number
  /** 最大显示时间（毫秒） */
  maxDuration?: number
}

// Loading 事件类型
export interface LoadingEmits {
  /** 取消事件 */
  cancel: () => void
  /** 超时事件 */
  timeout: () => void
  /** 显示事件 */
  show: () => void
  /** 隐藏事件 */
  hide: () => void
}

// Loading 插槽类型
export interface LoadingSlots {
  /** 默认插槽 - 被包装的内容 */
  default?: () => any
  /** 加载指示器插槽 */
  indicator?: () => any
  /** 加载文本插槽 */
  tip?: () => any
  /** 取消按钮插槽 */
  cancel?: () => any
}

// Loading 实例类型
export interface LoadingInstance {
  /** 原生 Spin 实例 */
  $antSpin: any
  /** 显示加载 */
  show: () => void
  /** 隐藏加载 */
  hide: () => void
  /** 切换加载状态 */
  toggle: () => void
  /** 取消加载 */
  cancel: () => void
}

// 全局加载配置
export interface GlobalLoadingConfig {
  /** 默认延迟时间 */
  defaultDelay?: number
  /** 默认最小显示时间 */
  defaultMinDuration?: number
  /** 默认最大显示时间 */
  defaultMaxDuration?: number
  /** 默认样式 */
  defaultLoadingStyle?: LoadingStyle
  /** 默认尺寸 */
  defaultSize?: LoadingSize
  /** 默认文本 */
  defaultText?: string
  /** 默认遮罩配置 */
  defaultMask?: {
    color?: string
    opacity?: number
  }
}

// 加载样式配置
export interface LoadingStyleConfig {
  /** 样式名称 */
  name: LoadingStyle
  /** 样式类名 */
  className: string
  /** 动画持续时间 */
  duration?: number
  /** 是否支持颜色定制 */
  colorizable?: boolean
}
