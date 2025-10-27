<template>
  <a-spin
    ref="spinRef"
    v-bind="$attrs"
    :spinning="computedSpinning"
    :delay="computedDelay"
    :size="size"
    :tip="computedTip"
    :indicator="computedIndicator"
    :class="computedClass"
    :style="computedStyle"
    :wrapper-class-name="wrapperClassName"
    @update:spinning="handleSpinningChange"
  >
    <!-- 自定义指示器插槽 -->
    <template v-if="$slots.indicator" #indicator>
      <slot name="indicator" />
    </template>

    <!-- 自定义文本插槽 -->
    <template v-if="$slots.tip" #tip>
      <slot name="tip" />
    </template>

    <!-- 默认插槽内容 -->
    <slot />

    <!-- 取消按钮（仅在可取消时显示） -->
    <div v-if="cancelable && computedSpinning" class="loading-cancel">
      <slot name="cancel">
        <a-button size="small" @click="handleCancel">
          {{ cancelText }}
        </a-button>
      </slot>
    </div>
  </a-spin>

  <!-- 全屏遮罩 -->
  <teleport v-if="fullscreen && computedSpinning" to="body">
    <div class="loading-fullscreen-mask" :style="maskStyle">
      <div class="loading-fullscreen-content">
        <div
          :class="[
            'loading-indicator',
            `loading-style-${props.loadingStyle}`,
            `loading-${props.size}`
          ]"
        >
          <component v-if="computedIndicator" :is="computedIndicator" />
          <div v-else class="loading-default-indicator" />
        </div>
        <div v-if="computedTip" class="loading-fullscreen-text">
          {{ computedTip }}
        </div>
        <div v-if="cancelable" class="loading-fullscreen-cancel">
          <a-button @click="handleCancel">
            {{ cancelText }}
          </a-button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted, h, type CSSProperties } from 'vue'
import { Spin as ASpin, Button as AButton } from 'ant-design-vue'
import type { LoadingProps } from './types'

// 定义组件名称
defineOptions({
  name: 'Loading',
  inheritAttrs: false
})

// Props 定义
const props = withDefaults(defineProps<LoadingProps>(), {
  loadingStyle: 'spin',
  size: 'default',
  position: 'container',
  showText: true,
  delay: 0,
  fullscreen: false,
  maskColor: 'rgba(255, 255, 255, 0.8)',
  maskOpacity: 0.8,
  cancelable: false,
  cancelText: '取消',
  minDuration: 300,
  maxDuration: 30000
})

// Emits 定义
const emit = defineEmits<{
  cancel: []
  timeout: []
  show: []
  hide: []
}>()

// 组件引用
const spinRef = ref()

// 内部状态
const internalSpinning = ref(false)
const showTime = ref(0)
const hideTimer = ref<NodeJS.Timeout>()
const maxTimer = ref<NodeJS.Timeout>()

// 计算属性
const computedSpinning = computed(() => {
  return props.spinning !== undefined ? props.spinning : internalSpinning.value
})

const computedDelay = computed(() => {
  return props.delay || 0
})

const computedTip = computed(() => {
  if (!props.showText) return undefined
  return props.text || props.tip
})

const shouldUseCustomIndicator = computed(() => {
  return props.loadingStyle && props.loadingStyle !== 'spin'
})

