# Selector 选择器组件

基于 Ant Design Vue 的 `a-select` 和 `a-tree-select` 组件封装，提供统一的接口和增强功能。

## 功能特点

- 支持普通选择器和树形选择器模式切换
- 支持多选模式和标签展示
- 支持搜索/过滤功能和高亮显示
- 支持本地和远程数据源
- 支持选项分组和分组标题
- 支持远程搜索防抖和加载状态
- 支持虚拟滚动优化性能
- 支持选项和标签的自定义渲染
- 完全兼容 Ant Design Vue 的 Select 和 TreeSelect 组件 API

## 基础用法

```vue
<template>
  <custom-selector v-model="value" placeholder="请选择" :options="options" />
</template>

<script setup>
import { ref } from 'vue'

const value = ref(null)
const options = [
  { value: '1', label: '选项1' },
  { value: '2', label: '选项2' },
  { value: '3', label: '选项3' }
]
</script>
```

## 不同选择器类型

### 普通选择器

```vue
<template>
  <custom-selector 
    v-model="value" 
    :mode="{ type: 'select' }" 
    :options="options" 
  />
</template>
```

### 树形选择器

```vue
<template>
  <custom-selector 
    v-model="value" 
    :mode="{ type: 'tree-select' }" 
    :treeData="treeData" 
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref(null)
const treeData = [
  {
    title: '父节点1',
    value: '1',
    children: [
      {
        title: '子节点1.1',
        value: '1-1'
      },
      {
        title: '子节点1.2',
        value: '1-2'
      }
    ]
  },
  {
    title: '父节点2',
    value: '2'
  }
]
</script>
```

## 多选模式

```vue
<template>
  <custom-selector 
    v-model="values" 
    :mode="{ type: 'select', multiple: true }" 
    :options="options" 
  />
</template>

<script setup>
import { ref } from 'vue'

const values = ref([])
const options = [
  { value: '1', label: '选项1' },
  { value: '2', label: '选项2' },
  { value: '3', label: '选项3' }
]
</script>
```

## 搜索功能

```vue
<template>
  <custom-selector 
    v-model="value" 
    :mode="{ type: 'select', searchable: true }" 
    :options="options" 
    @search="handleSearch"
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref(null)
const options = ref([
  { value: '1', label: '选项1' },
  { value: '2', label: '选项2' },
  { value: '3', label: '选项3' }
])

const handleSearch = (searchValue) => {
  console.log('搜索值:', searchValue)
}
</script>
```

## 远程搜索

```vue
<template>
  <custom-selector 
    v-model="value" 
    :mode="{ type: 'select', searchable: true }" 
    :options="options" 
    :loading="loading"
    :searchConfig="{ remote: true, debounce: 500 }"
    @remoteSearch="handleRemoteSearch"
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref(null)
const options = ref([])
const loading = ref(false)

const handleRemoteSearch = async (searchValue) => {
  if (!searchValue) return
  
  loading.value = true
  try {
    // 模拟远程搜索
    const response = await fetch(`/api/search?q=${searchValue}`)
    const data = await response.json()
    options.value = data.map(item => ({
      value: item.id,
      label: item.name
    }))
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

## 动态数据源

```vue
<template>
  <custom-selector 
    v-model="value" 
    :dataSource="fetchData" 
    :loading="loading"
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref(null)
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    // 模拟远程数据获取
    const response = await fetch('/api/options')
    const data = await response.json()
    return data.map(item => ({
      value: item.id,
      label: item.name
    }))
  } catch (error) {
    console.error('获取数据失败:', error)
    return []
  } finally {
    loading.value = false
  }
}
</script>
```

## 选项分组

```vue
<template>
  <custom-selector 
    v-model="value" 
    :options="groupedOptions" 
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref(null)
const groupedOptions = [
  { value: '1', label: '选项1', groupLabel: '分组1' },
  { value: '2', label: '选项2', groupLabel: '分组1' },
  { value: '3', label: '选项3', groupLabel: '分组2' },
  { value: '4', label: '选项4', groupLabel: '分组2' }
]
</script>
```

## 虚拟滚动

```vue
<template>
  <custom-selector 
    v-model="value" 
    :mode="{ type: 'select', virtual: true }" 
    :options="largeDataset" 
    :virtualConfig="{ itemHeight: 32, threshold: 100 }"
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref(null)
const largeDataset = Array.from({ length: 10000 }, (_, index) => ({
  value: `${index}`,
  label: `选项 ${index}`
}))
</script>
```

## 自定义渲染

```vue
<template>
  <custom-selector 
    v-model="value" 
    :options="options"
  >
    <template #option="{ value, label }">
      <div style="display: flex; align-items: center;">
        <span style="margin-right: 8px;">🔍</span>
        <span>{{ label }} ({{ value }})</span>
      </div>
    </template>
    
    <template #tagRender="{ value, label, closable, onClose }">
      <a-tag :closable="closable" @close="onClose" style="margin-right: 3px;">
        {{ label }} ({{ value }})
      </a-tag>
    </template>
  </custom-selector>
