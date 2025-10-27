/**
 * DatePicker 组件专用 Hooks
 */

import { ref, computed, type Ref } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/zh-cn' // 导入中文语言包

// 加载 dayjs 插件
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

/**
 * 配置dayjs默认语言为中文
 * 注意：这不会影响组件的locale设置，只是设置dayjs库的默认语言
 */
dayjs.locale('zh-cn')

/**
 * 日期格式化 Hook
 */
export function useDateFormatter(format?: string, displayFormat?: string) {
  /**
   * 格式化日期
   * @param date 日期对象
   * @param targetFormat 目标格式
   * @returns 格式化后的日期字符串
   */
  const formatDate = (date: dayjs.Dayjs | Date | string | number | null | undefined, targetFormat?: string): string => {
    if (!date) return ''
    
    const dayjsDate = dayjs.isDayjs(date) ? date : dayjs(date)
    return dayjsDate.format(targetFormat || format || 'YYYY-MM-DD')
  }
  
  /**
   * 解析日期字符串
   * @param dateString 日期字符串
   * @param sourceFormat 源格式
   * @returns dayjs 日期对象
   */
  const parseDate = (dateString: string, sourceFormat?: string): dayjs.Dayjs => {
    return dayjs(dateString, sourceFormat || format || 'YYYY-MM-DD')
  }
  
  return {
    formatDate,
    parseDate
  }
}

/**
 * 时区转换 Hook
 */
export function useTimezoneConverter(timezone?: string) {
  /**
   * 将日期转换为指定时区
   * @param date 日期对象
   * @param targetTimezone 目标时区
   * @returns 转换后的日期对象
   */
  const convertToTimezone = (date: dayjs.Dayjs | Date | string | number | null | undefined, targetTimezone?: string): dayjs.Dayjs | null => {
    if (!date) return null
    
    const dayjsDate = dayjs.isDayjs(date) ? date : dayjs(date)
    const tz = targetTimezone || timezone
    
    if (!tz) return dayjsDate
    
    return dayjsDate.tz(tz)
  }
  
  /**
   * 将指定时区的日期转换为本地时区
   * @param date 日期对象
   * @param sourceTimezone 源时区
   * @returns 转换后的日期对象
   */
  const convertFromTimezone = (date: dayjs.Dayjs | Date | string | number | null | undefined, sourceTimezone?: string): dayjs.Dayjs | null => {
    if (!date) return null
    
    const tz = sourceTimezone || timezone
    if (!tz) return dayjs.isDayjs(date) ? date : dayjs(date)
    
    const dayjsDate = dayjs.isDayjs(date) ? date : dayjs(date)
    return dayjsDate.tz(tz).local()
  }
  
  return {
    convertToTimezone,
    convertFromTimezone
  }
}

/**
 * 日期范围处理 Hook
 */
export function useDateRange(minDate?: string | number | Date | dayjs.Dayjs, maxDate?: string | number | Date | dayjs.Dayjs) {
  // 最小日期
  const minDateRef = ref<dayjs.Dayjs | null>(minDate ? dayjs(minDate) : null)
  
  // 最大日期
  const maxDateRef = ref<dayjs.Dayjs | null>(maxDate ? dayjs(maxDate) : null)
  
  /**
   * 判断日期是否在范围内
   * @param date 日期对象
   * @returns 是否在范围内
   */
  const isInRange = (date: dayjs.Dayjs | Date | string | number): boolean => {
    const dayjsDate = dayjs.isDayjs(date) ? date : dayjs(date)
    
    if (minDateRef.value && dayjsDate.isBefore(minDateRef.value, 'day')) {
      return false
    }
    
    if (maxDateRef.value && dayjsDate.isAfter(maxDateRef.value, 'day')) {
      return false
    }
    
    return true
  }
  
  /**
   * 禁用日期函数
   * @param date 日期对象
   * @returns 是否禁用
   */
  const disabledDate = (date: dayjs.Dayjs): boolean => {
    return !isInRange(date)
  }
  
  // 更新最小日期
  const setMinDate = (date: string | number | Date | dayjs.Dayjs | null) => {
    minDateRef.value = date ? dayjs(date) : null
  }
  
  // 更新最大日期
  const setMaxDate = (date: string | number | Date | dayjs.Dayjs | null) => {
    maxDateRef.value = date ? dayjs(date) : null
  }
  
  return {
    minDate: minDateRef,
    maxDate: maxDateRef,
    isInRange,
    disabledDate,
    setMinDate,
    setMaxDate
  }
}

/**
 * 日期快捷选项 Hook
 */
export function useDateShortcuts() {
  // 常用日期快捷选项
  const commonShortcuts = computed(() => [
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
    },
    {
      text: '三个月前',
      value: () => dayjs().subtract(3, 'month')
    }
  ])
  
  // 日期范围快捷选项
  const rangeShortcuts = computed(() => [
    {
      text: '最近一周',
      value: () => [dayjs().subtract(7, 'day'), dayjs()]
    },
    {
      text: '最近一个月',
      value: () => [dayjs().subtract(1, 'month'), dayjs()]
    },
    {
      text: '最近三个月',
      value: () => [dayjs().subtract(3, 'month'), dayjs()]
    },
    {
      text: '最近半年',
      value: () => [dayjs().subtract(6, 'month'), dayjs()]
    },
    {
      text: '最近一年',
      value: () => [dayjs().subtract(1, 'year'), dayjs()]
    }
  ])
  
  /**
   * 创建自定义快捷选项
   * @param text 显示文本
   * @param value 日期值或日期计算函数
   * @returns 快捷选项对象
   */
  const createShortcut = (
    text: string,
    value: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs] | (() => dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs])
  ) => {
    return {
      text,
      value: typeof value === 'function' ? value : () => value
    }
  }
  
  return {
    commonShortcuts,
    rangeShortcuts,
    createShortcut
  }
} 