const computedIndicator = computed(() => {
  // 如果有自定义图标或指示器，优先使用
  if (props.icon) {
    return typeof props.icon === 'string' ? props.icon : props.icon()
  }
  if (props.indicator) {
    return props.indicator
  }

  // 只有当使用自定义loadingStyle时才返回自定义指示器
  if (!shouldUseCustomIndicator.value) {
    return undefined
  }

  // 参考官方例子，使用h()函数创建简单的VNode
  const getSizeValue = () => {
    switch (props.size) {
      case 'small':
        return 14
      case 'large':
        return 32
      default:
        return 20
    }
  }

  const size = getSizeValue()

  // 根据样式类型返回自定义指示器
  if (props.loadingStyle === 'dots') {
    return h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }
      },
      [
        h('div', {
          style: {
            width: '8px',
            height: '8px',
            background: '#1890ff',
            borderRadius: '50%',
            animation: 'loading-dots 1.4s ease-in-out infinite both',
            animationDelay: '-0.32s'
          }
        }),
        h('div', {
          style: {
            width: '8px',
            height: '8px',
            background: '#1890ff',
            borderRadius: '50%',
            animation: 'loading-dots 1.4s ease-in-out infinite both',
            animationDelay: '-0.16s'
          }
        }),
        h('div', {
          style: {
            width: '8px',
            height: '8px',
            background: '#1890ff',
            borderRadius: '50%',
            animation: 'loading-dots 1.4s ease-in-out infinite both'
          }
        })
      ]
    )
  } else if (props.loadingStyle === 'bars') {
    const barHeight = props.size === 'small' ? 16 : props.size === 'large' ? 24 : 20
    return h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'flex-end',
          gap: '2px',
          height: `${barHeight}px`
        }
      },
      [
        h('div', {
          style: {
            width: '4px',
            height: '100%',
            background: '#1890ff',
            animation: 'loading-bars 1.2s ease-in-out infinite',
            animationDelay: '-0.24s'
          }
        }),
        h('div', {
          style: {
            width: '4px',
            height: '100%',
            background: '#1890ff',
            animation: 'loading-bars 1.2s ease-in-out infinite',
            animationDelay: '-0.12s'
          }
        }),
        h('div', {
          style: {
            width: '4px',
            height: '100%',
            background: '#1890ff',
            animation: 'loading-bars 1.2s ease-in-out infinite'
          }
        })
      ]
    )
  } else if (props.loadingStyle === 'pulse') {
    return h('div', {
      style: {
        width: `${size}px`,
        height: `${size}px`,
        background: '#1890ff',
        borderRadius: '50%',
        animation: 'loading-pulse 1.5s ease-in-out infinite'
      }
    })
  } else if (props.loadingStyle === 'wave') {
    const waveWidth = props.size === 'small' ? 30 : props.size === 'large' ? 50 : 40
    const waveHeight = props.size === 'small' ? 16 : props.size === 'large' ? 24 : 20
    return h('div', {
      style: {
        width: `${waveWidth}px`,
        height: `${waveHeight}px`,
        background: 'linear-gradient(90deg, transparent, #1890ff, transparent)',
        backgroundSize: '50% 100%',
        animation: 'loading-wave 1.5s ease-in-out infinite'
      }
    })
  } else if (props.loadingStyle === 'bounce') {
    return h('div', {
      style: {
        width: `${size}px`,
        height: `${size}px`,
        background: '#1890ff',
        borderRadius: '50%',
        animation: 'loading-bounce 2s ease-in-out infinite'
      }
    })
  }

  return undefined
})

const computedClass = computed(() => {
  const classes = ['custom-loading']

  if (props.loadingStyle) {
    classes.push(`loading-style-${props.loadingStyle}`)
  }

  if (props.position) {
    classes.push(`loading-position-${props.position}`)
  }

  if (props.className) {
    classes.push(props.className)
  }

  return classes.join(' ')
})

const computedStyle = computed((): CSSProperties => {
  const styles: CSSProperties = {}

  if (props.customStyle) {
    Object.assign(styles, props.customStyle)
  }

  return styles
})

const wrapperClassName = computed(() => {
  const classes = []

  if (props.fullscreen) {
    classes.push('loading-fullscreen-wrapper')
  }

  return classes.join(' ')
})

const maskStyle = computed((): CSSProperties => {
  return {
    backgroundColor: props.maskColor,
    opacity: props.maskOpacity
  }
})

// 监听 spinning 变化
watch(computedSpinning, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    handleShow()
  } else if (!newVal && oldVal) {
    handleHide()
  }
})

// 事件处理
const handleSpinningChange = (spinning: boolean) => {
  internalSpinning.value = spinning
}

const handleShow = () => {
  showTime.value = Date.now()

  // 设置最大显示时间
  if (props.maxDuration > 0) {
    maxTimer.value = setTimeout(() => {
      emit('timeout')
      if (props.cancelable) {
        handleCancel()
      }
    }, props.maxDuration)
  }

  emit('show')
}

const handleHide = () => {
  const duration = Date.now() - showTime.value

  // 清除定时器
  if (maxTimer.value) {
    clearTimeout(maxTimer.value)
    maxTimer.value = undefined
  }

  // 确保最小显示时间
  if (duration < props.minDuration) {
    const remainingTime = props.minDuration - duration
    hideTimer.value = setTimeout(() => {
      emit('hide')
    }, remainingTime)
  } else {
    emit('hide')
  }
}

const handleCancel = () => {
  // 清除所有定时器
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
    hideTimer.value = undefined
  }

  if (maxTimer.value) {
    clearTimeout(maxTimer.value)
    maxTimer.value = undefined
  }

  internalSpinning.value = false
  emit('cancel')
}

// 实例方法
const show = () => {
  internalSpinning.value = true
}

const hide = () => {
  internalSpinning.value = false
}

const toggle = () => {
  internalSpinning.value = !internalSpinning.value
}

const cancel = () => {
  handleCancel()
}

// 清理定时器
onUnmounted(() => {
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
  }
  if (maxTimer.value) {
    clearTimeout(maxTimer.value)
  }
})

// 暴露实例方法
defineExpose({
  $antSpin: spinRef,
  show,
  hide,
  toggle,
  cancel
})
</script>

<style scoped>
/* 全局动画定义，不受scoped限制 */
</style>

<style>
/* 动画定义需要是全局的，这样通过JavaScript创建的元素才能访问 */
@keyframes loading-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-dots {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes loading-bars {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}

@keyframes loading-wave {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
}

@keyframes loading-pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes loading-bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translateY(0);
  }
  40%,
  43% {
    transform: translateY(-20px);
  }
  70% {
    transform: translateY(-10px);
  }
  90% {
    transform: translateY(-4px);
  }
}
</style>

<style scoped>
.custom-loading {
  position: relative;
}

