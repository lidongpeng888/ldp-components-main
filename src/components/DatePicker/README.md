# DatePicker 日期选择器组件

基于 Ant Design Vue 的 `a-date-picker` 组件封装，提供更丰富的功能和更灵活的配置。

## 功能特点

- 支持单日期、日期范围和多日期选择
- 支持日期时间、时间段选择
- 支持周、月、季度、年的选择
- 支持自定义日期格式配置
- 支持输入格式和显示格式分离
- 支持最小/最大日期限制
- 支持特定日期或日期范围的禁用
- 支持时区转换和处理
- 支持多种返回值类型（dayjs对象、字符串、时间戳）
- 完全兼容 Ant Design Vue 的 DatePicker 组件 API

## 基础用法

```vue
<template>
  <custom-date-picker v-model="date" />
</template>

<script setup>
import { ref } from 'vue'

const date = ref(null)
</script>
```

## 不同选择器类型

```vue
<template>
  <!-- 日期选择器 (默认) -->
  <custom-date-picker v-model="date" />
  
  <!-- 周选择器 -->
  <custom-date-picker v-model="week" picker="week" />
  
  <!-- 月份选择器 -->
  <custom-date-picker v-model="month" picker="month" />
  
  <!-- 季度选择器 -->
  <custom-date-picker v-model="quarter" picker="quarter" />
  
  <!-- 年份选择器 -->
  <custom-date-picker v-model="year" picker="year" />
</template>

<script setup>
import { ref } from 'vue'

const date = ref(null)
const week = ref(null)
const month = ref(null)
const quarter = ref(null)
const year = ref(null)
</script>
```

## 日期时间选择

```vue
<template>
  <custom-date-picker 
    v-model="dateTime" 
    :show-time="true" 
    format="YYYY-MM-DD HH:mm:ss" 
  />
</template>

<script setup>
import { ref } from 'vue'

const dateTime = ref(null)
</script>
```

## 自定义格式

```vue
<template>
  <!-- 自定义日期格式 -->
  <custom-date-picker 
    v-model="date" 
    format="YYYY/MM/DD" 
  />
  
  <!-- 输入格式和显示格式分离 -->
  <custom-date-picker 
    v-model="date" 
    format="YYYY-MM-DD" 
    display-format="YYYY年MM月DD日" 
  />
</template>

<script setup>
import { ref } from 'vue'

const date = ref(null)
</script>
```

## 日期范围限制

```vue
<template>
  <custom-date-picker 
    v-model="date" 
    :disabled-date="disabledDate" 
  />
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const date = ref(null)

// 禁用今天之前的日期
const disabledDate = (current) => {
  return current && current < dayjs().startOf('day')
}
</script>
```

## 快捷选项

```vue
<template>
  <custom-date-picker 
    v-model="date" 
    :shortcuts="shortcuts" 
  />
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const date = ref(null)

const shortcuts = [
  {
    text: '今天',
    value: () => dayjs()
  },
  {
    text: '昨天',
    value: () => dayjs().subtract(1, 'day')
  },
  {
    text: '一周前',
    value: () => dayjs().subtract(7, 'day')
  }
]
</script>
```

## 不同尺寸

```vue
<template>
  <custom-date-picker v-model="date" size="small" />
  <custom-date-picker v-model="date" size="middle" />
  <custom-date-picker v-model="date" size="large" />
</template>

<script setup>
import { ref } from 'vue'

const date = ref(null)
</script>
```

## 不同返回值类型

```vue
<template>
  <!-- 返回 dayjs 对象 (默认) -->
  <custom-date-picker v-model="dateObj" value-type="date" />
  
  <!-- 返回日期字符串 -->
  <custom-date-picker v-model="dateString" value-type="string" />
  
  <!-- 返回时间戳 -->
  <custom-date-picker v-model="dateTimestamp" value-type="timestamp" />
</template>

<script setup>
import { ref } from 'vue'

const dateObj = ref(null)
const dateString = ref(null)
const dateTimestamp = ref(null)
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 绑定值 | `string \| number \| Date \| Dayjs` | - |
| format | 日期格式，同 dayjs 格式 | `string` | `'YYYY-MM-DD'` |
| displayFormat | 显示的日期格式，同 dayjs 格式 | `string` | - |
| picker | 选择器类型 | `'date' \| 'week' \| 'month' \| 'quarter' \| 'year'` | `'date'` |
| mode | 面板模式 | `'time' \| 'date' \| 'month' \| 'year' \| 'decade'` | - |
| showTime | 是否显示时间选择 | `boolean \| object` | `false` |
| showToday | 是否显示今天按钮 | `boolean` | `true` |
| disabled | 是否禁用 | `boolean` | `false` |
| allowClear | 是否显示清除按钮 | `boolean` | `true` |
| autoFocus | 自动获取焦点 | `boolean` | `false` |
| inputReadOnly | 输入框是否只读 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |
| placeholder | 占位文本 | `string` | - |
| timezone | 时区 | `string` | - |
| disabledDate | 禁用日期 | `(currentDate: Dayjs) => boolean` | - |
| disabledTime | 禁用时间 | `(currentDate: Dayjs) => any` | - |
| valueType | 返回值类型 | `'date' \| 'string' \| 'timestamp'` | `'date'` |
| size | 尺寸 | `'small' \| 'middle' \| 'large'` | - |
| shortcuts | 快捷选项 | `{ text: string; value: () => Dayjs \| [Dayjs, Dayjs] }[]` | - |

### 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化事件 | `(value: any) => void` |
| change | 日期变化事件 | `(value: any, dateString: string) => void` |
| ok | 确认选择事件 | `(value: any) => void` |
| openChange | 面板打开/关闭事件 | `(open: boolean) => void` |
| panelChange | 面板切换事件 | `(value: any, mode: string) => void` |
| focus | 获取焦点事件 | `(event: FocusEvent) => void` |
| blur | 失去焦点事件 | `(event: FocusEvent) => void` |

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| dateRender | 自定义日期单元格内容 |
| renderExtraFooter | 自定义渲染面板 |
| clearIcon | 自定义清除图标 |
| suffixIcon | 自定义后缀图标 |
| prevIcon | 自定义预览内容 |
| nextIcon | 自定义后一页图标 |
| superNextIcon | 自定义后一年图标 |
| superPrevIcon | 自定义前一年图标 |

### 方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| open | 打开日期选择器 | - |
| close | 关闭日期选择器 | - |
| clear | 清空选择 | - |
| focus | 获取焦点 | - |
| blur | 失去焦点 | - | 