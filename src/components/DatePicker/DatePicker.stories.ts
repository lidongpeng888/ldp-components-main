import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import dayjs from 'dayjs'

import DatePicker from './DatePicker.vue'
import DemoComponent from './demo.vue'

// 组件元数据
const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  // 删除autodocs标签，避免生成空白文档页面
  // tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'text',
      description: '绑定值',
      table: {
        type: { summary: 'string | number | Date | Dayjs' },
        defaultValue: { summary: 'undefined' }
      }
    },
    format: {
      control: 'text',
      description: '日期格式，同 dayjs 格式',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'YYYY-MM-DD' }
      }
    },
    displayFormat: {
      control: 'text',
      description: '显示的日期格式，同 dayjs 格式',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    picker: {
      control: { type: 'select' },
      options: ['date', 'week', 'month', 'quarter', 'year'],
      description: '选择器类型',
      table: {
        type: { summary: "'date' | 'week' | 'month' | 'quarter' | 'year'" },
        defaultValue: { summary: 'date' }
      }
    },
    mode: {
      control: { type: 'select' },
      options: ['time', 'date', 'month', 'year', 'decade'],
      description: '面板模式',
      table: {
        type: { summary: "'time' | 'date' | 'month' | 'year' | 'decade'" },
        defaultValue: { summary: 'undefined' }
      }
    },
    showTime: {
      control: 'boolean',
      description: '是否显示时间选择',
      table: {
        type: { summary: 'boolean | object' },
        defaultValue: { summary: 'false' }
      }
    },
    showToday: {
      control: 'boolean',
      description: '是否显示今天按钮',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    allowClear: {
      control: 'boolean',
      description: '是否显示清除按钮',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    autoFocus: {
      control: 'boolean',
      description: '自动获取焦点',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    inputReadOnly: {
      control: 'boolean',
      description: '输入框是否只读',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    placeholder: {
      control: 'text',
      description: '占位文本',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    timezone: {
      control: 'text',
      description: '时区',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    valueType: {
      control: { type: 'select' },
      options: ['date', 'string', 'timestamp'],
      description: '返回值类型',
      table: {
        type: { summary: "'date' | 'string' | 'timestamp'" },
        defaultValue: { summary: 'date' }
      }
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'middle', 'large'],
      description: '尺寸',
      table: {
        type: { summary: "'small' | 'middle' | 'large'" },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: {
    format: 'YYYY-MM-DD',
    picker: 'date',
    showTime: false,
    showToday: true,
    disabled: false,
    allowClear: true,
    autoFocus: false,
    inputReadOnly: false,
    valueType: 'date',
    placeholder: '请选择日期',
    // 设置中文语言
    locale: 'zh-CN'
  }
}

export default meta
type Story = StoryObj<typeof DatePicker>

// 格式化显示不同类型的值
const formatValue = (value: any, type: string = 'date') => {
  if (!value) return '未选择';
  
  if (typeof value === 'number') {
    return `时间戳: ${value} (${dayjs(value).format('YYYY-MM-DD HH:mm:ss')})`;
  }
  
  if (typeof value === 'string') {
    return `字符串: ${value}`;
  }
  
  if (dayjs.isDayjs(value)) {
    // 直接返回格式化后的值，不再根据类型进行特殊处理
    // 因为我们已经在DatePicker组件中设置了对应的format
    return `${value.format('YYYY-MM-DD HH:mm:ss')} (dayjs对象)`;
  }
  
  return String(value);
};

// 基础示例样式
const containerStyle = `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

const valueDisplayStyle = `
  margin-top: 16px;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  width: 100%;
  font-family: monospace;
`;

// 基础示例
export const Basic: Story = {
  render: (args) => ({
    components: { DatePicker },
    setup() {
      const value = ref(null)
      return { args, value, formatValue }
    },
    template: `
      <div style="${containerStyle}">
        <h3>基础用法</h3>
        <DatePicker v-model="value" v-bind="args" locale="zh-CN" style="width: 100%;" />
        <div style="${valueDisplayStyle}">选中值: {{ formatValue(value) }}</div>
      </div>
    `
  })
}

// 不同选择器类型
export const PickerTypes: Story = {
  render: () => ({
    components: { DatePicker },
    setup() {
      const date = ref(null)
      const week = ref(null)
      const month = ref(null)
      const quarter = ref(null)
      const year = ref(null)
      
      // 为每种选择器类型定义推荐格式
      const dateFormats = ref({
        date: 'YYYY-MM-DD',
        week: 'YYYY-wo周',
        month: 'YYYY年MM月',
        quarter: 'YYYY年第Q季度',
        year: 'YYYY年'
      })
      
      // 格式选项
      const formatOptions = {
        date: [
          { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
          { label: 'YYYY/MM/DD', value: 'YYYY/MM/DD' },
          { label: 'YYYY年MM月DD日', value: 'YYYY年MM月DD日' }
        ],
        week: [
          { label: 'YYYY-wo周', value: 'YYYY-wo周' },
          { label: 'YYYY-第w周', value: 'YYYY-第w周' },
          { label: 'YYYY年第w周', value: 'YYYY年第w周' }
        ],
        month: [
          { label: 'YYYY-MM', value: 'YYYY-MM' },
          { label: 'YYYY/MM', value: 'YYYY/MM' },
          { label: 'YYYY年MM月', value: 'YYYY年MM月' }
        ],
        quarter: [
          { label: 'YYYY-[Q]Q', value: 'YYYY-[Q]Q' },
          { label: 'YYYY年第Q季度', value: 'YYYY年第Q季度' }
        ],
        year: [
          { label: 'YYYY', value: 'YYYY' },
          { label: 'YYYY年', value: 'YYYY年' }
        ]
      }
      
      return { 
        date, week, month, quarter, year, 
        dateFormats, formatOptions,
        formatValue 
      }
    },
    template: `
      <div style="${containerStyle}">
        <h3>不同选择器类型</h3>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">日期选择器:</div>
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <DatePicker 
              v-model="date" 
              :format="dateFormats.date"
              placeholder="请选择日期" 
              locale="zh-CN" 
              style="flex: 1;" 
            />
            <select v-model="dateFormats.date" style="width: 150px;">
              <option v-for="option in formatOptions.date" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div style="${valueDisplayStyle}">{{ formatValue(date) }}</div>
        </div>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">周选择器:</div>
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <DatePicker 
              v-model="week" 
              picker="week" 
              :format="dateFormats.week"
              placeholder="请选择周" 
              locale="zh-CN" 
              style="flex: 1;" 
            />
            <select v-model="dateFormats.week" style="width: 150px;">
              <option v-for="option in formatOptions.week" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div style="${valueDisplayStyle}">{{ formatValue(week, 'week') }}</div>
        </div>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">月份选择器:</div>
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <DatePicker 
              v-model="month" 
              picker="month" 
              :format="dateFormats.month"
              placeholder="请选择月份" 
              locale="zh-CN" 
              style="flex: 1;" 
            />
            <select v-model="dateFormats.month" style="width: 150px;">
              <option v-for="option in formatOptions.month" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div style="${valueDisplayStyle}">{{ formatValue(month, 'month') }}</div>
        </div>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">季度选择器:</div>
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <DatePicker 
              v-model="quarter" 
              picker="quarter" 
              :format="dateFormats.quarter"
              placeholder="请选择季度" 
              locale="zh-CN" 
              style="flex: 1;" 
            />
            <select v-model="dateFormats.quarter" style="width: 150px;">
              <option v-for="option in formatOptions.quarter" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div style="${valueDisplayStyle}">{{ formatValue(quarter, 'quarter') }}</div>
        </div>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">年份选择器:</div>
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <DatePicker 
              v-model="year" 
              picker="year" 
              :format="dateFormats.year"
              placeholder="请选择年份" 
              locale="zh-CN" 
              style="flex: 1;" 
            />
            <select v-model="dateFormats.year" style="width: 150px;">
              <option v-for="option in formatOptions.year" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div style="${valueDisplayStyle}">{{ formatValue(year, 'year') }}</div>
        </div>
      </div>
    `
  })
}

// 日期时间选择
export const DateTime: Story = {
  render: () => ({
    components: { DatePicker },
    setup() {
      const dateTime = ref(null)
      
      return { dateTime, formatValue }
    },
    template: `
      <div style="${containerStyle}">
        <h3>日期时间选择</h3>
        <DatePicker
          v-model="dateTime"
          :show-time="true"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择日期和时间"
          locale="zh-CN"
          style="width: 100%;"
        />
        <div style="${valueDisplayStyle}">选中值: {{ formatValue(dateTime) }}</div>
      </div>
    `
  })
}

// 自定义格式
export const CustomFormat: Story = {
  render: () => ({
    components: { DatePicker },
    setup() {
      const customFormatDate = ref(null)
      const displayFormatDate = ref(null)
      
      return { customFormatDate, displayFormatDate, formatValue }
    },
    template: `
      <div style="${containerStyle}">
        <h3>自定义格式</h3>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">自定义日期格式:</div>
          <DatePicker 
            v-model="customFormatDate" 
            format="YYYY/MM/DD" 
            placeholder="YYYY/MM/DD" 
            locale="zh-CN"
            style="width: 100%;"
          />
          <div style="${valueDisplayStyle}">值: {{ formatValue(customFormatDate) }}</div>
        </div>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">输入格式和显示格式分离:</div>
          <DatePicker
            v-model="displayFormatDate"
            format="YYYY-MM-DD"
            display-format="YYYY年MM月DD日"
            placeholder="YYYY年MM月DD日"
            locale="zh-CN"
            style="width: 100%;"
          />
          <div style="${valueDisplayStyle}">值: {{ formatValue(displayFormatDate) }}</div>
        </div>
      </div>
    `
  })
}

// 日期范围限制
export const DateLimits: Story = {
  render: () => ({
    components: { DatePicker },
    setup() {
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
      
      return { limitedDate, weekRangeDate, disabledBeforeToday, disabledOutsideRange, formatValue }
    },
    template: `
      <div style="${containerStyle}">
        <h3>日期范围限制</h3>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">禁用今天之前的日期:</div>
          <DatePicker 
            v-model="limitedDate" 
            :disabled-date="disabledBeforeToday" 
            placeholder="请选择日期" 
            locale="zh-CN"
            style="width: 100%;"
          />
          <div style="${valueDisplayStyle}">值: {{ formatValue(limitedDate) }}</div>
        </div>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">只能选择最近一周:</div>
          <DatePicker 
            v-model="weekRangeDate" 
            :disabled-date="disabledOutsideRange" 
            placeholder="请选择日期" 
            locale="zh-CN"
            style="width: 100%;"
          />
          <div style="${valueDisplayStyle}">值: {{ formatValue(weekRangeDate) }}</div>
        </div>
      </div>
    `
  })
}

// 快捷选项
export const Shortcuts: Story = {
  render: () => ({
    components: { DatePicker },
    setup() {
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
      
      return { shortcutDate, shortcuts, formatValue }
    },
    template: `
      <div style="${containerStyle}">
        <h3>快捷选项</h3>
        <DatePicker 
          v-model="shortcutDate" 
          :shortcuts="shortcuts" 
          placeholder="请选择日期" 
          locale="zh-CN"
          style="width: 100%;"
        />
        <div style="${valueDisplayStyle}">选中值: {{ formatValue(shortcutDate) }}</div>
      </div>
    `
  })
}

// 不同尺寸
export const Sizes: Story = {
  render: () => ({
    components: { DatePicker },
    setup() {
      const smallDate = ref(null)
      const middleDate = ref(null)
      const largeDate = ref(null)
      
      return { smallDate, middleDate, largeDate, formatValue }
    },
    template: `
      <div style="${containerStyle}">
        <h3>不同尺寸</h3>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">小尺寸 (small):</div>
          <div style="display: flex; align-items: center;">
            <DatePicker 
              v-model="smallDate" 
              size="small" 
              placeholder="小尺寸" 
              locale="zh-CN"
            />
          </div>
          <div style="${valueDisplayStyle}">值: {{ formatValue(smallDate) }}</div>
        </div>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">中尺寸 (middle):</div>
          <div style="display: flex; align-items: center;">
            <DatePicker 
              v-model="middleDate" 
              size="middle" 
              placeholder="中尺寸" 
              locale="zh-CN"
            />
          </div>
          <div style="${valueDisplayStyle}">值: {{ formatValue(middleDate) }}</div>
        </div>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">大尺寸 (large):</div>
          <div style="display: flex; align-items: center;">
            <DatePicker 
              v-model="largeDate" 
              size="large" 
              placeholder="大尺寸" 
              locale="zh-CN"
            />
          </div>
          <div style="${valueDisplayStyle}">值: {{ formatValue(largeDate) }}</div>
        </div>
      </div>
    `
  })
}

// 不同返回值类型
export const ValueTypes: Story = {
  render: () => ({
    components: { DatePicker },
    setup() {
      const dateObj = ref(null)
      const dateString = ref(null)
      const dateTimestamp = ref(null)
      
      return { dateObj, dateString, dateTimestamp, formatValue }
    },
    template: `
      <div style="${containerStyle}">
        <h3>不同返回值类型</h3>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">返回 dayjs 对象:</div>
          <DatePicker 
            v-model="dateObj" 
            value-type="date" 
            placeholder="请选择日期" 
            locale="zh-CN"
            style="width: 100%;"
          />
          <div style="${valueDisplayStyle}">值类型: {{ typeof dateObj }} - {{ formatValue(dateObj) }}</div>
        </div>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">返回字符串:</div>
          <DatePicker 
            v-model="dateString" 
            value-type="string" 
            placeholder="请选择日期" 
            locale="zh-CN"
            style="width: 100%;"
          />
          <div style="${valueDisplayStyle}">值类型: {{ typeof dateString }} - {{ dateString || '未选择' }}</div>
        </div>
        
        <div style="width: 100%; margin-bottom: 16px;">
          <div style="margin-bottom: 8px; font-weight: 500;">返回时间戳:</div>
          <DatePicker 
            v-model="dateTimestamp" 
            value-type="timestamp" 
            placeholder="请选择日期" 
            locale="zh-CN"
            style="width: 100%;"
          />
          <div style="${valueDisplayStyle}">值类型: {{ typeof dateTimestamp }} - {{ formatValue(dateTimestamp) }}</div>
        </div>
      </div>
    `
  })
}

// 完整演示
export const FullDemo: Story = {
  render: () => ({
    components: { DemoComponent },
    template: '<DemoComponent />'
  })
} 