/**
 * Dropdown 组件专用 Hooks
 */

import { ref, computed, onMounted, onUnmounted, nextTick, watch, type Ref } from 'vue'
import { useEventListener, onClickOutside } from '@vueuse/core'
import type { DropdownTrigger, DropdownPlacement } from './types'

/**
 * 移动端检测 Hook
 */
export function useMobileDetection() {
  const isMobile = ref(false)

  const checkMobile = () => {
    isMobile.value =
      window.innerWidth <= 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })

  return {
    isMobile
  }
}

/**
 * 下拉菜单位置自动调整 Hook
 */
export function useDropdownPosition(
  triggerRef: Ref<HTMLElement | null>,
  dropdownRef: Ref<HTMLElement | null>,
  placement: Ref<DropdownPlacement>,
  autoAdjust: Ref<boolean>
) {
  // 计算最终位置
  const finalPlacement = ref<DropdownPlacement>(placement.value)
  
  // 调整位置函数
  const adjustPosition = () => {
    if (!autoAdjust.value || !triggerRef.value || !dropdownRef.value) {
      finalPlacement.value = placement.value
      return
    }

    const triggerRect = triggerRef.value.getBoundingClientRect()
    const dropdownRect = dropdownRef.value.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    
    // 获取原始方向
    const originalPlacement = placement.value
    let adjustedPlacement = originalPlacement
    
    // 检查顶部空间
    const hasTopSpace = triggerRect.top > dropdownRect.height
    // 检查底部空间
    const hasBottomSpace = viewportHeight - triggerRect.bottom > dropdownRect.height
    // 检查左侧空间
    const hasLeftSpace = triggerRect.left > dropdownRect.width
    // 检查右侧空间
    const hasRightSpace = viewportWidth - triggerRect.right > dropdownRect.width
    
    // 根据空间调整位置
    if (originalPlacement.startsWith('top') && !hasTopSpace && hasBottomSpace) {
      // 从上到下
      adjustedPlacement = originalPlacement.replace('top', 'bottom') as DropdownPlacement
    } else if (originalPlacement.startsWith('bottom') && !hasBottomSpace && hasTopSpace) {
      // 从下到上
      adjustedPlacement = originalPlacement.replace('bottom', 'top') as DropdownPlacement
    } else if (originalPlacement === 'topLeft' && !hasLeftSpace) {
      // 从左到右
      adjustedPlacement = 'topRight'
    } else if (originalPlacement === 'topRight' && !hasRightSpace) {
      // 从右到左
      adjustedPlacement = 'topLeft'
    }
    
    finalPlacement.value = adjustedPlacement
  }
  
  // 监听窗口大小变化
  useEventListener(window, 'resize', adjustPosition)
  
  // 监听滚动事件
  useEventListener(window, 'scroll', adjustPosition)
  
  // 监听位置变化
  watch(placement, () => {
    nextTick(adjustPosition)
  })
  
  return {
    finalPlacement,
    adjustPosition
  }
}

/**
 * 下拉菜单触发控制 Hook
 */
export function useDropdownTrigger(
  triggerRef: Ref<HTMLElement | null>,
  dropdownRef: Ref<HTMLElement | null>,
  trigger: Ref<DropdownTrigger | DropdownTrigger[] | undefined>,
  disabled: Ref<boolean | undefined>,
  manualControl: Ref<boolean | undefined>,
  emit: any
) {
  // 下拉菜单显示状态
  const isVisible = ref(false)
  
  // 计算实际触发方式
  const triggerTypes = computed<DropdownTrigger[]>(() => {
    if (!trigger.value) return ['hover']
    return Array.isArray(trigger.value) ? trigger.value : [trigger.value]
  })
  
  // 显示下拉菜单
  const show = () => {
    if (disabled.value) return
    isVisible.value = true
    emit('update:visible', true)
    emit('update:open', true)
    emit('visibleChange', true)
    emit('openChange', true)
  }
  
  // 隐藏下拉菜单
  const hide = () => {
    isVisible.value = false
    emit('update:visible', false)
    emit('update:open', false)
    emit('visibleChange', false)
    emit('openChange', false)
  }
  
  // 切换下拉菜单显示状态
  const toggle = () => {
    if (isVisible.value) {
      hide()
    } else {
      show()
    }
  }
  
  // 鼠标进入事件
  const handleMouseEnter = () => {
    if (disabled.value || manualControl.value) return
    if (triggerTypes.value.includes('hover')) {
      show()
    }
  }
  
  // 鼠标离开事件
  const handleMouseLeave = () => {
    if (disabled.value || manualControl.value) return
    if (triggerTypes.value.includes('hover')) {
      setTimeout(() => {
        hide()
      }, 100)
    }
  }
  
  // 点击事件
  const handleClick = (e: MouseEvent) => {
    if (disabled.value) return
    if (triggerTypes.value.includes('click')) {
      if (manualControl.value) return
      toggle()
      e.stopPropagation()
    }
  }
  
  // 右键菜单事件
  const handleContextMenu = (e: MouseEvent) => {
    if (disabled.value) return
    if (triggerTypes.value.includes('contextmenu')) {
      e.preventDefault()
      if (manualControl.value) return
      show()
    }
  }
  
  // 点击外部关闭
  onClickOutside(dropdownRef, (event: Event) => {
    // 如果点击的是触发元素，不处理
    if (triggerRef.value && triggerRef.value.contains(event.target as Node)) {
      return
    }
    
    // 如果是右键菜单模式，总是关闭
    if (triggerTypes.value.includes('contextmenu')) {
      hide()
      return
    }
    
    // 如果是点击模式，点击外部关闭
    if (triggerTypes.value.includes('click') && isVisible.value) {
      hide()
    }
  })
  
  // 监听 ESC 键关闭
  useEventListener(window, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isVisible.value) {
      hide()
    }
  })
  
  return {
    isVisible,
    show,
    hide,
    toggle,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    handleContextMenu
  }
} 