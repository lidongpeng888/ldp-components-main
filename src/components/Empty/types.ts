/**
 * Empty 组件类型定义
 */

import type { CSSProperties, VNode } from 'vue'
import type { EmptyProps as AntEmptyProps } from 'ant-design-vue'

// 空状态场景类型
export type EmptyScenario =
  | 'default'
  | 'no-data'
  | 'network-error'
  | 'permission-denied'
  | 'search-no-result'
  | 'custom'

// 操作按钮配置
export interface ActionButton {
  /** 按钮文本 */
  text: string
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  /** 按钮尺寸 */
  size?: 'large' | 'middle' | 'small'
  /** 是否加载中 */
  loading?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 点击事件 */
  onClick?: () => void | Promise<void>
  /** 按钮图标 */
  icon?: () => VNode
}

// 继承 Ant Design Vue Empty 的所有 props 并扩展
export interface EmptyProps extends AntEmptyProps {
  /** 空状态场景类型 */
  scenario?: EmptyScenario
  /** 自定义标题 */
  title?: string
  /** 自定义描述文本 */
  description?: string
  /** 自定义图标 */
  icon?: () => VNode | string
  /** 操作按钮配置 */
  actions?: ActionButton[]
  /** 是否显示重试按钮 */
  showRetry?: boolean
  /** 重试按钮文本 */
  retryText?: string
  /** 是否显示反馈按钮 */
  showFeedback?: boolean
  /** 反馈按钮文本 */
  feedbackText?: string
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
}

// Empty 事件类型
export interface EmptyEmits {
  /** 重试事件 */
  retry: []
  /** 反馈事件 */
  feedback: []
  /** 操作按钮点击事件 */
  actionClick: [action: ActionButton, index: number]
}

// Empty 插槽类型
export interface EmptySlots {
  /** 默认插槽 - 自定义内容 */
  default?: () => any
  /** 图标插槽 */
  image?: () => any
  /** 描述插槽 */
  description?: () => any
  /** 操作区域插槽 */
  actions?: () => any
}

// Empty 实例类型
export interface EmptyInstance {
  /** 原生 Empty 实例 */
  $antEmpty: any
  /** 触发重试 */
  triggerRetry: () => void
  /** 触发反馈 */
  triggerFeedback: () => void
}

// 预设场景配置
export interface ScenarioConfig {
  /** 标题 */
  title: string
  /** 描述 */
  description: string
  /** 图标名称或组件 */
  icon?: string | (() => VNode)
  /** 默认操作按钮 */
  actions?: ActionButton[]
}
