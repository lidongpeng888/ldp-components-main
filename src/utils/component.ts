/**
 * 组件专用工具函数库
 * 提供组件开发中常用的工具函数
 */

import type { VNode, Slots, ComponentInternalInstance } from 'vue'

/**
 * 类名合并工具 - 合并多个类名，过滤掉无效值
 * @param classes 类名数组，支持字符串、undefined、null、false
 * @returns 合并后的类名字符串
 */
export function classNames(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  const result: string[] = []
  
  classes.forEach(cls => {
    if (!cls) return
    
    if (typeof cls === 'string') {
      result.push(cls)
    } else if (typeof cls === 'object') {
      Object.keys(cls).forEach(key => {
        if (cls[key]) {
          result.push(key)
        }
      })
    }
  })
  
  return result.join(' ')
}

/**
 * 样式对象转字符串 - 将样式对象转换为CSS字符串
 * @param style 样式对象
 * @returns CSS字符串
 */
export function styleToString(style: Record<string, string | number>): string {
  return Object.entries(style)
    .map(([key, value]: [string, string | number]) => {
      const cssKey = key.replace(/[A-Z]/g, (match: string) => `-${match.toLowerCase()}`)
      return `${cssKey}:${value}`
    })
    .join(';')
}

/**
 * 属性透传工具函数 - 创建属性代理，用于组件封装时透传属性
 * @param props 组件props
 * @param excludeKeys 要排除的属性键
 * @returns 过滤后的属性对象
 */
export function createPropsProxy<T extends Record<string, any>>(
  props: T,
  excludeKeys: (keyof T)[] = []
): Omit<T, keyof T> {
  const result = {} as any
  
  Object.keys(props).forEach(key => {
    if (!excludeKeys.includes(key as keyof T)) {
      result[key] = props[key]
    }
  })
  
  return result
}

/**
 * 事件代理工具函数 - 创建事件代理，用于组件封装时代理事件
 * @param emit 组件emit函数
 * @param eventName 事件名称
 * @param customHandler 自定义处理函数
 * @returns 事件处理函数
 */
export function createEventProxy<T extends any[]>(
  emit: (event: string, ...args: T) => void,
  eventName: string,
  customHandler?: (...args: T) => void | boolean
) {
  return (...args: T) => {
    // 先执行自定义处理函数
    if (customHandler) {
      const result = customHandler(...args)
      // 如果自定义处理函数返回false，则阻止事件继续传播
      if (result === false) {
        return
      }
    }
    
    // 触发事件
    emit(eventName, ...args)
  }
}

/**
 * 插槽转发工具函数 - 转发所有插槽到子组件
 * @param slots 插槽对象
 * @param excludeSlots 要排除的插槽名称
 * @returns 转发的插槽对象
 */
export function forwardSlots(
  slots: Slots,
  excludeSlots: string[] = []
): Record<string, () => VNode[]> {
  const result: Record<string, () => VNode[]> = {}
  
  Object.keys(slots).forEach(name => {
    if (!excludeSlots.includes(name) && slots[name]) {
      result[name] = slots[name]!
    }
  })
  
  return result
}

/**
 * 组件实例暴露工具 - 暴露组件实例的方法和属性
 * @param instance 组件实例引用
 * @param customMethods 自定义方法对象
 * @returns 暴露的实例对象
 */
export function exposeInstance<T = any, K extends Record<string, any> = {}>(
  instance: { value: T | null },
  customMethods: K = {} as K
): T & K {
  return new Proxy({} as T & K, {
    get(target, prop) {
      // 优先返回自定义方法
      if (prop in customMethods) {
        return customMethods[prop as keyof K]
      }
      
      // 返回原生组件实例的属性或方法
      if (instance.value && prop in instance.value) {
        const value = (instance.value as any)[prop]
        return typeof value === 'function' ? value.bind(instance.value) : value
      }
      
      return undefined
    },
    
    has(target, prop) {
      return prop in customMethods || (instance.value ? prop in instance.value : false)
    },
    
    ownKeys(target) {
      const customKeys = Object.keys(customMethods)
      const instanceKeys = instance.value ? Object.keys(instance.value) : []
      return [...new Set([...customKeys, ...instanceKeys])]
    }
  })
}

/**
 * 获取组件显示名称
 * @param component 组件实例
 * @returns 组件名称
 */
export function getComponentName(component: ComponentInternalInstance | null): string {
  if (!component) return 'Unknown'
  
  return component.type.name || 
         component.type.__name || 
         component.type.displayName || 
         'Anonymous'
}

/**
 * 检查是否为Vue组件
 * @param obj 要检查的对象
 * @returns 是否为Vue组件
 */
export function isVueComponent(obj: any): boolean {
  return obj && (
    typeof obj === 'function' ||
    (typeof obj === 'object' && (obj.render || obj.template || obj.setup))
  )
}

/**
 * 创建组件属性验证器
 * @param validator 验证函数
 * @param message 错误消息
 * @returns 属性验证器
 */
export function createPropValidator<T>(
  validator: (value: T) => boolean,
  message?: string
) {
  return {
    validator,
    message: message || 'Invalid prop value'
  }
}

/**
 * 合并组件props默认值
 * @param defaultProps 默认props
 * @param userProps 用户传入的props
 * @returns 合并后的props
 */
export function mergeProps<T extends Record<string, any>>(
  defaultProps: T,
  userProps: Partial<T>
): T {
  const result = { ...defaultProps }
  
  Object.keys(userProps).forEach(key => {
    const userValue = userProps[key]
    const defaultValue = defaultProps[key]
    
    if (userValue !== undefined) {
      if (typeof defaultValue === 'object' && typeof userValue === 'object' && 
          !Array.isArray(defaultValue) && !Array.isArray(userValue)) {
        result[key] = { ...defaultValue, ...userValue }
      } else {
        result[key] = userValue
      }
    }
  })
  
  return result
}