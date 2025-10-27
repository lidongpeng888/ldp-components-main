# 组件开发指南

## 组件列表

当前组件库包含以下四个组件：

1. **DatePicker** - 日期选择器组件，基于 `a-date-picker` 封装
2. **Dropdown** - 下拉菜单组件，基于 `a-dropdown` 封装
3. **Popover** - 气泡组件，基于 `a-popover` 封装
4. **Selector** - 选择器组件，基于 `a-select` 和 `a-tree-select` 封装

## 组件结构

每个组件应该包含以下文件：

```
ComponentName/
├── index.ts          # 组件导出文件
├── ComponentName.vue # 组件实现
├── types.ts          # 组件类型定义
├── hooks.ts          # 组件专用 hooks（可选）
├── utils.ts          # 组件专用工具函数（可选）
├── style/            # 样式文件
│   ├── index.scss
│   └── variables.scss
├── __tests__/        # 测试文件
│   ├── ComponentName.test.ts
│   └── ComponentName.spec.ts
└── ComponentName.stories.ts # Storybook 文档
```

## 组件开发模板

### 1. 组件实现模板 (ComponentName.vue)

```vue
<template>
  <div :class="componentClasses" :style="componentStyles">
    <!-- 组件内容 -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { classNames } from '@/utils'
import type { ComponentNameProps } from './types'

// 定义组件名称
defineOptions({
  name: 'CustomComponentName'
})

// 定义 Props
const props = withDefaults(defineProps<ComponentNameProps>(), {
  // 默认值
})

// 定义 Emits
const emit = defineEmits<{
  change: [value: any]
  click: [event: MouseEvent]
}>()

// 计算属性
const componentClasses = computed(() => {
  return classNames(
    'custom-component-name',
    {
      [`custom-component-name--${props.size}`]: props.size,
      'custom-component-name--disabled': props.disabled
    },
    props.className
  )
})

const componentStyles = computed(() => {
  return {
    ...props.style
  }
})

// 方法
const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit('click', event)
}
</script>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
```

### 2. 类型定义模板 (types.ts)

```typescript
import type { CSSProperties } from 'vue'
import type { ComponentSize } from '@/types'

export interface ComponentNameProps {
  // 基础属性
  size?: ComponentSize
  disabled?: boolean
  className?: string
  style?: CSSProperties
  
  // 组件特有属性
  // ...
}

export interface ComponentNameEmits {
  change: (value: any) => void
  click: (event: MouseEvent) => void
}

export interface ComponentNameSlots {
  default?: () => any
  // 其他插槽
}
```

### 3. 导出文件模板 (index.ts)

```typescript
import ComponentName from './ComponentName.vue'
import type { App } from 'vue'

ComponentName.install = (app: App) => {
  app.component(ComponentName.name || 'CustomComponentName', ComponentName)
}

export default ComponentName
export * from './types'
```

### 4. 测试文件模板 (ComponentName.test.ts)

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentName from '../ComponentName.vue'

describe('ComponentName', () => {
  it('renders properly', () => {
    const wrapper = mount(ComponentName, {
      props: {
        // 测试属性
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })
  
  it('emits events correctly', async () => {
    const wrapper = mount(ComponentName)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
```

### 5. Storybook 文档模板 (ComponentName.stories.ts)

```typescript
import type { Meta, StoryObj } from '@storybook/vue3'
import ComponentName from './ComponentName.vue'

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        component: '组件描述'
      }
    }
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'middle', 'large']
    },
    disabled: {
      control: { type: 'boolean' }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // 默认参数
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}
```

## 开发规范

1. **命名规范**：组件名使用 PascalCase，文件名使用 kebab-case
2. **类型安全**：所有 props、emits、slots 都要有类型定义
3. **样式隔离**：使用 scoped 样式，避免全局污染
4. **测试覆盖**：每个组件都要有对应的测试文件
5. **文档完整**：每个组件都要有 Storybook 文档
6. **无障碍性**：遵循 ARIA 规范，支持键盘导航

8. **主题定制**：支持主题定制，与 Ant Design Vue 主题系统兼容