</template>
```

## 平级数据转树形数据

```vue
<template>
  <custom-selector 
    v-model="value" 
    :mode="{ type: 'tree-select' }" 
    :treeData="treeData" 
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTreeDataConversion } from './hooks'

const value = ref(null)
const flatData = [
  { id: '1', name: '节点1', parentId: null },
  { id: '2', name: '节点2', parentId: null },
  { id: '1-1', name: '节点1.1', parentId: '1' },
  { id: '1-2', name: '节点1.2', parentId: '1' },
  { id: '2-1', name: '节点2.1', parentId: '2' }
]

const { convertToTree } = useTreeDataConversion()

// 转换为树形结构
const treeData = computed(() => {
  return convertToTree(flatData, 'id', 'parentId').map(node => ({
    value: node.id,
    title: node.name,
    children: node.children?.map(child => ({
      value: child.id,
      title: child.name,
      children: child.children || []
    }))
  }))
})
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 绑定值 | `any` | - |
| mode | 选择器模式 | `SelectorMode` | `{ type: 'select', multiple: false, searchable: false, virtual: false }` |
| dataSource | 数据源 | `SelectorOption[] \| SelectorTreeData[] \| (() => Promise<SelectorOption[] \| SelectorTreeData[]>)` | `[]` |
| options | 选择器选项(普通选择器) | `SelectorOption[]` | - |
| treeData | 树形选择器数据 | `SelectorTreeData[]` | - |
| placeholder | 占位文本 | `string` | `'请选择'` |
| loading | 是否加载中 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| allowClear | 是否可清空 | `boolean` | `true` |
| maxTagCount | 最多显示的标签数 | `number` | - |
| maxTagPlaceholder | 隐藏标签时显示的内容 | `any` | - |
| optionLabelProp | 选项标签属性 | `string` | `'label'` |
| optionFilterProp | 搜索时过滤对应的 option 属性 | `string` | `'label'` |
| listHeight | 设置弹窗滚动高度 | `number` | `256` |
| dropdownMatchSelectWidth | 下拉菜单和选择器同宽 | `boolean \| number` | `true` |
| dropdownStyle | 下拉菜单样式 | `CSSProperties` | - |
| dropdownClassName | 下拉菜单类名 | `string` | - |
| notFoundContent | 当下拉列表为空时显示的内容 | `string \| null` | `'无匹配数据'` |
| loadingTip | 加载中提示文本 | `string` | `'加载中...'` |
| treeDefaultExpandAll | 树形选择器默认展开所有树节点 | `boolean` | `false` |
| treeDefaultExpandedKeys | 树形选择器默认展开的树节点 | `string[]` | - |
| treeExpandedKeys | 树形选择器设置展开的树节点 | `string[]` | - |
| treeNodeFilterProp | 树形选择器搜索时过滤对应的 treeNode 属性 | `string` | `'title'` |
| treeNodeLabelProp | 树形选择器作为 value 唯一标识的属性 | `string` | `'title'` |
| treeDataSimpleMode | 树形选择器使用简单格式的 treeData | `boolean \| object` | `false` |
| treeCheckable | 树形选择器显示 Checkbox | `boolean` | `false` |
| treeCheckStrictly | 树形选择器完全受控 | `boolean` | `false` |
| showCheckedStrategy | 树形选择器定义选中项回填的方式 | `'SHOW_ALL' \| 'SHOW_PARENT' \| 'SHOW_CHILD'` | `'SHOW_CHILD'` |
| searchConfig | 搜索配置 | `SearchConfig` | `{ remote: false, debounce: 300, searchKeys: ['label', 'value'], highlightStyle: 'color: #1890ff; font-weight: bold;', saveHistory: false, historyMax: 10 }` |
| virtualConfig | 虚拟滚动配置 | `VirtualConfig` | `{ itemHeight: 32, threshold: 100 }` |

