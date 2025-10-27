/**
 * 类型验证工具
 * 提供运行时类型检查和验证功能
 */

import type {
  ComponentSize,
  ComponentStatus,
  PlacementType,
  TriggerType,
  ThemeMode,
  Option,
  TreeNode,
  TableColumn,
  FormField,
  ValidationRule,
  FileItem,
  ThemeConfig
} from './utils'

/**
 * 基础类型检查器
 */
export class TypeValidator {
  /**
   * 检查是否为字符串
   */
  static isString(value: any): value is string {
    return typeof value === 'string'
  }

  /**
   * 检查是否为数字
   */
  static isNumber(value: any): value is number {
    return typeof value === 'number' && !isNaN(value)
  }

  /**
   * 检查是否为布尔值
   */
  static isBoolean(value: any): value is boolean {
    return typeof value === 'boolean'
  }

  /**
   * 检查是否为函数
   */
  static isFunction(value: any): value is Function {
    return typeof value === 'function'
  }

  /**
   * 检查是否为对象
   */
  static isObject(value: any): value is object {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }

  /**
   * 检查是否为数组
   */
  static isArray(value: any): value is any[] {
    return Array.isArray(value)
  }

  /**
   * 检查是否为 Promise
   */
  static isPromise(value: any): value is Promise<any> {
    return value instanceof Promise || (value && typeof value.then === 'function')
  }

  /**
   * 检查是否为 undefined
   */
  static isUndefined(value: any): value is undefined {
    return value === undefined
  }

  /**
   * 检查是否为 null
   */
  static isNull(value: any): value is null {
    return value === null
  }

  /**
   * 检查是否为 null 或 undefined
   */
  static isNullish(value: any): value is null | undefined {
    return value == null
  }

  /**
   * 检查是否为空值（null、undefined、空字符串、空数组、空对象）
   */
  static isEmpty(value: any): boolean {
    if (this.isNullish(value)) return true
    if (this.isString(value)) return value.length === 0
    if (this.isArray(value)) return value.length === 0
    if (this.isObject(value)) return Object.keys(value).length === 0
    return false
  }

  /**
   * 检查是否为有效的 HTML 元素
   */
  static isElement(value: any): value is HTMLElement {
    return value instanceof HTMLElement
  }

  /**
   * 检查是否为有效的 DOM 节点
   */
  static isNode(value: any): value is Node {
    return value instanceof Node
  }
}

/**
 * 组件属性验证器
 */
export class ComponentPropsValidator {
  /**
   * 验证组件尺寸
   */
  static validateSize(size: any): size is ComponentSize {
    return ['small', 'middle', 'large'].includes(size)
  }

  /**
   * 验证组件状态
   */
  static validateStatus(status: any): status is ComponentStatus {
    return ['success', 'warning', 'error', 'info', 'default'].includes(status)
  }

  /**
   * 验证位置类型
   */
  static validatePlacement(placement: any): placement is PlacementType {
    const validPlacements = [
      'top', 'topLeft', 'topRight',
      'bottom', 'bottomLeft', 'bottomRight',
      'left', 'leftTop', 'leftBottom',
      'right', 'rightTop', 'rightBottom'
    ]
    return validPlacements.includes(placement)
  }

  /**
   * 验证触发方式
   */
  static validateTrigger(trigger: any): trigger is TriggerType {
    return ['hover', 'click', 'focus', 'contextmenu'].includes(trigger)
  }

  /**
   * 验证主题模式
   */
  static validateThemeMode(mode: any): mode is ThemeMode {
    return ['light', 'dark', 'auto'].includes(mode)
  }

