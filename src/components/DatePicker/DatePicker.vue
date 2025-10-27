<template>
  <a-date-picker
    ref="datePickerRef"
    v-bind="$attrs"
    :value="modelValue"
    :format="displayFormat || format"
    :value-format="format"
    :disabled="disabled"
    :placeholder="placeholder"
    :show-time="showTime"
    :show-today="showToday"
    :mode="mode"
    :picker="picker"
    :disabled-date="disabledDate"
    :disabled-time="disabledTime"
    :locale="localeObj"
    :size="size"
    :class="['custom-date-picker', className]"
    @update:value="handleChange"
    @ok="handleOk"
    @openChange="handleOpenChange"
    @panelChange="handlePanelChange"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- 传递所有插槽 -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </a-date-picker>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DatePicker as ADatePicker } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useDateFormatter, useTimezoneConverter } from './hooks'
import type { DatePickerProps, DatePickerInstance } from './types'
import dayjs from 'dayjs'

// 定义组件名称
defineOptions({
  name: 'CustomDatePicker',
  inheritAttrs: false
})

// 定义 Props
const props = withDefaults(defineProps<DatePickerProps>(), {
  format: 'YYYY-MM-DD',
  picker: 'date',
  mode: undefined,
  showTime: false,
  showToday: true,
  disabled: false,
  allowClear: true,
  autoFocus: false,
  inputReadOnly: false,
  valueType: 'date', // 返回值类型：date(dayjs对象)、string、timestamp
  locale: 'zh-CN'  // 默认使用中文
})

// 定义 Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [value: any, dateString: string]
  'ok': [value: any]
  'openChange': [open: boolean]
  'panelChange': [value: any, mode: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

// 组件引用
const datePickerRef = ref<InstanceType<typeof ADatePicker> | null>(null)

// 使用日期格式化工具
const { formatDate } = useDateFormatter(props.format, props.displayFormat)

// 使用时区转换工具
const { convertToTimezone, convertFromTimezone } = useTimezoneConverter(props.timezone)

// 计算属性：格式化后的显示格式
const displayFormat = computed(() => props.displayFormat || props.format)

// 计算属性：处理 modelValue
const modelValue = computed(() => {
  if (!props.modelValue) return undefined
  
  // 如果是时间戳，转换为dayjs对象
  if (typeof props.modelValue === 'number') {
    return dayjs(props.modelValue)
  }
  
  // 如果是字符串，按照format解析
  if (typeof props.modelValue === 'string') {
    return dayjs(props.modelValue, props.format)
  }
  
  // 如果已经是dayjs对象，直接返回
  return props.modelValue
})

// 计算属性：处理 locale
const localeObj = computed(() => {
  if (props.locale === 'zh-CN') {
    return zhCN.DatePicker
  }
  return props.locale
})

// 处理日期变更
const handleChange = (value: any, dateString: string) => {
  let outputValue = value
  
  // 根据valueType转换输出值
  if (value && props.valueType === 'string') {
    outputValue = dateString
  } else if (value && props.valueType === 'timestamp') {
    outputValue = value.valueOf()
  }
  
  emit('update:modelValue', outputValue)
  emit('change', outputValue, dateString)
}

// 处理确认事件
const handleOk = (value: any) => {
  emit('ok', value)
}

// 处理面板打开关闭事件
const handleOpenChange = (open: boolean) => {
  emit('openChange', open)
}

// 处理面板切换事件
const handlePanelChange = (value: any, mode: string) => {
  emit('panelChange', value, mode)
}

// 处理聚焦事件
const handleFocus = (e: FocusEvent) => {
  emit('focus', e)
}

// 处理失焦事件
const handleBlur = (e: FocusEvent) => {
  emit('blur', e)
}

// 打开日期选择器
const open = () => {
  if (datePickerRef.value) {
    datePickerRef.value.focus()
  }
}

// 关闭日期选择器
const close = () => {
  if (datePickerRef.value) {
    datePickerRef.value.blur()
  }
}

// 清空选择
const clear = () => {
  emit('update:modelValue', null)
}

// 暴露组件实例方法
const instance: DatePickerInstance = {
  get $antDatePicker() {
    return datePickerRef.value
  },
  open,
  close,
  clear,
  focus: open,
  blur: close
}

defineExpose(instance)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.custom-date-picker {
  width: 100%;
}

// 移动端样式
@media (max-width: 768px) {
  :deep(.ant-picker-dropdown) {
    max-width: 90vw;
  }
}
</style> 