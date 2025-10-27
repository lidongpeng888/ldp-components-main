# Dropdown 下拉菜单组件

基于 Ant Design Vue 的 `a-dropdown` 组件封装，提供更丰富的功能和更灵活的配置。

## 功能特点

- 支持 hover、click、contextmenu（右键菜单）三种触发方式
- 支持 12 个方向的定位选项，可自动调整位置避免超出视口
- 支持手动控制显示隐藏
- 支持箭头指示器
- 支持图标菜单项
- 支持移动端自适应
- 完全兼容 Ant Design Vue 的 Dropdown 组件 API

## 基础用法

```vue
<template>
  <custom-dropdown>
    <a-button>
      下拉菜单 <down-outlined />
    </a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">菜单项 1</a-menu-item>
        <a-menu-item key="2">菜单项 2</a-menu-item>
        <a-menu-item key="3">菜单项 3</a-menu-item>
      </a-menu>
    </template>
  </custom-dropdown>
</template>
```

## 不同触发方式

```vue
<template>
  <!-- 悬停触发 (默认) -->
  <custom-dropdown>
    <a-button>悬停触发</a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">菜单项 1</a-menu-item>
        <a-menu-item key="2">菜单项 2</a-menu-item>
      </a-menu>
    </template>
  </custom-dropdown>

  <!-- 点击触发 -->
  <custom-dropdown trigger="click">
    <a-button>点击触发</a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">菜单项 1</a-menu-item>
        <a-menu-item key="2">菜单项 2</a-menu-item>
      </a-menu>
    </template>
  </custom-dropdown>

  <!-- 右键菜单触发 -->
  <custom-dropdown trigger="contextmenu">
    <a-button>右键点击</a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">菜单项 1</a-menu-item>
        <a-menu-item key="2">菜单项 2</a-menu-item>
      </a-menu>
    </template>
  </custom-dropdown>
</template>
```

## 不同位置

```vue
<template>
  <custom-dropdown placement="bottomLeft">
    <a-button>下左</a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">菜单项</a-menu-item>
      </a-menu>
    </template>
  </custom-dropdown>

  <custom-dropdown placement="bottom">
    <a-button>下中</a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">菜单项</a-menu-item>
      </a-menu>
    </template>
  </custom-dropdown>

  <custom-dropdown placement="bottomRight">
    <a-button>下右</a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">菜单项</a-menu-item>
      </a-menu>
    </template>
  </custom-dropdown>

  <custom-dropdown placement="topLeft">
    <a-button>上左</a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">菜单项</a-menu-item>
      </a-menu>
    </template>
  </custom-dropdown>
</template>
```

## 带箭头指示器

```vue
<template>
  <custom-dropdown :arrow="true">
    <a-button>带箭头</a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">菜单项 1</a-menu-item>
        <a-menu-item key="2">菜单项 2</a-menu-item>
      </a-menu>
    </template>
  </custom-dropdown>
</template>
```

## 手动控制

```vue
<template>
  <custom-dropdown ref="dropdownRef" :manual-control="true">
    <a-button>手动控制</a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">菜单项 1</a-menu-item>
        <a-menu-item key="2">菜单项 2</a-menu-item>
      </a-menu>
    </template>
  </custom-dropdown>

  <a-button @click="showDropdown">显示</a-button>
  <a-button @click="hideDropdown">隐藏</a-button>
  <a-button @click="toggleDropdown">切换</a-button>
</template>

<script setup>
import { ref } from 'vue'

const dropdownRef = ref(null)

const showDropdown = () => {
  dropdownRef.value.show()
}

const hideDropdown = () => {
  dropdownRef.value.hide()
}

const toggleDropdown = () => {
  dropdownRef.value.toggle()
}
</script>
```

## 带图标的菜单项

```vue
<template>
  <custom-dropdown :with-icon="true">
    <a-button>带图标菜单</a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">
          <template #icon><user-outlined /></template>
          用户
        </a-menu-item>
        <a-menu-item key="2">
          <template #icon><setting-outlined /></template>
          设置
        </a-menu-item>
        <a-menu-item key="3">
          <template #icon><logout-outlined /></template>
          退出
        </a-menu-item>
      </a-menu>
    </template>
  </custom-dropdown>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| trigger | 触发方式 | `'hover'` \| `'click'` \| `'contextmenu'` \| `Array<'hover' \| 'click' \| 'contextmenu'>` | `'hover'` |
| placement | 下拉菜单位置 | `'top'` \| `'topLeft'` \| `'topRight'` \| `'topCenter'` \| `'bottom'` \| `'bottomLeft'` \| `'bottomRight'` \| `'bottomCenter'` | `'bottomLeft'` |
| arrow | 是否显示箭头 | `boolean` | `false` |
| autoAdjust | 是否自动调整位置 | `boolean` | `true` |
| withIcon | 菜单项是否带图标 | `boolean` | `false` |
| manualControl | 是否支持手动控制显示隐藏 | `boolean` | `false` |
| visible | 菜单是否可见 | `boolean` | - |
| open | 菜单是否可见 (Vue 3 命名) | `boolean` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| closeOnClick | 点击菜单项后是否自动关闭 | `boolean` | `true` |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |

### 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:visible | 菜单显示状态变化事件 | `(visible: boolean) => void` |
| update:open | 菜单显示状态变化事件 (Vue 3 命名) | `(open: boolean) => void` |
| click | 点击菜单项事件 | `(key: string \| number, event: MouseEvent) => void` |
| visibleChange | 菜单显示状态变化事件 | `(visible: boolean) => void` |
| openChange | 菜单显示状态变化事件 (Vue 3 命名) | `(open: boolean) => void` |

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 触发元素 |
| overlay | 下拉菜单内容 (兼容 Ant Design Vue 3.x) |
| menu | 下拉菜单内容 (兼容 Ant Design Vue 4.x) |

### 方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| show | 手动显示下拉菜单 | - |
| hide | 手动隐藏下拉菜单 | - |
| toggle | 手动切换下拉菜单显示状态 | - | 