  /**
   * 验证颜色值
   */
  static validateColor(color: any): boolean {
    if (!TypeValidator.isString(color)) return false
    
    // 十六进制颜色
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)) return true
    
    // RGB/RGBA 颜色
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/.test(color)) return true
    
    // HSL/HSLA 颜色
    if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/.test(color)) return true
    
    // CSS 颜色关键字（简化版）
    const cssColors = ['red', 'green', 'blue', 'white', 'black', 'transparent']
    return cssColors.includes(color.toLowerCase())
  }

  /**
   * 验证 CSS 尺寸值
   */
  static validateCSSSize(size: any): boolean {
    if (TypeValidator.isNumber(size)) return size >= 0
    if (TypeValidator.isString(size)) {
      return /^\d+(\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax)$/.test(size)
    }
    return false
  }

  /**
   * 验证 URL
   */
  static validateUrl(url: any): boolean {
    if (!TypeValidator.isString(url)) return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * 验证邮箱地址
   */
  static validateEmail(email: any): boolean {
    if (!TypeValidator.isString(email)) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  /**
   * 验证手机号码（中国）
   */
  static validatePhone(phone: any): boolean {
    if (!TypeValidator.isString(phone)) return false
    return /^1[3-9]\d{9}$/.test(phone)
  }
}

/**
 * 数据结构验证器
 */
export class DataStructureValidator {
  /**
   * 验证选项数组
   */
  static validateOptions(options: any): options is Option[] {
    if (!TypeValidator.isArray(options)) return false
    
    return options.every(option => {
      if (!TypeValidator.isObject(option)) return false
      if (!('label' in option) || !TypeValidator.isString(option.label)) return false
      if (!('value' in option)) return false
      if ('disabled' in option && !TypeValidator.isBoolean(option.disabled)) return false
      if ('children' in option && !this.validateOptions(option.children)) return false
      return true
    })
  }

  /**
   * 验证树形数据
   */
  static validateTreeData(data: any): data is TreeNode[] {
    if (!TypeValidator.isArray(data)) return false
    
    return data.every(node => {
      if (!TypeValidator.isObject(node)) return false
      if (!('key' in node) || (!TypeValidator.isString(node.key) && !TypeValidator.isNumber(node.key))) return false
      if (!('title' in node) || !TypeValidator.isString(node.title)) return false
      if ('disabled' in node && !TypeValidator.isBoolean(node.disabled)) return false
      if ('children' in node && !this.validateTreeData(node.children)) return false
      return true
    })
  }

  /**
   * 验证表格列配置
   */
  static validateTableColumns(columns: any): columns is TableColumn[] {
    if (!TypeValidator.isArray(columns)) return false
    
    return columns.every(column => {
      if (!TypeValidator.isObject(column)) return false
      if (!('key' in column) || !TypeValidator.isString(column.key)) return false
      if (!('title' in column) || !TypeValidator.isString(column.title)) return false
      if ('width' in column && !TypeValidator.isNumber(column.width) && !TypeValidator.isString(column.width)) return false
      if ('fixed' in column && !['left', 'right'].includes(column.fixed)) return false
      if ('sorter' in column && !TypeValidator.isBoolean(column.sorter) && !TypeValidator.isFunction(column.sorter)) return false
      return true
    })
  }

  /**
   * 验证表单字段配置
   */
  static validateFormFields(fields: any): fields is FormField[] {
    if (!TypeValidator.isArray(fields)) return false
    
    return fields.every(field => {
      if (!TypeValidator.isObject(field)) return false
      if (!('name' in field) || !TypeValidator.isString(field.name)) return false
      if (!('label' in field) || !TypeValidator.isString(field.label)) return false
      if (!('type' in field) || !TypeValidator.isString(field.type)) return false
      if ('required' in field && !TypeValidator.isBoolean(field.required)) return false
      if ('rules' in field && !TypeValidator.isArray(field.rules)) return false
      return true
    })
  }

  /**
   * 验证文件列表
   */
  static validateFileList(files: any): files is FileItem[] {
    if (!TypeValidator.isArray(files)) return false
    
    return files.every(file => {
      if (!TypeValidator.isObject(file)) return false
      if (!('uid' in file) || !TypeValidator.isString(file.uid)) return false
      if (!('name' in file) || !TypeValidator.isString(file.name)) return false
      if (!('status' in file) || !['uploading', 'done', 'error', 'removed'].includes(file.status)) return false
      if ('url' in file && !TypeValidator.isString(file.url)) return false
      if ('size' in file && !TypeValidator.isNumber(file.size)) return false
      return true
    })
  }
}

/**
 * 主题配置验证器
 */
export class ThemeConfigValidator {
  /**
   * 验证主题配置
   */
  static validateThemeConfig(config: any): config is ThemeConfig {
    if (!TypeValidator.isObject(config)) return false
    
    if ('token' in config && !this.validateThemeToken(config.token)) return false
    if ('components' in config && !this.validateComponentTheme(config.components)) return false
    
    return true
  }

  /**
   * 验证主题令牌
   */
  static validateThemeToken(token: any): boolean {
    if (!TypeValidator.isObject(token)) return false
    
    const colorKeys = ['colorPrimary', 'colorSuccess', 'colorWarning', 'colorError', 'colorInfo', 'colorText', 'colorBgBase']
    const sizeKeys = ['borderRadius', 'fontSize']
    const stringKeys = ['fontFamily']
    
    for (const key of colorKeys) {
      if (key in token && !ComponentPropsValidator.validateColor(token[key])) return false
    }
    
    for (const key of sizeKeys) {
      if (key in token && !TypeValidator.isNumber(token[key])) return false
    }
    
    for (const key of stringKeys) {
      if (key in token && !TypeValidator.isString(token[key])) return false
    }
    
    return true
  }

  /**
   * 验证组件主题配置
   */
  static validateComponentTheme(components: any): boolean {
    if (!TypeValidator.isObject(components)) return false
    
    return Object.values(components).every(componentTheme => {
      return TypeValidator.isObject(componentTheme)
    })
  }
}

/**
 * 验证错误类
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public value?: any,
    public expectedType?: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * 属性验证装饰器工厂
 */
export function validateProp(validator: (value: any) => boolean, errorMessage?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = function (...args: any[]) {
      const value = args[0]
      if (!validator(value)) {
        throw new ValidationError(
          errorMessage || `Invalid value for property ${propertyKey}`,
          propertyKey,
          value
        )
      }
      return originalMethod.apply(this, args)
    }
    
    return descriptor
  }
}

