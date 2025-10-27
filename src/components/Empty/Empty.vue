<template>
  <a-empty
    ref="emptyRef"
    v-bind="$attrs"
    :image="computedImage"
    :description="computedDescription"
    :class="computedClass"
    :style="computedStyle"
  >
    <!-- 自定义图标插槽 -->
    <template v-if="$slots.image" #image>
      <slot name="image" />
    </template>

    <!-- 自定义描述插槽 -->
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>

    <!-- 默认插槽内容 -->
    <template v-if="$slots.default" #default>
      <slot />
    </template>

    <!-- 操作区域 -->
    <template v-if="hasActions || $slots.actions" #default>
      <slot name="actions">
        <div class="empty-actions">
          <!-- 预设操作按钮 -->
          <template v-if="showRetry">
            <a-button type="primary" :loading="retryLoading" @click="handleRetry">
              {{ retryText }}
            </a-button>
          </template>

          <template v-if="showFeedback">
            <a-button type="default" @click="handleFeedback">
              {{ feedbackText }}
            </a-button>
          </template>

          <!-- 自定义操作按钮 -->
          <template v-if="actions && actions.length > 0">
            <a-button
              v-for="(action, index) in actions"
              :key="index"
              :type="action.type || 'default'"
              :size="action.size"
              :loading="action.loading"
              :disabled="action.disabled"
              @click="handleActionClick(action, index)"
            >
              <template v-if="action.icon" #icon>
                <component :is="action.icon" />
              </template>
              {{ action.text }}
            </a-button>
          </template>
        </div>
      </slot>
    </template>
  </a-empty>
</template>

<script setup lang="ts">
import { computed, ref, h, type CSSProperties } from 'vue'
import { Empty as AEmpty, Button as AButton } from 'ant-design-vue'
import type { EmptyProps, ActionButton, ScenarioConfig } from './types'

// 使用内置图标，避免外部依赖
const createIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    inbox: '📦',
    wifi: '📶',
    lock: '🔒',
    search: '🔍',
    exclamation: '⚠️'
  }
  return iconMap[type] || '📦'
}

// 定义组件名称
defineOptions({
  name: 'Empty',
  inheritAttrs: false
})

// Props 定义
const props = withDefaults(defineProps<EmptyProps>(), {
  scenario: 'default',
  showRetry: false,
  retryText: '重试',
  showFeedback: false,
  feedbackText: '反馈问题'
})

// Emits 定义
const emit = defineEmits<{
  retry: []
  feedback: []
  actionClick: [action: ActionButton, index: number]
}>()

// 组件引用
const emptyRef = ref()
const retryLoading = ref(false)

// 预设场景配置
const scenarioConfigs: Record<string, ScenarioConfig> = {
  default: {
    title: '暂无内容',
    description: '',
    icon: () => h('div', { style: { fontSize: '64px', color: '#d9d9d9' } }, createIcon('inbox'))
  },
  'no-data': {
    title: '暂无数据',
    description: '当前没有可显示的数据',
    icon: () => h('div', { style: { fontSize: '64px', color: '#d9d9d9' } }, createIcon('inbox'))
  },
  'network-error': {
    title: '网络异常',
    description: '网络连接失败，请检查网络设置后重试',
    icon: () => h('div', { style: { fontSize: '64px', color: '#ff4d4f' } }, createIcon('wifi'))
  },
  'permission-denied': {
    title: '权限不足',
    description: '您没有访问此内容的权限，请联系管理员',
    icon: () => h('div', { style: { fontSize: '64px', color: '#faad14' } }, createIcon('lock'))
  },
  'search-no-result': {
    title: '搜索无结果',
    description: '没有找到符合条件的内容，请尝试其他关键词',
    icon: () => h('div', { style: { fontSize: '64px', color: '#d9d9d9' } }, createIcon('search'))
  },
  custom: {
    title: '',
    description: ''
  }
}

// 计算属性
const computedImage = computed(() => {
  if (props.icon) {
    return typeof props.icon === 'string' ? props.icon : props.icon()
  }

  const config = scenarioConfigs[props.scenario || 'default']
  return config.icon && typeof config.icon === 'function' ? config.icon() : config.icon
})

const computedDescription = computed(() => {
  const config = scenarioConfigs[props.scenario || 'default']

  // 如果同时传入了自定义标题和描述，拼接显示
  if (props.title && props.description) {
    return `${props.title}\n${props.description}`
  }

  // 如果只传入了自定义描述，直接使用
  if (props.description) {
    return props.description
  }

  // 如果只传入了自定义标题，使用自定义标题 + 场景描述
  if (props.title) {
    const desc = config.description
    return desc ? `${props.title}\n${desc}` : props.title
  }

  // 使用场景默认配置
  const title = config.title
  const desc = config.description
  return title ? `${title}\n${desc}` : desc
})

const computedClass = computed(() => {
  const classes = ['custom-empty']

  if (props.scenario) {
    classes.push(`empty-${props.scenario}`)
  }

  if (props.className) {
    classes.push(props.className)
  }

  return classes.join(' ')
})

const computedStyle = computed((): CSSProperties => {
  return {
    ...props.style
  }
})

const hasActions = computed(() => {
  return props.showRetry || props.showFeedback || (props.actions && props.actions.length > 0)
})

// 事件处理
const handleRetry = async () => {
  retryLoading.value = true
  try {
    emit('retry')
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    retryLoading.value = false
  }
}

const handleFeedback = () => {
  emit('feedback')
}

const handleActionClick = async (action: ActionButton, index: number) => {
  if (action.onClick) {
    await action.onClick()
  }
  emit('actionClick', action, index)
}

// 暴露实例方法
defineExpose({
  $antEmpty: emptyRef,
  triggerRetry: handleRetry,
  triggerFeedback: handleFeedback
})
</script>

<style scoped>
.custom-empty {
  padding: 40px 0;
}

.empty-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.empty-actions .ant-btn {
  min-width: 80px;
}

/* 不同场景的样式定制 */
.empty-no-data {
  color: rgba(0, 0, 0, 0.45);
}

.empty-network-error {
  color: #ff4d4f;
}

.empty-network-error :deep(.ant-empty-description) {
  color: #ff4d4f;
}

.empty-permission-denied {
  color: #faad14;
}

.empty-permission-denied :deep(.ant-empty-description) {
  color: #faad14;
}

.empty-search-no-result {
  color: rgba(0, 0, 0, 0.45);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .empty-actions {
    flex-direction: column;
    align-items: center;
  }

  .empty-actions .ant-btn {
    width: 120px;
  }
}
</style>