### 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化事件 | `(value: any) => void` |
| change | 选择器值变化事件 | `(value: any, option: any) => void` |
| search | 搜索事件 | `(value: string) => void` |
| remoteSearch | 远程搜索事件 | `(value: string) => void` |
| focus | 获取焦点事件 | `(e: FocusEvent) => void` |
| blur | 失去焦点事件 | `(e: FocusEvent) => void` |
| dropdownVisibleChange | 下拉菜单显示/隐藏事件 | `(visible: boolean) => void` |
| select | 选中事件 | `(value: any, option: any) => void` |
| deselect | 取消选中事件 | `(value: any, option: any) => void` |
| clear | 清空事件 | `() => void` |
| popupScroll | 弹出层滚动事件 | `(e: Event) => void` |
| mouseEnter | 鼠标进入事件 | `(e: MouseEvent) => void` |
| mouseLeave | 鼠标离开事件 | `(e: MouseEvent) => void` |
| treeExpand | 树节点展开事件 | `(expandedKeys: string[]) => void` |

### 插槽

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| option | 自定义选项 | `option: SelectorOption` |
| optionGroup | 自定义选项组 | `group: any` |
| title | 自定义树节点 | `nodeData: SelectorTreeData` |
| dropdownRender | 自定义下拉菜单 | `menu: any` |
| notFoundContent | 自定义下拉菜单为空时显示内容 | - |
| tagRender | 自定义标签 | `props: any` |
| clearIcon | 自定义清除图标 | - |
| suffixIcon | 自定义后缀图标 | - |
| removeIcon | 自定义移除图标 | - |
| menuItemSelectedIcon | 自定义菜单滚动加载图标 | - |
| switcherIcon | 自定义树节点展开/折叠图标 | - |

### 方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| focus | 聚焦选择器 | - |
| blur | 失焦选择器 | - |

### 类型定义

#### SelectorMode

```typescript
interface SelectorMode {
  /** 选择器类型：普通选择器或树形选择器 */
  type: 'select' | 'tree-select';
  /** 是否多选 */
  multiple?: boolean;
  /** 是否可搜索 */
  searchable?: boolean;
  /** 是否启用虚拟滚动 */
  virtual?: boolean;
}
```

#### SelectorOption

```typescript
interface SelectorOption {
  /** 选项值 */
  value: string | number;
  /** 选项标签 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 分组标题 */
  groupLabel?: string;
  /** 子选项 */
  options?: SelectorOption[];
  /** 其他自定义属性 */
  [key: string]: any;
}
```

#### SelectorTreeData

```typescript
interface SelectorTreeData {
  /** 节点值 */
  value: string | number;
  /** 节点标题 */
  title: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可选 */
  selectable?: boolean;
  /** 是否可勾选 */
  checkable?: boolean;
  /** 是否禁止勾选 */
  disableCheckbox?: boolean;
  /** 是否是叶子节点 */
  isLeaf?: boolean;
  /** 子节点 */
  children?: SelectorTreeData[];
  /** 其他自定义属性 */
  [key: string]: any;
}
```

#### SearchConfig

```typescript
interface SearchConfig {
  /** 是否远程搜索 */
  remote?: boolean;
  /** 防抖延迟时间(毫秒) */
  debounce?: number;
  /** 搜索的字段 */
  searchKeys?: string[];
  /** 高亮样式 */
  highlightStyle?: string;
  /** 是否保存搜索历史 */
  saveHistory?: boolean;
  /** 历史记录最大数量 */
  historyMax?: number;
}
```

#### VirtualConfig

```typescript
interface VirtualConfig {
  /** 每项高度 */
  itemHeight?: number;
  /** 启用虚拟滚动的阈值(项数) */
  threshold?: number;
}
``` 