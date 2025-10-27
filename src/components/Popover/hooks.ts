/**
 * Popover 组件专用 Hooks
 */

import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import type { PopoverPlacement } from './types'

/**
 * 位置检测 Hook
 * @param triggerRef 触发元素引用
 * @param placement 气泡位置
 */
export function usePlacementDetection(
  triggerRef: Ref<HTMLElement | null>,
  placement: Ref<PopoverPlacement>
) {
  // 检测最佳位置
  const detectBestPlacement = () => {
    if (!triggerRef.value) return
    
    const el = triggerRef.value
    const rect = el.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // 计算元素在视口中的位置
    const top = rect.top
    const bottom = viewportHeight - rect.bottom
    const left = rect.left
    const right = viewportWidth - rect.right
    
    // 确定最佳位置
    const positions: [string, number][] = [
      ['top', top],
      ['bottom', bottom],
      ['left', left],
      ['right', right]
    ]
    
    // 按可用空间排序
    positions.sort((a, b) => b[1] - a[1])
    
    // 获取最佳基础位置
    const bestBase = positions[0][0] as 'top' | 'bottom' | 'left' | 'right'
    
    // 确定水平/垂直对齐
    let align = ''
    if (bestBase === 'top' || bestBase === 'bottom') {
      if (left < right && left < 100) align = 'Left'
      else if (right < left && right < 100) align = 'Right'
    } else if (bestBase === 'left' || bestBase === 'right') {
      if (top < bottom && top < 100) align = 'Top'
      else if (bottom < top && bottom < 100) align = 'Bottom'
    }
    
    // 返回最佳位置
    return `${bestBase}${align}` as PopoverPlacement
  }
  
  // 自动调整位置
  const adjustPlacement = () => {
    const bestPlacement = detectBestPlacement()
    if (bestPlacement) {
      placement.value = bestPlacement
    }
  }
  
  return {
    adjustPlacement
  }
}

/**
 * 边界检测 Hook
 * @param popoverRef 气泡元素引用
 */
export function useBoundaryDetection(popoverRef: Ref<any>) {
  // 检测边界并调整位置
  const checkBoundary = () => {
    if (!popoverRef.value) return
    
    // 获取气泡元素
    const popoverEl = document.querySelector('.ant-popover')
    if (!popoverEl) return
    
    const rect = popoverEl.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // 检查是否超出视口
    const isOutOfLeft = rect.left < 0
    const isOutOfRight = rect.right > viewportWidth
    const isOutOfTop = rect.top < 0
    const isOutOfBottom = rect.bottom > viewportHeight
    
    // 调整位置
    if (isOutOfLeft) {
      (popoverEl as HTMLElement).style.left = '0px'
    }
    
    if (isOutOfRight) {
      const overflow = rect.right - viewportWidth
      (popoverEl as HTMLElement).style.left = `${rect.left - overflow - 10}px`
    }
    
    if (isOutOfTop) {
      (popoverEl as HTMLElement).style.top = '0px'
    }
    
    if (isOutOfBottom) {
      const overflow = rect.bottom - viewportHeight
      (popoverEl as HTMLElement).style.top = `${rect.top - overflow - 10}px`
    }
  }
  
  return {
    checkBoundary
  }
}

/**
 * 触发器管理 Hook
 * @param triggerRef 触发元素引用
 * @param trigger 触发方式
 * @param onShow 显示回调
 * @param onHide 隐藏回调
 */
export function useTriggerEvents(
  triggerRef: Ref<HTMLElement | null>,
  trigger: Ref<string | string[]>,
  onShow: () => void,
  onHide: () => void
) {
  // 事件监听器集合
  const listeners: { type: string; handler: (e: Event) => void; element: HTMLElement | Document }[] = []
  
  // 添加事件监听
  const addListener = (element: HTMLElement | Document, type: string, handler: (e: Event) => void) => {
    element.addEventListener(type, handler)
    listeners.push({ type, handler, element })
  }
  
  // 移除所有事件监听
  const removeAllListeners = () => {
    listeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler)
    })
    listeners.length = 0
  }
  
  // 初始化触发器事件
  const initTriggerEvents = () => {
    if (!triggerRef.value) return
    
    // 清除之前的监听器
    removeAllListeners()
    
    const el = triggerRef.value
    const triggers = Array.isArray(trigger.value) ? trigger.value : [trigger.value]
    
    // 添加触发器事件
    triggers.forEach(triggerType => {
      switch (triggerType) {
        case 'hover':
          addListener(el, 'mouseenter', onShow)
          addListener(el, 'mouseleave', onHide)
          break
          
        case 'focus':
          addListener(el, 'focus', onShow)
          addListener(el, 'blur', onHide)
          break
          
        case 'click':
          addListener(el, 'click', (e) => {
            e.preventDefault()
            onShow()
          })
          addListener(document, 'click', (e) => {
            if (e.target !== el && !el.contains(e.target as Node)) {
              onHide()
            }
          })
          break
          
        case 'contextmenu':
          addListener(el, 'contextmenu', (e) => {
            e.preventDefault()
            onShow()
          })
          addListener(document, 'click', (e) => {
            if (e.target !== el && !el.contains(e.target as Node)) {
              onHide()
            }
          })
          break
      }
    })
  }
  
  // 组件卸载时清理
  onUnmounted(() => {
    removeAllListeners()
  })
  
  return {
    initTriggerEvents,
    removeAllListeners
  }
} 