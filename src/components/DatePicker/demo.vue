<template>
  <div class="datepicker-demo">
    <h2>基础用法</h2>
    <div class="demo-block">
      <custom-date-picker v-model="date" placeholder="请选择日期" locale="zh-CN" />
      <div class="demo-value">选中值: {{ formatValue(date) }}</div>
    </div>

    <h2>不同选择器类型</h2>
    <div class="demo-block">
      <div class="demo-item">
        <label>日期选择器:</label>
        <custom-date-picker v-model="date" placeholder="请选择日期" locale="zh-CN" />
      </div>
      <div class="demo-item">
        <label>周选择器:</label>
        <custom-date-picker v-model="week" picker="week" format="YYYY-wo周" placeholder="请选择周" locale="zh-CN" />
      </div>
      <div class="demo-item">
        <label>月份选择器:</label>
        <custom-date-picker v-model="month" picker="month" format="YYYY年MM月" placeholder="请选择月份" locale="zh-CN" />
      </div>
      <div class="demo-item">
        <label>季度选择器:</label>
        <custom-date-picker v-model="quarter" picker="quarter" format="YYYY年第Q季度" placeholder="请选择季度" locale="zh-CN" />
      </div>
      <div class="demo-item">
        <label>年份选择器:</label>
        <custom-date-picker v-model="year" picker="year" format="YYYY年" placeholder="请选择年份" locale="zh-CN" />
      </div>
    </div>

    <h2>日期时间选择</h2>
    <div class="demo-block">
      <custom-date-picker
        v-model="dateTime"
        :show-time="true"
        format="YYYY-MM-DD HH:mm:ss"
        placeholder="请选择日期和时间"
        locale="zh-CN"
      />
      <div class="demo-value">选中值: {{ formatValue(dateTime) }}</div>
    </div>

    <h2>自定义格式</h2>
    <div class="demo-block">
      <div class="demo-item">
        <label>自定义日期格式:</label>
        <custom-date-picker v-model="customFormatDate" format="YYYY/MM/DD" placeholder="YYYY/MM/DD" locale="zh-CN" />
      </div>
      <div class="demo-item">
        <label>输入格式和显示格式分离:</label>
        <custom-date-picker
          v-model="displayFormatDate"
          format="YYYY-MM-DD"
          display-format="YYYY年MM月DD日"
          placeholder="YYYY年MM月DD日"
          locale="zh-CN"
        />
      </div>
    </div>

    <h2>日期范围限制</h2>
    <div class="demo-block">
      <div class="demo-item">
        <label>禁用今天之前的日期:</label>
        <custom-date-picker v-model="limitedDate" :disabled-date="disabledBeforeToday" placeholder="请选择日期" locale="zh-CN" />
      </div>
      <div class="demo-item">
        <label>只能选择最近一周:</label>
        <custom-date-picker v-model="weekRangeDate" :disabled-date="disabledOutsideRange" placeholder="请选择日期" locale="zh-CN" />
      </div>
    </div>

    <h2>快捷选项</h2>
    <div class="demo-block">
      <custom-date-picker v-model="shortcutDate" :shortcuts="shortcuts" placeholder="请选择日期" locale="zh-CN" />
      <div class="demo-value">选中值: {{ formatValue(shortcutDate) }}</div>
    </div>

    <h2>不同尺寸</h2>
    <div class="demo-block">
      <div class="demo-item">
        <label>小尺寸:</label>
        <custom-date-picker v-model="date" size="small" placeholder="小尺寸" locale="zh-CN" />
      </div>
      <div class="demo-item">
        <label>中尺寸:</label>
        <custom-date-picker v-model="date" size="middle" placeholder="中尺寸" locale="zh-CN" />
      </div>
      <div class="demo-item">
        <label>大尺寸:</label>
        <custom-date-picker v-model="date" size="large" placeholder="大尺寸" locale="zh-CN" />
      </div>
    </div>

    <h2>不同返回值类型</h2>
    <div class="demo-block">
      <div class="demo-item">
        <label>返回 dayjs 对象:</label>
        <custom-date-picker v-model="dateObj" value-type="date" placeholder="请选择日期" locale="zh-CN" />
        <div class="demo-value">值类型: {{ typeof dateObj }} - {{ formatValue(dateObj) }}</div>
      </div>
      <div class="demo-item">
        <label>返回字符串:</label>
        <custom-date-picker v-model="dateString" value-type="string" placeholder="请选择日期" locale="zh-CN" />
        <div class="demo-value">值类型: {{ typeof dateString }} - {{ dateString || '未选择' }}</div>
      </div>
      <div class="demo-item">
        <label>返回时间戳:</label>
        <custom-date-picker v-model="dateTimestamp" value-type="timestamp" placeholder="请选择日期" locale="zh-CN" />
        <div class="demo-value">值类型: {{ typeof dateTimestamp }} - {{ formatValue(dateTimestamp) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import CustomDatePicker from './DatePicker.vue'

// 基础用法
const date = ref(null)

// 不同选择器类型
const week = ref(null)
const month = ref(null)
const quarter = ref(null)
const year = ref(null)

// 日期时间选择
const dateTime = ref(null)

// 自定义格式
const customFormatDate = ref(null)
const displayFormatDate = ref(null)

// 日期范围限制
const limitedDate = ref(null)
const weekRangeDate = ref(null)

// 禁用今天之前的日期
const disabledBeforeToday = (current: any) => {
  return current && current < dayjs().startOf('day')
}

// 只能选择最近一周
const disabledOutsideRange = (current: any) => {
  const oneWeekAgo = dayjs().subtract(7, 'day')
  const today = dayjs()
  return current && (current < oneWeekAgo || current > today)
}

// 快捷选项
const shortcutDate = ref(null)
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
  },
  {
    text: '一个月前',
    value: () => dayjs().subtract(1, 'month')
  }
]

// 不同返回值类型
const dateObj = ref(null)
const dateString = ref(null)
const dateTimestamp = ref(null)

// 格式化值显示
const formatValue = (value: any) => {
  if (!value) return '未选择'
  if (typeof value === 'number') return `时间戳: ${value} (${dayjs(value).format('YYYY-MM-DD HH:mm:ss')})`
  if (typeof value === 'string') return `字符串: ${value}`
  
  if (dayjs.isDayjs(value)) {
    // 根据不同类型格式化显示
    if (week.value === value) {
      return `第 ${value.week()} 周 (${value.format('YYYY-MM-DD')})`
    } else if (month.value === value) {
      return `${value.format('YYYY年MM月')}`
    } else if (quarter.value === value) {
      return `${value.format('YYYY年')}第 ${Math.floor((value.month() / 3) + 1)} 季度`
    } else if (year.value === value) {
      return `${value.format('YYYY年')}`
    } else {
      return `日期对象: ${value.format('YYYY-MM-DD HH:mm:ss')}`
    }
  }
  
  return String(value)
}
</script>

<style lang="scss" scoped>
.datepicker-demo {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  
  h2 {
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 500;
  }
  
  .demo-block {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    background-color: #fafafa;
  }
  
  .demo-item {
    margin-bottom: 15px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
  }
  
  .demo-value {
    margin-top: 10px;
    padding: 8px;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-family: monospace;
  }
}
</style> 