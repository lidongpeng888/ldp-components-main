/**
 * 通用工具函数库
 * 提供防抖、节流、深拷贝等常用工具函数
 * 集成 VueUse 工具库，避免重复实现常用功能
 */

// 导入 VueUse 工具函数，优先使用 VueUse 实现
export { 
  clamp
} from '@vueuse/core'

/**
 * 防抖函数 - 延迟执行函数，在指定时间内多次调用只执行最后一次
 * @deprecated 推荐使用 VueUse 的 debounce 函数
 * @param func 要防抖的函数
 * @param wait 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounceCompat<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数 - 限制函数执行频率，在指定时间内最多执行一次
 * @deprecated 推荐使用 VueUse 的 throttle 函数
 * @param func 要节流的函数
 * @param wait 节流时间间隔（毫秒）
 * @returns 节流后的函数
 */
export function throttleCompat<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func(...args)
    }
  }
}

/**
 * 深拷贝函数 - 递归拷贝对象的所有层级
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof RegExp) return new RegExp(obj) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * 对象合并工具 - 深度合并多个对象
 * @param target 目标对象
 * @param sources 源对象数组
 * @returns 合并后的对象
 */
export function merge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        merge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return merge(target, ...sources)
}

/**
 * 判断是否为对象
 * @param item 要判断的项
 * @returns 是否为对象
 */
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * 获取对象的类型字符串
 * @param obj 要检查的对象
 * @returns 类型字符串
 */
export function getType(obj: any): string {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

/**
 * 判断两个值是否相等（深度比较）
 * @param a 值A
 * @param b 值B
 * @returns 是否相等
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a == null || b == null) return a === b
  if (typeof a !== typeof b) return false
  
  const typeA = getType(a)
  const typeB = getType(b)
  if (typeA !== typeB) return false
  
  if (typeA === 'array') {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false
    }
    return true
  }
  
  if (typeA === 'object') {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    for (const key of keysA) {
      if (!keysB.includes(key) || !isEqual(a[key], b[key])) return false
    }
    return true
  }
  
  return false
}

/**
 * 生成唯一ID
 * @param prefix 前缀
 * @returns 唯一ID字符串
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 延迟执行
 * @param ms 延迟时间（毫秒）
 * @returns Promise
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 数组去重
 * @param arr 要去重的数组
 * @param key 对象数组时的去重键
 * @returns 去重后的数组
 */
export function unique<T>(arr: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(arr)]
  }
  
  const seen = new Set()
  return arr.filter(item => {
    const val = item[key]
    if (seen.has(val)) {
      return false
    }
    seen.add(val)
    return true
  })
}