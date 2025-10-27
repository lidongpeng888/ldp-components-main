/**
 * Dropdown 下拉菜单组件类型定义
 */

import type { CSSProperties } from 'vue'
import type { DropdownProps as AntDropdownProps } from 'ant-design-vue'

// 下拉菜单触发方式
export type DropdownTrigger = 'hover' | 'click' | 'contextmenu'

// 下拉菜单位置
export type DropdownPlacement = 
  'top' | 'topLeft' | 'topRight' | 'topCenter' |
  'bottom' | 'bottomLeft' | 'bottomRight' | 'bottomCenter'

// 继承 Ant Design Vue Dropdown 的所有 props 并扩展
export interface DropdownProps extends /* @vue-ignore */ AntDropdownProps {
  /** 下拉菜单触发方式 */
  trigger?: DropdownTrigger | DropdownTrigger[]
  /** 下拉菜单位置 */
  placement?: DropdownPlacement
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 是否显示箭头 */
  arrow?: boolean
  /** 是否自动调整位置 */
  autoAdjust?: boolean
  /** 菜单项是否带图标 */
  withIcon?: boolean
  /** 是否支持手动控制显示隐藏 */
  manualControl?: boolean
  /** 菜单是否可见 */
  visible?: boolean
  /** 菜单是否可见 (Vue 3 命名) */
  open?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 点击菜单项后是否自动关闭 */
  closeOnClick?: boolean
}

// Dropdown 事件类型
export interface DropdownEmits {
  /** 菜单显示状态变化事件 */
  'update:visible': (visible: boolean) => void
  /** 菜单显示状态变化事件 (Vue 3 命名) */
  'update:open': (open: boolean) => void
  /** 点击菜单项事件 */
  click: (key: string | number, event: MouseEvent) => void
  /** 菜单显示事件 */
  visibleChange: (visible: boolean) => void
  /** 菜单显示事件 (Vue 3 命名) */
  openChange: (open: boolean) => void
}

// Dropdown 插槽类型
export interface DropdownSlots {
  /** 默认插槽 - 触发元素 */
  default?: () => any
  /** 下拉菜单内容 */
  overlay?: () => any
  /** 下拉菜单内容 (Vue 3 命名) */
  menu?: () => any
}

// Dropdown 实例类型
export interface DropdownInstance {
  /** 原生 Dropdown 实例 */
  $antDropdown: any
  /** 手动显示下拉菜单 */
  show: () => void
  /** 手动隐藏下拉菜单 */
  hide: () => void
  /** 手动切换下拉菜单显示状态 */
  toggle: () => void
} 