/**
 * 运行时类型检查工具
 */
export class RuntimeTypeChecker {
  private static errors: ValidationError[] = []

  /**
   * 检查属性类型
   */
  static checkProp<T>(
    value: any,
    validator: (value: any) => value is T,
    propName: string,
    componentName?: string
  ): T {
    if (!validator(value)) {
      const error = new ValidationError(
        `Invalid prop ${propName} in ${componentName || 'component'}`,
        propName,
        value
      )
      this.errors.push(error)
      
      if (process.env.NODE_ENV === 'development') {
        console.warn(error.message, { value, propName, componentName })
      }
    }
    
    return value as T
  }

  /**
   * 获取验证错误
   */
  static getErrors(): ValidationError[] {
    return [...this.errors]
  }

  /**
   * 清除验证错误
   */
  static clearErrors(): void {
    this.errors = []
  }

  /**
   * 检查是否有验证错误
   */
  static hasErrors(): boolean {
    return this.errors.length > 0
  }
}

/**
 * 类型断言工具
 */
export function assertType<T>(
  value: any,
  validator: (value: any) => value is T,
  message?: string
): asserts value is T {
  if (!validator(value)) {
    throw new ValidationError(message || 'Type assertion failed', undefined, value)
  }
}

/**
 * 安全类型转换工具
 */
export function safeTypeConvert<T>(
  value: any,
  converter: (value: any) => T,
  fallback: T
): T {
  try {
    const result = converter(value)
    // 检查 NaN 的情况
    if (typeof result === 'number' && isNaN(result)) {
      return fallback
    }
    return result
  } catch {
    return fallback
  }
}

/**
 * 类型守卫组合工具
 */
export function combineTypeGuards<T, U>(
  guard1: (value: any) => value is T,
  guard2: (value: any) => value is U
): (value: any) => value is T & U {
  return (value: any): value is T & U => {
    return guard1(value) && guard2(value)
  }
}

/**
 * 可选类型守卫
 */
export function optionalTypeGuard<T>(
  guard: (value: any) => value is T
): (value: any) => value is T | undefined {
  return (value: any): value is T | undefined => {
    return value === undefined || guard(value)
  }
}

/**
 * 数组类型守卫
 */
export function arrayTypeGuard<T>(
  elementGuard: (value: any) => value is T
): (value: any) => value is T[] {
  return (value: any): value is T[] => {
    return TypeValidator.isArray(value) && value.every(elementGuard)
  }
}