.loading-cancel {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
}

/* 全屏遮罩样式 */
.loading-fullscreen-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-fullscreen-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-fullscreen-text {
  color: #666;
  font-size: 14px;
}

.loading-fullscreen-cancel {
  margin-top: 8px;
}

/* 不同样式的加载指示器 */
.loading-indicator {
  display: inline-block;
}

/* 基础指示器样式 - 现在主要使用inline样式 */

.loading-default-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1890ff;
  border-radius: 50%;
  animation: loading-spin 1s linear infinite;
}

.loading-small .loading-default-indicator,
.loading-style-default.loading-small .loading-default-indicator {
  width: 14px;
  height: 14px;
}

.loading-large .loading-default-indicator,
.loading-style-default.loading-large .loading-default-indicator {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

/* 旋转样式 */
.loading-style-spin .loading-default-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1890ff;
  border-radius: 50%;
  animation: loading-spin 1s linear infinite;
}

.loading-style-spin.loading-small .loading-default-indicator,
.loading-small .loading-style-spin .loading-default-indicator {
  width: 14px;
  height: 14px;
}

.loading-style-spin.loading-large .loading-default-indicator,
.loading-large .loading-style-spin .loading-default-indicator {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

/* 旋转动画已移至全局样式 */

/* 点状样式 */
.loading-style-dots .loading-default-indicator {
  width: 60px;
  height: 20px;
  border: none;
  background: transparent;
  position: relative;
}

.loading-style-dots.loading-small .loading-default-indicator,
.loading-small .loading-style-dots .loading-default-indicator {
  width: 40px;
  height: 16px;
}

.loading-style-dots.loading-large .loading-default-indicator,
.loading-large .loading-style-dots .loading-default-indicator {
  width: 80px;
  height: 24px;
}

.loading-style-dots .loading-default-indicator::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  animation: loading-dots 1.4s ease-in-out infinite both;
  animation-delay: -0.32s;
}

.loading-style-dots .loading-default-indicator::after {
  content: '';
  position: absolute;
  left: 26px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  animation: loading-dots 1.4s ease-in-out infinite both;
  animation-delay: -0.16s;
}

/* 第三个点通过box-shadow实现 */
.loading-dots-third {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  animation: loading-dots 1.4s ease-in-out infinite both;
}

/* loading-dots动画已移至全局样式 */

/* 条状样式 */
.loading-style-bars .loading-default-indicator {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 20px;
}

.loading-style-bars.loading-small .loading-default-indicator,
.loading-small .loading-style-bars .loading-default-indicator {
  height: 16px;
  gap: 1px;
}

.loading-style-bars.loading-large .loading-default-indicator,
.loading-large .loading-style-bars .loading-default-indicator {
  height: 24px;
  gap: 3px;
}

/* loading-bars动画已移至全局样式 */

/* 波浪样式 */
.loading-style-wave .loading-default-indicator {
  width: 40px;
  height: 20px;
  border: none;
  background: linear-gradient(90deg, transparent, #1890ff, transparent);
  background-size: 50% 100%;
  animation: loading-wave 1.5s ease-in-out infinite;
}

.loading-style-wave.loading-small .loading-default-indicator,
.loading-small .loading-style-wave .loading-default-indicator {
  width: 30px;
  height: 16px;
}

.loading-style-wave.loading-large .loading-default-indicator,
.loading-large .loading-style-wave .loading-default-indicator {
  width: 50px;
  height: 24px;
}

/* loading-wave动画已移至全局样式 */

/* 脉冲样式 */
.loading-style-pulse .loading-default-indicator {
  width: 20px;
  height: 20px;
  border: none;
  background: #1890ff;
  border-radius: 50%;
  animation: loading-pulse 1.5s ease-in-out infinite;
}

.loading-style-pulse.loading-small .loading-default-indicator,
.loading-small .loading-style-pulse .loading-default-indicator {
  width: 14px;
  height: 14px;
}

.loading-style-pulse.loading-large .loading-default-indicator,
.loading-large .loading-style-pulse .loading-default-indicator {
  width: 32px;
  height: 32px;
}

/* loading-pulse动画已移至全局样式 */

/* 弹跳样式 */
.loading-style-bounce .loading-default-indicator {
  width: 20px;
  height: 20px;
  border: none;
  background: #1890ff;
  border-radius: 50%;
  animation: loading-bounce 2s ease-in-out infinite;
}

.loading-style-bounce.loading-small .loading-default-indicator,
.loading-small .loading-style-bounce .loading-default-indicator {
  width: 14px;
  height: 14px;
}

.loading-style-bounce.loading-large .loading-default-indicator,
.loading-large .loading-style-bounce .loading-default-indicator {
  width: 32px;
  height: 32px;
}

/* loading-bounce动画已移至全局样式 */

/* 位置样式 */
.loading-position-global {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.loading-position-inline {
  display: inline-block;
  vertical-align: middle;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-fullscreen-content {
    padding: 20px;
  }

  .loading-cancel {
    bottom: 40px;
  }
}
</style>
