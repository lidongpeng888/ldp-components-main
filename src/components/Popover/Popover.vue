<template>
  <div class="custom-popover-wrapper" :class="wrapperClasses">
    <!-- 基于 a-popover 封装 -->
    <a-popover
      ref="popoverRef"
      v-bind="$attrs"
      :title="title"
      :content="rich ? undefined : content"
      :visible="visible"
      :placement="placement"
      :trigger="trigger"
      :mouse-enter-delay="mouseEnterDelay"
      :mouse-leave-delay="mouseLeaveDelay"
      :overlay-style="overlayStyle"
      :overlay-class-name="overlayClassName"
      :arrow-point-at-center="arrowPointAtCenter"
      :auto-adjust-overflow="autoAdjustOverflow"
      :destroy-tooltip-on-hide="destroyTooltipOnHide"
      :get-popup-container="getPopupContainer"
      :class="popoverClasses"
      @visibleChange="handleVisibleChange"
    >
      <!-- 默认插槽 -->
      <template #default>
        <slot />
      </template>
      
      <!-- 标题插槽 -->
      <template #title v-if="$slots.title">
        <slot name="title" />
      </template>
      <template #title v-else-if="title">
        <div class="custom-popover-title">{{ title }}</div>
      </template>
      
      <!-- 内容插槽 -->
      <template #content>
        <slot name="content" v-if="$slots.content" />
        <div v-else-if="content" class="custom-popover-content" :class="contentClasses">
          <div v-if="rich && typeof content === 'string'" v-html="content"></div>
          <div v-else>{{ content }}</div>
        </div>
      </template>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Popover } from 'ant-design-vue'
import type { PopoverProps, PopoverEmits, PopoverInstance } from './types'

// 定义组件名称
defineOptions({
  name: 'Popover',
  inheritAttrs: false
})

// 定义 Props
const props = withDefaults(defineProps<PopoverProps>(), {
  title: undefined,
  content: undefined,
  visible: undefined,
  placement: 'top',
  trigger: 'hover',
  mouseEnterDelay: 0.1,
  mouseLeaveDelay: 0.1,
  overlayStyle: undefined,
  overlayClassName: undefined,
  arrowPointAtCenter: false,
  autoAdjustOverflow: true,
  destroyTooltipOnHide: false,
  getPopupContainer: undefined,
  rich: false,
  theme: 'light',
  maxWidth: undefined,
  showArrow: true,
  offset: undefined
})

// 定义 Emits
const emit = defineEmits<PopoverEmits>()

// 组件引用
const popoverRef = ref<InstanceType<typeof Popover> | null>(null)

// 内部状态
const internalVisible = ref<boolean>(!!props.visible)

// 监听 visible 属性变化
watch(() => props.visible, (newVal) => {
  if (newVal !== undefined) {
    internalVisible.value = newVal
  }
})

// 处理可见性变化
const handleVisibleChange = (visible: boolean) => {
  internalVisible.value = visible
  emit('update:visible', visible)
  emit('visibleChange', visible)
}

// 计算包装器类名
const wrapperClasses = computed(() => {
  return {
    [`custom-popover-theme-${props.theme}`]: props.theme,
    'custom-popover-no-arrow': !props.showArrow
  }
})

// 计算气泡类名
const popoverClasses = computed(() => {
  return {
    'custom-popover': true
  }
})

// 计算内容类名
const contentClasses = computed(() => {
  return {
    'custom-popover-content-rich': props.rich
  }
})

// 渲染富文本内容
const renderContent = computed(() => {
  // 如果是富文本内容，直接返回内容字符串，由v-html指令处理
  return props.content
})

// 手动控制显示/隐藏
const show = () => {
  if (popoverRef.value) {
    internalVisible.value = true
    emit('update:visible', true)
    emit('visibleChange', true)
  }
}

const hide = () => {
  if (popoverRef.value) {
    internalVisible.value = false
    emit('update:visible', false)
    emit('visibleChange', false)
  }
}

// 处理边界检测和位置调整
onMounted(() => {
  nextTick(() => {
    // 如果设置了偏移量，应用自定义偏移
    if (props.offset && popoverRef.value) {
      const popoverEl = popoverRef.value.$el
      if (popoverEl) {
        const popupEl = document.querySelector('.ant-popover')
        if (popupEl) {
          const [x, y] = Array.isArray(props.offset) ? props.offset : [props.offset, props.offset]
          
          // 监听弹出层显示
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const style = (mutation.target as HTMLElement).style
                const transform = style.transform
                
                if (transform) {
                  // 提取当前的 translate 值
                  const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/)
                  if (match) {
                    const currentX = parseFloat(match[1])
                    const currentY = parseFloat(match[2])
                    
                    // 应用自定义偏移
                    style.transform = `translate(${currentX + x}px, ${currentY + y}px)`
                  }
                }
              }
            })
          })
          
          // 开始观察
          observer.observe(popupEl, { attributes: true })
          
          // 组件卸载时停止观察
          onUnmounted(() => {
            observer.disconnect()
          })
        }
      }
    }
    
    // 如果设置了最大宽度，应用样式
    if (props.maxWidth && popoverRef.value) {
      const popoverEl = popoverRef.value.$el
      if (popoverEl) {
        const popupEl = document.querySelector('.ant-popover-inner-content')
        if (popupEl) {
          (popupEl as HTMLElement).style.maxWidth = typeof props.maxWidth === 'number' 
            ? `${props.maxWidth}px` 
            : props.maxWidth
        }
      }
    }
  })
})

// 暴露组件实例方法
const instance: PopoverInstance = {
  show,
  hide,
  get $popoverInstance() {
    return popoverRef.value
  }
}

defineExpose(instance)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.custom-popover-wrapper {
  display: inline-block;
  
  :deep(.ant-popover) {
    &.custom-popover {
      .ant-popover-inner {
        border-radius: 4px;
        box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
      }
      
      .ant-popover-title {
        padding: 12px 16px;
        font-weight: 500;
        border-bottom: 1px solid #f0f0f0;
      }
      
      .ant-popover-inner-content {
        padding: 12px 16px;
      }
    }
  }
}

// 主题样式
.custom-popover-theme-light {
  :deep(.ant-popover) {
    .ant-popover-inner {
      background-color: #fff;
    }
    
    .ant-popover-arrow {
      border-top-color: #fff;
      border-left-color: #fff;
    }
  }
}

.custom-popover-theme-dark {
  :deep(.ant-popover) {
    .ant-popover-inner {
      background-color: #1f1f1f;
      
      .ant-popover-title {
        color: rgba(255, 255, 255, 0.85);
        border-bottom-color: #303030;
      }
      
      .ant-popover-inner-content {
        color: rgba(255, 255, 255, 0.85);
      }
    }
    
    .ant-popover-arrow {
      border-top-color: #1f1f1f;
      border-left-color: #1f1f1f;
    }
  }
}

// 富文本内容样式
.custom-popover-content-rich {
  :deep(a) {
    color: #1890ff;
    text-decoration: none;
    
    &:hover {
      color: #40a9ff;
      text-decoration: underline;
    }
  }
  
  :deep(p) {
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  :deep(ul, ol) {
    padding-left: 20px;
    margin-bottom: 8px;
  }
}

// 无箭头样式
.custom-popover-no-arrow {
  :deep(.ant-popover-arrow) {
    display: none;
  }
}
</style> 