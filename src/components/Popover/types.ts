/**
 * Popover 气泡组件类型定义
 */

import type { CSSProperties, VNode } from 'vue'
import type { PopoverProps as AntPopoverProps } from 'ant-design-vue'

/**
 * 气泡位置类型
 */
export type PopoverPlacement = 
  | 'top' | 'left' | 'right' | 'bottom' 
  | 'topLeft' | 'topRight' 
  | 'bottomLeft' | 'bottomRight' 
  | 'leftTop' | 'leftBottom' 
  | 'rightTop' | 'rightBottom'

/**
 * 气泡触发方式类型
 */
export type PopoverTrigger = 'hover' | 'focus' | 'click' | 'contextmenu'

/**
 * 气泡主题类型
 */
export type PopoverTheme = 'light' | 'dark'

/**
 * 气泡组件Props
 */
export interface PopoverProps {
  /** 气泡卡片标题 */
  title?: string | VNode | (() => VNode)
  /** 气泡卡片内容 */
  content?: string | VNode | (() => VNode)
  /** 气泡是否可见 */
  visible?: boolean
  /** 气泡位置 */
  placement?: PopoverPlacement
  /** 触发方式 */
  trigger?: PopoverTrigger | PopoverTrigger[]
  /** 鼠标移入后延时多少才显示气泡，单位：秒 */
  mouseEnterDelay?: number
  /** 鼠标移出后延时多少才隐藏气泡，单位：秒 */
  mouseLeaveDelay?: number
  /** 浮层样式 */
  overlayStyle?: CSSProperties
  /** 浮层类名 */
  overlayClassName?: string
  /** 箭头是否指向目标元素中心 */
  arrowPointAtCenter?: boolean
  /** 气泡被遮挡时自动调整位置 */
  autoAdjustOverflow?: boolean
  /** 隐藏后是否销毁气泡 */
  destroyTooltipOnHide?: boolean
  /** 浮层渲染父节点 */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** 是否支持富文本内容 */
  rich?: boolean
  /** 气泡主题 */
  theme?: PopoverTheme
  /** 内容最大宽度 */
  maxWidth?: number | string
  /** 是否显示箭头 */
  showArrow?: boolean
  /** 气泡偏移量 [x, y] */
  offset?: [number, number] | number
}

/**
 * 气泡组件Emits
 */
export interface PopoverEmits {
  /** 气泡显示状态变化事件 */
  'update:visible': (visible: boolean) => void
  /** 气泡显示状态变化事件 */
  'visibleChange': (visible: boolean) => void
}

/**
 * 气泡组件Slots
 */
export interface PopoverSlots {
  /** 默认插槽 - 触发元素 */
  default: () => any
  /** 标题插槽 */
  title?: () => any
  /** 内容插槽 */
  content?: () => any
}

/**
 * 气泡组件实例
 */
export interface PopoverInstance {
  /** 显示气泡 */
  show: () => void
  /** 隐藏气泡 */
  hide: () => void
  /** 原生气泡实例 */
  $popoverInstance: any
} 