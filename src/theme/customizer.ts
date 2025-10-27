/**
 * 主题定制工具
 * 提供主题定制、导入导出、实时预览等功能
 */

import type { ThemeConfig, ThemeMode, PresetTheme } from './types'
import { defaultTheme, darkTheme, presetThemes, mergeThemeConfig } from './config'
import { createThemeVars, applyThemeVars } from './provider'

/**
 * 主题定制器类
 */
export class ThemeCustomizer {
  private currentTheme: ThemeConfig = defaultTheme
  private listeners: Set<(theme: ThemeConfig) => void> = new Set()
  private previewElement: HTMLElement | null = null

  constructor(initialTheme?: Partial<ThemeConfig>) {
    if (initialTheme) {
      this.currentTheme = mergeThemeConfig(defaultTheme, initialTheme)
    }
  }

  /**
   * 获取当前主题
   */
  getTheme(): ThemeConfig {
    return { ...this.currentTheme }
  }

  /**
   * 设置主题
   */
  setTheme(theme: Partial<ThemeConfig>): void {
    this.currentTheme = mergeThemeConfig(this.currentTheme, theme)
    this.notifyListeners()
    this.updatePreview()
  }

  /**
   * 重置主题
   */
  resetTheme(): void {
    this.currentTheme = { ...defaultTheme }
    this.notifyListeners()
    this.updatePreview()
  }

  /**
   * 切换主题模式
   */
  switchMode(mode: ThemeMode): void {
    const baseTheme = mode === 'dark' ? darkTheme : defaultTheme
    this.currentTheme = mergeThemeConfig(baseTheme, {
      token: this.currentTheme.token,
      components: this.currentTheme.components
    })
    this.notifyListeners()
    this.updatePreview()
  }

  /**
   * 应用预设主题
   */
  applyPreset(presetName: string): void {
    const preset = presetThemes.find(p => p.name === presetName)
    if (preset) {
      this.currentTheme = { ...preset.config }
      this.notifyListeners()
      this.updatePreview()
    }
  }

  /**
   * 更新主色调
   */
  updatePrimaryColor(color: string): void {
    this.setTheme({
      token: {
        colorPrimary: color
      }
    })
  }

  /**
   * 更新组件主题
   */
  updateComponentTheme<T extends keyof NonNullable<ThemeConfig['components']>>(
    componentName: T,
    theme: Partial<NonNullable<ThemeConfig['components']>[T]>
  ): void {
    this.setTheme({
      components: {
        [componentName]: theme
      }
    })
  }

  /**
   * 导出主题配置
   */
  exportTheme(): string {
    return JSON.stringify(this.currentTheme, null, 2)
  }

  /**
   * 导入主题配置
   */
  importTheme(themeJson: string): boolean {
    try {
      const theme = JSON.parse(themeJson) as ThemeConfig
      this.validateTheme(theme)
      this.currentTheme = theme
      this.notifyListeners()
      this.updatePreview()
      return true
    } catch (error) {
      console.error('Failed to import theme:', error)
      return false
    }
  }

  /**
   * 生成主题CSS变量
   */
  generateCSSVars(): string {
    const vars = createThemeVars(this.currentTheme)
    return Object.entries(vars)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n')
  }

  /**
   * 生成主题CSS文件
   */
  generateCSSFile(): string {
    const cssVars = this.generateCSSVars()
    return `:root {\n${cssVars}\n}`
  }

  /**
   * 启用实时预览
   */
  enablePreview(element?: HTMLElement): void {
    this.previewElement = element || document.documentElement
    this.updatePreview()
  }

  /**
   * 禁用实时预览
   */
  disablePreview(): void {
    if (this.previewElement) {
      const vars = createThemeVars(this.currentTheme)
      Object.keys(vars).forEach(key => {
        this.previewElement!.style.removeProperty(key)
      })
      this.previewElement = null
    }
  }

