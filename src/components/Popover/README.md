# Popover 气泡组件

基于 Ant Design Vue 的 `a-popover` 组件封装，提供灵活的气泡提示和内容展示功能。

## 功能特点

- 支持多种触发方式（hover、click、focus、右键）
- 支持 12 个方向的定位选项
- 支持边界检测和自动位置调整
- 支持纯文本和富文本内容
- 支持亮色和暗色两种主题
- 支持自定义偏移量和最大宽度
- 支持编程方式控制显示/隐藏
- 完全兼容 Ant Design Vue 的 Popover 组件 API

## 基础用法

```vue
<template>
  <custom-popover title="标题" content="这是一段内容">
    <a-button>悬停我</a-button>
  </custom-popover>
</template>

<script setup>
import { CustomPopover } from '@/components'
</script>
```

## 不同触发方式

### 悬停触发

```vue
<template>
  <custom-popover title="标题" content="这是一段内容" trigger="hover">
    <a-button>悬停我</a-button>
  </custom-popover>
</template>
```

### 点击触发

```vue
<template>
  <custom-popover title="标题" content="这是一段内容" trigger="click">
    <a-button>点击我</a-button>
  </custom-popover>
</template>
```

### 聚焦触发

```vue
<template>
  <custom-popover title="标题" content="这是一段内容" trigger="focus">
    <a-input placeholder="点击输入框" />
  </custom-popover>
</template>
```

### 右键菜单触发

```vue
<template>
  <custom-popover title="右键菜单" content="这是一个右键菜单" trigger="contextmenu">
    <div style="width: 200px; height: 100px; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center;">
      右键点击此区域
    </div>
  </custom-popover>
</template>
```

## 不同位置

```vue
<template>
  <div style="display: flex; flex-wrap: wrap; gap: 16px;">
    <custom-popover content="上方气泡" placement="top">
      <a-button>上方</a-button>
    </custom-popover>
    
    <custom-popover content="下方气泡" placement="bottom">
      <a-button>下方</a-button>
    </custom-popover>
    
    <custom-popover content="左侧气泡" placement="left">
      <a-button>左侧</a-button>
    </custom-popover>
    
    <custom-popover content="右侧气泡" placement="right">
      <a-button>右侧</a-button>
    </custom-popover>
    
    <custom-popover content="左上角气泡" placement="topLeft">
      <a-button>左上角</a-button>
    </custom-popover>
    
    <custom-popover content="右上角气泡" placement="topRight">
      <a-button>右上角</a-button>
    </custom-popover>
  </div>
</template>
```

## 富文本内容

```vue
<template>
  <custom-popover 
    title="富文本内容" 
    content="<p>这是一段<strong>富文本</strong>内容，支持 <a href='#'>链接</a>。</p><ul><li>列表项 1</li><li>列表项 2</li></ul>"
    :rich="true"
  >
    <a-button>富文本内容</a-button>
  </custom-popover>
</template>
```

## 暗色主题

```vue
<template>
  <custom-popover 
    content="这是一个暗色主题的气泡" 
    theme="dark"
  >
    <a-button>暗色主题</a-button>
  </custom-popover>
</template>
```

## 自定义内容

```vue
<template>
  <custom-popover>
    <template #content>
      <div style="padding: 8px;">
        <p>自定义内容区域</p>
        <a-button type="primary" size="small">操作按钮</a-button>
      </div>
    </template>
    <a-button>自定义内容</a-button>
  </custom-popover>
</template>
```

## 手动控制

```vue
<template>
  <div>
    <custom-popover 
      ref="popoverRef"
      title="手动控制" 
      content="这是一个手动控制的气泡" 
      v-model:visible="visible"
      trigger="click"
    >
      <a-button>点击控制</a-button>
    </custom-popover>
    
    <div style="margin-top: 16px;">
      <a-button @click="showPopover">显示气泡</a-button>
      <a-button @click="hidePopover" style="margin-left: 8px;">隐藏气泡</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const popoverRef = ref(null)
const visible = ref(false)

const showPopover = () => {
  popoverRef.value.show()
}

const hidePopover = () => {
  popoverRef.value.hide()
}
</script>
```

## 边界检测和位置调整

```vue
<template>
  <div style="display: flex; justify-content: space-between; width: 100%;">
    <custom-popover 
      content="这个气泡会自动调整位置，避免超出视口"
      :autoAdjustOverflow="true"
    >
      <a-button>边缘位置</a-button>
    </custom-popover>
  </div>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 气泡卡片标题 | `string \| VNode \| (() => VNode)` | - |
| content | 气泡卡片内容 | `string \| VNode \| (() => VNode)` | - |
| visible | 气泡是否可见 | `boolean` | - |
| placement | 气泡位置 | `PopoverPlacement` | `'top'` |
| trigger | 触发方式 | `PopoverTrigger \| PopoverTrigger[]` | `'hover'` |
| mouseEnterDelay | 鼠标移入后延时多少才显示气泡，单位：秒 | `number` | `0.1` |
| mouseLeaveDelay | 鼠标移出后延时多少才隐藏气泡，单位：秒 | `number` | `0.1` |
| overlayStyle | 浮层样式 | `CSSProperties` | - |
| overlayClassName | 浮层类名 | `string` | - |
| arrowPointAtCenter | 箭头是否指向目标元素中心 | `boolean` | `false` |
| autoAdjustOverflow | 气泡被遮挡时自动调整位置 | `boolean` | `true` |
| destroyTooltipOnHide | 隐藏后是否销毁气泡 | `boolean` | `false` |
| getPopupContainer | 浮层渲染父节点 | `(triggerNode: HTMLElement) => HTMLElement` | - |
| rich | 是否支持富文本内容 | `boolean` | `false` |
| theme | 气泡主题 | `'light' \| 'dark'` | `'light'` |
| maxWidth | 内容最大宽度 | `number \| string` | - |
| showArrow | 是否显示箭头 | `boolean` | `true` |
| offset | 气泡偏移量 [x, y] | `[number, number] \| number` | - |

### 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:visible | 气泡显示状态变化事件 | `(visible: boolean) => void` |
| visibleChange | 气泡显示状态变化事件 | `(visible: boolean) => void` |

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 触发元素 |
| title | 标题内容 |
| content | 内容区域 |

### 方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| show | 显示气泡 | - |
| hide | 隐藏气泡 | - |

### 类型定义

#### PopoverPlacement

```typescript
type PopoverPlacement = 
  | 'top' | 'left' | 'right' | 'bottom' 
  | 'topLeft' | 'topRight' 
  | 'bottomLeft' | 'bottomRight' 
  | 'leftTop' | 'leftBottom' 
  | 'rightTop' | 'rightBottom'
```

#### PopoverTrigger

```typescript
type PopoverTrigger = 'hover' | 'focus' | 'click' | 'contextmenu'
```

#### PopoverTheme

```typescript
type PopoverTheme = 'light' | 'dark'
``` 