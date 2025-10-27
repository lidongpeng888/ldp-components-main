<template>
  <a-dropdown
    ref="dropdownRef"
    v-bind="$attrs"
    :trigger="computedTrigger"
    :placement="props.placement"
    :arrow="props.arrow"
    :disabled="props.disabled"
    :class="['custom-dropdown', props.className]"
    :visible="props.manualControl ? isVisible : undefined"
    @visibleChange="handleVisibleChange"
    @openChange="handleOpenChange"
  >
    <!-- 默认插槽 - 触发元素 -->
    <div
      ref="triggerRef"
      class="custom-dropdown-trigger"
      :class="{
        'custom-dropdown-trigger--disabled': props.disabled,
        'custom-dropdown-trigger--active': isVisible
      }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
      @contextmenu="handleContextMenu"
    >
      <slot />
    </div>

    <!-- 使用 overlay 插槽 -->
    <template #overlay>
      <slot name="overlay"></slot>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dropdown as ADropdown } from 'ant-design-vue'
import { useMobileDetection } from './hooks'
import type { DropdownProps, DropdownInstance } from './types'

// 定义组件名称
defineOptions({
  name: 'CustomDropdown',
  inheritAttrs: false
})

// 定义 Props
const props = withDefaults(defineProps<DropdownProps>(), {
  trigger: 'hover',
  placement: 'bottomLeft',
  arrow: false,
  autoAdjust: true,
  withIcon: false,
  manualControl: false,
  disabled: false,
  closeOnClick: true
})

// 定义 Emits
const emit = defineEmits<{
  'update:visible': [visible: boolean]
  'update:open': [open: boolean]
  'click': [key: string | number, event: MouseEvent]
  'visibleChange': [visible: boolean]
  'openChange': [open: boolean]
}>()

// 组件引用
const dropdownRef = ref<InstanceType<typeof ADropdown> | null>(null)
const triggerRef = ref<HTMLElement | null>(null)

// 使用移动端检测
const { isMobile } = useMobileDetection()

// 控制显示状态
const isVisible = ref(false)

// 计算触发方式
const computedTrigger = computed(() => {
  // 如果是手动控制，则不使用自动触发
  if (props.manualControl) {
    return []
  }
  
  // 如果是移动端，优先使用click触发
  if (isMobile.value) {
    return 'click'
  }
  
  return props.trigger
})

// 显示下拉菜单
const show = () => {
  if (props.disabled) return
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

// 事件处理
const handleMouseEnter = () => {
  if (props.disabled || props.manualControl) return
  if (props.trigger === 'hover' || (Array.isArray(props.trigger) && props.trigger.includes('hover'))) {
    show()
  }
}

const handleMouseLeave = () => {
  if (props.disabled || props.manualControl) return
  if (props.trigger === 'hover' || (Array.isArray(props.trigger) && props.trigger.includes('hover'))) {
    setTimeout(() => {
      hide()
    }, 100)
  }
}

const handleClick = (e: MouseEvent) => {
  if (props.disabled) return
  if (props.trigger === 'click' || (Array.isArray(props.trigger) && props.trigger.includes('click'))) {
    if (props.manualControl) return
    toggle()
    e.stopPropagation()
  }
}

const handleContextMenu = (e: MouseEvent) => {
  if (props.disabled) return
  if (props.trigger === 'contextmenu' || (Array.isArray(props.trigger) && props.trigger.includes('contextmenu'))) {
    e.preventDefault()
    if (props.manualControl) return
    show()
  }
}

const handleVisibleChange = (visible: boolean) => {
  isVisible.value = visible
  emit('visibleChange', visible)
}

const handleOpenChange = (open: boolean) => {
  isVisible.value = open
  emit('openChange', open)
}

// 暴露组件实例方法
const instance: DropdownInstance = {
  get $antDropdown() {
    return dropdownRef.value
  },
  show,
  hide,
  toggle
}

defineExpose(instance)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

// 下拉菜单触发器样式
.custom-dropdown-trigger {
  display: inline-block;
  position: relative;
  cursor: pointer;

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  &--active {
    // 激活状态样式
  }
}

// 下拉菜单样式
:deep(.ant-dropdown) {
  &.custom-dropdown-with-icon {
    .ant-dropdown-menu-item {
      .anticon {
        margin-right: 8px;
      }
    }
  }
}

// 右键菜单样式
:deep(.ant-dropdown-menu--contextmenu) {
  min-width: 160px;
}

// 移动端样式
@media (max-width: 768px) {
  :deep(.ant-dropdown) {
    max-width: 90vw;
  }
}
</style> 