  /**
   * 添加主题变化监听器
   */
  addListener(listener: (theme: ThemeConfig) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * 获取主题差异
   */
  getDiff(compareTheme: ThemeConfig = defaultTheme): Partial<ThemeConfig> {
    const diff: Partial<ThemeConfig> = {}

    // 比较token
    if (this.currentTheme.token && compareTheme.token) {
      const tokenDiff: Record<string, any> = {}
      Object.entries(this.currentTheme.token).forEach(([key, value]) => {
        if (compareTheme.token![key as keyof typeof compareTheme.token] !== value) {
          tokenDiff[key] = value
        }
      })
      if (Object.keys(tokenDiff).length > 0) {
        diff.token = tokenDiff
      }
    }

    // 比较components
    if (this.currentTheme.components && compareTheme.components) {
      const componentsDiff: Record<string, any> = {}
      Object.entries(this.currentTheme.components).forEach(([componentName, componentTheme]) => {
        const compareComponentTheme = compareTheme.components![componentName as keyof typeof compareTheme.components]
        if (JSON.stringify(componentTheme) !== JSON.stringify(compareComponentTheme)) {
          componentsDiff[componentName] = componentTheme
        }
      })
      if (Object.keys(componentsDiff).length > 0) {
        diff.components = componentsDiff
      }
    }

    return diff
  }

  /**
   * 创建主题快照
   */
  createSnapshot(): ThemeSnapshot {
    return {
      id: Date.now().toString(),
      name: `Snapshot ${new Date().toLocaleString()}`,
      theme: { ...this.currentTheme },
      createdAt: new Date()
    }
  }

  /**
   * 恢复主题快照
   */
  restoreSnapshot(snapshot: ThemeSnapshot): void {
    this.currentTheme = { ...snapshot.theme }
    this.notifyListeners()
    this.updatePreview()
  }

  private validateTheme(theme: any): void {
    if (!theme || typeof theme !== 'object') {
      throw new Error('Invalid theme format')
    }

    // 基本结构验证
    if (theme.token && typeof theme.token !== 'object') {
      throw new Error('Invalid token format')
    }

    if (theme.components && typeof theme.components !== 'object') {
      throw new Error('Invalid components format')
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentTheme)
      } catch (error) {
        console.error('Theme listener error:', error)
      }
    })
  }

  private updatePreview(): void {
    if (this.previewElement) {
      applyThemeVars(this.currentTheme, this.previewElement)
    }
  }
}

/**
 * 主题快照接口
 */
export interface ThemeSnapshot {
  id: string
  name: string
  theme: ThemeConfig
  createdAt: Date
}

/**
 * 主题定制选项
 */
export interface ThemeCustomizerOptions {
  enablePreview?: boolean
  previewElement?: HTMLElement
  initialTheme?: Partial<ThemeConfig>
}

/**
 * 创建主题定制器实例
 */
export function createThemeCustomizer(options: ThemeCustomizerOptions = {}): ThemeCustomizer {
  const customizer = new ThemeCustomizer(options.initialTheme)
  
  if (options.enablePreview) {
    customizer.enablePreview(options.previewElement)
  }
  
  return customizer
}

/**
 * 主题颜色工具
 */
export class ThemeColorUtils {
  /**
   * 生成颜色调色板
   */
  static generatePalette(primaryColor: string): Record<string, string> {
    // 简化的调色板生成逻辑
    // 实际项目中可以使用更复杂的颜色算法
    const colors: Record<string, string> = {}
    
    // 基础颜色
    colors.primary = primaryColor
    
    // 生成不同深浅的颜色
    for (let i = 1; i <= 10; i++) {
      colors[`primary-${i}`] = this.adjustBrightness(primaryColor, (i - 6) * 0.1)
    }
    
    return colors
  }

  /**
   * 调整颜色亮度
   */
  static adjustBrightness(color: string, amount: number): string {
    // 简化的亮度调整逻辑
    // 实际项目中应该使用专业的颜色处理库
    const hex = color.replace('#', '')
    const num = parseInt(hex, 16)
    
    let r = (num >> 16) + Math.round(255 * amount)
    let g = ((num >> 8) & 0x00FF) + Math.round(255 * amount)
    let b = (num & 0x0000FF) + Math.round(255 * amount)
    
    r = Math.max(0, Math.min(255, r))
    g = Math.max(0, Math.min(255, g))
    b = Math.max(0, Math.min(255, b))
    
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  /**
   * 检查颜色对比度
   */
  static checkContrast(color1: string, color2: string): number {
    // 简化的对比度检查
    // 实际项目中应该使用WCAG标准的对比度计算
    const lum1 = this.getLuminance(color1)
    const lum2 = this.getLuminance(color2)
    
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    
    return (brightest + 0.05) / (darkest + 0.05)
  }

  private static getLuminance(color: string): number {
    // 简化的亮度计算
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    
    return 0.299 * r + 0.587 * g + 0.114 * b
  }
}

/**
 * 默认主题定制器实例
 */
export const defaultCustomizer = createThemeCustomizer()